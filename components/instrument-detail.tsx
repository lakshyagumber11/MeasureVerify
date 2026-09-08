"use client"

import Link from "next/link"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useStore } from "@/lib/store"
import type { Instrument } from "@/lib/types"
import { History } from "lucide-react"

export function InstrumentDetail({ instrument, certificateBasePath }: { instrument: Instrument; certificateBasePath: string }) {
  const applications = useStore((s) => s.applications)
  const certificates = useStore((s) => s.certificates)

  const relatedApplications = applications.filter((a) => a.instrument.serialNumber === instrument.serialNumber)
  const relatedCertificates = certificates.filter((c) => c.instrument.serialNumber === instrument.serialNumber)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Instrument details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Serial number" value={instrument.serialNumber} mono />
            <Detail label="Type" value={instrument.type} />
            <Detail label="Manufacturer / model" value={`${instrument.manufacturer} / ${instrument.model}`} />
            <Detail label="Owner" value={instrument.owner} />
            <Detail label="Last verification" value={instrument.lastVerification ?? "Not yet verified"} />
            <Detail label="Valid until" value={instrument.validUntil ?? "—"} />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4 text-muted-foreground" />
              Verification history
            </CardTitle>
            <CardDescription>Every certificate issued for this instrument.</CardDescription>
          </CardHeader>
          <CardContent>
            {relatedCertificates.length === 0 ? (
              <Empty className="border border-dashed border-border rounded-lg py-8">
                <EmptyMedia variant="icon">
                  <History />
                </EmptyMedia>
                <EmptyTitle>No certificates yet</EmptyTitle>
                <EmptyDescription>This instrument has not completed verification.</EmptyDescription>
              </Empty>
            ) : (
              <div className="flex flex-col gap-2">
                {relatedCertificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-foreground">{cert.certificateNumber}</span>
                      <span className="text-xs text-muted-foreground">
                        Issued {cert.issueDate} · Valid until {cert.validUntil}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={cert.status} />
                      <Button variant="ghost" size="sm" render={<Link href={`${certificateBasePath}/${cert.id}`} />}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Related applications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {relatedApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications on record.</p>
            ) : (
              relatedApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5">
                  <span className="font-mono text-xs text-foreground">{app.id}</span>
                  <StatusBadge status={app.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
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
