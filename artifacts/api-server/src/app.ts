import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import session from "express-session";
import passport from "./config/passport.js";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { csrfProtection } from "./middlewares/csrf.js";

const app: Express = express();

const httpLogger = ((pinoHttp as any).default || pinoHttp) as (opts?: any) => any;
app.use(
  httpLogger({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS configuration with explicit origins and credentialed request support
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];

const envFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CSRF_ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsAllowedOrigins = new Set<string>([
  ...defaultAllowedOrigins,
  ...(envFrontendUrl ? [envFrontendUrl] : []),
  ...envAllowedOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalized = origin.trim().replace(/\/$/, "");
      if (corsAllowedOrigins.has(normalized)) {
        return callback(null, true);
      }

      // Allow any localhost/127.0.0.1 in non-production
      if (process.env.NODE_ENV !== "production") {
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) {
          return callback(null, true);
        }
      }

      // Allow Vercel preview deployments matching synergy pattern
      if (/^https:\/\/synergy[a-zA-Z0-9-]*\.vercel\.app$/.test(normalized)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "x-csrf-token",
      "X-XSRF-Token",
      "x-xsrf-token",
      "x-user-id",
    ],
    exposedHeaders: ["X-CSRF-Token"],
  })
);

// Cookie parsing (required for CSRF and session cookies)
const cookieSecret = process.env.COOKIE_SECRET || process.env.SESSION_SECRET || "synergy-cookie-secret";
app.use(cookieParser(cookieSecret));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CSRF Protection middleware for all state-changing requests
app.use(csrfProtection);

// API routes
app.use("/api", router);
app.use(router);

// Centralized error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "The uploaded file or request payload is too large." });
  }
  if (err?.code === "EBADCSRFTOKEN" || err?.status === 403) {
    return res.status(403).json({ error: "Invalid CSRF token", message: err?.message || "Forbidden" });
  }
  return res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
});

export default app;
