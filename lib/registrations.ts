import { db } from "./db"

export type Program = "SD" | "SMP" | "SMA"
export type ModeBelajar = "offline" | "online"

export interface Registration {
  id: number
  nama_siswa: string
  program: Program
  jumlah_sesi: number
  durasi_per_sesi: number
  mode_belajar: ModeBelajar
  created_at: string
}

export interface Session {
  id: number
  registration_id: number
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  tempat: string
  materi: string
  created_at: string
}

export interface NewRegistration {
  nama_siswa: string
  program: Program
  jumlah_sesi: number
  durasi_per_sesi: number
  mode_belajar: ModeBelajar
}

export function createRegistration(data: NewRegistration): number {
  const result = db
    .prepare(
      `INSERT INTO registrations (nama_siswa, program, jumlah_sesi, durasi_per_sesi, mode_belajar)
       VALUES (@nama_siswa, @program, @jumlah_sesi, @durasi_per_sesi, @mode_belajar)`
    )
    .run(data)
  return Number(result.lastInsertRowid)
}

export function getRegistration(id: number): Registration | undefined {
  return db.prepare("SELECT * FROM registrations WHERE id = ?").get(id) as
    | Registration
    | undefined
}

export function getSessions(registrationId: number): Session[] {
  return db
    .prepare("SELECT * FROM sessions WHERE registration_id = ? ORDER BY id")
    .all(registrationId) as Session[]
}

export function addSession(input: {
  registrationId: number
  tanggal: string
  jam_mulai: string
  jam_selesai: string
}): number {
  const result = db
    .prepare(
      `INSERT INTO sessions (registration_id, tanggal, jam_mulai, jam_selesai)
       VALUES (@registrationId, @tanggal, @jam_mulai, @jam_selesai)`
    )
    .run(input)
  return Number(result.lastInsertRowid)
}

export function updateSessionDetail(
  sessionId: number,
  detail: { tempat: string; materi: string }
): void {
  db.prepare(
    "UPDATE sessions SET tempat = @tempat, materi = @materi WHERE id = @id"
  ).run({ id: sessionId, ...detail })
}

export function firstSessionNeedingDetail(registrationId: number): Session | undefined {
  return db
    .prepare(
      `SELECT * FROM sessions
       WHERE registration_id = ? AND (tempat = '' OR materi = '')
       ORDER BY id
       LIMIT 1`
    )
    .get(registrationId) as Session | undefined
}

export function addMinutesToTime(jam: string, minutes: number): string {
  const [h, m] = jam.split(":").map(Number)
  const total = h * 60 + m + minutes
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0")
  const mm = String(total % 60).padStart(2, "0")
  return `${hh}:${mm}`
}