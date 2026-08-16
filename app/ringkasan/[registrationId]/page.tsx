import Link from "next/link"
import { notFound } from "next/navigation"
import StepLayout from "@/components/layout/StepLayout"

import { getRegistration, getSessions } from "@/lib/registrations"

const HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const BULAN_PENDEK = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
]

function formatTanggalPendek(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return `${HARI_PENDEK[date.getDay()]}, ${d} ${BULAN_PENDEK[m - 1]}`
}

function formatJam(jam: string): string {
  return jam.replace(":", ".")
}

export default async function RingkasanPage({
  params,
}: {
  params: Promise<{ registrationId: string }>
}) {
  const { registrationId } = await params
  const registration = await getRegistration(registrationId)
  if (!registration) notFound()

  const sessions = (await getSessions(registrationId)).sort(
    (a, b) =>
      a.tanggal.localeCompare(b.tanggal) || a.jam_mulai.localeCompare(b.jam_mulai)
  )

  const total = registration.jumlah_sesi
  const scheduled = sessions.length
  const remaining = Math.max(total - scheduled, 0)
  const quotaFull = scheduled >= total
  const modeLabel =
    registration.mode_belajar === "offline" ? "tutor datang ke lokasi" : "online"

  // Progress calculation
  const percent = total > 0 ? Math.min(scheduled / total, 1) : 0
  const RADIUS = 9
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const dashOffset = CIRCUMFERENCE * (1 - percent)

  return (
    <StepLayout step={4} title="Ringkasan">
      {/* Student Info Card */}
      <div className="rounded-2xl border border-zinc-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold">{registration.nama_siswa}</p>
            <p className="mt-0.5 text-sm text-zinc-500">
              Les Privat {registration.program} · paket {total} sesi
            </p>
            <p className="text-sm text-zinc-500">
              {registration.durasi_per_sesi} menit · {modeLabel}
            </p>
          </div>
       
        </div>
      </div>

      {/* Session Status */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          <span className="font-semibold text-zinc-900">{scheduled} sesi terjadwal</span>
          {remaining > 0 && <> · {remaining} belum dijadwalkan</>}
        </p>

        {/* Circular Progress Ring */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="shrink-0 -rotate-90"
        >
          <circle
            cx="12"
            cy="12"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-zinc-200"
          />
          <circle
            cx="12"
            cy="12"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="text-edufio-teal transition-[stroke-dashoffset] duration-500"
          />
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-edufio-teal transition-[width] duration-500"
          style={{ width: `${percent * 100}%` }}
        />
      </div>

      {/* Session List */}
      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">
          Belum ada sesi yang dijadwalkan.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {sessions.map((s, idx) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                  Sesi {idx + 1}
                </p>
                <p className="mt-0.5 text-sm font-semibold">
                  {formatTanggalPendek(s.tanggal)} · {formatJam(s.jam_mulai)}–{formatJam(s.jam_selesai)}
                </p>
                <p className="text-sm text-zinc-500">
                  {s.tempat || "—"} · {s.materi || "—"}
                </p>
              </div>
              <span className="text-zinc-300">›</span>
            </div>
          ))}
        </div>
      )}

      {/* Remaining Info */}
      {remaining > 0 && sessions.length > 0 && (
        <p className="mt-2 text-center text-xs text-zinc-400">
          {remaining > 0 && `${remaining} slot masih kosong`}
        </p>
      )}

      {/* Add Session Button - Inline (not in BottomBar) */}
      <div className="mt-4">
        {quotaFull ? (
          <button
            type="button"
            disabled
            className="flex h-12 w-full items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm font-medium text-zinc-400"
          >
            Kuota sesi penuh
          </button>
        ) : (
          <Link
            href={`/pilih-tanggal/${registrationId}`}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm font-semibold text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.98]"
          >
            + Tambah sesi
          </Link>
        )}
      </div>

      {/* Back to Home */}
      <div className="mt-3">
        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-edufio-teal text-sm font-semibold text-white hover:bg-edufio-navy active:scale-[0.98]"
        >
          Ke Beranda
        </Link>
      </div>
    </StepLayout>
  )
}