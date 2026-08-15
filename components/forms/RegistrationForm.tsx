"use client"

import { useActionState, useState, type ChangeEvent } from "react"
import { createRegistrationAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"

const initial: FormState = {}

const PROGRAM_OPTIONS = [
  { value: "SD", label: "Les Privat SD" },
  { value: "SMP", label: "Les Privat SMP" },
  { value: "SMA", label: "Les Privat SMA" },
]

const JUMLAH_OPTIONS = [
  { value: "4", label: "4 Sesi" },
  { value: "8", label: "8 Sesi" },
  { value: "12", label: "12 Sesi" },
]

const DURASI_OPTIONS = [
  { value: "60", label: "60 Menit" },
  { value: "90", label: "90 Menit" },
  { value: "120", label: "120 Menit" },
]

const MODE_OPTIONS = [
  { value: "offline", label: "Tutor datang ke lokasi" },
  { value: "online", label: "Online" },
]

const PILL_STYLES =
  "flex h-12 items-center justify-center rounded-xl border border-zinc-300 text-sm font-medium transition-colors peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white"

const CARD_STYLES =
  "flex min-h-12 items-center rounded-xl border border-zinc-300 px-3 text-sm font-medium transition-colors peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white"

function onChangeValue(
  group: string,
  setValues: React.Dispatch<React.SetStateAction<FormValues>>
) {
  return (event: ChangeEvent<HTMLInputElement>) =>
    setValues((values) => ({ ...values, [group]: event.target.value }))
}

interface FormValues {
  program: string
  jumlahSesi: string
  durasi: string
  mode: string
}

function RadioCard({
  name,
  value,
  label,
  onChange,
}: {
  name: string
  value: string
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label>
      <input type="radio" name={name} value={value} onChange={onChange} className="peer sr-only" />
      <span className={CARD_STYLES}>{label}</span>
    </label>
  )
}

function PillButton({
  name,
  value,
  label,
  onChange,
}: {
  name: string
  value: string
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex-1">
      <input type="radio" name={name} value={value} onChange={onChange} className="peer sr-only" />
      <span className={PILL_STYLES}>{label}</span>
    </label>
  )
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
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nama Siswa</span>
          <input
            name="nama_siswa"
            className="h-12 rounded-xl border border-zinc-300 px-3"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">
            Program
            <span className="text-zinc-400"> *</span>
          </legend>
          {PROGRAM_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              name="program"
              value={option.value}
              label={option.label}
              onChange={onChangeValue("program", setValues)}
            />
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">
            Jumlah Sesi
            <span className="text-zinc-400"> *</span>
          </legend>
          <div className="flex gap-2">
            {JUMLAH_OPTIONS.map((option) => (
              <PillButton
                key={option.value}
                name="jumlah_sesi"
                value={option.value}
                label={option.label}
                onChange={onChangeValue("jumlahSesi", setValues)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">
            Durasi Per Sesi
            <span className="text-zinc-400"> *</span>
          </legend>
          <div className="flex gap-2">
            {DURASI_OPTIONS.map((option) => (
              <PillButton
                key={option.value}
                name="durasi_per_sesi"
                value={option.value}
                label={option.label}
                onChange={onChangeValue("durasi", setValues)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">
            Mode Belajar
            <span className="text-zinc-400"> *</span>
          </legend>
          {MODE_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              name="mode_belajar"
              value={option.value}
              label={option.label}
              onChange={onChangeValue("mode", setValues)}
            />
          ))}
        </fieldset>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>

      <BottomBar>
        <button
          type="submit"
          disabled={!complete || pending}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Menyimpan..." : "Lanjut"}
        </button>
      </BottomBar>
    </form>
  )
}