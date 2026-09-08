"use client"

import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useStore } from "@/lib/store"

export default function ApplicantAppointmentsPage() {
  const currentUser = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)

  const mine = applications.filter((a) => a.applicantId === currentUser?.id)
  const upcoming = mine.filter((a) => a.appointment && a.status === "Inspection Scheduled")
  const needsScheduling = mine.filter((a) => !a.appointment && (a.status === "Pending" || a.status === "Under Review"))

  return (
    <div>
      <PageHeader title="Appointments" description="Manage your inspection appointments." />

      {needsScheduling.length > 0 ? (
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="text-base">Awaiting scheduling</CardTitle>
            <CardDescription>These applications need an inspection appointment booked.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {needsScheduling.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {app.id} — {app.instrument.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{app.instrument.serialNumber}</span>
                </div>
                <Button size="sm" render={<Link href={`/applicant/appointments/${app.id}`} />}>
                  Book appointment
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Upcoming inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <Empty className="border border-dashed border-border rounded-lg py-10">
              <EmptyMedia variant="icon">
                <Calendar />
              </EmptyMedia>
              <EmptyTitle>No upcoming inspections</EmptyTitle>
              <EmptyDescription>Book an appointment for a pending application to see it here.</EmptyDescription>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">
                      {app.id} — {app.instrument.type} ({app.instrument.serialNumber})
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
                  <Button variant="outline" size="sm" render={<Link href={`/applicant/applications/${app.id}`} />}>
                    View application
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
