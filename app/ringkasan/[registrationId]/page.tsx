import Link from "next/link"
import { notFound } from "next/navigation"
import BottomBar from "@/components/layout/BottomBar"
import StepLayout from "@/components/layout/StepLayout"
import { getRegistration, getSessions } from "@/lib/registrations"

export default async function RingkasanPage({
  params,
}: {
  params: Promise<{ registrationId: string }>
}) {
  const { registrationId } = await params
  const id = Number(registrationId)
  const registration = getRegistration(id)
  if (!registration) notFound()

  const sessions = getSessions(id)

  return (
    <StepLayout
      title="Ringkasan"
      subtitle={registration.nama_siswa}
      progress={{ current: sessions.length, total: registration.jumlah_sesi }}
    >
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Program</dt>
          <dd>{registration.program}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Jumlah Sesi</dt>
          <dd>{registration.jumlah_sesi}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Durasi per Sesi</dt>
          <dd>{registration.durasi_per_sesi} menit</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-zinc-500">Mode Belajar</dt>
          <dd className="capitalize">{registration.mode_belajar}</dd>
        </div>
      </dl>

      <ul className="mt-6 flex flex-col gap-2">
        {sessions.map((s, i) => (
          <li key={s.id} className="rounded-lg border border-zinc-200 px-3 py-2 text-sm">
            <p className="font-medium">
              Sesi ke-{i + 1}: {s.tanggal} {s.jam_mulai}–{s.jam_selesai}
            </p>
            <p className="text-zinc-600">Tempat: {s.tempat || "-"}</p>
            <p className="text-zinc-600">Materi: {s.materi || "-"}</p>
          </li>
        ))}
      </ul>

      <BottomBar>
        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white"
        >
          Selesai
        </Link>
      </BottomBar>
    </StepLayout>
  )
}