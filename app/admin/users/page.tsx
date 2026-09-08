"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
}

export default function AdminUsersPage() {
  const users = useStore((s) => s.users)
  const [search, setSearch] = useState("")

  const applicants = users
    .filter((u) => u.role === "applicant")
    .filter((u) => u.name.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <div>
      <PageHeader title="Users" description="All applicant accounts registered on the platform." />
      <Field className="mb-4 w-full sm:w-80">
        <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Field>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.mobile}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
