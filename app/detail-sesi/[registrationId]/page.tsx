import Link from "next/link"
import { notFound } from "next/navigation"
import BottomBar from "@/components/layout/BottomBar"
import DetailForm from "@/components/forms/DetailForm"
import StepLayout from "@/components/layout/StepLayout"
import {
  firstSessionNeedingDetail,
  getRegistration,
  getSessions,
} from "@/lib/registrations"

export default async function DetailSesiPage({
  params,
}: {
  params: Promise<{ registrationId: string }>
}) {
  const { registrationId } = await params
  const id = Number(registrationId)
  const registration = getRegistration(id)
  if (!registration) notFound()

  const sessions = getSessions(id)
  const session = firstSessionNeedingDetail(id)

  if (!session) {
    return (
      <StepLayout
        title="Detail Sesi"
        subtitle={registration.nama_siswa}
        progress={{ current: sessions.length, total: sessions.length }}
      >
        <p className="text-sm text-zinc-600">
          Detail semua sesi sudah lengkap. Lanjut ke ringkasan pendaftaran.
        </p>
        <BottomBar>
          <Link
            href={`/ringkasan/${id}`}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white"
          >
            Lihat Ringkasan
          </Link>
        </BottomBar>
      </StepLayout>
    )
  }

  const index = sessions.findIndex((s) => s.id === session.id) + 1

  return (
    <StepLayout
      title="Detail Sesi"
      subtitle={registration.nama_siswa}
      progress={{ current: index, total: sessions.length }}
    >
      <DetailForm
        sessionId={session.id}
        registrationId={id}
        label={`Sesi ke-${index}: ${session.tanggal} ${session.jam_mulai}–${session.jam_selesai}`}
      />
    </StepLayout>
  )
}