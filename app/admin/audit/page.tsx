"use client"

import { useState } from "react"
import { AuditLogTable } from "@/components/audit-log-table"
import { PageHeader } from "@/components/page-header"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"

export default function AdminAuditPage() {
  const auditLog = useStore((s) => s.auditLog)
  const [search, setSearch] = useState("")

  const filtered = auditLog.filter((e) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      e.user.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.reference.toLowerCase().includes(q)
    )
  })

  // Safely serialize the entries array to remove complex structural data/functions
  const safeEntries = JSON.parse(JSON.stringify(filtered))

  return (
    <div>
      <PageHeader title="System Audit Log" description="Complete, timestamped log of every action across the platform." />
      <Field className="mb-4 w-full sm:w-80">
        <Input placeholder="Search by user, action, or reference" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Field>
      <AuditLogTable entries={safeEntries} />
    </div>
  )
}

