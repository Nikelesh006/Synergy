import type { Request, Response } from "express";
import app from "../artifacts/api-server/src/app.js";
import { connectDB } from "../artifacts/api-server/src/lib/db.js";

let isDbConnected = false;

async function ensureDb() {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (err: any) {
      console.warn("MongoDB connection warning in Vercel serverless function:", err?.message || err);
    }
  }
}

export default async function handler(req: Request, res: Response) {
  await ensureDb();
  return app(req, res);
}
