"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Printer } from "lucide-react"
import { CertificateView } from "@/components/certificate-view"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export default function ApplicantCertificateDetailPage() {
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
      <PageHeader
        title="Certificate"
        description="Digital certificate of verification for your instrument."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" render={<Link href="/applicant/certificates" />}>
              <ArrowLeft data-icon="inline-start" />
              Back
            </Button>
            <Button onClick={() => window.print()}>
              <Printer data-icon="inline-start" />
              Print / Download
            </Button>
          </div>
        }
      />
      <div className="max-w-2xl">
        <CertificateView certificate={certificate} verifyUrl={`${origin}/verify/${certificate.certificateNumber}`} />
      </div>
    </div>
  )
}
