"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, FilePlus2, ListChecks, ShieldCheck } from "lucide-react"
import { ApplicationsTable } from "@/components/applications-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export default function ApplicantDashboardPage() {
  const currentUser = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)
  const certificates = useStore((s) => s.certificates)

  const mine = applications.filter((a) => a.applicantId === currentUser?.id)
  const pending = mine.filter((a) => a.status === "Pending" || a.status === "Under Review")
  const scheduled = mine.filter((a) => a.status === "Inspection Scheduled")
  const myCertificates = certificates.filter((c) => c.applicantName === currentUser?.name)
  const activeCertificates = myCertificates.filter((c) => c.status === "Valid")

  const stats = [
    { label: "Total applications", value: mine.length, icon: ListChecks },
    { label: "Awaiting review", value: pending.length, icon: FilePlus2 },
    { label: "Inspections scheduled", value: scheduled.length, icon: CalendarClock },
    { label: "Active certificates", value: activeCertificates.length, icon: ShieldCheck },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome, ${currentUser?.name ?? ""}`}
        description="Track your verification applications, appointments, and certificates."
        actions={
          <Button render={<Link href="/applicant/applications/new" />}>
            <FilePlus2 data-icon="inline-start" />
            New application
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-4.5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6 border-border">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent applications</CardTitle>
            <CardDescription>Your most recently submitted verification requests.</CardDescription>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/applicant/applications" />}>
            View all
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent>
          <ApplicationsTable
            applications={mine.slice(0, 5)}
            detailBasePath="/applicant/applications"
            emptyMessage="You have not submitted any applications yet."
          />
        </CardContent>
      </Card>

      {scheduled.length > 0 ? (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Upcoming inspections</CardTitle>
            <CardDescription>Appointments booked for on-site verification.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {scheduled.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {app.instrument.type} — {app.instrument.serialNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {app.appointment?.date} at {app.appointment?.time} · {app.appointment?.location}
                  </span>
                </div>
                <Button variant="outline" size="sm" render={<Link href={`/applicant/applications/${app.id}`} />}>
                  View details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
