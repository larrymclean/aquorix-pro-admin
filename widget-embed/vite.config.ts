/*
  Product: AQUORIX
  File: vite.config.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/vite.config.ts
  Description: Vite configuration for building the Phase 9 embeddable scheduler widget as a browser-safe IIFE bundle.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.0.2

  Last Updated: 2026-03-05
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Initial widget-embed Vite configuration for IIFE library build output.
    - 2026-03-05 - v1.0.1:
      - Add browser-safe defines to eliminate runtime "process is not defined" errors in plain HTML embeds.
    - 2026-03-05 - v1.0.2:
      - Add dev-only proxy endpoint /legacy-schedule to fetch legacy prototype schedule JSON for parity work.
*/

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": JSON.stringify({ NODE_ENV: "production" }),
    "process": JSON.stringify({ env: { NODE_ENV: "production" } }),
  },
  server: {
    port: 5173,
    proxy: {
      "/legacy-schedule": {
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: () => "/aquorix-scheduler/api/arab-divers-schedule.php",
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget.tsx"),
      name: "AquorixSchedulerWidget",
      formats: ["iife"],
      fileName: () => "aquorix-scheduler-widget.iife.js",
    },
    rollupOptions: {
      external: [],
    },
  },
})