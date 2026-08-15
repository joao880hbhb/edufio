import Link from "next/link"

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex flex-1 flex-col justify-center gap-4 px-4">
        <h1 className="text-2xl font-semibold">Bimbel</h1>
        <p className="text-sm text-zinc-500">
          Kelola pendaftaran dan jadwal sesi belajar.
        </p>
        <Link
          href="/pendaftaran"
          className="flex h-12 items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white"
        >
          Mulai Pendaftaran
        </Link>
      </main>
    </div>
  )
}