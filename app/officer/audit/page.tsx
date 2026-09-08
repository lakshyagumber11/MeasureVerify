"use client"

import { AuditLogTable } from "@/components/audit-log-table"
import { PageHeader } from "@/components/page-header"
import { useStore } from "@/lib/store"

export default function OfficerAuditPage() {
  const auditLog = useStore((s) => s.auditLog)
  return (
    <div>
      <PageHeader title="Audit Log" description="Timestamped record of actions across the verification workflow." />
      <AuditLogTable entries={auditLog} />
    </div>
  )
}
