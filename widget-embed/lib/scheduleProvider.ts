/*
  Product: AQUORIX
  File: scheduleProvider.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/lib/scheduleProvider.ts
  Description: Schedule provider for the Phase 9 scheduler widget. Loads legacy schedule JSON for parity-mode rendering.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.0.0

  Last Updated: 2026-03-05
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Initial provider for loading legacy schedule JSON
      - Used by App.tsx parity-mode widget shell
*/

export type ScheduleSession = {
  id?: number
  site_name?: string
  start_at?: string
  capacity_total?: number
  capacity_available?: number
}

export type ScheduleJson = {
  sessions?: ScheduleSession[]
  [key: string]: any
}

const LEGACY_URL =
  "http://localhost:3500/api/arab-divers-schedule.php"

export async function fetchLegacySchedule(): Promise<ScheduleJson> {
  const res = await fetch(LEGACY_URL)

  if (!res.ok) {
    throw new Error("Schedule request failed: " + res.status)
  }

  return res.json()
}