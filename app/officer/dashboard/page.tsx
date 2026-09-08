"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, CheckCircle2, ClipboardList, XCircle } from "lucide-react"
import { ApplicationsTable } from "@/components/applications-table"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export default function OfficerDashboardPage() {
  const currentUser = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)

  const pendingReview = applications.filter((a) => a.status === "Pending" || a.status === "Under Review")
  const scheduledToday = applications.filter(
    (a) => a.status === "Inspection Scheduled" && a.appointment?.officer === currentUser?.name,
  )
  const approved = applications.filter((a) => a.status === "Approved")
  const rejected = applications.filter((a) => a.status === "Rejected")

  const stats = [
    { label: "Pending review", value: pendingReview.length, icon: ClipboardList },
    { label: "Scheduled inspections", value: scheduledToday.length, icon: CalendarClock },
    { label: "Approved", value: approved.length, icon: CheckCircle2 },
    { label: "Rejected", value: rejected.length, icon: XCircle },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome, ${currentUser?.name ?? ""}`}
        description="Review applications, conduct inspections, and issue certificates."
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
            <CardTitle className="text-base">Applications awaiting review</CardTitle>
            <CardDescription>New submissions that need to be reviewed and scheduled.</CardDescription>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/officer/applications" />}>
            View all
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent>
          <ApplicationsTable
            applications={pendingReview.slice(0, 5)}
            detailBasePath="/officer/applications"
            showApplicant
            emptyMessage="No applications are currently pending review."
          />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Your scheduled inspections</CardTitle>
            <CardDescription>Inspections assigned to you that are upcoming.</CardDescription>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/officer/today" />}>
            View schedule
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent>
          <ApplicationsTable
            applications={scheduledToday.slice(0, 5)}
            detailBasePath="/officer/applications"
            showApplicant
            emptyMessage="No inspections are currently scheduled for you."
          />
        </CardContent>
      </Card>
    </div>
  )
}
