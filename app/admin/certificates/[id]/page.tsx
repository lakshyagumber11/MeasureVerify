"use client"

import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CertificateView } from "@/components/certificate-view"
import { PageHeader } from "@/components/page-header"
import { usestore } from "@/lib/store"

export default function AdminCertificateDetailPage() {
  const params = useParams<{ id: string }>()
  const certificates = usestore((s) => s.certificates)
  const certificate = certificates.find((c) => c.id === params.id)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  if (!certificate) return notFound()

  // We serialize the certificate object to safely pass it without functions
  const safeCertificate = JSON.parse(JSON.stringify(certificate))

  return (
    <div>
      <PageHeader title="Certificate" description="Issued verification certificate." />
      <div className="max-w-2xl">
        <CertificateView 
          certificate={safeCertificate} 
          verifyUrl={`${origin}/verify/${certificate.id}`} 
        />
      </div>
    </div>
  )
}

