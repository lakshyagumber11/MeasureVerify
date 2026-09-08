"use client"

import { useState } from "react"
import { InstrumentsTable } from "@/components/instruments-table"
import { PageHeader } from "@/components/page-header"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"

export default function OfficerInstrumentsPage() {
  const instruments = useStore((s) => s.instruments)
  const [search, setSearch] = useState("")

  const filtered = instruments.filter((i) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return i.serialNumber.toLowerCase().includes(q) || i.owner.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader title="Instrument Registry" description="Search all registered weighing and measuring instruments." />
      <Field className="mb-4 w-full sm:w-80">
        <Input placeholder="Search by serial number, owner, or type" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Field>
      <InstrumentsTable instruments={filtered} detailBasePath="/officer/instruments" />
    </div>
  )
}
