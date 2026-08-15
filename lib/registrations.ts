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

export interface NewSession {
  registration_id: number
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  tempat: string
  materi: string
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

export function getSessionsByDate(tanggal: string): Session[] {
  return db
    .prepare("SELECT * FROM sessions WHERE tanggal = ? ORDER BY jam_mulai")
    .all(tanggal) as Session[]
}

export function insertSession(input: NewSession): number {
  const result = db
    .prepare(
      `INSERT INTO sessions (registration_id, tanggal, jam_mulai, jam_selesai, tempat, materi)
       VALUES (@registration_id, @tanggal, @jam_mulai, @jam_selesai, @tempat, @materi)`
    )
    .run(input)
  return Number(result.lastInsertRowid)
}