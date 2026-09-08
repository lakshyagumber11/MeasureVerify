"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, ScanQrCode } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function VerifyPage() {
  const router = useRouter()
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    router.push(`/verify/${encodeURIComponent(value.trim())}`)
  }

  return (
    <div className="flex min-h-svh flex-col bg-secondary/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 md:px-6">
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
        <Card className="w-full max-w-md border-border">
          <CardHeader className="items-center text-center">
            <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ScanQrCode className="size-6" />
            </span>
            <CardTitle>Verify a certificate</CardTitle>
            <CardDescription>
              Scan the QR code printed on a MeasureVerify certificate, or enter its certificate number below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <Input
                    placeholder="e.g. CERT-2026-00871"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="text-center font-mono"
                    autoFocus
                  />
                </Field>
                <Button type="submit" className="w-full" disabled={!value.trim()}>
                  Verify certificate
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </FieldGroup>
            </form>
            <div className="mt-6 flex flex-col gap-1.5 rounded-lg border border-dashed border-border bg-background p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Try a demo certificate:</span>
              <button
                type="button"
                className="text-left font-mono hover:text-primary"
                onClick={() => router.push("/verify/CERT-2026-00871")}
              >
                CERT-2026-00871 — Valid
              </button>
              <button
                type="button"
                className="text-left font-mono hover:text-primary"
                onClick={() => router.push("/verify/CERT-2025-00612")}
              >
                CERT-2025-00612 — Expired
              </button>
              <button
                type="button"
                className="text-left font-mono hover:text-primary"
                onClick={() => router.push("/verify/CERT-0000-00000")}
              >
                CERT-0000-00000 — Invalid / not found
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
