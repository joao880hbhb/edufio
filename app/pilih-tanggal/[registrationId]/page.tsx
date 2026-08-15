import { notFound, redirect } from "next/navigation"
import Calendar from "@/components/calendar/Calendar"
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

  const nextIndex = sessions.length + 1

  return (
    <StepLayout
      title="Pilih Tanggal"
      subtitle={`${registration.nama_siswa} • ${registration.program} • ${registration.durasi_per_sesi} menit/sesi`}
    >
      <p className="mb-4 text-sm font-medium">
        Sesi ke-{nextIndex} dari {registration.jumlah_sesi} sesi terjadwal
      </p>
      <Calendar
        registrationId={id}
        todayIso={toIsoDate(new Date())}
        sessionDates={sessions.map((s) => s.tanggal)}
      />
    </StepLayout>
  )
}