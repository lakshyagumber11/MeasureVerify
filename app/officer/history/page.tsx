"use client"

import { ApplicationsTable } from "@/components/applications-table"
import { PageHeader } from "@/components/page-header"
import { useStore } from "@/lib/store"

export default function OfficerHistoryPage() {
  const applications = useStore((s) => s.applications)
  const completed = applications
    .filter((a) => a.status === "Approved" || a.status === "Rejected")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div>
      <PageHeader title="Inspection History" description="All completed inspections — approved and rejected applications." />
      <ApplicationsTable
        applications={completed}
        detailBasePath="/officer/applications"
        showApplicant
        emptyMessage="No completed inspections yet."
      />
    </div>
  )
}
