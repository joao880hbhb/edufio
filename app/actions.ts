"use server"

import { redirect } from "next/navigation"
import {
  createRegistration,
  getRegistration,
  getSessions,
  getSessionsByDate,
  insertSession,
  type ModeBelajar,
  type Program,
} from "@/lib/registrations"
import { addMinutesToTime, timesOverlap, toIsoDate } from "@/lib/date"

export interface FormState {
  error?: string
}

const PROGRAM_VALUES: Program[] = ["SD", "SMP", "SMA"]
const JUMLAH_SESI_VALUES = [4, 8, 12]
const DURASI_VALUES = [60, 90, 120]
const MODE_VALUES: ModeBelajar[] = ["offline", "online"]

function first(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function error(msg: string): FormState {
  return { error: msg }
}

export async function createRegistrationAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const nama_siswa = first(formData, "nama_siswa")
  const program = first(formData, "program")
  const jumlah_sesi = Number(formData.get("jumlah_sesi"))
  const durasi_per_sesi = Number(formData.get("durasi_per_sesi"))
  const mode_belajar = first(formData, "mode_belajar")

  if (!nama_siswa) return error("Nama siswa wajib diisi.")
  if (!PROGRAM_VALUES.includes(program as Program)) return error("Program tidak valid.")
  if (!JUMLAH_SESI_VALUES.includes(jumlah_sesi)) return error("Jumlah sesi tidak valid.")
  if (!DURASI_VALUES.includes(durasi_per_sesi)) return error("Durasi per sesi tidak valid.")
  if (!MODE_VALUES.includes(mode_belajar as ModeBelajar)) return error("Mode belajar tidak valid.")

  const id = createRegistration({
    nama_siswa,
    program: program as Program,
    jumlah_sesi,
    durasi_per_sesi,
    mode_belajar: mode_belajar as ModeBelajar,
  })

  redirect(`/pilih-tanggal/${id}`)
}

export async function createSessionDetailAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const registrationId = Number(formData.get("registration_id"))
  const tanggal = first(formData, "tanggal")
  const jam_mulai = first(formData, "jam_mulai")
  const tempat = first(formData, "tempat")
  const materi = first(formData, "materi")

  const registration = getRegistration(registrationId)
  if (!registration) return error("Registrasi tidak ditemukan.")

  const sessions = getSessions(registrationId)
  if (sessions.length >= registration.jumlah_sesi) {
    redirect(`/ringkasan/${registrationId}`)
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return error("Tanggal tidak valid.")
  const min = new Date()
  min.setDate(min.getDate() + 3)
  if (tanggal < toIsoDate(min)) return error("Tanggal minimal 3 hari dari hari ini.")
  if (sessions.some((s) => s.tanggal === tanggal))
    return error("Tanggal ini sudah terjadwal untuk pendaftaran ini.")

  if (!/^\d{2}:\d{2}$/.test(jam_mulai)) return error("Jam mulai tidak valid.")
  if (!tempat) return error("Tempat wajib diisi.")
  if (!materi) return error("Materi wajib diisi.")

  const jam_selesai = addMinutesToTime(jam_mulai, registration.durasi_per_sesi)

  const conflict = getSessionsByDate(tanggal).find((s) =>
    timesOverlap(jam_mulai, jam_selesai, s.jam_mulai, s.jam_selesai)
  )
  if (conflict)
    return error(`Jam bentrok dengan sesi lain: ${conflict.jam_mulai}–${conflict.jam_selesai}.`)

  insertSession({ registration_id: registrationId, tanggal, jam_mulai, jam_selesai, tempat, materi })

  const done = getSessions(registrationId).length >= registration.jumlah_sesi
  redirect(done ? `/ringkasan/${registrationId}` : `/pilih-tanggal/${registrationId}`)
}