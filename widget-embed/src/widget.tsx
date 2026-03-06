/*
  Product: AQUORIX
  File: widget.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/widget.tsx
  Description: Embeddable widget entrypoint exposing mount() and unmount() for the React scheduler widget bundle.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.0.1

  Last Updated: 2026-03-06
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Initial creation of embeddable widget entrypoint
      - Exposes mount() and unmount()
      - Uses createRoot() and tracks mounted roots by target element
    - 2026-03-06 - v1.0.1:
      - Remove global index.css import to prevent host-page CSS bleed.
      - Add .aqx-widget-root wrapper and import widget.css for scoped styling.
*/

import { createRoot } from "react-dom/client"
import App from "./App"
import "./widget.css"

export type MountOptions = {
  operatorSlug?: string
}

const roots = new Map<HTMLElement, ReturnType<typeof createRoot>>()

export function mount(target: HTMLElement | string, _opts: MountOptions = {}) {
  const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target
  if (!el) throw new Error("mount target not found")

  unmount(el)

  const root = createRoot(el)
  roots.set(el, root)
  root.render(
    <div className="aqx-widget-root">
      <App />
    </div>
  )
}

export function unmount(target: HTMLElement | string) {
  const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target
  if (!el) return

  const root = roots.get(el)
  if (root) {
    root.unmount()
    roots.delete(el)
  }
}