import { notFound, redirect } from "next/navigation"
import StepLayout from "@/components/layout/StepLayout"
import { getRegistration, getSessions } from "@/lib/registrations"
import { toIsoDate } from "@/lib/date"
import PilihTanggalClient from "./PilihTanggalClient"

export default async function PilihTanggalPage({
  params,
}: {
  params: Promise<{ registrationId: string }>
}) {
  const { registrationId } = await params
  const registration = await getRegistration(registrationId)
  if (!registration) notFound()

  const sessions = await getSessions(registrationId)
  if (sessions.length >= registration.jumlah_sesi) {
    redirect(`/ringkasan/${registrationId}`)
  }

  const nextIndex = sessions.length + 1
  const backUrl = sessions.length === 0 ? "/pendaftaran" : `/ringkasan/${registrationId}`

  return (
    <StepLayout
      step={2}
      title="Pilih tanggal"
      subtitle={`Sesi ke-${nextIndex} · ${sessions.length} dari ${registration.jumlah_sesi} sesi terjadwal`}
      backUrl={backUrl}
    >
      <PilihTanggalClient
        registrationId={registrationId}
        todayIso={toIsoDate(new Date())}
        sessionDates={sessions.map((s) => s.tanggal)}
      />
    </StepLayout>
  )
}