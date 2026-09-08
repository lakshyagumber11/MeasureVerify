"use client"

import { useState } from "react"
import { ApplicationsTable } from "@/components/applications-table"
import { PageHeader } from "@/components/page-header"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import type { ApplicationStatus } from "@/lib/types"

const FILTERS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Under Review", value: "Under Review" },
  { label: "Scheduled", value: "Inspection Scheduled" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
]

export default function OfficerApplicationsPage() {
  const applications = useStore((s) => s.applications)
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all")
  const [search, setSearch] = useState("")

  const filtered = applications
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return (
        a.id.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.instrument.serialNumber.toLowerCase().includes(q)
      )
    })

  return (
    <div>
      <PageHeader title="Applications" description="Review and manage all verification applications." />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as ApplicationStatus | "all")}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Field className="w-full sm:w-64">
          <Input
            placeholder="Search by ID, applicant, or serial no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
      </div>
      <ApplicationsTable
        applications={filtered}
        detailBasePath="/officer/applications"
        showApplicant
        emptyMessage="No applications match this filter."
      />
    </div>
  )
}
