"use client"

import { StatusBadge } from "@/components/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AuditLogEntry } from "@/lib/types"

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-sm text-muted-foreground">{entry.timestamp}</TableCell>
              <TableCell className="text-sm">{entry.user}</TableCell>
              <TableCell className="text-sm capitalize text-muted-foreground">{entry.role}</TableCell>
              <TableCell className="text-sm">{entry.action}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{entry.reference}</TableCell>
              <TableCell>
                <StatusBadge status={entry.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
