import Link from "next/link"
import {
  ArrowRight,
  Award,
  CalendarClock,
  ClipboardCheck,
  FileText,
  QrCode,
  ScanQrCode,
  ShieldCheck,
} from "lucide-react"
import { Logo, SihBadge } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const FEATURES = [
  {
    icon: FileText,
    title: "Digital application filing",
    description: "Applicants submit verification requests online with instrument details and supporting documents.",
  },
  {
    icon: CalendarClock,
    title: "Self-service scheduling",
    description: "Book inspection appointments directly with a verification officer at a convenient slot and location.",
  },
  {
    icon: ClipboardCheck,
    title: "Structured officer inspection",
    description: "Officers record standardized observations on-site and submit a clear pass or fail result.",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-evident certificates",
    description: "Approved instruments receive a digital certificate bound to a unique QR code and serial number.",
  },
  {
    icon: ScanQrCode,
    title: "Instant public verification",
    description: "Anyone can scan a certificate's QR code or enter its number to confirm authenticity in seconds.",
  },
  {
    icon: Award,
    title: "Full audit trail",
    description: "Every action — from filing to certificate issuance — is timestamped and logged for accountability.",
  },
]

const STEPS = [
  { label: "Apply", description: "Submit instrument details and documents online." },
  { label: "Schedule", description: "Book an inspection slot with a verification officer." },
  { label: "Inspect", description: "Officer verifies the instrument on-site." },
  { label: "Certify", description: "A digital, QR-verifiable certificate is issued." },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
          <Logo />
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/verify" />}>
              <ScanQrCode data-icon="inline-start" />
              Verify a certificate
            </Button>
            <Button size="sm" render={<Link href="/login" />}>
              Sign in
              <ArrowRight data-icon="inline-end" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:px-6 md:py-24">
            <SihBadge />
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Legal Metrology verification, digitized end to end.
            </h1>
            <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              MeasureVerify replaces paper-based instrument verification with a transparent digital workflow —
              application, inspection scheduling, officer sign-off, and QR-verifiable certificates — for weighing
              and measuring instruments used in trade.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/login" />}>
                Get started
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/verify" />}>
                <QrCode data-icon="inline-start" />
                Verify a certificate
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              One platform for applicants, officers, and administrators
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Every step of instrument verification is tracked, timestamped, and auditable — replacing manual
              registers with a single source of truth.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-border">
                <CardHeader>
                  <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-4.5" />
                  </span>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground">How verification works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{step.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center md:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Ready to file an application?</h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Sign in as an applicant, verification officer, or administrator to access your dashboard.
            </p>
            <Button size="lg" render={<Link href="/login" />}>
              Sign in to continue
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-6">
          <span>&copy; 2026 MeasureVerify — Department of Legal Metrology.</span>
          <span>Smart India Hackathon 2026 · Problem Statement SIH26036</span>
        </div>
      </footer>
    </div>
  )
}
