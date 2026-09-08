"use client"

import { ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
}

export default function AdminOfficersPage() {
  const users = useStore((s) => s.users)
  const applications = useStore((s) => s.applications)

  const officers = users.filter((u) => u.role === "officer")

  return (
    <div>
      <PageHeader title="Verification Officers" description="Officers responsible for conducting on-site inspections." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {officers.map((officer) => {
          const handled = applications.filter((a) => a.appointment?.officer === officer.name)
          const approved = handled.filter((a) => a.status === "Approved").length
          const rejected = handled.filter((a) => a.status === "Rejected").length

          return (
            <Card key={officer.id} className="border-border">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary">{initials(officer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{officer.name}</span>
                    <span className="text-xs text-muted-foreground">{officer.title}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-foreground">{handled.length}</span>
                    <span className="text-[11px] text-muted-foreground">Assigned</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-success">{approved}</span>
                    <span className="text-[11px] text-muted-foreground">Approved</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-destructive">{rejected}</span>
                    <span className="text-[11px] text-muted-foreground">Rejected</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" />
                  {officer.email}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
