"use server"

import { redirect } from "next/navigation"
import {
  addMinutesToTime,
  addSession,
  createRegistration,
  getRegistration,
  updateSessionDetail,
  type ModeBelajar,
  type Program,
} from "@/lib/registrations"

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

export async function addSessionAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const registrationId = Number(formData.get("registration_id"))
  const registration = getRegistration(registrationId)
  if (!registration) return error("Registrasi tidak ditemukan.")

  const tanggal = first(formData, "tanggal")
  const jam_mulai = first(formData, "jam_mulai")

  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return error("Tanggal tidak valid.")
  if (!/^\d{2}:\d{2}$/.test(jam_mulai)) return error("Jam mulai tidak valid.")

  const jam_selesai = addMinutesToTime(jam_mulai, registration.durasi_per_sesi)
  addSession({ registrationId, tanggal, jam_mulai, jam_selesai })

  const intent = first(formData, "intent")
  const next =
    intent === "detail"
      ? `/detail-sesi/${registrationId}`
      : `/pilih-tanggal/${registrationId}`
  redirect(next)
}

export async function updateSessionDetailAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const sessionId = Number(formData.get("session_id"))
  const registrationId = Number(formData.get("registration_id"))
  const tempat = first(formData, "tempat")
  const materi = first(formData, "materi")

  if (!getRegistration(registrationId)) return error("Registrasi tidak ditemukan.")
  if (!tempat) return error("Tempat wajib diisi.")
  if (!materi) return error("Materi wajib diisi.")

  updateSessionDetail(sessionId, { tempat, materi })

  const intent = first(formData, "intent")
  const next =
    intent === "finish"
      ? `/ringkasan/${registrationId}`
      : `/detail-sesi/${registrationId}`
  redirect(next)
}