import "dotenv/config";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { connectDB } from "./lib/db.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Initialize database connection (gracefully falls back if unavailable)
connectDB()
  .catch((err) => {
    logger.warn({ err: err?.message || err }, "MongoDB initialization encountered an error");
  })
  .finally(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }
      logger.info({ port }, "Synergy API Server listening successfully");
    });
  });

