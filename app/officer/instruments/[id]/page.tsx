"use client"

import { notFound, useParams } from "next/navigation"
import { InstrumentDetail } from "@/components/instrument-detail"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { useStore } from "@/lib/store"

export default function OfficerInstrumentDetailPage() {
  const params = useParams<{ id: string }>()
  const instruments = useStore((s) => s.instruments)
  const instrument = instruments.find((i) => i.id === params.id)

  if (!instrument) return notFound()

  return (
    <div>
      <PageHeader title={instrument.serialNumber} description={instrument.owner} actions={<StatusBadge status={instrument.status} />} />
      <InstrumentDetail instrument={instrument} certificateBasePath="/officer/certificates" />
    </div>
  )
}
