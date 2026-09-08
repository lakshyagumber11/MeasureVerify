"use client"

import { QRCodeSVG } from "qrcode.react"
import { Scale } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Certificate } from "@/lib/types"

export function CertificateView({ certificate, verifyUrl }: { certificate: Certificate; verifyUrl: string }) {
  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <div className="flex items-center justify-between gap-2 bg-primary px-6 py-4 text-primary-foreground">
        <div className="flex items-center gap-2.5">
          <Scale className="size-5" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">MeasureVerify</span>
            <span className="text-[11px] text-primary-foreground/80">Certificate of Verification</span>
          </div>
        </div>
        <StatusBadge status={certificate.status} className="bg-white/15 text-primary-foreground border-white/20" />
      </div>
      <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Certificate Number</p>
            <p className="font-mono text-lg font-semibold text-foreground">{certificate.certificateNumber}</p>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Issued to" value={certificate.applicantName} />
            <Field label="Issuing officer" value={certificate.officer} />
            <Field label="Instrument type" value={certificate.instrument.type} />
            <Field label="Manufacturer / model" value={`${certificate.instrument.manufacturer} / ${certificate.instrument.model}`} />
            <Field label="Serial number" value={certificate.instrument.serialNumber} mono />
            <Field label="Capacity" value={certificate.instrument.capacity} />
            <Field label="Location of use" value={certificate.instrument.locationOfUse} />
            <Field label="Issue date" value={certificate.issueDate} />
            <Field label="Valid until" value={certificate.validUntil} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 p-4">
          <QRCodeSVG value={verifyUrl} size={128} className="rounded bg-white p-2" />
          <p className="text-center font-mono text-[11px] text-muted-foreground">{certificate.qrToken}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>{value}</span>
    </div>
  )
}
