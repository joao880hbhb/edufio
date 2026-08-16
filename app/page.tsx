import Link from "next/link"
import { connection } from "next/server"
import { getAllRegistrations } from "@/lib/registrations"

export default async function Home() {
  await connection()
  const registrations = await getAllRegistrations()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edufio</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Kelola pendaftaran dan jadwal sesi belajar privat.
          </p>
        </div>

        <Link
          href="/pendaftaran"
          className="flex h-12 items-center justify-center rounded-xl bg-edufio-teal text-sm font-semibold text-white hover:bg-edufio-navy active:scale-[0.98]"
        >
          Mulai Pendaftaran
        </Link>

        <section>
          <h2 className="text-sm font-semibold text-zinc-500">Daftar Pendaftaran</h2>
          {registrations.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">Belum ada pendaftaran.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {registrations.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/ringkasan/${r.id}`}
                    className="block rounded-xl border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-50"
                  >
                    <p className="font-medium">{r.nama_siswa}</p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      Les Privat {r.program} · {r.jumlah_sesi} sesi ·{" "}
                      {r.session_count} terjadwal
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}