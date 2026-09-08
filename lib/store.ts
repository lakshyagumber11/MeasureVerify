"use client"

import { create } from "zustand"
import {
  DOCUMENT_TEMPLATE,
  seedApplications,
  seedAppointmentSlots,
  seedAuditLog,
  seedCertificates,
  seedInspections,
  seedInstruments,
  seedNotifications,
  seedUsers,
} from "./mock-data"
import type {
  Application,
  ApplicationStatus,
  AppNotification,
  AppointmentSlot,
  AppUser,
  AuditLogEntry,
  Certificate,
  DocumentUpload,
  Inspection,
  InspectionObservations,
  Instrument,
  InstrumentDetails,
  Role,
} from "./types"

function pad(n: number, len = 5) {
  return String(n).padStart(len, "0")
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatTimestamp() {
  const d = new Date()
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface NewApplicationInput {
  applicantId: string
  applicantName: string
  mobile: string
  email: string
  address: string
  instrument: InstrumentDetails
  documents: DocumentUpload[]
}

interface InspectionInput {
  observations: InspectionObservations
  remarks: string
  result: "PASS" | "FAIL"
  officer: string
}

interface StoreState {
  currentUser: AppUser | null
  users: AppUser[]
  applications: Application[]
  inspections: Inspection[]
  certificates: Certificate[]
  instruments: Instrument[]
  notifications: AppNotification[]
  auditLog: AuditLogEntry[]
  appointmentSlots: AppointmentSlot[]
  applicationSeq: number
  certificateSeq: number
  inspectionSeq: number

  login: (role: Role, name?: string) => AppUser
  logout: () => void

  checkDuplicateSerial: (serialNumber: string) => boolean
  createApplication: (input: NewApplicationInput) => Application
  bookAppointment: (applicationId: string, slotId: string) => { ok: boolean; error?: string }
  submitInspection: (applicationId: string, input: InspectionInput) => Inspection
  generateCertificate: (applicationId: string) => Certificate | null
  getCertificateByToken: (token: string) => Certificate | undefined
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (audience: Role) => void
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void
  addNotification: (entry: Omit<AppNotification, "id" | "date" | "read">) => void
}

export const useStore = create<StoreState>((set, get) => ({
  currentUser: null,
  users: seedUsers,
  applications: seedApplications,
  inspections: seedInspections,
  certificates: seedCertificates,
  instruments: seedInstruments,
  notifications: seedNotifications,
  auditLog: seedAuditLog,
  appointmentSlots: seedAppointmentSlots,
  applicationSeq: 133,
  certificateSeq: 871,
  inspectionSeq: 879,

  login: (role, name) => {
    const existing = get().users.find((u) => u.role === role && (!name || u.name === name))
    const user =
      existing ??
      ({
        id: `u-${role}-session`,
        name: name || (role === "applicant" ? "Lakshya Traders" : role === "officer" ? "Rajesh Kumar" : "Anil Deshmukh"),
        email: `${role}@measureverify.gov.in`,
        mobile: "+91 90000 00000",
        role,
        createdAt: todayIso(),
      } as AppUser)
    set({ currentUser: user })
    return user
  },

  logout: () => set({ currentUser: null }),

  checkDuplicateSerial: (serialNumber) => {
    const normalized = serialNumber.trim().toLowerCase()
    if (!normalized) return false
    return (
      get().instruments.some((i) => i.serialNumber.toLowerCase() === normalized) ||
      get().applications.some((a) => a.instrument.serialNumber.toLowerCase() === normalized)
    )
  },

  addAuditLog: (entry) => {
    set((state) => ({
      auditLog: [
        { ...entry, id: `AUD-${state.auditLog.length + 1}`, timestamp: formatTimestamp() },
        ...state.auditLog,
      ],
    }))
  },

  addNotification: (entry) => {
    set((state) => ({
      notifications: [
        { ...entry, id: `NOTIF-${state.notifications.length + 1}`, date: todayIso(), read: false },
        ...state.notifications,
      ],
    }))
  },

  createApplication: (input) => {
    const state = get()
    const nextSeq = state.applicationSeq + 1
    const id = `APP-2026-${pad(nextSeq)}`
    const application: Application = {
      id,
      applicantId: input.applicantId,
      applicantName: input.applicantName,
      mobile: input.mobile,
      email: input.email,
      address: input.address,
      instrument: input.instrument,
      documents: input.documents.length ? input.documents : DOCUMENT_TEMPLATE.map((d) => ({ ...d, uploaded: false })),
      status: "Pending",
      createdAt: todayIso(),
    }
    set({
      applications: [application, ...state.applications],
      applicationSeq: nextSeq,
    })
    get().addAuditLog({
      user: input.applicantName,
      role: "applicant",
      action: "Submitted application",
      reference: id,
      status: "Success",
    })
    get().addNotification({
      audience: "officer",
      title: "New application submitted",
      message: `Application ${id} for ${input.instrument.type} (${input.instrument.serialNumber}) has been submitted and is awaiting review.`,
      type: "info",
    })
    get().addNotification({
      audience: "applicant",
      userId: input.applicantId,
      title: "Application submitted successfully",
      message: `Your application ${id} has been submitted and is pending officer review.`,
      type: "success",
    })
    return application
  },

  bookAppointment: (applicationId, slotId) => {
    const state = get()
    const slot = state.appointmentSlots.find((s) => s.id === slotId)
    if (!slot) return { ok: false, error: "Selected time slot could not be found." }
    if (slot.booked) return { ok: false, error: "This appointment slot has already been booked. Please choose another slot." }

    const application = state.applications.find((a) => a.id === applicationId)
    if (!application) return { ok: false, error: "Application not found." }

    set({
      appointmentSlots: state.appointmentSlots.map((s) =>
        s.id === slotId ? { ...s, booked: true, applicationId } : s,
      ),
      applications: state.applications.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: "Inspection Scheduled" as ApplicationStatus,
              appointment: { slotId: slot.id, date: slot.date, time: slot.time, officer: slot.officer, location: slot.location },
            }
          : a,
      ),
    })

    get().addAuditLog({
      user: application.applicantName,
      role: "applicant",
      action: "Scheduled inspection appointment",
      reference: applicationId,
      status: "Success",
    })
    get().addNotification({
      audience: "applicant",
      userId: application.applicantId,
      title: "Appointment confirmed",
      message: `Inspection appointment confirmed for ${slot.date} at ${slot.time}, ${slot.location}.`,
      type: "info",
    })
    get().addNotification({
      audience: "officer",
      title: "Inspection appointment scheduled",
      message: `Application ${applicationId} has been scheduled for inspection on ${slot.date} at ${slot.time}.`,
      type: "info",
    })

    return { ok: true }
  },

  submitInspection: (applicationId, input) => {
    const state = get()
    const nextSeq = state.inspectionSeq + 1
    const inspectionId = `INS-${pad(nextSeq)}`
    const inspection: Inspection = {
      id: inspectionId,
      applicationId,
      officer: input.officer,
      observations: input.observations,
      remarks: input.remarks,
      result: input.result,
      date: todayIso(),
    }

    const application = state.applications.find((a) => a.id === applicationId)
    const newStatus: ApplicationStatus = input.result === "PASS" ? "Approved" : "Rejected"

    set({
      inspections: [inspection, ...state.inspections],
      inspectionSeq: nextSeq,
      applications: state.applications.map((a) =>
        a.id === applicationId ? { ...a, status: newStatus, inspectionId } : a,
      ),
    })

    get().addAuditLog({
      user: input.officer,
      role: "officer",
      action: "Updated inspection result",
      reference: applicationId,
      status: input.result === "PASS" ? "Success" : "Failed",
    })

    if (application) {
      get().addNotification({
        audience: "applicant",
        userId: application.applicantId,
        title: input.result === "PASS" ? "Application approved" : "Application rejected",
        message:
          input.result === "PASS"
            ? `Application ${applicationId} has been approved following inspection.`
            : `Application ${applicationId} has been rejected. Reason: ${input.remarks}`,
        type: input.result === "PASS" ? "success" : "error",
      })
    }

    return inspection
  },

  generateCertificate: (applicationId) => {
    const state = get()
    const application = state.applications.find((a) => a.id === applicationId)
    if (!application || application.status !== "Approved") return null
    if (application.certificateId) {
      return state.certificates.find((c) => c.id === application.certificateId) ?? null
    }

    const nextSeq = state.certificateSeq + 1
    const certificateNumber = `CERT-2026-${pad(nextSeq)}`
    const issueDate = todayIso()
    const validUntilDate = new Date()
    validUntilDate.setFullYear(validUntilDate.getFullYear() + 1)
    const validUntil = validUntilDate.toISOString().slice(0, 10)
    const inspection = state.inspections.find((i) => i.id === application.inspectionId)

    const certificate: Certificate = {
      id: certificateNumber,
      applicationId,
      certificateNumber,
      qrToken: `MV-QR-${pad(nextSeq)}`,
      applicantName: application.applicantName,
      instrument: application.instrument,
      officer: inspection?.officer ?? "Authorized Verification Officer",
      issueDate,
      validUntil,
      status: "Valid",
    }

    const instrumentId = application.instrumentId ?? `INST-${1000 + state.instruments.length + 1}`
    const existingInstrument = state.instruments.find((i) => i.serialNumber === application.instrument.serialNumber)

    set({
      certificates: [certificate, ...state.certificates],
      certificateSeq: nextSeq,
      applications: state.applications.map((a) =>
        a.id === applicationId ? { ...a, certificateId: certificate.id, instrumentId } : a,
      ),
      instruments: existingInstrument
        ? state.instruments.map((i) =>
            i.serialNumber === application.instrument.serialNumber
              ? { ...i, status: "Valid", lastVerification: issueDate, validUntil, certificateId: certificate.id, applicationId }
              : i,
          )
        : [
            ...state.instruments,
            {
              id: instrumentId,
              serialNumber: application.instrument.serialNumber,
              type: application.instrument.type,
              manufacturer: application.instrument.manufacturer,
              model: application.instrument.model,
              owner: application.applicantName,
              ownerId: application.applicantId,
              status: "Valid",
              lastVerification: issueDate,
              validUntil,
              applicationId,
              certificateId: certificate.id,
            },
          ],
    })

    get().addAuditLog({
      user: certificate.officer,
      role: "officer",
      action: "Issued certificate",
      reference: certificate.certificateNumber,
      status: "Success",
    })
    get().addNotification({
      audience: "applicant",
      userId: application.applicantId,
      title: "Certificate issued",
      message: `Certificate ${certificate.certificateNumber} has been issued for ${application.instrument.type} (${application.instrument.serialNumber}).`,
      type: "success",
    })

    return certificate
  },

  getCertificateByToken: (token) => {
    const normalized = token.trim().toLowerCase()
    return get().certificates.find(
      (c) => c.qrToken.toLowerCase() === normalized || c.certificateNumber.toLowerCase() === normalized,
    )
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  },

  markAllNotificationsRead: (audience) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.audience === audience ? { ...n, read: true } : n)),
    }))
  },
}))
