"use client"

import { useState } from "react"
import { InstrumentsTable } from "@/components/instruments-table"
import { PageHeader } from "@/components/page-header"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import type { InstrumentStatus } from "@/lib/types"

const FILTERS: { label: string; value: InstrumentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Valid", value: "Valid" },
  { label: "Expiring Soon", value: "Expiring Soon" },
  { label: "Expired", value: "Expired" },
  { label: "Under Verification", value: "Under Verification" },
]

export default function AdminInstrumentsPage() {
  const instruments = useStore((s) => s.instruments)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<InstrumentStatus | "all">("all")

  const filtered = instruments
    .filter((i) => filter === "all" || i.status === filter)
    .filter((i) => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return i.serialNumber.toLowerCase().includes(q) || i.owner.toLowerCase().includes(q)
    })

  return (
    <div>
      <PageHeader title="Instrument Registry" description="System-wide registry of verified weighing and measuring instruments." />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as InstrumentStatus | "all")}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Field className="w-full sm:w-64">
          <Input placeholder="Search by serial number or owner" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Field>
      </div>
      <InstrumentsTable instruments={filtered} detailBasePath="/admin/instruments" />
    </div>
  )
}
