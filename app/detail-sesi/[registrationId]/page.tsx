import { notFound, redirect } from "next/navigation"
import DetailForm from "@/components/forms/DetailForm"
import StepLayout from "@/components/layout/StepLayout"
import { getRegistration, getSessions, getSessionsByDate } from "@/lib/registrations"
import { toIsoDate } from "@/lib/date"

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

function formatTanggal(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return `${HARI[date.getDay()]}, ${d} ${BULAN[m - 1]} ${y}`
}

export default async function DetailSesiPage({
  params,
  searchParams,
}: {
  params: Promise<{ registrationId: string }>
  searchParams: Promise<{ tanggal?: string }>
}) {
  const { registrationId } = await params
  const registration = await getRegistration(registrationId)
  if (!registration) notFound()

  const sessions = await getSessions(registrationId)
  if (sessions.length >= registration.jumlah_sesi) {
    redirect(`/ringkasan/${registrationId}`)
  }

  const { tanggal } = await searchParams
  if (!tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) redirect(`/pilih-tanggal/${registrationId}`)
  const min = new Date()
  min.setDate(min.getDate() + 3)
  if (tanggal < toIsoDate(min)) redirect(`/pilih-tanggal/${registrationId}`)

  const nextIndex = sessions.length + 1

  const occupied = (await getSessionsByDate(tanggal)).map((s) => ({
    jam_mulai: s.jam_mulai,
    jam_selesai: s.jam_selesai,
    materi: s.materi,
  }))

  return (
    <StepLayout
      step={3}
      title="Detail sesi"
      subtitle={`${formatTanggal(tanggal)} · sesi ke-${nextIndex}`}
      backUrl={`/pilih-tanggal/${registrationId}`}
    >
      <DetailForm
        registrationId={registrationId}
        tanggal={tanggal}
        durasiMenit={registration.durasi_per_sesi}
        modeBelajar={registration.mode_belajar}
        occupied={occupied}
      />
    </StepLayout>
  )
}