import crypto from "node:crypto";
import type { CookieOptions } from "express";

export const CSRF_COOKIE_NAME = "_csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";
export const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CsrfTokenResult {
  rawToken: string;
  cookieValue: string;
}

export interface CsrfValidationResult {
  valid: boolean;
  reason?: string;
  code?: "MISSING_HEADER" | "MISSING_COOKIE" | "MALFORMED" | "INVALID_SIGNATURE" | "TOKEN_MISMATCH" | "EXPIRED" | "CONTEXT_MISMATCH";
}

/**
 * Retrieves the server CSRF secret.
 * Falls back to SESSION_SECRET or a development fallback if not set.
 */
export function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CSRF_SECRET or SESSION_SECRET must be configured in production.");
    }
    return "synergy-csrf-dev-default-secret-key-32-chars-long";
  }
  return secret;
}

/**
 * Constant-time string comparison to prevent timing side-channel attacks.
 */
export function safeCompare(a?: string | null, b?: string | null): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Computes an HMAC-SHA256 signature for a given payload.
 */
export function signCsrfPayload(payload: string, secret = getCsrfSecret()): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Generates a new cryptographically secure CSRF token and its signed cookie counterpart.
 *
 * The raw token (256-bit random hex) is returned to the client in JSON.
 * The cookie stores: `${rawToken}.${timestamp}.${userContext}.${hmac}`
 *
 * @param userContext An optional user identifier (e.g. userId or "anon") to bind to the token.
 * @param customTimestamp Optional timestamp (used in unit tests for expiration testing).
 */
export function generateCsrfToken(userContext = "anon", customTimestamp?: number): CsrfTokenResult {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const timestamp = customTimestamp ?? Date.now();
  const sanitizedContext = (userContext || "anon").replace(/[^a-zA-Z0-9_-]/g, "");
  const payload = `${rawToken}.${timestamp}.${sanitizedContext}`;
  const signature = signCsrfPayload(payload);
  const cookieValue = `${payload}.${signature}`;

  return {
    rawToken,
    cookieValue,
  };
}

/**
 * Validates a client-provided CSRF token header against the signed CSRF cookie value.
 *
 * @param clientToken The token sent by the client (e.g. in X-CSRF-Token).
 * @param cookieValue The signed cookie value (_csrf).
 * @param expectedUserContext The currently authenticated user's ID, if any.
 * @param maxAgeMs Maximum allowed token age in milliseconds.
 */
export function validateCsrfToken(
  clientToken?: string | null,
  cookieValue?: string | null,
  expectedUserContext?: string | null,
  maxAgeMs = DEFAULT_MAX_AGE_MS
): CsrfValidationResult {
  if (!clientToken || typeof clientToken !== "string" || !clientToken.trim()) {
    return { valid: false, reason: "CSRF token is missing from request header (X-CSRF-Token).", code: "MISSING_HEADER" };
  }

  if (!cookieValue || typeof cookieValue !== "string" || !cookieValue.trim()) {
    return { valid: false, reason: "CSRF cookie (_csrf) is missing.", code: "MISSING_COOKIE" };
  }

  const parts = cookieValue.split(".");
  if (parts.length !== 4) {
    return { valid: false, reason: "CSRF cookie is malformed.", code: "MALFORMED" };
  }

  const [cookieRawToken, timestampStr, cookieUserContext, signature] = parts;

  // 1. Validate signature using constant-time check
  const payload = `${cookieRawToken}.${timestampStr}.${cookieUserContext}`;
  const expectedSig = signCsrfPayload(payload);
  if (!safeCompare(signature, expectedSig)) {
    return { valid: false, reason: "CSRF cookie signature is invalid.", code: "INVALID_SIGNATURE" };
  }

  // 2. Validate client token matches cookie raw token
  if (!safeCompare(clientToken.trim(), cookieRawToken)) {
    return { valid: false, reason: "CSRF token does not match cookie.", code: "TOKEN_MISMATCH" };
  }

  // 3. Validate timestamp / expiration
  const tokenTime = parseInt(timestampStr, 10);
  if (Number.isNaN(tokenTime)) {
    return { valid: false, reason: "Invalid CSRF token timestamp.", code: "MALFORMED" };
  }

  const now = Date.now();
  if (tokenTime > now + 60_000) {
    // Clock skewed into the future
    return { valid: false, reason: "CSRF token timestamp is in the future.", code: "MALFORMED" };
  }

  if (now - tokenTime > maxAgeMs) {
    return { valid: false, reason: "CSRF token has expired.", code: "EXPIRED" };
  }

  // 4. Validate user/session context binding (if token was bound to a specific user)
  if (cookieUserContext !== "anon" && expectedUserContext && expectedUserContext !== "anon") {
    const currentContext = expectedUserContext.replace(/[^a-zA-Z0-9_-]/g, "");
    if (cookieUserContext !== currentContext) {
      return {
        valid: false,
        reason: "CSRF token user context does not match current authentication state.",
        code: "CONTEXT_MISMATCH",
      };
    }
  }

  return { valid: true };
}

/**
 * Returns Express cookie configuration options for the CSRF cookie.
 */
export function getCsrfCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSiteEnv = (process.env.COOKIE_SAMESITE || "").toLowerCase();
  let sameSite: "lax" | "strict" | "none" = "lax";

  if (sameSiteEnv === "strict") {
    sameSite = "strict";
  } else if (sameSiteEnv === "none") {
    sameSite = "none";
  }

  return {
    httpOnly: true,
    secure: isProduction || sameSite === "none",
    sameSite,
    path: "/",
    maxAge: DEFAULT_MAX_AGE_MS,
  };
}
