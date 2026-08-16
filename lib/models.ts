import mongoose from "mongoose"

export interface RegistrationDoc {
  nama_siswa: string
  program: "SD" | "SMP" | "SMA"
  jumlah_sesi: number
  durasi_per_sesi: number
  mode_belajar: "offline" | "online"
  created_at: Date
}

const registrationSchema = new mongoose.Schema<RegistrationDoc>(
  {
    nama_siswa: { type: String, required: true },
    program: { type: String, required: true, enum: ["SD", "SMP", "SMA"] },
    jumlah_sesi: { type: Number, required: true, enum: [4, 8, 12] },
    durasi_per_sesi: { type: Number, required: true, enum: [60, 90, 120] },
    mode_belajar: { type: String, required: true, enum: ["offline", "online"] },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "registrations" }
)

export interface SessionDoc {
  registration_id: mongoose.Types.ObjectId
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  tempat: string
  materi: string
  created_at: Date
}

const sessionSchema = new mongoose.Schema<SessionDoc>(
  {
    registration_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },
    tanggal: { type: String, required: true, index: true },
    jam_mulai: { type: String, required: true },
    jam_selesai: { type: String, required: true },
    tempat: { type: String, default: "" },
    materi: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "sessions" }
)

export const Registration =
  (mongoose.models.Registration as mongoose.Model<RegistrationDoc>) ||
  mongoose.model<RegistrationDoc>("Registration", registrationSchema)

export const Session =
  (mongoose.models.Session as mongoose.Model<SessionDoc>) ||
  mongoose.model<SessionDoc>("Session", sessionSchema)