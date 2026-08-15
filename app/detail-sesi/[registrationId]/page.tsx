import { notFound, redirect } from "next/navigation"
import DetailForm from "@/components/forms/DetailForm"
import StepLayout from "@/components/layout/StepLayout"
import { getRegistration, getSessions, getSessionsByDate } from "@/lib/registrations"
import { toIsoDate } from "@/lib/date"

export default async function DetailSesiPage({
  params,
  searchParams,
}: {
  params: Promise<{ registrationId: string }>
  searchParams: Promise<{ tanggal?: string }>
}) {
  const { registrationId } = await params
  const id = Number(registrationId)
  const registration = getRegistration(id)
  if (!registration) notFound()

  const sessions = getSessions(id)
  if (sessions.length >= registration.jumlah_sesi) {
    redirect(`/ringkasan/${id}`)
  }

  const { tanggal } = await searchParams
  if (!tanggal || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) redirect(`/pilih-tanggal/${id}`)
  const min = new Date()
  min.setDate(min.getDate() + 3)
  if (tanggal < toIsoDate(min)) redirect(`/pilih-tanggal/${id}`)
  if (sessions.some((s) => s.tanggal === tanggal)) redirect(`/pilih-tanggal/${id}`)

  const occupied = getSessionsByDate(tanggal).map((s) => ({
    jam_mulai: s.jam_mulai,
    jam_selesai: s.jam_selesai,
  }))

  return (
    <StepLayout
      title="Detail Sesi"
      subtitle={`${registration.nama_siswa} • ${tanggal}`}
    >
      <DetailForm
        registrationId={id}
        tanggal={tanggal}
        durasiMenit={registration.durasi_per_sesi}
        occupied={occupied}
      />
    </StepLayout>
  )
}