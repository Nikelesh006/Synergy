import type { Request, Response } from "express";
import app from "../artifacts/api-server/src/app.js";
import { connectDB } from "../artifacts/api-server/src/lib/db.js";

let dbPromise: Promise<void> | null = null;

async function ensureDb() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      console.warn("MongoDB connection warning in Vercel serverless function:", err?.message || err);
      dbPromise = null;
    });
  }
  return dbPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (error: any) {
    console.error("Unhandled serverless error:", error);
    return res.status(500).json({
      error: "Internal Server Error in API handler",
      details: error?.message || String(error),
    });
  }
}
