"use client"

import { useActionState } from "react"
import { updateSessionDetailAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"

const initial: FormState = {}

export default function DetailForm({
  sessionId,
  registrationId,
  label,
}: {
  sessionId: number
  registrationId: number
  label: string
}) {
  const [state, formAction, pending] = useActionState(updateSessionDetailAction, initial)

  return (
    <form action={formAction} className="flex flex-col">
      <input type="hidden" name="session_id" value={sessionId} />
      <input type="hidden" name="registration_id" value={registrationId} />
      <p className="mb-4 text-sm font-medium text-zinc-600">{label}</p>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Tempat</span>
          <input
            name="tempat"
            className="h-12 rounded-lg border border-zinc-300 px-3"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Materi</span>
          <input
            name="materi"
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
            {pending ? "Menyimpan..." : "Simpan & Detail Sesi Berikutnya"}
          </button>
          <button
            type="submit"
            name="intent"
            value="finish"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white disabled:opacity-60"
          >
            Simpan & Lihat Ringkasan
          </button>
        </div>
      </BottomBar>
    </form>
  )
}