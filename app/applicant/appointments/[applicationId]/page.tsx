"use client"

import { notFound, useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CalendarClock, Loader2, MapPin } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function BookAppointmentPage() {
  const params = useParams<{ applicationId: string }>()
  const router = useRouter()
  const applications = useStore((s) => s.applications)
  const appointmentSlots = useStore((s) => s.appointmentSlots)
  const bookAppointment = useStore((s) => s.bookAppointment)

  const application = applications.find((a) => a.id === params.applicationId)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map<string, typeof appointmentSlots>()
    for (const slot of appointmentSlots) {
      const list = map.get(slot.date) ?? []
      list.push(slot)
      map.set(slot.date, list)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [appointmentSlots])

  if (!application) return notFound()
  const app = application

  function handleConfirm() {
    if (!selectedSlot) return
    setSubmitting(true)
    setError(null)
    setTimeout(() => {
      const result = bookAppointment(app.id, selectedSlot)
      setSubmitting(false)
      if (!result.ok) {
        setError(result.error ?? "Unable to book this appointment.")
        toast.error(result.error ?? "Unable to book this appointment.")
        return
      }
      toast.success("Appointment booked successfully.")
      router.push(`/applicant/applications/${app.id}`)
    }, 500)
  }

  return (
    <div>
      <PageHeader
        title="Schedule Inspection Appointment"
        description={`For application ${application.id} — ${application.instrument.type} (${application.instrument.serialNumber})`}
      />

      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Booking failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4">
        {grouped.map(([date, slots]) => (
          <Card key={date} className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="size-4 text-muted-foreground" />
                {date}
              </CardTitle>
              <CardDescription>{slots[0].location}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={slot.booked}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    selectedSlot === slot.id
                      ? "border-primary bg-accent/50"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="font-medium text-foreground">{slot.time}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    Officer: {slot.officer}
                  </span>
                  {slot.booked ? <span className="text-xs text-destructive">Already booked</span> : null}
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleConfirm} disabled={!selectedSlot || submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : null}
          Confirm appointment
        </Button>
      </div>
    </div>
  )
}
