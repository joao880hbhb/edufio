import Link from "next/link"
import { notFound } from "next/navigation"
import BottomBar from "@/components/layout/BottomBar"
import ScheduleForm from "@/components/forms/ScheduleForm"
import StepLayout from "@/components/layout/StepLayout"
import { getRegistration, getSessions } from "@/lib/registrations"

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
  const allScheduled = sessions.length >= registration.jumlah_sesi

  return (
    <StepLayout
      title="Pilih Tanggal"
      subtitle={`${registration.nama_siswa} • ${registration.program} • ${registration.durasi_per_sesi} menit/sesi`}
      progress={{ current: sessions.length, total: registration.jumlah_sesi }}
    >
      {sessions.length > 0 && (
        <ul className="mb-6 flex flex-col gap-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            >
              {s.tanggal} • {s.jam_mulai}–{s.jam_selesai}
            </li>
          ))}
        </ul>
      )}

      {allScheduled ? (
        <>
          <p className="text-sm text-zinc-600">
            Semua sesi sudah dijadwalkan. Lanjutkan untuk mengisi detail tiap sesi.
          </p>
          <BottomBar>
            <Link
              href={`/detail-sesi/${id}`}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white"
            >
              Lanjut ke Detail Sesi
            </Link>
          </BottomBar>
        </>
      ) : (
        <ScheduleForm registrationId={id} />
      )}
    </StepLayout>
  )
}