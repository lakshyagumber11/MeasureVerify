"use client"

import Link from "next/link"
import { ChevronRight, FileSearch } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Application } from "@/lib/types"

export function ApplicationsTable({
  applications,
  detailBasePath,
  showApplicant = false,
  emptyMessage = "No applications found.",
}: {
  applications: Application[]
  detailBasePath: string
  showApplicant?: boolean
  emptyMessage?: string
}) {
  if (applications.length === 0) {
    return (
      <Empty className="border border-dashed border-border rounded-lg py-12">
        <EmptyMedia variant="icon">
          <FileSearch />
        </EmptyMedia>
        <EmptyTitle>No applications</EmptyTitle>
        <EmptyDescription>{emptyMessage}</EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application ID</TableHead>
            {showApplicant ? <TableHead>Applicant</TableHead> : null}
            <TableHead>Instrument</TableHead>
            <TableHead>Serial No.</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-mono text-sm">{app.id}</TableCell>
              {showApplicant ? <TableCell>{app.applicantName}</TableCell> : null}
              <TableCell>{app.instrument.type}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{app.instrument.serialNumber}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{app.createdAt}</TableCell>
              <TableCell>
                <StatusBadge status={app.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" render={<Link href={`${detailBasePath}/${app.id}`} />}>
                  View
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
