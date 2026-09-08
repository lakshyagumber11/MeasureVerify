"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import dynamic from "next/dynamic"

// This safely imports your table without breaking the build path scanner
const ApplicationTable = dynamic(
  () => import("@/components/application-table").then((mod) => mod.ApplicationTable || mod.default),
  { ssr: false }
)

export default function ApplicantApplicationsPage() {
  const user = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)
  const [isClient, setIsClient] = useState(false)


  // Prevents Next.js from evaluating client-side data hooks during the build step
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div>
        <PageHeader title="My Applications" description="Loading your applications..." />
      </div>
    )
  }

  const myApplications = applications.filter((a) => a.applicantId === user?.id)
  const safeEntries = JSON.parse(JSON.stringify(myApplications))

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="My Applications" description="Manage and track your verification requests." />
        <Button asChild size="sm">
          <Link href="/applicant/new">
            <Plus className="mr-1.5 size-4" />
            New Application
          </Link>
        </Button>
      </div>
      <ApplicationTable entries={safeEntries} />
    </div>
  )
}

