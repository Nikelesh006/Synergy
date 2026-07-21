import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load root .env
let env = { ...process.env };
try {
  const envFile = readFileSync(resolve(__dirname, "../.env"), "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (key && !(key in env)) env[key] = val;
  }
} catch {
  // no root .env — that's fine
}

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const processes = [];

function spawnChild(args, extraEnv = {}) {
  const child = spawn(pnpm, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...env, ...extraEnv },
  });
  processes.push(child);
  child.on("exit", (code, signal) => {
    if (signal) {
      for (const p of processes) p.kill(signal);
      process.kill(process.pid, signal);
      return;
    }
    if (code !== 0) {
      console.error(`Process exited with code ${code}`);
      for (const p of processes) p.kill();
      process.exit(code ?? 1);
    }
  });
  return child;
}

// Start API server
spawnChild(["--filter", "@workspace/api-server", "run", "dev"], {
  PORT: env.PORT || "5000",
  MONGODB_URL: env.MONGODB_URL,
  NODE_ENV: "development",
});

// Start Vite frontend (give API server a small head-start)
setTimeout(() => {
  spawnChild(["--filter", "@workspace/synergy", "run", "dev"], {
    PORT: "5173",
    BASE_PATH: env.BASE_PATH || "/",
    VITE_API_URL: `http://localhost:${env.PORT || "5000"}/api`,
  });
}, 2000);
