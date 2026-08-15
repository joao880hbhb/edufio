import Database from "better-sqlite3"
import path from "node:path"

const globalForDb = globalThis as unknown as {
  db?: Database.Database
}

export const db =
  globalForDb.db ??
  new Database(path.join(process.cwd(), "data.db"))

if (process.env.NODE_ENV !== "production") globalForDb.db = db