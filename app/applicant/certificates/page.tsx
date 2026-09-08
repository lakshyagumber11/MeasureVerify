"use client"

import Link from "next/link"
import { ChevronRight, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"

export default function ApplicantCertificatesPage() {
  const currentUser = useStore((s) => s.currentUser)
  const certificates = useStore((s) => s.certificates)

  const mine = certificates.filter((c) => c.applicantName === currentUser?.name)

  return (
    <div>
      <PageHeader title="My Certificates" description="Digital verification certificates issued for your instruments." />

      {mine.length === 0 ? (
        <Empty className="border border-dashed border-border rounded-lg py-12">
          <EmptyMedia variant="icon">
            <ShieldCheck />
          </EmptyMedia>
          <EmptyTitle>No certificates yet</EmptyTitle>
          <EmptyDescription>Certificates will appear here once your applications are approved.</EmptyDescription>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate No.</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono text-sm">{cert.certificateNumber}</TableCell>
                  <TableCell>
                    {cert.instrument.type} ({cert.instrument.serialNumber})
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cert.issueDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cert.validUntil}</TableCell>
                  <TableCell>
                    <StatusBadge status={cert.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" render={<Link href={`/applicant/certificates/${cert.id}`} />}>
                      View
                      <ChevronRight data-icon="inline-end" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
