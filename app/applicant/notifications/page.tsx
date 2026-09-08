"use client"

import { Bell, CheckCircle2, Info, ShieldAlert, XCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: ShieldAlert,
  error: XCircle,
}

export default function ApplicantNotificationsPage() {
  const currentUser = useStore((s) => s.currentUser)
  const notifications = useStore((s) => s.notifications)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)

  const mine = notifications.filter(
    (n) => n.audience === "applicant" && (!n.userId || n.userId === currentUser?.id),
  )

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Updates about your applications, appointments, and certificates."
        actions={
          <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead("applicant")}>
            Mark all as read
          </Button>
        }
      />

      {mine.length === 0 ? (
        <Empty className="border border-dashed border-border rounded-lg py-12">
          <EmptyMedia variant="icon">
            <Bell />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>You&apos;re all caught up.</EmptyDescription>
        </Empty>
      ) : (
        <div className="flex flex-col gap-2">
          {mine.map((n) => {
            const Icon = ICONS[n.type]
            return (
              <Card key={n.id} className={cn("border-border", !n.read && "border-primary/30 bg-accent/20")}>
                <CardContent className="flex items-start gap-3 p-4">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      n.type === "success" && "bg-success/10 text-success",
                      n.type === "warning" && "bg-warning/15 text-warning",
                      n.type === "error" && "bg-destructive/10 text-destructive",
                      n.type === "info" && "bg-accent text-accent-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{n.title}</span>
                    <span className="text-sm text-muted-foreground">{n.message}</span>
                    <span className="text-xs text-muted-foreground">{n.date}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
