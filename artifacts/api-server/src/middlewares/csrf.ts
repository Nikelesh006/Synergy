import type { Request, Response, NextFunction } from "express";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  validateCsrfToken,
  generateCsrfToken,
  getCsrfCookieOptions,
} from "../lib/csrf.js";
import { logger } from "../lib/logger.js";

declare global {
  namespace Express {
    interface Request {
      csrfExempt?: boolean;
    }
  }
}

/**
 * Returns a list of origins explicitly trusted for state-changing browser requests.
 */
export function getAllowedOrigins(req?: Request): string[] {
  const allowed = new Set<string>();

  // Host header from request (same-origin support)
  if (req?.headers.host) {
    const proto = (req.headers["x-forwarded-proto"] as string) || (req.secure ? "https" : "http");
    allowed.add(`${proto}://${req.headers.host}`);
  }

  // Frontend URL from environment
  if (process.env.FRONTEND_URL) {
    allowed.add(process.env.FRONTEND_URL.replace(/\/$/, ""));
  }

  // Standard development origins
  allowed.add("http://localhost:5173");
  allowed.add("http://127.0.0.1:5173");
  allowed.add("http://localhost:5000");
  allowed.add("http://127.0.0.1:5000");

  // Additional origins from env (comma-separated)
  const extraOrigins = process.env.ALLOWED_ORIGINS || process.env.CSRF_ALLOWED_ORIGINS;
  if (extraOrigins) {
    extraOrigins
      .split(",")
      .map((o) => o.trim().replace(/\/$/, ""))
      .filter(Boolean)
      .forEach((o) => allowed.add(o));
  }

  return Array.from(allowed);
}

/**
 * Verifies if a given origin is allowed to perform browser state changes.
 */
export function isOriginAllowed(origin: string, req?: Request): boolean {
  if (!origin) return true;

  const normalized = origin.trim().replace(/\/$/, "");
  const allowed = getAllowedOrigins(req);

  if (allowed.includes(normalized)) {
    return true;
  }

  // Development convenience: permit any localhost or 127.0.0.1 port
  if (process.env.NODE_ENV !== "production") {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) {
      return true;
    }
  }

  // Production Vercel preview deploys matching the synergy project pattern
  if (/^https:\/\/synergy[a-zA-Z0-9-]*\.vercel\.app$/.test(normalized)) {
    return true;
  }

  return false;
}

/**
 * Helper to issue a fresh CSRF token, attach the HttpOnly cookie, and return the client token.
 */
export function issueCsrfToken(res: Response, userContext?: string): string {
  const { rawToken, cookieValue } = generateCsrfToken(userContext);
  res.cookie(CSRF_COOKIE_NAME, cookieValue, getCsrfCookieOptions());
  return rawToken;
}

/**
 * Helper to remove the CSRF cookie on logout or session reset.
 */
export function clearCsrfCookie(res: Response): void {
  res.clearCookie(CSRF_COOKIE_NAME, getCsrfCookieOptions());
}

/**
 * Middleware that flags a route as exempt from CSRF validation.
 * Use exclusively for signed server-to-server webhooks or API key endpoints.
 */
export function exemptCsrf(req: Request, _res: Response, next: NextFunction): void {
  req.csrfExempt = true;
  next();
}

/**
 * Express middleware that enforces CSRF token validation and Origin checking
 * on all state-changing HTTP methods (POST, PUT, PATCH, DELETE).
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  const method = req.method.toUpperCase();

  // 1. Safe methods (GET, HEAD, OPTIONS) do not alter server state
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return next();
  }

  // 2. Explicit exemptions (e.g. verified webhooks)
  if (req.csrfExempt) {
    return next();
  }

  // 3. Origin & Referer Defense-in-Depth verification
  const originHeader = req.headers["origin"] as string | undefined;
  const refererHeader = req.headers["referer"] as string | undefined;

  let requestOrigin = originHeader;
  if (!requestOrigin && refererHeader) {
    try {
      requestOrigin = new URL(refererHeader).origin;
    } catch {
      // Invalid referer URL format
    }
  }

  if (requestOrigin && !isOriginAllowed(requestOrigin, req)) {
    logger.warn(
      {
        method,
        path: req.originalUrl,
        origin: requestOrigin,
        ip: req.ip,
      },
      "CSRF defense-in-depth: rejected request from untrusted origin"
    );
    res.status(403).json({
      error: "Forbidden",
      message: "Request origin is untrusted or not allowed.",
      code: "UNTRUSTED_ORIGIN",
    });
    return;
  }

  // 4. Token & Cookie extraction
  const clientToken = (req.headers[CSRF_HEADER_NAME] || req.headers["x-xsrf-token"]) as string | undefined;
  const cookieValue = req.cookies?.[CSRF_COOKIE_NAME] as string | undefined;

  // Active user context (bound to session / user if present)
  const activeUserId =
    (req.user as any)?._id ||
    (req.user as any)?.id ||
    (req.headers["x-user-id"] as string | undefined) ||
    "anon";

  // 5. Validation using constant-time comparison & signature verification
  const result = validateCsrfToken(clientToken, cookieValue, String(activeUserId));

  if (!result.valid) {
    logger.warn(
      {
        method,
        url: req.originalUrl?.split("?")[0],
        code: result.code,
        ip: req.ip,
      },
      "CSRF validation failed"
    );

    res.status(403).json({
      error: "Invalid CSRF token",
      message: result.reason || "CSRF token validation failed.",
      code: result.code,
    });
    return;
  }

  next();
}
