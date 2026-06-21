import { spawn } from "node:child_process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const child = spawn(
  pnpm,
  ["--filter", "@workspace/synergy", "run", "dev"],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      PORT: process.env.PORT || "5173",
      BASE_PATH: process.env.BASE_PATH || "/",
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
