import Link from "next/link"
import { addDaysToIsoDate } from "@/lib/date"

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

export default function Calendar({
  registrationId,
  todayIso,
  sessionDates,
}: {
  registrationId: number
  todayIso: string
  sessionDates: string[]
}) {
  const today = new Date(`${todayIso}T00:00:00`)
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leading = new Date(year, month, 1).getDay()
  const minDateIso = addDaysToIsoDate(todayIso, 3)
  const monthLabel = `${MONTH_LABELS[month]} ${year}`

  const dates: string[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
  }

  return (
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
        {dates.map((date) => {
          const past = date < minDateIso
          const hasSession = sessionDates.includes(date)
          const disabled = past || hasSession
          const dayNum = Number(date.slice(8))

          if (disabled) {
            return (
              <span
                key={date}
                className={`relative flex h-9 items-center justify-center rounded-lg text-sm ${
                  hasSession ? "text-zinc-500" : "text-zinc-300"
                }`}
              >
                {dayNum}
                {hasSession && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-400" />
                )}
              </span>
            )
          }

          return (
            <Link
              key={date}
              href={`/detail-sesi/${registrationId}?tanggal=${date}`}
              className="flex h-9 items-center justify-center rounded-lg text-sm hover:bg-zinc-100"
            >
              {dayNum}
            </Link>
          )
        })}
      </div>

      <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        Sudah terjadwal
      </p>
    </div>
  )
}