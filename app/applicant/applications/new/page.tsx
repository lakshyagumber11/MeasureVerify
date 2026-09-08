"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AlertCircle, ArrowLeft, ArrowRight, Check, FileUp, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DOCUMENT_TEMPLATE, INSTRUMENT_TYPES } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const STEPS = ["Applicant Details", "Instrument Details", "Documents", "Review & Submit"]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_REGEX = /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/

export default function NewApplicationPage() {
  const router = useRouter()
  const currentUser = useStore((s) => s.currentUser)
  const createApplication = useStore((s) => s.createApplication)
  const checkDuplicateSerial = useStore((s) => s.checkDuplicateSerial)

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const [applicant, setApplicant] = useState({
    name: currentUser?.name ?? "",
    mobile: currentUser?.mobile ?? "",
    email: currentUser?.email ?? "",
    address: "",
  })

  const [instrument, setInstrument] = useState({
    type: "" as string,
    manufacturer: "",
    model: "",
    serialNumber: "",
    capacity: "",
    locationOfUse: "",
  })

  const [documents, setDocuments] = useState(DOCUMENT_TEMPLATE.map((d) => ({ ...d, uploaded: false, fileName: undefined as string | undefined })))
  const [uploading, setUploading] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [touched, setTouched] = useState(false)

  const serialDuplicate = useMemo(
    () => (instrument.serialNumber.trim() ? checkDuplicateSerial(instrument.serialNumber) : false),
    [instrument.serialNumber, checkDuplicateSerial],
  )

  const nameValid = applicant.name.trim().length >= 3
  const mobileValid = MOBILE_REGEX.test(applicant.mobile.trim())
  const emailValid = EMAIL_REGEX.test(applicant.email.trim())
  const addressValid = applicant.address.trim().length >= 10
  const applicantValid = nameValid && mobileValid && emailValid && addressValid
  const instrumentValid =
    instrument.type &&
    instrument.manufacturer.trim() &&
    instrument.model.trim() &&
    instrument.serialNumber.trim() &&
    !serialDuplicate &&
    instrument.capacity.trim() &&
    instrument.locationOfUse.trim()
  const documentsValid = documents.every((d) => d.uploaded)

  function handleUpload(key: string) {
    setUploading(key)
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.key === key ? { ...d, uploaded: true, fileName: `${key}.pdf` } : d)),
      )
      setUploading(null)
      toast.success("Document uploaded successfully.")
    }, 600)
  }

  function goNext() {
    setTouched(true)
    if (step === 0 && !applicantValid) return
    if (step === 1 && !instrumentValid) return
    if (step === 2 && !documentsValid) return
    setTouched(false)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    setTouched(false)
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleSubmit() {
    if (!currentUser || !confirmed) return
    setSubmitting(true)
    setTimeout(() => {
      const application = createApplication({
        applicantId: currentUser.id,
        applicantName: applicant.name,
        mobile: applicant.mobile,
        email: applicant.email,
        address: applicant.address,
        instrument: {
          type: instrument.type as (typeof INSTRUMENT_TYPES)[number],
          manufacturer: instrument.manufacturer,
          model: instrument.model,
          serialNumber: instrument.serialNumber,
          capacity: instrument.capacity,
          locationOfUse: instrument.locationOfUse,
        },
        documents,
      })
      toast.success(`Application ${application.id} submitted successfully.`)
      router.push(`/applicant/applications/${application.id}`)
    }, 700)
  }

  return (
    <div>
      <PageHeader title="New Verification Application" description="Complete all steps to submit your instrument for verification." />

      <div className="mb-6 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                  i < step
                    ? "bg-success text-success-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn("whitespace-nowrap text-sm", i === step ? "font-medium text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 ? <Separator className="w-8" /> : null}
          </div>
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          {step === 0 ? (
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={touched && !nameValid}>
                  <FieldLabel htmlFor="name">Full name / Business name</FieldLabel>
                  <Input
                    id="name"
                    value={applicant.name}
                    onChange={(e) => setApplicant((p) => ({ ...p, name: e.target.value }))}
                    aria-invalid={touched && !nameValid}
                  />
                  {touched && !nameValid ? (
                    <FieldError>Enter at least 3 characters.</FieldError>
                  ) : null}
                </Field>
                <Field data-invalid={touched && !mobileValid}>
                  <FieldLabel htmlFor="mobile">Mobile number</FieldLabel>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+91 98100 22456"
                    value={applicant.mobile}
                    onChange={(e) => setApplicant((p) => ({ ...p, mobile: e.target.value }))}
                    aria-invalid={touched && !mobileValid}
                  />
                  {touched && !mobileValid ? (
                    <FieldError>Enter a valid 10-digit Indian mobile number.</FieldError>
                  ) : null}
                </Field>
              </div>
              <Field data-invalid={touched && !emailValid}>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={applicant.email}
                  onChange={(e) => setApplicant((p) => ({ ...p, email: e.target.value }))}
                  aria-invalid={touched && !emailValid}
                />
                {touched && !emailValid ? <FieldError>Enter a valid email address.</FieldError> : null}
              </Field>
              <Field data-invalid={touched && !addressValid}>
                <FieldLabel htmlFor="address">Business / usage address</FieldLabel>
                <Textarea
                  id="address"
                  rows={3}
                  value={applicant.address}
                  onChange={(e) => setApplicant((p) => ({ ...p, address: e.target.value }))}
                  aria-invalid={touched && !addressValid}
                />
                {touched && !addressValid ? <FieldError>Enter a complete address (at least 10 characters).</FieldError> : null}
              </Field>
            </FieldGroup>
          ) : null}

          {step === 1 ? (
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={touched && !instrument.type}>
                  <FieldLabel htmlFor="type">Instrument type</FieldLabel>
                  <Select value={instrument.type} onValueChange={(v) => setInstrument((p) => ({ ...p, type: v as string }))}>
                    <SelectTrigger id="type" aria-invalid={touched && !instrument.type}>
                      <SelectValue placeholder="Select instrument type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {INSTRUMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field data-invalid={touched && !instrument.capacity.trim()}>
                  <FieldLabel htmlFor="capacity">Capacity / range</FieldLabel>
                  <Input
                    id="capacity"
                    placeholder="e.g. 500 kg"
                    value={instrument.capacity}
                    onChange={(e) => setInstrument((p) => ({ ...p, capacity: e.target.value }))}
                    aria-invalid={touched && !instrument.capacity.trim()}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={touched && !instrument.manufacturer.trim()}>
                  <FieldLabel htmlFor="manufacturer">Manufacturer</FieldLabel>
                  <Input
                    id="manufacturer"
                    value={instrument.manufacturer}
                    onChange={(e) => setInstrument((p) => ({ ...p, manufacturer: e.target.value }))}
                    aria-invalid={touched && !instrument.manufacturer.trim()}
                  />
                </Field>
                <Field data-invalid={touched && !instrument.model.trim()}>
                  <FieldLabel htmlFor="model">Model</FieldLabel>
                  <Input
                    id="model"
                    value={instrument.model}
                    onChange={(e) => setInstrument((p) => ({ ...p, model: e.target.value }))}
                    aria-invalid={touched && !instrument.model.trim()}
                  />
                </Field>
              </div>
              <Field data-invalid={(touched && !instrument.serialNumber.trim()) || serialDuplicate}>
                <FieldLabel htmlFor="serial">Serial number</FieldLabel>
                <Input
                  id="serial"
                  className="font-mono"
                  placeholder="e.g. DWS-91234"
                  value={instrument.serialNumber}
                  onChange={(e) => setInstrument((p) => ({ ...p, serialNumber: e.target.value }))}
                  aria-invalid={(touched && !instrument.serialNumber.trim()) || serialDuplicate}
                />
                {serialDuplicate ? (
                  <FieldError>This serial number already exists in the instrument registry.</FieldError>
                ) : touched && !instrument.serialNumber.trim() ? (
                  <FieldError>Serial number is required.</FieldError>
                ) : null}
              </Field>
              <Field data-invalid={touched && !instrument.locationOfUse.trim()}>
                <FieldLabel htmlFor="location">Location of use</FieldLabel>
                <Input
                  id="location"
                  placeholder="e.g. Wholesale Grain Market, Gurugram"
                  value={instrument.locationOfUse}
                  onChange={(e) => setInstrument((p) => ({ ...p, locationOfUse: e.target.value }))}
                  aria-invalid={touched && !instrument.locationOfUse.trim()}
                />
              </Field>
            </FieldGroup>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Upload the following documents to support your application. This is a demonstration environment —
                clicking upload simulates a file upload.
              </p>
              {documents.map((doc) => (
                <div
                  key={doc.key}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        doc.uploaded ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {doc.uploaded ? <Check className="size-4" /> : <FileUp className="size-4" />}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{doc.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {doc.uploaded ? doc.fileName : "Not uploaded"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={doc.uploaded ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleUpload(doc.key)}
                    disabled={uploading === doc.key}
                  >
                    {uploading === doc.key ? (
                      <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    ) : doc.uploaded ? (
                      <FileUp data-icon="inline-start" />
                    ) : (
                      <FileUp data-icon="inline-start" />
                    )}
                    {doc.uploaded ? "Re-upload" : "Upload"}
                  </Button>
                </div>
              ))}
              {touched && !documentsValid ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Missing documents</AlertTitle>
                  <AlertDescription>Please upload all required documents before continuing.</AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Applicant Details</h3>
                <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
                  <SummaryField label="Name" value={applicant.name} />
                  <SummaryField label="Mobile" value={applicant.mobile} />
                  <SummaryField label="Email" value={applicant.email} />
                  <SummaryField label="Address" value={applicant.address} />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Instrument Details</h3>
                <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
                  <SummaryField label="Type" value={instrument.type} />
                  <SummaryField label="Manufacturer / Model" value={`${instrument.manufacturer} / ${instrument.model}`} />
                  <SummaryField label="Serial number" value={instrument.serialNumber} mono />
                  <SummaryField label="Capacity" value={instrument.capacity} />
                  <SummaryField label="Location of use" value={instrument.locationOfUse} />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Documents</h3>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-sm text-muted-foreground">{documents.filter((d) => d.uploaded).length} of {documents.length} documents uploaded.</p>
                </div>
              </div>
              <Field orientation="horizontal">
                <Checkbox id="confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
                <FieldLabel htmlFor="confirm" className="font-normal">
                  I confirm the information provided above is accurate to the best of my knowledge.
                </FieldLabel>
              </Field>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={goBack} disabled={step === 0}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={goNext}>
            Continue
            <ArrowRight data-icon="inline-end" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!confirmed || submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : <Check data-icon="inline-start" />}
            Submit application
          </Button>
        )}
      </div>
    </div>
  )
}

function SummaryField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>{value || "—"}</span>
    </div>
  )
}
