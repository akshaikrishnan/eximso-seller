// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

declare global {
    // eslint-disable-next-line no-var
    var __mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}
global.__mongoose ||= { conn: null, promise: null };

export const runtime = 'nodejs'; // ensure Node runtime for route handlers

export default async function connectDB() {
    if (global.__mongoose.conn && mongoose.connection.readyState === 1) {
        return global.__mongoose.conn;
    }

    if (!global.__mongoose.promise) {
        // One-time driver tuning
        mongoose.set('strictQuery', true);
        // Disable autoIndex in prod to avoid boot-time index builds
        mongoose.set('autoIndex', process.env.NODE_ENV !== 'production');

        const opts = {
            // keep buffers off so you fail fast instead of hanging
            bufferCommands: false,
            // pool & timeouts (tweak as you need)
            maxPoolSize: 10,
            minPoolSize: 0,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // prefer IPv4 (avoids some slow IPv6 DNS paths)
            // If you connect to a single non-replica host, consider:
            // directConnection: true,
        } as const;

        global.__mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
    }

    global.__mongoose.conn = await global.__mongoose.promise;
    return global.__mongoose.conn;
}
