"use client"

import { useActionState } from "react"
import { createRegistrationAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"

const initial: FormState = {}

export default function RegistrationForm() {
  const [state, formAction, pending] = useActionState(createRegistrationAction, initial)

  return (
    <form action={formAction} className="flex flex-col">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nama Siswa</span>
          <input
            name="nama_siswa"
            className="h-12 rounded-lg border border-zinc-300 px-3"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Program</span>
          <select
            name="program"
            defaultValue="SD"
            className="h-12 rounded-lg border border-zinc-300 bg-background px-3"
          >
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Jumlah Sesi</span>
          <select
            name="jumlah_sesi"
            defaultValue="4"
            className="h-12 rounded-lg border border-zinc-300 bg-background px-3"
          >
            <option value="4">4 sesi</option>
            <option value="8">8 sesi</option>
            <option value="12">12 sesi</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Durasi Per Sesi</span>
          <select
            name="durasi_per_sesi"
            defaultValue="60"
            className="h-12 rounded-lg border border-zinc-300 bg-background px-3"
          >
            <option value="60">60 menit</option>
            <option value="90">90 menit</option>
            <option value="120">120 menit</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Mode Belajar</span>
          <select
            name="mode_belajar"
            defaultValue="online"
            className="h-12 rounded-lg border border-zinc-300 bg-background px-3"
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>

      <BottomBar>
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Lanjut"}
        </button>
      </BottomBar>
    </form>
  )
}