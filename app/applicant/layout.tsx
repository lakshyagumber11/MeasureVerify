import { AppShell } from "@/components/layout/app-shell"
import { applicantNav } from "@/components/layout/nav-config"

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell role="applicant" navItems={applicantNav}>
      {children}
    </AppShell>
  )
}
