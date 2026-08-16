import mongoose from "mongoose"
import { connectDB } from "./mongoose"
import { Registration, Session, type RegistrationDoc, type SessionDoc } from "./models"

export type Program = "SD" | "SMP" | "SMA"
export type ModeBelajar = "offline" | "online"

export interface Registration {
  id: string
  nama_siswa: string
  program: Program
  jumlah_sesi: number
  durasi_per_sesi: number
  mode_belajar: ModeBelajar
  created_at: string
}

export interface Session {
  id: string
  registration_id: string
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
  registration_id: string
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  tempat: string
  materi: string
}

export interface RegistrationListItem extends Registration {
  session_count: number
}

type RegRow = RegistrationDoc & { _id: mongoose.Types.ObjectId }
type SessRow = SessionDoc & { _id: mongoose.Types.ObjectId }

function toRegistration(doc: RegRow): Registration {
  return {
    id: String(doc._id),
    nama_siswa: doc.nama_siswa,
    program: doc.program,
    jumlah_sesi: doc.jumlah_sesi,
    durasi_per_sesi: doc.durasi_per_sesi,
    mode_belajar: doc.mode_belajar,
    created_at: doc.created_at?.toISOString() ?? "",
  }
}

function toSession(doc: SessRow): Session {
  return {
    id: String(doc._id),
    registration_id: String(doc.registration_id),
    tanggal: doc.tanggal,
    jam_mulai: doc.jam_mulai,
    jam_selesai: doc.jam_selesai,
    tempat: doc.tempat,
    materi: doc.materi,
    created_at: doc.created_at?.toISOString() ?? "",
  }
}

export function isValidId(id: string): boolean {
  return mongoose.isValidObjectId(id)
}

export async function createRegistration(data: NewRegistration): Promise<string> {
  await connectDB()
  const doc = await Registration.create(data)
  return String(doc._id)
}

export async function getRegistration(id: string): Promise<Registration | null> {
  await connectDB()
  if (!isValidId(id)) return null
  const doc = await Registration.findById(id).lean()
  return doc ? toRegistration(doc as RegRow) : null
}

export async function getAllRegistrations(): Promise<RegistrationListItem[]> {
  await connectDB()
  const rows = await Registration.aggregate<RegRow & { session_count: number }>([
    {
      $lookup: {
        from: "sessions",
        localField: "_id",
        foreignField: "registration_id",
        as: "_sessions",
      },
    },
    { $addFields: { session_count: { $size: "$_sessions" } } },
    { $project: { _sessions: 0 } },
    { $sort: { created_at: -1 } },
  ])
  return rows.map((r) => ({ ...toRegistration(r), session_count: r.session_count }))
}

export async function getSessions(registrationId: string): Promise<Session[]> {
  await connectDB()
  if (!isValidId(registrationId)) return []
  const docs = await Session.find({ registration_id: registrationId })
    .sort({ _id: 1 })
    .lean()
  return docs.map((d) => toSession(d as SessRow))
}

export async function getSessionsByDate(tanggal: string): Promise<Session[]> {
  await connectDB()
  const docs = await Session.find({ tanggal }).sort({ jam_mulai: 1 }).lean()
  return docs.map((d) => toSession(d as SessRow))
}

export async function insertSession(input: NewSession): Promise<string> {
  await connectDB()
  const doc = await Session.create(input)
  return String(doc._id)
}