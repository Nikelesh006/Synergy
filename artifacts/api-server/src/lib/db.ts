import mongoose from "mongoose";
import { logger } from "./logger.js";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env["MONGODB_URL"];
  if (!uri) {
    throw new Error("MONGODB_URL environment variable is required.");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "synergy",
    });
    isConnected = true;
    logger.info("MongoDB connected successfully");
  } catch (err) {
    logger.error({ err }, "Failed to connect to MongoDB");
    throw err;
  }
}

export { mongoose };
