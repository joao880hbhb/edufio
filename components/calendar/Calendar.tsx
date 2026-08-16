"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addDaysToIsoDate } from "@/lib/date"

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
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

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export default function Calendar({
  registrationId,
  todayIso,
  sessionDates,
  onSelectDate,
}: {
  registrationId: string
  todayIso: string
  sessionDates: string[]
  onSelectDate?: (date: string) => void
}) {
  const today = new Date(`${todayIso}T00:00:00`)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const router = useRouter()

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  // getDay() returns 0=Sun, we want Mon=0, so shift
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const leading = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Monday-start
  const minDateIso = addDaysToIsoDate(todayIso, 3)
  const monthLabel = `${MONTH_LABELS[viewMonth]} ${viewYear}`

  const dates: string[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(toIsoDate(viewYear, viewMonth, d))
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  function handleSelect(date: string) {
    setSelectedDate(date)
    if (onSelectDate) {
      onSelectDate(date)
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-zinc-200 p-4">
        {/* Month Navigation */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
          >
            ‹
          </button>
          <p className="text-sm font-bold">{monthLabel}</p>
          <button
            type="button"
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-400">
          {DAY_LABELS.map((label) => (
            <span key={label} className="py-1">
              {label}
            </span>
          ))}
        </div>

        {/* Date Grid */}
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: leading }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {dates.map((date) => {
            const isPast = date < minDateIso
            const hasSession = sessionDates.includes(date)
            const isToday = date === todayIso
            const isSelected = date === selectedDate
            const disabled = isPast  // hasSession tidak men-disable, hanya tampil dot
            const dayNum = Number(date.slice(8))

            if (disabled) {
              return (
                <span
                  key={date}
                  className="relative flex h-9 items-center justify-center rounded-lg text-sm"
                >
                  <span className={[
                    "flex h-7 w-7 items-center justify-center rounded-full",
                    hasSession ? "text-zinc-500" : "text-zinc-300",
                    isToday ? "ring-1 ring-zinc-300" : ""
                  ].join(" ")}>
                    {dayNum}
                  </span>
                  {hasSession && (
                    <span className="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-400" />
                  )}
                </span>
              )
            }

            return (
              <button
                key={date}
                type="button"
                onClick={() => handleSelect(date)}
                className="relative flex h-9 items-center justify-center text-sm font-medium"
              >
                <span className={[
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                  isSelected
                    ? "bg-edufio-teal text-white"
                    : isToday
                      ? "ring-1 ring-zinc-400 hover:bg-zinc-100"
                      : "hover:bg-zinc-100"
                ].join(" ")}>
                  {dayNum}
                </span>
                {hasSession && (
                  <span className="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-edufio-yellow" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          sudah ada sesi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded text-[10px] ring-1 ring-zinc-400">
            ○
          </span>
          hari ini ({todayIso.slice(8)}{' '}
          {MONTH_LABELS[Number(todayIso.slice(5, 7)) - 1]?.slice(0, 3)})
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-400">
        belum bisa dipilih — minimal 3 hari dari hari ini
      </p>
    </div>
  )
}