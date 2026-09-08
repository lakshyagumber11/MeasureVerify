"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCw } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col bg-secondary/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center px-4 py-3.5 md:px-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 md:px-6">
        <Card className="w-full max-w-md border-2 border-destructive/30">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-7" />
            </span>
            <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              An unexpected error occurred while loading this page. You can try again, or head back to the home
              page.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Button variant="outline" render={<Link href="/" />}>
                Back to home
              </Button>
              <Button onClick={() => reset()}>
                <RotateCw data-icon="inline-start" />
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
