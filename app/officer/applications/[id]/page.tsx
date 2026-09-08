"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { toast } from "sonner"
import { Calendar, ClipboardCheck, FileText, MapPin, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export default function OfficerApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const applications = useStore((s) => s.applications)
  const inspections = useStore((s) => s.inspections)
  const generateCertificate = useStore((s) => s.generateCertificate)
  const application = applications.find((a) => a.id === params.id)

  if (!application) return notFound()

  const inspection = inspections.find((i) => i.id === application.inspectionId)

  function handleGenerateCertificate() {
    const cert = generateCertificate(application!.id)
    if (cert) toast.success(`Certificate ${cert.certificateNumber} issued.`)
  }

  return (
    <div>
      <PageHeader
        title={application.id}
        description={`Applicant: ${application.applicantName} · Submitted ${application.createdAt}`}
        actions={<StatusBadge status={application.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Applicant details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={application.applicantName} />
              <Detail label="Mobile" value={application.mobile} />
              <Detail label="Email" value={application.email} />
              <Detail label="Address" value={application.address} />
            </CardContent>
          </Card>

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
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
              <CardDescription>Documents submitted by the applicant.</CardDescription>
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

          {inspection ? (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Inspection record</CardTitle>
                <CardDescription>
                  Conducted by {inspection.officer} on {inspection.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Detail label="Physical condition" value={inspection.observations.condition} />
                  <Detail label="Display" value={inspection.observations.display} />
                  <Detail label="Seal" value={inspection.observations.seal} />
                  <Detail label="Accuracy" value={inspection.observations.accuracy} />
                  <Detail label="Identification" value={inspection.observations.identification} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Result</span>
                    <StatusBadge status={inspection.result} />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Remarks</span>
                  <p className="text-sm text-foreground">{inspection.remarks}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
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
              </CardContent>
            </Card>
          ) : null}

          {application.status === "Inspection Scheduled" ? (
            <Card className="border-primary/30 bg-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardCheck className="size-4 text-primary" />
                  Ready for inspection
                </CardTitle>
                <CardDescription>Record your on-site verification findings for this instrument.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" render={<Link href={`/officer/applications/${application.id}/inspect`} />}>
                  Start inspection
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {application.status === "Approved" ? (
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4 text-success" />
                  {application.certificateId ? "Certificate issued" : "Approved — issue certificate"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.certificateId ? (
                  <Button variant="outline" className="w-full" render={<Link href={`/officer/certificates/${application.certificateId}`} />}>
                    View certificate
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleGenerateCertificate}>
                    Generate certificate
                  </Button>
                )}
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
