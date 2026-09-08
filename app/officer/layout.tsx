import { AppShell } from "@/components/layout/app-shell"
import { officerNav } from "@/components/layout/nav-config"

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="officer" navItems={officerNav}>
      {children}
    </AppShell>
  )
}
