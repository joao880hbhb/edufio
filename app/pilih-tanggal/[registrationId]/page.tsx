import { notFound, redirect } from "next/navigation"
import ScheduleForm from "@/components/forms/ScheduleForm"
import StepLayout from "@/components/layout/StepLayout"
import { getRegistration, getSessions } from "@/lib/registrations"
import { toIsoDate } from "@/lib/date"

export default async function PilihTanggalPage({
  params,
}: {
  params: Promise<{ registrationId: string }>
}) {
  const { registrationId } = await params
  const id = Number(registrationId)
  const registration = getRegistration(id)
  if (!registration) notFound()

  const sessions = getSessions(id)
  if (sessions.length >= registration.jumlah_sesi) {
    redirect(`/ringkasan/${id}`)
  }

  return (
    <StepLayout
      title="Pilih Tanggal"
      subtitle={`${registration.nama_siswa} • ${registration.program} • ${registration.durasi_per_sesi} menit/sesi`}
    >
      <ScheduleForm
        registrationId={id}
        totalSessions={registration.jumlah_sesi}
        currentSessions={sessions.length}
        sessionDates={sessions.map((s) => s.tanggal)}
        todayIso={toIsoDate(new Date())}
      />
    </StepLayout>
  )
}