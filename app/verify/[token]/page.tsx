"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react"
import { CertificateView } from "@/components/certificate-view"
import { Logo } from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export default function VerifyResultPage() {
  const params = useParams<{ token: string }>()
  const token = decodeURIComponent(params.token)
  const getCertificateByToken = useStore((s) => s.getCertificateByToken)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const certificate = getCertificateByToken(token)

  return (
    <div className="flex min-h-svh flex-col bg-secondary/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3.5 md:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Button variant="ghost" size="sm" render={<Link href="/verify" />}>
            <ArrowLeft data-icon="inline-start" />
            Verify another
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-2xl">
          {!certificate ? (
            <Card className="border-2 border-destructive/30">
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <ShieldX className="size-7" />
                </span>
                <h1 className="text-lg font-semibold text-foreground">Certificate not found</h1>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {"“"}
                  {token}
                  {"”"} does not match any certificate issued through MeasureVerify. It may be invalid, mistyped, or
                  fraudulent — do not rely on this instrument&apos;s legal metrology compliance.
                </p>
                <Button render={<Link href="/verify" />} className="mt-2">
                  Try another certificate
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {certificate.status === "Valid" ? (
                <Alert className="border-success/30 bg-success/10 text-success">
                  <ShieldCheck className="size-4 text-success" />
                  <AlertTitle>Certificate is valid</AlertTitle>
                  <AlertDescription className="text-success/90">
                    This certificate is authentic and currently valid for legal metrology compliance.
                  </AlertDescription>
                </Alert>
              ) : certificate.status === "Expired" ? (
                <Alert className="border-warning/30 bg-warning/10 text-warning">
                  <ShieldAlert className="size-4 text-warning" />
                  <AlertTitle>Certificate has expired</AlertTitle>
                  <AlertDescription className="text-warning/90">
                    This certificate was authentic but expired on {certificate.validUntil}. The instrument must be
                    re-verified.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-4 text-destructive" />
                  <AlertTitle>Certificate has been revoked</AlertTitle>
                  <AlertDescription className="text-destructive/90">
                    This certificate is no longer valid and should not be trusted.
                  </AlertDescription>
                </Alert>
              )}
              <CertificateView certificate={certificate} verifyUrl={`${origin}/verify/${certificate.certificateNumber}`} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
