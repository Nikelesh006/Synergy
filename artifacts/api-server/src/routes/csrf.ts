import { Router, type Request, type Response } from "express";
import {
  CSRF_COOKIE_NAME,
  validateCsrfToken,
} from "../lib/csrf.js";
import { issueCsrfToken } from "../middlewares/csrf.js";

const router = Router();

/**
 * GET /api/csrf-token (and /csrf-token)
 * Issues or returns a valid CSRF token bound to the current session / cookie.
 * Sets the HttpOnly `_csrf` cookie on the client response.
 */
router.get("/", (req: Request, res: Response) => {
  const activeUserId =
    (req.user as any)?._id ||
    (req.user as any)?.id ||
    (req.headers["x-user-id"] as string | undefined) ||
    "anon";

  const shouldForceRefresh = req.query.refresh === "true" || req.query.refresh === "1";
  const existingCookie = req.cookies?.[CSRF_COOKIE_NAME] as string | undefined;

  if (!shouldForceRefresh && existingCookie) {
    const [rawToken] = existingCookie.split(".");
    if (rawToken) {
      const validation = validateCsrfToken(rawToken, existingCookie, String(activeUserId));
      if (validation.valid) {
        res.json({
          success: true,
          csrfToken: rawToken,
        });
        return;
      }
    }
  }

  // Issue a fresh token and cookie
  const freshToken = issueCsrfToken(res, String(activeUserId));
  res.json({
    success: true,
    csrfToken: freshToken,
  });
});

export default router;
