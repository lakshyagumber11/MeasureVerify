"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, ShieldCheck, UserCog, UserRound } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import type { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

const ROLES: {
  role: Role
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  redirect: string
}[] = [
  {
    role: "applicant",
    title: "Applicant",
    description: "File verification applications, book inspections, and download certificates.",
    icon: UserRound,
    redirect: "/applicant/dashboard",
  },
  {
    role: "officer",
    title: "Verification Officer",
    description: "Review applications, conduct on-site inspections, and issue certificates.",
    icon: ShieldCheck,
    redirect: "/officer/dashboard",
  },
  {
    role: "admin",
    title: "Administrator",
    description: "Oversee users, officers, the instrument registry, and system-wide audit logs.",
    icon: UserCog,
    redirect: "/admin/dashboard",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const login = useStore((s) => s.login)
  const [selected, setSelected] = useState<Role>("applicant")
  const [pending, setPending] = useState(false)

  function handleContinue() {
    setPending(true)
    login(selected)
    const target = ROLES.find((r) => r.role === selected)!.redirect
    router.push(target)
  }

  return (
    <div className="flex min-h-svh flex-col bg-secondary/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 md:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Button variant="ghost" size="sm" render={<Link href="/" />}>
            <ArrowLeft data-icon="inline-start" />
            Back to home
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in to MeasureVerify</h1>
            <p className="max-w-md text-sm text-muted-foreground">
              This is a demonstration environment. Choose a role below to explore its dashboard — no password
              required.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {ROLES.map((r) => (
              <Card
                key={r.role}
                onClick={() => setSelected(r.role)}
                className={cn(
                  "cursor-pointer border-2 transition-colors",
                  selected === r.role ? "border-primary bg-accent/40" : "border-border hover:border-primary/40",
                )}
              >
                <CardHeader>
                  <span
                    className={cn(
                      "mb-2 flex size-10 items-center justify-center rounded-lg",
                      selected === r.role ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <r.icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{r.title}</CardTitle>
                  <CardDescription>{r.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-border">
            <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Continue as {ROLES.find((r) => r.role === selected)?.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  You will be signed in with a demo account for this role.
                </span>
              </div>
              <Button onClick={handleContinue} disabled={pending} className="w-full sm:w-auto">
                {pending ? "Signing in…" : "Continue"}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
