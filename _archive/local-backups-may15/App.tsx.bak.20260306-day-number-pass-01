/*
  Product: AQUORIX
  File: App.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/App.tsx
  Description: Phase 9 embeddable scheduler widget (parity mode). Renders a weekly schedule grid from legacy JSON, manages itinerary, and provides commit redirect seam.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-05
  Version: 1.1.0

  Last Updated: 2026-03-06
  Status: ACTIVE

  Change Log (append-only):
    - 2026-03-05 - v1.0.0:
      - Initial widget shell: fetch legacy schedule JSON and render raw preview for parity plumbing verification.
    - 2026-03-05 - v1.0.1:
      - Fix TypeScript build error by tightening schedule typing.
    - 2026-03-05 - v1.0.2:
      - Add JSON length + scroll hint to eliminate ambiguity about truncated preview.
    - 2026-03-06 - v1.1.0:
      - Replace raw JSON preview with initial React widget UI:
        - Schedule grid render (legacy parity data)
        - Itinerary add/remove
        - Available vs waitlist separation (available-only commits)
        - Commit seam redirects to checkout URL with encoded payload
*/

import { useEffect, useMemo, useState } from "react"
import { fetchLegacySchedule } from "./lib/scheduleProvider"
import type { LegacyScheduleRow, ScheduleJson } from "./lib/scheduleProvider"
import type { ItineraryItem, ItineraryPayload } from "./lib/itineraryTypes"

const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
const LS_KEY = "aqx_widget_itinerary_v1"

const DAY_INDEX: Record<(typeof DAYS_ORDER)[number], number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatWeekdayFromDateLabel(dateLabel: string): string {
  const [month, day] = dateLabel.split(" ")
  const d = new Date(`${month} ${day}, ${new Date().getFullYear()}`)
  return d.toLocaleDateString("en-US", { weekday: "long" })
}

function getWeekDates(startDate: Date): Record<(typeof DAYS_ORDER)[number], string> {
  const out = {} as Record<(typeof DAYS_ORDER)[number], string>

  DAYS_ORDER.forEach((day) => {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + DAY_INDEX[day])
    out[day] = formatDateLabel(d)
  })

  return out
}

function makeItemId(day: string, time: string, name: string): string {
  return `${day}__${time}__${name}`.replace(/\s+/g, "_").toLowerCase()
}

function safeLoadItinerary(): ItineraryItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as ItineraryItem[]
  } catch {
    return []
  }
}

function safeSaveItinerary(items: ItineraryItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  } catch {
    // ignore (storage may be blocked)
  }
}

