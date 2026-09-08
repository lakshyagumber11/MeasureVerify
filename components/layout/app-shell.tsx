"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Bell, LogOut, ScanQrCode } from "lucide-react"
import { Logo } from "@/components/logo"
import type { NavItem } from "@/components/layout/nav-config"
import { useStore } from "@/lib/store"
import type { Role } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const ROLE_LABEL: Record<Role, string> = {
  applicant: "Applicant",
  officer: "Verification Officer",
  admin: "Administrator",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AppShell({
  role,
  navItems,
  children,
}: {
  role: Role
  navItems: NavItem[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = useStore((s) => s.currentUser)
  const logout = useStore((s) => s.logout)
  const notifications = useStore((s) => s.notifications)
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead)

  useEffect(() => {
    if (!currentUser || currentUser.role !== role) {
      router.replace("/login")
    }
  }, [currentUser, role, router])

  if (!currentUser || currentUser.role !== role) {
    return <div className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">Redirecting to login…</div>
  }

  const roleNotifications = notifications.filter(
    (n) => n.audience === role || (n.userId && n.userId === currentUser.id),
  )
  const unreadCount = roleNotifications.filter((n) => !n.read).length

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5 group-data-[collapsible=icon]:px-2">
          <Link href="/" className="group-data-[collapsible=icon]:hidden">
            <Logo dark />
          </Link>
        </SidebarHeader>
        <SidebarContent className="py-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const active = pathname === item.href || pathname?.startsWith(item.href + "/")
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.label}
                        className="text-sidebar-foreground data-active:bg-sidebar-accent data-active:text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border px-3 py-3 group-data-[collapsible=icon]:px-2">
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-sidebar-primary text-xs text-sidebar-primary-foreground">
                {initials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-medium text-sidebar-foreground">{currentUser.name}</span>
              <span className="truncate text-[11px] text-sidebar-foreground/60">{ROLE_LABEL[role]}</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-auto shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
              onClick={() => {
                logout()
                router.push("/login")
              }}
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
          <SidebarTrigger />
          <div className="flex-1" />
          <Button variant="outline" size="sm" render={<Link href="/verify" />}>
            <ScanQrCode data-icon="inline-start" />
            Public Verification
          </Button>
          <DropdownMenu
            onOpenChange={(open) => {
              if (!open) markAllNotificationsRead(role)
            }}
          >
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
                  <Bell className="size-4" />
                  {unreadCount > 0 ? (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
                      {unreadCount}
                    </Badge>
                  ) : null}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {roleNotifications.length === 0 ? (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications yet.</p>
                ) : (
                  <DropdownMenuGroup>
                    {roleNotifications.slice(0, 8).map((n) => (
                      <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal py-2">
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/10 text-[11px] text-primary">
                      {initials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{currentUser.name}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{ROLE_LABEL[role]}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 bg-background p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
