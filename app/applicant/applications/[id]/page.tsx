"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Calendar, Check, FileText, MapPin, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const TIMELINE: ApplicationStatus[] = ["Pending", "Under Review", "Inspection Scheduled", "Approved"]

export default function ApplicantApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const applications = useStore((s) => s.applications)
  const application = applications.find((a) => a.id === params.id)

  if (!application) return notFound()

  const isRejected = application.status === "Rejected"
  const currentIndex = isRejected ? TIMELINE.length : TIMELINE.indexOf(application.status)

  return (
    <div>
      <PageHeader
        title={application.id}
        description={`Submitted on ${application.createdAt}`}
        actions={<StatusBadge status={application.status} />}
      />

      <Card className="mb-6 border-border">
        <CardContent className="p-5">
          {isRejected ? (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              This application was rejected following inspection. See inspection remarks for details.
            </div>
          ) : (
            <div className="flex items-center">
              {TIMELINE.map((step, i) => (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                        i <= currentIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {i < currentIndex ? <Check className="size-4" /> : i + 1}
                    </span>
                    <span className={cn("text-center text-[11px] leading-tight", i <= currentIndex ? "text-foreground" : "text-muted-foreground")}>
                      {step}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 ? (
                    <Separator className={cn("mx-2 flex-1", i < currentIndex ? "bg-primary" : "bg-border")} />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Instrument details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Detail label="Instrument type" value={application.instrument.type} />
              <Detail label="Manufacturer / model" value={`${application.instrument.manufacturer} / ${application.instrument.model}`} />
              <Detail label="Serial number" value={application.instrument.serialNumber} mono />
              <Detail label="Capacity" value={application.instrument.capacity} />
              <Detail label="Location of use" value={application.instrument.locationOfUse} />
              <Detail label="Applicant" value={application.applicantName} />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
              <CardDescription>Supporting documents submitted with this application.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {application.documents.map((doc) => (
                <div key={doc.key} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
                    <FileText className="size-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{doc.label}</span>
                    <span className="text-xs text-muted-foreground">{doc.uploaded ? doc.fileName : "Not uploaded"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {application.appointment ? (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Appointment</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="size-4 text-muted-foreground" />
                  {application.appointment.date} at {application.appointment.time}
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="size-4 text-muted-foreground" />
                  {application.appointment.location}
                </div>
                <p className="text-xs text-muted-foreground">Assigned officer: {application.appointment.officer}</p>
              </CardContent>
            </Card>
          ) : application.status === "Pending" || application.status === "Under Review" ? (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Schedule inspection</CardTitle>
                <CardDescription>Book a time slot for your on-site instrument inspection.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" render={<Link href={`/applicant/appointments/${application.id}`} />}>
                  Book appointment
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {application.status === "Approved" && application.certificateId ? (
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4 text-success" />
                  Certificate issued
                </CardTitle>
                <CardDescription>Your instrument has been verified and certified.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" render={<Link href={`/applicant/certificates/${application.certificateId}`} />}>
                  View certificate
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>{value}</span>
    </div>
  )
}
