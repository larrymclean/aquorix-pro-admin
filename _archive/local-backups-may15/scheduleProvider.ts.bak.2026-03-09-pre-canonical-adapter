/*
  Product: AQUORIX
  File: scheduleProvider.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/lib/scheduleProvider.ts
  Description: Schedule data provider for Phase 9 widget parity mode. Fetches legacy schedule JSON via dev proxy.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.0.1

  Last Updated: 2026-03-05
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Initial ScheduleProvider for parity mode using /legacy-schedule endpoint.
    - 2026-03-05 - v1.0.1:
      - Define legacy schedule JSON TypeScript types for grid rendering.
      - Remove unknown typing to prevent ReactNode/type errors.
*/

export type LegacyScheduleCell = {
  name: string
  entryType: string
  spaceAvail: number
}

export type LegacyScheduleRow = {
  time: string
  days: Record<string, LegacyScheduleCell>
}

export type ScheduleJson = {
  status: string
  message?: string
  schedule: LegacyScheduleRow[]
}

export async function fetchLegacySchedule(): Promise<ScheduleJson> {
  const res = await fetch("/legacy-schedule", { method: "GET" })
  if (!res.ok) throw new Error(`legacy schedule fetch failed: HTTP ${res.status} ${res.statusText}`)
  return res.json()
}