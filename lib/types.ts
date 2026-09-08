export type Role = "applicant" | "officer" | "admin"

export type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "Inspection Scheduled"
  | "Inspection Completed"
  | "Approved"
  | "Rejected"

export type InstrumentStatus = "Valid" | "Expiring Soon" | "Expired" | "Under Verification"

export type CertificateStatus = "Valid" | "Expired" | "Revoked"

export type InstrumentType = "Weighing Scale" | "Electronic Balance" | "Platform Scale" | "Measuring Instrument"

export interface AppUser {
  id: string
  name: string
  email: string
  mobile: string
  role: Role
  title?: string
  createdAt: string
}

export interface DocumentUpload {
  key: string
  label: string
  uploaded: boolean
  fileName?: string
}

export interface InstrumentDetails {
  type: InstrumentType
  manufacturer: string
  model: string
  serialNumber: string
  capacity: string
  locationOfUse: string
}

export interface Appointment {
  slotId: string
  date: string
  time: string
  officer: string
  location: string
}

export interface Application {
  id: string
  applicantId: string
  applicantName: string
  mobile: string
  email: string
  address: string
  instrument: InstrumentDetails
  documents: DocumentUpload[]
  status: ApplicationStatus
  appointment?: Appointment
  certificateId?: string
  inspectionId?: string
  instrumentId?: string
  createdAt: string
}

export interface InspectionObservations {
  condition: "Good" | "Damaged"
  display: "Pass" | "Fail"
  seal: "Valid" | "Invalid"
  accuracy: "Within permissible limit" | "Outside permissible limit"
  identification: "Verified" | "Mismatch"
}

export interface Inspection {
  id: string
  applicationId: string
  officer: string
  observations: InspectionObservations
  remarks: string
  result: "PASS" | "FAIL"
  date: string
}

export interface Certificate {
  id: string
  applicationId: string
  certificateNumber: string
  qrToken: string
  applicantName: string
  instrument: InstrumentDetails
  officer: string
  issueDate: string
  validUntil: string
  status: CertificateStatus
}

export interface Instrument {
  id: string
  serialNumber: string
  type: InstrumentType
  manufacturer: string
  model: string
  owner: string
  ownerId: string
  status: InstrumentStatus
  lastVerification?: string
  validUntil?: string
  applicationId?: string
  certificateId?: string
}

export interface AppNotification {
  id: string
  audience: Role | "all"
  userId?: string
  title: string
  message: string
  date: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

export interface AuditLogEntry {
  id: string
  user: string
  role: Role
  action: string
  reference: string
  status: "Success" | "Failed" | "Info"
  timestamp: string
}

export interface AppointmentSlot {
  id: string
  date: string
  time: string
  officer: string
  location: string
  booked: boolean
  applicationId?: string
}