export default function App() {
  const [data, setData] = useState<ScheduleJson | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => safeLoadItinerary())
  const [currentWeekStartDate] = useState<Date>(() => getWeekStart(new Date()))

  const weekDates = useMemo(() => {
    return getWeekDates(currentWeekStartDate)
  }, [currentWeekStartDate])

  useEffect(() => {
    safeSaveItinerary(itinerary)
  }, [itinerary])

  useEffect(() => {
    let mounted = true

    fetchLegacySchedule()
      .then((json) => {
        if (!mounted) return
        setData(json)
      })
      .catch((err: any) => {
        if (!mounted) return
        setError(String(err?.message || err))
      })

    return () => {
      mounted = false
    }
  }, [])

  const scheduleRows: LegacyScheduleRow[] = useMemo(() => {
    return data?.schedule || []
  }, [data])

  function addToItinerary(day: (typeof DAYS_ORDER)[number], row: LegacyScheduleRow) {
    const cell = row.days[day]
    if (!cell) return

    const id = makeItemId(day, row.time, cell.name)
    const kind: ItineraryItem["kind"] = cell.spaceAvail > 0 ? "available" : "waitlist"

    setItinerary((prev) => {
      if (prev.some((x) => x.id === id)) return prev
      return [
        ...prev,
        {
          id,
          kind,
          day,
          time: row.time,
          name: cell.name,
          dateLabel: weekDates[day],
          entryType: cell.entryType,
        },
      ]
    })
  }

  function removeFromItinerary(id: string) {
    setItinerary((prev) => prev.filter((x) => x.id !== id))
  }

  function clearItinerary() {
    setItinerary([])
  }

  function commitItinerary() {
    const available = itinerary.filter((x) => x.kind === "available")
    const waitlist = itinerary.filter((x) => x.kind === "waitlist")

    const payload: ItineraryPayload = {
      operatorSlug: "demo-operator",
      createdAtIso: new Date().toISOString(),
      available: available.map((x) => ({ ...x, kind: "available" })),
      waitlist: waitlist.map((x) => ({ ...x, kind: "waitlist" })),
    }

    // Canon rule: available items are the only chargeable cart items.
    // Waitlist items are tracked but not billed.
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))))

    // Seam: redirect to checkout URL (placeholder for now).
    // Later: replace "/checkout" with real generated checkout_url from backend.
    window.location.assign(`/checkout?aqx_payload=${encoded}`)
  }

  const availableCount = itinerary.filter((x) => x.kind === "available").length
  const waitlistCount = itinerary.filter((x) => x.kind === "waitlist").length

  return (
      <div className="aqx-widget-shell" style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>AQUORIX Scheduler Widget (Parity Mode)</div>

      {error && (
        <div style={{ padding: 12, background: "#ffecec", border: "1px solid #ffb3b3", borderRadius: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Schedule load failed</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      {!error && !data && <div>Loading schedule...</div>}

      {!error && data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <div className="aqx-widget-card aqx-widget-schedule-card" style={{ border: "1px solid #e3e6ea", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Schedule</div>

            <div style={{ overflowX: "auto" }}>
              <table className="aqx-widget-table aqx-widget-schedule-table" style={{ borderCollapse: "collapse", width: "100%", minWidth: 780 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e3e6ea" }}>Time</th>
                    {DAYS_ORDER.map((d) => (
                      <th key={d} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e3e6ea" }}>
                        <div>{d}</div>
                        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{weekDates[d]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row) => (
                    <tr key={row.time}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f0f2f4", fontWeight: 700 }}>{row.time}</td>
                      {DAYS_ORDER.map((day) => {
                        const cell = row.days[day]
                        if (!cell) {
                          return <td key={day} style={{ padding: 10, borderBottom: "1px solid #f0f2f4" }} />
                        }

                        const isFull = cell.spaceAvail <= 0
                        const label = isFull ? "FULL" : `BOOK (${cell.spaceAvail})`

                        return (
                          <td key={day} style={{ padding: 10, borderBottom: "1px solid #f0f2f4", verticalAlign: "top" }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{cell.name}</div>
                            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8 }}>{cell.entryType}</div>
                            <button
                              type="button"
                              onClick={() => addToItinerary(day, row)}
                              style={{
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid #cfd6dd",
                                background: isFull ? "#f6f7f8" : "#ffffff",
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              {label}
                            </button>
                            {isFull && <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>Adds to waitlist (no charge)</div>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="aqx-widget-card aqx-widget-itinerary-card" style={{ border: "1px solid #e3e6ea", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>Itinerary</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                Available: {availableCount} | Waitlist: {waitlistCount}
              </div>
            </div>

            {itinerary.length === 0 && <div style={{ marginTop: 10, opacity: 0.8 }}>No items yet. Click BOOK/FULL on the schedule.</div>}

            {itinerary.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <table className="aqx-widget-table aqx-widget-itinerary-table" style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Day</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Date</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Time</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Item</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Status</th>
                      <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itinerary.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>{formatWeekdayFromDateLabel(item.dateLabel)}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>{item.dateLabel}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>{item.time}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>
                          <div style={{ fontWeight: 700 }}>{item.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.85 }}>{item.entryType}</div>
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4", fontWeight: 700 }}>
                          {item.kind === "available" ? "AVAILABLE" : "WAITLIST"}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => removeFromItinerary(item.id)}
                            style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #cfd6dd", background: "#ffffff", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={clearItinerary}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cfd6dd", background: "#ffffff", cursor: "pointer", fontWeight: 800 }}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={commitItinerary}
                    disabled={availableCount === 0}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #0b6",
                      background: availableCount === 0 ? "#f6f7f8" : "#eafff3",
                      cursor: availableCount === 0 ? "not-allowed" : "pointer",
                      fontWeight: 900,
                    }}
                  >
                    Commit (Available Only)
                  </button>
                </div>

                {availableCount === 0 && <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>Add at least one AVAILABLE item to commit.</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}