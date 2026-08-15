"use client"

import { useActionState, useState } from "react"
import { createSessionDetailAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"
import { addMinutesToTime, timesOverlap } from "@/lib/date"

const initial: FormState = {}

const SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export default function DetailForm({
  registrationId,
  tanggal,
  durasiMenit,
  occupied,
}: {
  registrationId: number
  tanggal: string
  durasiMenit: number
  occupied: { jam_mulai: string; jam_selesai: string }[]
}) {
  const [state, formAction, pending] = useActionState(createSessionDetailAction, initial)
  const [jamMulai, setJamMulai] = useState("")
  const [tempat, setTempat] = useState("")
  const [materi, setMateri] = useState("")
  const [touched, setTouched] = useState<{ tempat?: boolean; materi?: boolean }>({})

  const jamSelesai = jamMulai ? addMinutesToTime(jamMulai, durasiMenit) : ""
  const conflicts = occupied.filter((o) => timesOverlap(jamMulai, jamSelesai, o.jam_mulai, o.jam_selesai))

  const tempatEmpty = !tempat.trim()
  const materiEmpty = !materi.trim()
  const blocked = conflicts.length > 0
  const ready = Boolean(jamMulai && !blocked && !tempatEmpty && !materiEmpty)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="registration_id" value={registrationId} />
      <input type="hidden" name="tanggal" value={tanggal} />
      <input type="hidden" name="jam_mulai" value={jamMulai} />

      <div>
        <p className="mb-2 text-sm font-medium">Jam Mulai</p>
        <div className="grid grid-cols-4 gap-2">
          {SLOTS.map((slot) => {
            const slotEnd = addMinutesToTime(slot, durasiMenit)
            const slotConflict = occupied.some((o) =>
              timesOverlap(slot, slotEnd, o.jam_mulai, o.jam_selesai)
            )
            const selected = slot === jamMulai
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setJamMulai(slot)}
                className={[
                  "flex h-10 items-center justify-center rounded-lg border text-sm",
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : slotConflict
                      ? "border-red-200 text-red-500"
                      : "border-zinc-300 hover:bg-zinc-100",
                ].join(" ")}
              >
                {slot}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-sm">
        Jam Selesai (otomatis):{" "}
        <span className="font-semibold">
          {jamSelesai || "Pilih jam mulai dahulu"}
        </span>{" "}
        · {durasiMenit} menit
      </p>

      {jamMulai && blocked && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Jam bentrok dengan sesi lain pada tanggal {tanggal}:{" "}
          {conflicts.map((c) => `${c.jam_mulai}–${c.jam_selesai}`).join(", ")}. Pilih jam
          lain untuk melanjutkan.
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Tempat</span>
        <input
          name="tempat"
          value={tempat}
          onChange={(event) => setTempat(event.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, tempat: true }))}
          className={`h-12 rounded-xl border px-3 ${
            touched.tempat && tempatEmpty ? "border-red-400" : "border-zinc-300"
          }`}
        />
        {touched.tempat && tempatEmpty && (
          <p className="text-xs text-red-600">Tempat wajib diisi.</p>
        )}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          Materi
          <span className="text-zinc-400"> *</span>
        </span>
        <input
          name="materi"
          value={materi}
          onChange={(event) => setMateri(event.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, materi: true }))}
          className={`h-12 rounded-xl border px-3 ${
            touched.materi && materiEmpty ? "border-red-400" : "border-zinc-300"
          }`}
        />
        {touched.materi && materiEmpty && (
          <p className="text-xs text-red-600">Materi wajib diisi.</p>
        )}
      </label>

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <BottomBar>
        <button
          type="submit"
          disabled={!ready || pending}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Menyimpan..." : "Simpan Sesi"}
        </button>
      </BottomBar>
    </form>
  )
}