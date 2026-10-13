import type { Request, Response, NextFunction } from "express";
import { User } from "../models/index.js";
import { inMemoryStore } from "../data/inMemoryStore.js";
import { isDbConnected } from "../lib/db.js";

/**
 * Returns allowed administrator emails loaded strictly from environment variables.
 * No admin emails are hardcoded in application logic.
 */
export function getAdminEmails(): string[] {
  const envVal = process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "";
  return envVal
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies if a given email is listed in the configured admin emails list.
 */
export function isEmailAdmin(email?: string | null): boolean {
  if (!email || typeof email !== "string") return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.trim().toLowerCase());
}

/**
 * Middleware ensuring that only authenticated administrators can access protected endpoints.
 * Resolves user identity from Passport session, x-user-email, or x-user-id.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let email: string | null = null;

    // 1. Passport session
    if (req.isAuthenticated && req.isAuthenticated()) {
      const sessionUser = req.user as any;
      if (sessionUser?.email) {
        email = sessionUser.email;
      }
    }

    // 2. Direct user email header
    if (!email && req.headers["x-user-email"]) {
      email = String(req.headers["x-user-email"]);
    }

    // 3. User ID lookup from DB or in-memory store
    const userId = req.headers["x-user-id"];
    if (!email && userId) {
      const uId = String(userId);
      if (isDbConnected()) {
        try {
          const dbUser = await User.findById(uId).lean();
          if (dbUser?.email) {
            email = dbUser.email;
          }
        } catch {
          // Fallback to in-memory store
        }
      }

      if (!email) {
        const memUser = inMemoryStore.findUserById(uId);
        if (memUser?.email) {
          email = memUser.email;
        }
      }
    }

    if (email && isEmailAdmin(email)) {
      next();
      return;
    }

    res.status(403).json({
      error: "Access denied. Administrator privileges required.",
      code: "FORBIDDEN_ADMIN_ONLY",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify administrator privileges" });
  }
}
