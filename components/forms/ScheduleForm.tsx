"use client"

import { useActionState } from "react"
import { addSessionAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"

const initial: FormState = {}

export default function ScheduleForm({ registrationId }: { registrationId: number }) {
  const [state, formAction, pending] = useActionState(addSessionAction, initial)

  return (
    <form action={formAction} className="flex flex-col">
      <input type="hidden" name="registration_id" value={registrationId} />
      <p className="mb-4 text-sm text-zinc-600">
        Isi tanggal dan jam mulai. Jam selesai otomatis dihitung dari durasi paket.
      </p>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Tanggal</span>
          <input
            type="date"
            name="tanggal"
            required
            className="h-12 rounded-lg border border-zinc-300 px-3"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Jam Mulai</span>
          <input
            type="time"
            name="jam_mulai"
            required
            className="h-12 rounded-lg border border-zinc-300 px-3"
          />
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>

      <BottomBar>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            name="intent"
            value="stay"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-zinc-300 text-sm font-medium disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : "Simpan & Tambah Sesi Lagi"}
          </button>
          <button
            type="submit"
            name="intent"
            value="detail"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white disabled:opacity-60"
          >
            Simpan & Lanjut Detail Sesi
          </button>
        </div>
      </BottomBar>
    </form>
  )
}