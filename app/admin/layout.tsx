import { AppShell } from "@/components/layout/app-shell"
import { adminNav } from "@/components/layout/nav-config"
export const dynamic = "force-dynamic"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="admin" navItems={adminNav}>
      {children}
    </AppShell>
  )
}
