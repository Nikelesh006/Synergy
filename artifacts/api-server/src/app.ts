import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import passport from "./config/passport.js";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", router);
app.use(router);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "The uploaded file or request payload is too large." });
  }
  return res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
});

export default app;
