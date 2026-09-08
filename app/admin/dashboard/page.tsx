"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts"
import { ClipboardList, ShieldCheck, Users, Wrench } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { AuditLogTable } from "@/components/audit-log-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useStore } from "@/lib/store"

const STATUS_CHART_CONFIG: ChartConfig = {
  count: { label: "Applications" },
}

const CERT_COLORS: Record<string, string> = {
  Valid: "var(--chart-2)",
  Expired: "var(--chart-4)",
  Revoked: "var(--chart-5)",
}

export default function AdminDashboardPage() {
  const rawApplications = useStore((s) => s.applications)
  const rawUsers = useStore((s) => s.users)
  const rawCertificates = useStore((s) => s.certificates)
  const rawInstruments = useStore((s) => s.instruments)
  const rawAuditLog = useStore((s) => s.auditLog)

  // Safely copy state datasets to remove complex structures or functions
  const applications = JSON.parse(JSON.stringify(rawApplications)) as typeof rawApplications
  const users = JSON.parse(JSON.stringify(rawUsers)) as typeof rawUsers
  const certificates = JSON.parse(JSON.stringify(rawCertificates)) as typeof rawCertificates
  const instruments = JSON.parse(JSON.stringify(rawInstruments)) as typeof rawInstruments
  const auditLog = JSON.parse(JSON.stringify(rawAuditLog)) as typeof rawAuditLog

  const officers = users.filter((u) => u.role === "officer")
  const applicants = users.filter((u) => u.role === "applicant")

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const app of applications) counts[app.status] = (counts[app.status] ?? 0) + 1
    return Object.entries(counts).map(([status, count]) => ({ status, count }))
  }, [applications])

  const certData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const cert of certificates) counts[cert.status] = (counts[cert.status] ?? 0) + 1
    return Object.entries(counts).map(([status, count]) => ({ status, count, fill: CERT_COLORS[status] }))
  }, [certificates])

  const stats = [
    { label: "Total users", value: users.length, icon: Users },
    { label: "Verification officers", value: officers.length, icon: ShieldCheck },
    { label: "Registered instruments", value: instruments.length, icon: Wrench },
    { label: "Total applications", value: applications.length, icon: ClipboardList },
  ]

  return (
    <div>
      <PageHeader title="Administrator Dashboard" description="System-wide overview of the verification platform." />

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

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Applications by status</CardTitle>
            <CardDescription>Distribution of all applications across the workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={STATUS_CHART_CONFIG} className="h-64 w-full">
              <BarChart data={statusData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Certificate status</CardTitle>
            <CardDescription>Valid, expired, and revoked certificates issued.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={STATUS_CHART_CONFIG} className="h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={certData} dataKey="count" nameKey="status" innerRadius={50} strokeWidth={4}>
                  {certData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>Latest actions logged across the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogTable entries={auditLog.slice(0, 6)} />
        </CardContent>
      </Card>
    </div>
  )
}
