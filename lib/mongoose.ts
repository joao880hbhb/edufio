import mongoose from "mongoose"

const globalForMongo = globalThis as unknown as {
  mongoosePromise?: Promise<typeof mongoose>
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!globalForMongo.mongoosePromise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("MONGODB_URI belum di-set di .env.local")
    globalForMongo.mongoosePromise = mongoose.connect(uri)
  }
  await globalForMongo.mongoosePromise
  return mongoose
}