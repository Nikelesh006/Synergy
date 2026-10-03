import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import fs from "fs";

try {
  const destDir = path.resolve(import.meta.dirname, "public/categories");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const brainDir = "C:/Users/saile/.gemini/antigravity-ide/brain/c39e2c30-e639-40b7-ac71-3695c941bdfd";
  const files = [
    { src: "cat_iot_board_1791048241177.jpg", dest: "iot-boards.jpg" },
    { src: "cat_ai_board_1791048261264.jpg", dest: "ai-boards.jpg" },
    { src: "cat_robotics_board_1791048279509.jpg", dest: "robotics-boards.jpg" },
    { src: "cat_embedded_board_1791048303691.jpg", dest: "embedded-boards.jpg" },
    { src: "cat_lab_equipment_1791048326489.jpg", dest: "lab-equipments.jpg" },
  ];
  for (const f of files) {
    const s = path.join(brainDir, f.src);
    const d = path.join(destDir, f.dest);
    if (fs.existsSync(s) && !fs.existsSync(d)) {
      fs.copyFileSync(s, d);
    }
  }
} catch (e) {
  // Silent fallback
}


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  const rawPort = env.PORT || "5173";
  const port = Number(rawPort);
  const basePath = env.BASE_PATH || "/";

  const plugins = [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ];

  // Add Replit plugins conditionally without async/await
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    plugins.push(
      // @ts-ignore - Replit plugins may not have proper types
      import("@replit/vite-plugin-cartographer").then((m) =>
        m.cartographer({
          root: path.resolve(import.meta.dirname, ".."),
        }),
      ),
      // @ts-ignore - Replit plugins may not have proper types
      import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
    );
  }

  return {
    base: basePath,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: false,
      host: "0.0.0.0",

      allowedHosts: true,
      fs: {
        strict: true,
      },
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
