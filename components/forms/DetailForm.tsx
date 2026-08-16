"use client"

import { useActionState, useState } from "react"
import { createSessionDetailAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"
import { addMinutesToTime, timesOverlap } from "@/lib/date"

const initial: FormState = {}

const SLOTS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30", "23:00", "23:30",
]

export default function DetailForm({
  registrationId,
  tanggal,
  durasiMenit,
  modeBelajar,
  occupied,
}: {
  registrationId: string
  tanggal: string
  durasiMenit: number
  modeBelajar: string
  occupied: { jam_mulai: string; jam_selesai: string; materi?: string }[]
}) {
  const [state, formAction, pending] = useActionState(createSessionDetailAction, initial)
  const [open, setOpen] = useState(false)
  const [jamMulai, setJamMulai] = useState("")
  const [tempat, setTempat] = useState("")
  const [materi, setMateri] = useState("")
  const [touched, setTouched] = useState<{ materi?: boolean }>({})

  const jamSelesai = jamMulai ? addMinutesToTime(jamMulai, durasiMenit) : ""
  const conflicts = jamMulai
    ? occupied.filter((o) => timesOverlap(jamMulai, jamSelesai, o.jam_mulai, o.jam_selesai))
    : []

  const materiEmpty = !materi.trim()
  const blocked = conflicts.length > 0
  const ready = Boolean(jamMulai && !blocked && !materiEmpty)

  const modeLabel = modeBelajar === "offline" ? "Tutor datang ke lokasi" : "Online"

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="registration_id" value={registrationId} />
      <input type="hidden" name="tanggal" value={tanggal} />
      <input type="hidden" name="jam_mulai" value={jamMulai} />

      {/* Jam Mulai - Dropdown Overlay */}
      <div className="relative z-40 flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Jam mulai</span>
        {open && (
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative z-50 flex h-12 items-center justify-between rounded-xl border border-edufio-gray-light bg-white px-3 text-sm focus:border-edufio-teal focus:outline-none focus:ring-1 focus:ring-edufio-teal"
        >
          <span className={jamMulai ? "" : "text-zinc-400"}>
            {jamMulai || "Pilih jam mulai"}
          </span>
          <span
            className={`text-xs text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
        {open && (
          <div className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-edufio-gray-light bg-white py-1 shadow-lg">
            {SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  setJamMulai(slot)
                  setOpen(false)
                }}
                className={`flex h-10 w-full items-center px-3 text-sm hover:bg-zinc-50 ${
                  slot === jamMulai
                    ? "bg-edufio-teal/10 font-semibold text-edufio-teal"
                    : ""
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Info */}
      {jamMulai && (
        <p className="-mt-2 text-xs text-zinc-500">
          Selesai {jamSelesai} · durasi {durasiMenit} menit (dari paket)
        </p>
      )}

      {/* Conflict Warning - Amber */}
      {jamMulai && blocked && (
        <div className="flex items-start gap-2 rounded-xl border border-edufio-yellow/30 bg-edufio-yellow/10 px-3 py-2.5 text-sm text-foreground">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edufio-yellow text-xs font-bold text-foreground">C</span>
          <div>
            <p className="font-semibold">Bentrok dengan sesi lain</p>
            <p className="opacity-80">
              {conflicts.map((c) => `${c.jam_mulai}–${c.jam_selesai}${c.materi ? ` ${c.materi}` : ""}`).join(", ")}.
              Geser jam mulai untuk melanjutkan.
            </p>
          </div>
        </div>
      )}

      {/* Tempat */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Tempat</span>
        <input
          name="tempat"
          value={tempat}
          onChange={(e) => setTempat(e.target.value)}
          placeholder="contoh: Rumah siswa — Jl. Kaliurang KM 5"
          className="h-12 rounded-xl border border-edufio-gray-light bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-edufio-teal focus:outline-none focus:ring-1 focus:ring-edufio-teal"
        />
      </label>

      {/* Mode Info */}
      <p className="-mt-2 text-xs text-zinc-500">
        Mode: {modeLabel}
      </p>

      {/* Materi - Textarea */}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">
          Materi yang akan disampaikan <span className="text-red-500">*</span>
        </span>
        <textarea
          name="materi"
          value={materi}
          onChange={(e) => setMateri(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, materi: true }))}
          rows={3}
          placeholder="contoh: Persamaan linear dua variabel — soal cerita"
          className={`rounded-xl border px-3 py-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 ${
            touched.materi && materiEmpty
              ? "border-edufio-yellow focus:border-edufio-yellow focus:ring-edufio-yellow bg-white"
              : "border-edufio-gray-light focus:border-edufio-teal focus:ring-edufio-teal bg-white"
          }`}
        />
        {touched.materi && materiEmpty && (
          <p className="text-xs font-medium text-amber-600">Wajib diisi, tidak boleh kosong</p>
        )}
      </label>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <BottomBar>
        <button
          type="submit"
          disabled={!ready || pending}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-edufio-teal text-sm font-semibold text-white hover:bg-edufio-navy active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Menyimpan..." : "Simpan sesi"}
        </button>
      </BottomBar>
    </form>
  )
}