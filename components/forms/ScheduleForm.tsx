"use client"

import { useActionState, useMemo, useState } from "react"
import { addSessionAction, type FormState } from "@/app/actions"
import BottomBar from "@/components/layout/BottomBar"
import { addDaysToIsoDate } from "@/lib/date"

const initial: FormState = {}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const MONTH_LABELS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

export default function ScheduleForm({
  registrationId,
  totalSessions,
  currentSessions,
  sessionDates,
  todayIso,
}: {
  registrationId: number
  totalSessions: number
  currentSessions: number
  sessionDates: string[]
  todayIso: string
}) {
  const [state, formAction, pending] = useActionState(addSessionAction, initial)
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("")

  const { monthLabel, days, leading, minDateIso, nextIndex } = useMemo(() => {
    const today = new Date(`${todayIso}T00:00:00`)
    const year = today.getFullYear()
    const month = today.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: string[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
    }
    return {
      monthLabel: `${MONTH_LABELS[month]} ${year}`,
      days,
      leading: new Date(year, month, 1).getDay(),
      minDateIso: addDaysToIsoDate(todayIso, 3),
      nextIndex: Math.min(currentSessions + 1, totalSessions),
    }
  }, [todayIso, currentSessions, totalSessions])

  const ready = Boolean(selectedDate && startTime)

  function isDisabled(date: string): boolean {
    return date < minDateIso || sessionDates.includes(date)
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="registration_id" value={registrationId} />
      <input type="hidden" name="tanggal" value={selectedDate} />

      <p className="text-sm font-medium">
        Sesi ke-{nextIndex} dari {totalSessions} sesi terjadwal
      </p>

      <div className="rounded-xl border border-zinc-200 p-3">
        <p className="mb-2 text-center text-sm font-semibold">{monthLabel}</p>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
          {DAY_LABELS.map((label) => (
            <span key={label} className="py-1">
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leading }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {days.map((date) => {
            const disabled = isDisabled(date)
            const selected = date === selectedDate
            const hasSession = sessionDates.includes(date)
            return (
              <button
                key={date}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedDate(date)}
                className={[
                  "relative flex h-9 items-center justify-center rounded-lg text-sm",
                  disabled
                    ? "cursor-not-allowed text-zinc-300"
                    : selected
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100",
                ].join(" ")}
              >
                {Number(date.slice(8))}
                {hasSession && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-400" />
                )}
              </button>
            )
          })}
        </div>

        <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          Sudah terjadwal
        </p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Jam Mulai</span>
        <input
          type="time"
          name="jam_mulai"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          className="h-12 rounded-xl border border-zinc-300 px-3"
        />
      </label>

      <p className="text-xs text-zinc-500">
        Jam selesai otomatis dihitung dari durasi paket.
      </p>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <BottomBar>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            name="intent"
            value="stay"
            disabled={!ready || pending}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-zinc-300 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Menyimpan..." : "Simpan & Tambah Sesi Lagi"}
          </button>
          <button
            type="submit"
            name="intent"
            value="detail"
            disabled={!ready || pending}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Simpan & Lanjut Detail Sesi
          </button>
        </div>
      </BottomBar>
    </form>
  )
}