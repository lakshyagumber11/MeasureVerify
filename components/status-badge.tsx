import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileSearch,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react"

type StatusTone = "neutral" | "info" | "success" | "warning" | "destructive"

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  info: "bg-accent text-accent-foreground border-transparent",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/25",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
}

const STATUS_CONFIG: Record<string, { tone: StatusTone; icon: React.ComponentType<{ className?: string }> }> = {
  Pending: { tone: "neutral", icon: Clock },
  "Under Review": { tone: "info", icon: FileSearch },
  "Inspection Scheduled": { tone: "info", icon: Clock },
  "Inspection Completed": { tone: "info", icon: ScanSearch },
  Approved: { tone: "success", icon: CheckCircle2 },
  Rejected: { tone: "destructive", icon: XCircle },
  Valid: { tone: "success", icon: ShieldCheck },
  "Expiring Soon": { tone: "warning", icon: ShieldAlert },
  Expired: { tone: "destructive", icon: ShieldX },
  "Under Verification": { tone: "info", icon: ScanSearch },
  Revoked: { tone: "destructive", icon: ShieldX },
  PASS: { tone: "success", icon: CheckCircle2 },
  FAIL: { tone: "destructive", icon: XCircle },
  Success: { tone: "success", icon: CheckCircle2 },
  Failed: { tone: "destructive", icon: AlertTriangle },
  Info: { tone: "neutral", icon: Clock },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = STATUS_CONFIG[status] ?? { tone: "neutral" as StatusTone, icon: Clock }
  const Icon = config.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        TONE_CLASSES[config.tone],
        className,
      )}
    >
      <Icon className="size-3.5" />
      {status}
    </span>
  )
}
