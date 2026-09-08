"use client"

import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { useStore } from "@/lib/store"

// Dynamically import CertificateView to completely bypass server-side prerendering checks
const CertificateView = dynamic(
  () => import("@/components/certificate-view").then((mod) => mod.CertificateView),
  { ssr: false }
)

export default function AdminCertificateDetailPage() {
  const params = useParams<{ id: string }>()
  const certificates = useStore((s) => s.certificates)
  const certificate = certificates.find((c) => c.id === params.id)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  if (!certificate) return notFound()

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


