"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Calendar from "@/components/calendar/Calendar"
import BottomBar from "@/components/layout/BottomBar"

export default function PilihTanggalClient({
  registrationId,
  todayIso,
  sessionDates,
}: {
  registrationId: string
  todayIso: string
  sessionDates: string[]
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const router = useRouter()

  function handleContinue() {
    if (selectedDate) {
      router.push(`/detail-sesi/${registrationId}?tanggal=${selectedDate}`)
    }
  }

  return (
    <>
      <Calendar
        registrationId={registrationId}
        todayIso={todayIso}
        sessionDates={sessionDates}
        onSelectDate={setSelectedDate}
      />

      <BottomBar>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedDate}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-edufio-teal text-sm font-semibold text-white hover:bg-edufio-navy active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Lanjut
        </button>
      </BottomBar>
    </>
  )
}
