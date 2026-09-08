"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"

export default function AdminCertificatesPage() {
  const certificates = useStore((s) => s.certificates)

  return (
    <div>
      <PageHeader title="Certificates" description="System-wide record of all issued verification certificates." />
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate No.</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Instrument</TableHead>
              <TableHead>Officer</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-mono text-sm">{cert.certificateNumber}</TableCell>
                <TableCell>{cert.applicantName}</TableCell>
                <TableCell>
                  {cert.instrument.type} ({cert.instrument.serialNumber})
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{cert.officer}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{cert.issueDate}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{cert.validUntil}</TableCell>
                <TableCell>
                  <StatusBadge status={cert.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" render={<Link href={`/admin/certificates/${cert.id}`} />}>
                    View
                    <ChevronRight data-icon="inline-end" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
