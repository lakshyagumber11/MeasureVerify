import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-secondary/40">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  )
}
