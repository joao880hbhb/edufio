import Database from "better-sqlite3"
import path from "node:path"

const globalForDb = globalThis as unknown as {
  db?: Database.Database
}

export const db =
  globalForDb.db ??
  new Database(path.join(process.cwd(), "data.db"))

if (process.env.NODE_ENV !== "production") globalForDb.db = db

export function migrate() {
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")

  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_siswa      TEXT    NOT NULL,
      program         TEXT    NOT NULL CHECK (program IN ('SD', 'SMP', 'SMA')),
      jumlah_sesi     INTEGER NOT NULL CHECK (jumlah_sesi IN (4, 8, 12)),
      durasi_per_sesi INTEGER NOT NULL CHECK (durasi_per_sesi IN (60, 90, 120)),
      mode_belajar    TEXT    NOT NULL CHECK (mode_belajar IN ('offline', 'online')),
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      tanggal         TEXT    NOT NULL,
      jam_mulai       TEXT    NOT NULL,
      jam_selesai     TEXT    NOT NULL,
      tempat          TEXT    NOT NULL DEFAULT '',
      materi          TEXT    NOT NULL DEFAULT '',
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
      FOREIGN KEY (registration_id) REFERENCES registrations (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_registration_id
      ON sessions (registration_id);
  `)
}

migrate()