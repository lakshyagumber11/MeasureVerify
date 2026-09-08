"use client"

import Link from "next/link"
import { ChevronRight, PackageSearch } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Instrument } from "@/lib/types"

export function InstrumentsTable({ instruments, detailBasePath }: { instruments: Instrument[]; detailBasePath: string }) {
  if (instruments.length === 0) {
    return (
      <Empty className="border border-dashed border-border rounded-lg py-12">
        <EmptyMedia variant="icon">
          <PackageSearch />
        </EmptyMedia>
        <EmptyTitle>No instruments found</EmptyTitle>
        <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial No.</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Last Verified</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instruments.map((inst) => (
            <TableRow key={inst.id}>
              <TableCell className="font-mono text-sm">{inst.serialNumber}</TableCell>
              <TableCell>{inst.type}</TableCell>
              <TableCell>{inst.owner}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{inst.lastVerification ?? "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{inst.validUntil ?? "—"}</TableCell>
              <TableCell>
                <StatusBadge status={inst.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" render={<Link href={`${detailBasePath}/${inst.id}`} />}>
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
