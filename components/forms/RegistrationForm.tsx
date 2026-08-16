"use client"

import { useActionState, useState, type ChangeEvent } from "react"
import { createRegistrationAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"

const initial: FormState = {}

const PROGRAM_OPTIONS = [
  { value: "", label: "Pilih program" },
  { value: "SD", label: "Les Privat SD" },
  { value: "SMP", label: "Les Privat SMP" },
  { value: "SMA", label: "Les Privat SMA" },
]

const JUMLAH_OPTIONS = [
  { value: "4", label: "4 sesi" },
  { value: "8", label: "8 sesi" },
  { value: "12", label: "12 sesi" },
]

const DURASI_OPTIONS = [
  { value: "60", label: "60 mnt" },
  { value: "90", label: "90 mnt" },
  { value: "120", label: "120 mnt" },
]

const MODE_OPTIONS = [
  { value: "offline", label: "Tutor datang ke lokasi", desc: "Sesi belajar tatap muka di lokasi siswa" },
  { value: "online", label: "Online", desc: "Sesi belajar via video call" },
]

interface FormValues {
  program: string
  jumlahSesi: string
  durasi: string
  mode: string
}

export default function RegistrationForm() {
  const [values, setValues] = useState<FormValues>({
    program: "",
    jumlahSesi: "",
    durasi: "",
    mode: "",
  })
  const [state, formAction, pending] = useActionState(createRegistrationAction, initial)

  const complete = Boolean(
    values.program && values.jumlahSesi && values.durasi && values.mode
  )

  return (
    <form action={formAction} className="flex flex-col">
      <div className="flex flex-col gap-6">
        {/* Nama Siswa */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Nama siswa</span>
          <input
            name="nama_siswa"
            placeholder="contoh: Aruna Prameswari"
            className="h-12 rounded-xl border border-edufio-gray-light px-3 text-sm placeholder:text-zinc-400 focus:border-edufio-teal focus:outline-none focus:ring-1 focus:ring-edufio-teal bg-white"
          />
        </label>

        {/* Program - Dropdown */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Program</span>
          <select
            name="program"
            value={values.program}
            onChange={(e) => setValues((v) => ({ ...v, program: e.target.value }))}
            className="h-12 rounded-xl border border-edufio-gray-light bg-white px-3 pr-10 text-sm focus:border-edufio-teal focus:outline-none focus:ring-1 focus:ring-edufio-teal"
          >
            {PROGRAM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Jumlah Sesi - Pill Buttons */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold">Jumlah sesi dalam paket</legend>
          <div className="mt-1 flex gap-2">
            {JUMLAH_OPTIONS.map((option) => (
              <label key={option.value} className="flex-1">
                <input
                  type="radio"
                  name="jumlah_sesi"
                  value={option.value}
                  onChange={() => setValues((v) => ({ ...v, jumlahSesi: option.value }))}
                  className="peer sr-only"
                />
                <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-edufio-gray-light bg-white text-sm font-medium peer-checked:border-edufio-teal peer-checked:bg-edufio-teal peer-checked:text-white">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Durasi Per Sesi - Pill Buttons */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold">Durasi per sesi</legend>
          <div className="mt-1 flex items-center gap-2">
            {DURASI_OPTIONS.map((option, idx) => (
              <div key={option.value} className="contents">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="durasi_per_sesi"
                    value={option.value}
                    onChange={() => setValues((v) => ({ ...v, durasi: option.value }))}
                    className="peer sr-only"
                  />
                  <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-edufio-gray-light bg-white text-sm font-medium peer-checked:border-edufio-teal peer-checked:bg-edufio-teal peer-checked:text-white">
                    {option.label}
                  </span>
                </label>
                {idx < DURASI_OPTIONS.length - 1 && (
                  <span className="text-zinc-300">→</span>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        {/* Mode Belajar - Radio Cards */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold">Mode belajar</legend>
          <div className="mt-1 flex flex-col gap-2">
            {MODE_OPTIONS.map((option) => (
              <label key={option.value} className="group block">
                <input
                  type="radio"
                  name="mode_belajar"
                  value={option.value}
                  onChange={() => setValues((v) => ({ ...v, mode: option.value }))}
                  className="sr-only"
                />
                <span className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-edufio-gray-light bg-white px-4 py-3 transition-colors group-has-[:checked]:border-edufio-teal group-has-[:checked]:bg-edufio-teal/5">
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-edufio-navy">
                      {option.label}
                    </span>
                    <span className="text-xs text-zinc-400">{option.desc}</span>
                  </span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-edufio-gray-light transition-colors group-has-[:checked]:border-edufio-teal group-has-[:checked]:bg-edufio-teal">
                    <svg
                      viewBox="0 0 24 24"
                      className="hidden h-3.5 w-3.5 text-white group-has-[:checked]:block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Helper Text */}
        <p className="-mt-2 text-xs italic text-zinc-400">
          Jumlah sesi & durasi mengunci kuota dan jam selesai tiap sesi.
        </p>

        {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      </div>

      <BottomBar>
        <button
          type="submit"
          disabled={!complete || pending}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-edufio-teal text-sm font-semibold text-white hover:bg-edufio-navy active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Menyimpan..." : "Lanjut"}
        </button>
      </BottomBar>
    </form>
  )
}