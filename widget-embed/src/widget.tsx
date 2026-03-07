/*
  Product: AQUORIX
  File: widget.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/widget.tsx
  Description: Embeddable widget entrypoint exposing mount() and unmount() for the React scheduler widget bundle. Accepts widget mount options and passes destination-local timezone into the scheduler app.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.0.2

  Last Updated: 2026-03-07
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Initial creation of embeddable widget entrypoint.
      - Exposes mount() and unmount().
      - Uses createRoot() and tracks mounted roots by target element.
    - 2026-03-06 - v1.0.1:
      - Remove global index.css import to prevent host-page CSS bleed.
      - Add .aqx-widget-root wrapper and import widget.css for scoped styling.
    - 2026-03-07 - v1.0.2:
      - Add destinationTimeZone to MountOptions for widget configuration.
      - Validate destinationTimeZone at mount time using Intl.DateTimeFormat.
      - Default to UTC with console warning when timezone is missing or invalid.
      - Pass destinationTimeZone into App for destination-local date navigation.
*/

import { createRoot } from "react-dom/client"
import App from "./App"
import "./widget.css"

export type MountOptions = {
  operatorSlug?: string
  destinationTimeZone?: string
}

const roots = new Map<HTMLElement, ReturnType<typeof createRoot>>()

export function mount(target: HTMLElement | string, opts: MountOptions = {}) {
  const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target
  if (!el) throw new Error("mount target not found")

  let destinationTimeZone = opts.destinationTimeZone || "UTC"

  if (!opts.destinationTimeZone) {
    console.warn("[AQUORIX] destinationTimeZone missing. Defaulting to UTC.")
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: destinationTimeZone })
  } catch {
    console.warn(`[AQUORIX] Invalid timezone "${destinationTimeZone}". Falling back to UTC.`)
    destinationTimeZone = "UTC"
  }

  unmount(el)

  const root = createRoot(el)
  roots.set(el, root)
  root.render(
    <div className="aqx-widget-root">
      <App destinationTimeZone={destinationTimeZone} />
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