"use client"

import Link from "next/link"
import { useState } from "react"
import { FilePlus2 } from "lucide-react"
import { ApplicationsTable } from "@/components/applications-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
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

export default function ApplicantApplicationsPage() {
  const currentUser = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all")

  const mine = applications.filter((a) => a.applicantId === currentUser?.id)
  const filtered = filter === "all" ? mine : mine.filter((a) => a.status === filter)

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="All verification applications you have submitted."
        actions={
          <Button render={<Link href="/applicant/applications/new" />}>
            <FilePlus2 data-icon="inline-start" />
            New application
          </Button>
        }
      />
      <Tabs value={filter} onValueChange={(v) => setFilter(v as ApplicationStatus | "all")} className="mb-4">
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ApplicationsTable
        applications={filtered}
        detailBasePath="/applicant/applications"
        emptyMessage="No applications match this filter."
      />
    </div>
  )
}
