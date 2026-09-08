"use client"

import Link from "next/link"
import { Calendar, ClipboardCheck, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useStore } from "@/lib/store"

export default function OfficerTodayPage() {
  const currentUser = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)

  const scheduled = applications
    .filter((a) => a.status === "Inspection Scheduled" && a.appointment?.officer === currentUser?.name)
    .sort((a, b) => (a.appointment!.date + a.appointment!.time).localeCompare(b.appointment!.date + b.appointment!.time))

  return (
    <div>
      <PageHeader title="Today's Inspections" description="Your upcoming on-site inspection appointments." />

      {scheduled.length === 0 ? (
        <Empty className="border border-dashed border-border rounded-lg py-12">
          <EmptyMedia variant="icon">
            <Calendar />
          </EmptyMedia>
          <EmptyTitle>No inspections scheduled</EmptyTitle>
          <EmptyDescription>Applications you are assigned to inspect will appear here.</EmptyDescription>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {scheduled.map((app) => (
            <Card key={app.id} className="border-border">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-foreground">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <span className="text-sm text-foreground">
                    {app.applicantName} — {app.instrument.type} ({app.instrument.serialNumber})
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {app.appointment?.date} at {app.appointment?.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {app.appointment?.location}
                  </span>
                </div>
                <Button render={<Link href={`/officer/applications/${app.id}/inspect`} />}>
                  <ClipboardCheck data-icon="inline-start" />
                  Start inspection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
