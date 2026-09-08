import {
  Bell,
  ClipboardCheck,
  FileClock,
  FilePlus2,
  Gauge,
  History,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  ShieldCheck,
  User,
  Users,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const applicantNav: NavItem[] = [
  { label: "Dashboard", href: "/applicant/dashboard", icon: LayoutDashboard },
  { label: "My Applications", href: "/applicant/applications", icon: ListChecks },
  { label: "New Application", href: "/applicant/applications/new", icon: FilePlus2 },
  { label: "Appointments", href: "/applicant/appointments", icon: FileClock },
  { label: "Certificates", href: "/applicant/certificates", icon: ShieldCheck },
  { label: "Notifications", href: "/applicant/notifications", icon: Bell },
  { label: "Profile", href: "/applicant/profile", icon: User },
]

export const officerNav: NavItem[] = [
  { label: "Dashboard", href: "/officer/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/officer/applications", icon: ListChecks },
  { label: "Today's Inspections", href: "/officer/today", icon: Gauge },
  { label: "Instruments", href: "/officer/instruments", icon: ClipboardCheck },
  { label: "Certificates", href: "/officer/certificates", icon: ShieldCheck },
  { label: "History", href: "/officer/history", icon: History },
  { label: "Audit Log", href: "/officer/audit", icon: ScrollText },
]

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Officers", href: "/admin/officers", icon: ShieldCheck },
  { label: "Instruments", href: "/admin/instruments", icon: ClipboardCheck },
  { label: "Certificates", href: "/admin/certificates", icon: ScrollText },
  { label: "Audit Log", href: "/admin/audit", icon: History },
]
