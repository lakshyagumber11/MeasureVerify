import { cn } from "@/lib/utils"
import { Scale } from "lucide-react"

export function Logo({
  className,
  subtitle = true,
  dark = false,
}: {
  className?: string
  subtitle?: boolean
  dark?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          dark ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        <Scale className="size-5" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className={cn("text-sm font-bold tracking-tight", dark ? "text-sidebar-foreground" : "text-foreground")}>
          MeasureVerify
        </span>
        {subtitle ? (
          <span className={cn("text-[11px]", dark ? "text-sidebar-foreground/60" : "text-muted-foreground")}>
            Digital Legal Metrology Platform
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function SihBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary",
        className,
      )}
    >
      SIH 2026 • SIH26036
    </span>
  )
}
