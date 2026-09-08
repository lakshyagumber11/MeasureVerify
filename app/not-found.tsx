import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
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
        <Card className="w-full max-w-md border-border">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileQuestion className="size-7" />
            </span>
            <h1 className="text-lg font-semibold text-foreground">Page not found</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <Button render={<Link href="/" />} className="mt-2">
              Back to home
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
