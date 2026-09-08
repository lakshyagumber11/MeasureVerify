"use client"

import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CertificateView } from "@/components/certificate-view"
import { PageHeader } from "@/components/page-header"
import { useStore } from "@/lib/store"

export default function OfficerCertificateDetailPage() {
  const params = useParams<{ id: string }>()
  const certificates = useStore((s) => s.certificates)
  const certificate = certificates.find((c) => c.id === params.id)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  if (!certificate) return notFound()

  return (
    <div>
      <PageHeader title="Certificate" description="Issued verification certificate." />
      <div className="max-w-2xl">
        <CertificateView certificate={certificate} verifyUrl={`${origin}/verify/${certificate.certificateNumber}`} />
      </div>
    </div>
  )
}
