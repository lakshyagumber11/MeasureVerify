"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Save, UserRound } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"

export default function ApplicantProfilePage() {
  const currentUser = useStore((s) => s.currentUser)
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    mobile: currentUser?.mobile ?? "",
    address: "12-A, Industrial Estate, Sector 18, Gurugram, Haryana",
  })

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Profile updated successfully.")
  }

  return (
    <div>
      <PageHeader title="Profile" description="Manage your account information." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                <UserRound className="size-7" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">Applicant account</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Account details</CardTitle>
            <CardDescription>Update your contact information used for applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="profile-name">Full name / Business name</FieldLabel>
                    <Input id="profile-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="profile-mobile">Mobile number</FieldLabel>
                    <Input id="profile-mobile" value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="profile-email">Email address</FieldLabel>
                  <Input id="profile-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-address">Address</FieldLabel>
                  <Textarea id="profile-address" rows={3} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save data-icon="inline-start" />
                    Save changes
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
