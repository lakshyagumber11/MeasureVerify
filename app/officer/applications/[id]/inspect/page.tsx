"use client"

import { notFound, useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const OBSERVATION_FIELDS = [
  { key: "condition", label: "Physical condition", options: ["Good", "Damaged"], fail: "Damaged" },
  { key: "display", label: "Display readout", options: ["Pass", "Fail"], fail: "Fail" },
  { key: "seal", label: "Verification seal", options: ["Valid", "Invalid"], fail: "Invalid" },
  { key: "accuracy", label: "Accuracy check", options: ["Within permissible limit", "Outside permissible limit"], fail: "Outside permissible limit" },
  { key: "identification", label: "Identification marks", options: ["Verified", "Mismatch"], fail: "Mismatch" },
] as const

type ObsKey = (typeof OBSERVATION_FIELDS)[number]["key"]

export default function InspectApplicationPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const currentUser = useStore((s) => s.currentUser)
  const applications = useStore((s) => s.applications)
  const submitInspection = useStore((s) => s.submitInspection)
  const application = applications.find((a) => a.id === params.id)

  const [observations, setObservations] = useState<Record<ObsKey, string>>({
    condition: "",
    display: "",
    seal: "",
    accuracy: "",
    identification: "",
  })
  const [remarks, setRemarks] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  if (!application) return notFound()

  const allAnswered = OBSERVATION_FIELDS.every((f) => observations[f.key])
  const hasFailure = OBSERVATION_FIELDS.some((f) => observations[f.key] === f.fail)
  const result: "PASS" | "FAIL" = hasFailure ? "FAIL" : "PASS"

  function handleSubmit() {
    setTouched(true)
    if (!allAnswered || !remarks.trim() || !currentUser) return
    setSubmitting(true)
    setTimeout(() => {
      submitInspection(application!.id, {
        observations: observations as unknown as {
          condition: "Good" | "Damaged"
          display: "Pass" | "Fail"
          seal: "Valid" | "Invalid"
          accuracy: "Within permissible limit" | "Outside permissible limit"
          identification: "Verified" | "Mismatch"
        },
        remarks,
        result,
        officer: currentUser.name,
      })
      setSubmitting(false)
      toast.success(`Inspection submitted — result: ${result}.`)
      router.push(`/officer/applications/${application!.id}`)
    }, 600)
  }

  return (
    <div>
      <PageHeader
        title="Conduct Inspection"
        description={`${application.id} — ${application.instrument.type} (${application.instrument.serialNumber})`}
      />

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Observations</CardTitle>
          <CardDescription>Record your on-site findings for each checkpoint.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {OBSERVATION_FIELDS.map((field) => (
              <FieldSet key={field.key} className={cn(touched && !observations[field.key] && "rounded-lg border border-destructive/40 p-3")}>
                <FieldLabel className="mb-2 text-sm font-medium">{field.label}</FieldLabel>
                <RadioGroup
                  value={observations[field.key]}
                  onValueChange={(v) => setObservations((p) => ({ ...p, [field.key]: v as string }))}
                  className="flex flex-row gap-6"
                >
                  {field.options.map((opt) => (
                    <Field key={opt} orientation="horizontal" className="w-auto">
                      <RadioGroupItem value={opt} id={`${field.key}-${opt}`} />
                      <FieldLabel htmlFor={`${field.key}-${opt}`} className="font-normal">
                        {opt}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>
              </FieldSet>
            ))}

            <Field data-invalid={touched && !remarks.trim()}>
              <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
              <Textarea
                id="remarks"
                rows={4}
                placeholder="Describe your findings in detail..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                aria-invalid={touched && !remarks.trim()}
              />
            </Field>
          </FieldGroup>

          {allAnswered ? (
            <div
              className={cn(
                "mt-4 flex items-center gap-2 rounded-lg p-3 text-sm font-medium",
                result === "PASS" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {result === "PASS" ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
              Computed result: {result}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : null}
          Submit inspection
        </Button>
      </div>
    </div>
  )
}
