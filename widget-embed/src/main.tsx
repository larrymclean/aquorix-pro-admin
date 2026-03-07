/*
  Product: AQUORIX
  File: main.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/main.tsx
  Description: Vite dev entrypoint for the widget-embed project (local dev only). Mounts App into #root with a fixed development destination-local timezone.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.0.2

  Last Updated: 2026-03-07
  Status: ACTIVE (DEV ENTRY ONLY)

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Vite scaffold: mount App into #root.
    - 2026-03-06 - v1.0.1:
      - Add IP header + versioning.
    - 2026-03-07 - v1.0.2:
      - Pass destinationTimeZone prop into App for local development rendering.
      - Keep local dev entry aligned with widget mount contract.
*/

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App destinationTimeZone="Asia/Amman" />
  </StrictMode>,
)