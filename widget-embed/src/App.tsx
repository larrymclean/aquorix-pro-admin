/*
  Product: AQUORIX
  File: App.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/widget-embed/src/App.tsx
  Description: Phase 9 embeddable scheduler widget. Renders a destination-local schedule grid from legacy JSON, manages itinerary state, supports rolling and calendar-week navigation, preserves available vs waitlist behavior, and prepares commit redirect seam behavior.

  Author: ChatGPT (Lead) + Larry McLean
  Created: 2026-03-0
  Version: 1.2.1

  Last Updated: 2026-03-07
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
    - 2026-03-07 - v1.2.0:
      - Add destination-local rolling seven-day schedule view.
      - Add calendar-week navigation with Previous Week and Next Week controls.
      - Fix Next Week transition bug so first calendar week begins on the first Monday on or after minDate.
      - Refactor schedule headers and schedule body to render from visible date columns.
      - Add destinationTimeZone prop support for date calculations.
      - Add isoDate to itinerary item handling for stable chronological sorting.
      - Sort itinerary by isoDate, then time, then name.
      - Rebuild Day No. logic from chronological unique isoDate groups.
      - Improve itinerary accounting presentation and waitlist visual distinction.
      - Improve commit button UX and helper messaging.
    - 2026-03-07 - v1.2.1:
      - Harden localStorage itinerary loading with runtime validation.
      - Require isoDate and current canonical itinerary fields when restoring saved itinerary items.
      - Prevent stale or pre-isoDate saved data from corrupting chronological sorting and Day No. logic.
*/

import { useEffect, useMemo, useState } from "react"
import { fetchLegacySchedule } from "./lib/scheduleProvider"
import type { LegacyScheduleRow, ScheduleJson } from "./lib/scheduleProvider"
import type { ItineraryItem, ItineraryPayload } from "./lib/itineraryTypes"

const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
const LS_KEY = "aqx_widget_itinerary_v1"

type ViewMode = "rolling_today" | "calendar_week"

function getTimeZoneDateParts(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const parts = formatter.formatToParts(date)

  const year = Number(parts.find((p) => p.type === "year")?.value)
  const month = Number(parts.find((p) => p.type === "month")?.value)
  const day = Number(parts.find((p) => p.type === "day")?.value)

  return { year, month, day }
}

function getIsoDateInTimeZone(date: Date, timeZone: string): string {
  const { year, month, day } = getTimeZoneDateParts(date, timeZone)
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function getDateFromIso(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00Z`)
}

function addDaysToIso(isoDate: string, days: number): string {
  const d = getDateFromIso(isoDate)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function addMonthsToIso(isoDate: string, months: number): string {
  const d = getDateFromIso(isoDate)
  d.setUTCMonth(d.getUTCMonth() + months)
  return d.toISOString().slice(0, 10)
}

function getFirstDayOfMonthIso(isoDate: string): string {
  const d = getDateFromIso(isoDate)
  d.setUTCDate(1)
  return d.toISOString().slice(0, 10)
}

function getWeekdayNameFromIso(isoDate: string): (typeof DAYS_ORDER)[number] {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
  }).format(getDateFromIso(isoDate))

  return weekday as (typeof DAYS_ORDER)[number]
}

function formatDateLabelFromIso(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(getDateFromIso(isoDate))
}

function formatHeaderLabelFromIso(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(getDateFromIso(isoDate))
}

function getRollingWindowDates(startIsoDate: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDaysToIso(startIsoDate, i))
}

function getMondayOnOrBeforeIso(isoDate: string): string {
  const d = getDateFromIso(isoDate)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().slice(0, 10)
}

function getMondayOnOrAfterIso(isoDate: string): string {
  const d = getDateFromIso(isoDate)
  const day = d.getUTCDay()
  const daysUntilMonday = day === 1 ? 0 : day === 0 ? 1 : 8 - day
  d.setUTCDate(d.getUTCDate() + daysUntilMonday)
  return d.toISOString().slice(0, 10)
}

function getCalendarWeekDates(anchorIsoDate: string): string[] {
  const monday = getMondayOnOrBeforeIso(anchorIsoDate)
  return Array.from({ length: 7 }, (_, i) => addDaysToIso(monday, i))
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

    return parsed.filter((item): item is ItineraryItem => {
      return !!item
        && typeof item.id === "string"
        && typeof item.kind === "string"
        && (item.kind === "available" || item.kind === "waitlist")
        && typeof item.day === "string"
        && typeof item.isoDate === "string"
        && typeof item.dateLabel === "string"
        && typeof item.time === "string"
        && typeof item.name === "string"
        && typeof item.entryType === "string"
    })
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

type AppProps = {
  destinationTimeZone: string
}

export default function App({ destinationTimeZone }: AppProps) {
    const [data, setData] = useState<ScheduleJson | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => safeLoadItinerary())

    const [minDate] = useState<string>(() => getIsoDateInTimeZone(new Date(), destinationTimeZone))
    const [viewMode, setViewMode] = useState<ViewMode>("rolling_today")
    const [anchorDate, setAnchorDate] = useState<string>(() => getIsoDateInTimeZone(new Date(), destinationTimeZone))

    const visibleDates = useMemo(() => {
      return viewMode === "rolling_today"
        ? getRollingWindowDates(anchorDate)
        : getCalendarWeekDates(anchorDate)
    }, [viewMode, anchorDate])

      function handleNextWeek() {
        if (viewMode === "rolling_today") {
        const nextAnchorDate = getMondayOnOrAfterIso(minDate)
        setViewMode("calendar_week")
        setAnchorDate(nextAnchorDate)
        return
      }

    setAnchorDate(addDaysToIso(anchorDate, 7))
    }

    function handlePreviousWeek() {
      if (viewMode === "rolling_today") return

      const previousAnchorDate = addDaysToIso(anchorDate, -7)

      if (previousAnchorDate < minDate) {
        setViewMode("rolling_today")
        setAnchorDate(minDate)
        return
      }

      setAnchorDate(previousAnchorDate)
    }

    function handleNextMonth() {
      const nextMonthIso = addMonthsToIso(anchorDate, 1)
      const firstDayNextMonthIso = getFirstDayOfMonthIso(nextMonthIso)

      setViewMode("calendar_week")
      setAnchorDate(firstDayNextMonthIso)
    }

    function handlePreviousMonth() {
      const previousMonthIso = addMonthsToIso(anchorDate, -1)
      const firstDayPreviousMonthIso = getFirstDayOfMonthIso(previousMonthIso)

      if (firstDayPreviousMonthIso < minDate) {
        setViewMode("rolling_today")
        setAnchorDate(minDate)
        return
      }

      setViewMode("calendar_week")
      setAnchorDate(firstDayPreviousMonthIso)
    }

    const visibleDateHeaders = useMemo(() => {
      return visibleDates.map((isoDate) => ({
        isoDate,
        weekday: getWeekdayNameFromIso(isoDate),
        headerLabel: formatHeaderLabelFromIso(isoDate),
        dateLabel: formatDateLabelFromIso(isoDate),
      }))
    }, [visibleDates])

    const scheduleRangeLabel = useMemo(() => {
    if (!visibleDates.length) return ""

    const startIso = visibleDates[0]
    const endIso = visibleDates[visibleDates.length - 1]

    const start = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
    }).format(getDateFromIso(startIso))

    const end = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(getDateFromIso(endIso))

    return `${start} – ${end}`
  }, [visibleDates])

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

  function addToItinerary(day: (typeof DAYS_ORDER)[number], isoDate: string, dateLabel: string, row: LegacyScheduleRow) {
    const cell = row.days[day]
    if (!cell) return

    const id = makeItemId(`${isoDate}_${day}`, row.time, cell.name)
    const kind: ItineraryItem["kind"] = cell.spaceAvail > 0 ? "available" : "waitlist"

    setItinerary((prev) => {
      if (prev.some((x) => x.id === id)) return prev
      return [
        ...prev,
        {
          id,
          kind,
          day,
          isoDate,
          time: row.time,
          name: cell.name,
          dateLabel,
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

  const itineraryTotal = itinerary
  .filter((x) => x.kind === "available")
  .reduce((sum) => sum + 45, 0)

    const [promoCodeInput, setPromoCodeInput] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)

  const [greenFinsEnabled, setGreenFinsEnabled] = useState(false)
  const [greenFinsModalOpen, setGreenFinsModalOpen] = useState(false)
  const [greenFinsAgreedAt, setGreenFinsAgreedAt] = useState<string | null>(null)

  const promoDiscount = useMemo(() => {
    if (appliedPromoCode === "FALL10") {
      return itineraryTotal * 0.1
    }
    return 0
  }, [appliedPromoCode, itineraryTotal])

  const postPromoSubtotal = Math.max(0, itineraryTotal - promoDiscount)

  const greenFinsDiscount = useMemo(() => {
    if (greenFinsEnabled) {
      return postPromoSubtotal * 0.1
    }
    return 0
  }, [greenFinsEnabled, postPromoSubtotal])

  const finalTotal = Math.max(0, postPromoSubtotal - greenFinsDiscount)

  const costPerDive = availableCount > 0 ? finalTotal / availableCount : 0

  const confirmedDiveSummary =
    availableCount > 0
      ? `${availableCount} confirmed ${availableCount === 1 ? "dive" : "dives"} • $${costPerDive.toFixed(2)} per dive`
      : ""

  function applyPromoCode() {
    const normalized = promoCodeInput.trim()

    if (!normalized) {
      setPromoError("Enter a promo code.")
      setAppliedPromoCode(null)
      return
    }

    if (normalized !== "FALL10") {
      setPromoError("Invalid promo code.")
      setAppliedPromoCode(null)
      return
    }

    setAppliedPromoCode(normalized)
    setPromoError(null)
  }

  function clearPromoCode() {
    setPromoCodeInput("")
    setAppliedPromoCode(null)
    setPromoError(null)
  }

  function openGreenFinsModal() {
    setGreenFinsModalOpen(true)
  }

  function closeGreenFinsModal() {
    setGreenFinsModalOpen(false)
  }

  function applyGreenFins() {
    setGreenFinsEnabled(true)
    setGreenFinsAgreedAt(new Date().toISOString())
    setGreenFinsModalOpen(false)
  }

  const sortedItinerary = useMemo(() => {
    return [...itinerary].sort((a, b) => {
      if (a.isoDate !== b.isoDate) return a.isoDate.localeCompare(b.isoDate)
      if (a.time !== b.time) return a.time.localeCompare(b.time)
      return a.name.localeCompare(b.name)
    })
  }, [itinerary])

  // Dive Day numbering (divers think in dive days, not weekdays)
    const diveDayMap = useMemo(() => {
      const uniqueDates = Array.from(new Set(sortedItinerary.map((x) => x.isoDate)))
      const map: Record<string, number> = {}

      uniqueDates.forEach((isoDate, i) => {
        map[isoDate] = i + 1
      })

      return map
    }, [sortedItinerary])

  return (
      <div className="aqx-widget-shell" style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>AQUORIX Scheduler Widget (Parity Mode) v1.0.0</div>

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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Schedule</div>
                  <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
                    {scheduleRangeLabel}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                    Time zone: {destinationTimeZone} | Mode: {viewMode === "rolling_today" ? "Today + 6 days" : "Monday-Sunday"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handlePreviousMonth}
                    disabled={viewMode === "rolling_today"}
                    title={viewMode === "rolling_today" ? "Cannot go earlier than destination-local today" : "Go to previous month"}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #cfd6dd",
                      background: viewMode === "rolling_today" ? "#e9ecef" : "#ffffff",
                      color: viewMode === "rolling_today" ? "#7a7f87" : "#1f2933",
                      cursor: viewMode === "rolling_today" ? "not-allowed" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Previous Month
                  </button>

                  <button
                    type="button"
                    onClick={handlePreviousWeek}
                    disabled={viewMode === "rolling_today"}
                    title={viewMode === "rolling_today" ? "Cannot go earlier than destination-local today" : "Go to previous week"}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: viewMode === "rolling_today" ? "1px solid #cfd6dd" : "1px solid #cfd6dd",
                      background: viewMode === "rolling_today" ? "#e9ecef" : "#ffffff",
                      color: viewMode === "rolling_today" ? "#7a7f87" : "#1f2933",
                      cursor: viewMode === "rolling_today" ? "not-allowed" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Previous Week
                  </button>

                  <button
                    type="button"
                    onClick={handleNextWeek}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #cfd6dd",
                      background: "#ffffff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Next Week
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #cfd6dd",
                      background: "#ffffff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Next Month
                  </button>
                </div>
              </div>

            <div style={{ overflowX: "auto" }}>
              <table className="aqx-widget-table aqx-widget-schedule-table" style={{ borderCollapse: "collapse", width: "100%", minWidth: 780 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e3e6ea" }}>Time</th>
                    {visibleDateHeaders.map((col) => (
                      <th key={col.isoDate} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #e3e6ea" }}>
                        <div>{col.headerLabel}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row) => (
                    <tr key={row.time}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f0f2f4", fontWeight: 700 }}>{row.time}</td>
                                            {visibleDateHeaders.map((col) => {
                        const day = col.weekday
                        const cell = row.days[day]

                        if (!cell) {
                          return <td key={col.isoDate} style={{ padding: 10, borderBottom: "1px solid #f0f2f4" }} />
                        }

                        const isFull = cell.spaceAvail <= 0
                        const label = isFull ? "FULL" : `BOOK (${cell.spaceAvail})`

                        return (
                          <td key={col.isoDate} style={{ padding: 10, borderBottom: "1px solid #f0f2f4", verticalAlign: "top" }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{cell.name}</div>
                            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8 }}>{cell.entryType}</div>
                            <button
                              type="button"
                              onClick={() => addToItinerary(day, col.isoDate, col.dateLabel, row)}
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
              <div style={{ fontWeight: 700 }}>Your Itinerary</div>
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
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Day No.</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Day</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Date</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Time</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Activity</th>
                      <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Status</th>
                      <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Amount</th>
                      <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #e3e6ea" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItinerary.map((item) => (
                      <tr key={item.id} style={{ background: item.kind === "waitlist" ? "#f7f7f7" : "transparent" }}>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>
                          {diveDayMap[item.isoDate] ?? "-"}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>{item.day}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>{item.dateLabel}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>{item.time}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4" }}>
                          <div style={{ fontWeight: 700 }}>{item.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.85 }}>{item.entryType}</div>
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #f0f2f4", fontWeight: 700 }}>
                          {item.kind === "available" ? "AVAILABLE" : "WAITLIST"}
                        </td>

                        <td
                          style={{
                            padding: 8,
                            borderBottom: "1px solid #f0f2f4",
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            color: item.kind === "waitlist" ? "#777" : "#075c31",
                            fontWeight: item.kind === "available" ? 700 : 500,
                          }}
                        >
                          {item.kind === "available" ? "$45.00" : "WAITLIST"}
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
                  <tfoot>
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          padding: 0,
                          height: 0,
                          lineHeight: 0,
                          borderTop: "1px solid #d7dde3",
                        }}
                      ></td>
                    </tr>
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 10,
                          fontWeight: 800,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#5f6b76" }}>
                            Only available dives are included in checkout. Waitlist items are tracked separately and not charged.
                          </span>
                          <span style={{ marginLeft: "auto" }}>Subtotal</span>
                        </div>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: 10,
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                        }}
                      >
                        ${itineraryTotal.toFixed(2)}
                      </td>
                      <td
                        style={{}}
                      ></td>
                    </tr>

                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 10,
                          fontWeight: 800,
                          borderTop: "0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <input
                              type="text"
                              value={promoCodeInput}
                              onChange={(e) => setPromoCodeInput(e.target.value)}
                              placeholder="Promo code"
                              style={{
                                padding: "6px 8px",
                                borderRadius: 8,
                                border: "1px solid #cfd6dd",
                                width: 120,
                              }}
                            />

                            <button
                              type="button"
                              onClick={applyPromoCode}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 8,
                                border: "1px solid #cfd6dd",
                                background: "#ffffff",
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              Apply
                            </button>

                            {appliedPromoCode && (
                              <span style={{ fontSize: 12, color: "#075c31", fontWeight: 700 }}>
                                {appliedPromoCode} applied
                              </span>
                            )}

                            {promoError && (
                              <span style={{ fontSize: 12, color: "#b00020", fontWeight: 700 }}>
                                {promoError}
                              </span>
                            )}
                          </div>

                          <span style={{ marginLeft: "auto" }}>Promo Code Discount</span>
                        </div>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: 10,
                          fontWeight: 800,
                          color: promoDiscount > 0 ? "#075c31" : "#6b7280",
                          whiteSpace: "nowrap",
                          borderTop: "1px solid #d7dde3",
                        }}
                      >
                        -${promoDiscount.toFixed(2)}
                      </td>
                                            <td
                        style={{
                          borderTop: "1px solid #d7dde3",
                          textAlign: "right",
                          padding: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={clearPromoCode}
                          style={{
                            padding: "6px 8px",
                            borderRadius: 8,
                            border: "1px solid #cfd6dd",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Clear
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 10,
                          fontWeight: 800,
                          borderTop: "1px solid #d7dde3",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={openGreenFinsModal}
                              disabled={greenFinsEnabled}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 8,
                                border: "1px solid #cfd6dd",
                                background: greenFinsEnabled ? "#e6f4ec" : "#ffffff",
                                cursor: greenFinsEnabled ? "not-allowed" : "pointer",
                                fontWeight: 700,
                                color: greenFinsEnabled ? "#075c31" : "#1f2933",
                              }}
                            >
                              {greenFinsEnabled ? "Green Fins Applied (10% off)" : "Apply Green Fins"}
                            </button>

                            {greenFinsEnabled && greenFinsAgreedAt && (
                              <span style={{ fontSize: 12, color: "#075c31", fontWeight: 700 }}>
                                Agreed {new Date(greenFinsAgreedAt).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <span style={{ marginLeft: "auto" }}>Green Fins Discount</span>
                        </div>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: 10,
                          fontWeight: 800,
                          color: greenFinsDiscount > 0 ? "#075c31" : "#6b7280",
                          whiteSpace: "nowrap",
                          borderTop: "1px solid #d7dde3",
                        }}
                      >
                        -${greenFinsDiscount.toFixed(2)}
                      </td>
                      <td style={{ borderTop: "1px solid #d7dde3" }}></td>
                    </tr>

                    <tr style={{ background: "#e6f4ec" }}>
                      <td
                          colSpan={6}
                          style={{
                            padding: 12,
                            fontWeight: 900,
                            fontSize: 15,
                            borderTop: "2px solid #0a7a43",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 12,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#075c31",
                                textAlign: "left",
                              }}
                            >
                              {confirmedDiveSummary}
                            </span>

                            <span style={{ marginLeft: "auto" }}>Total</span>
                          </div>
                        </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: 12,
                          fontWeight: 900,
                          fontSize: 16,
                          color: "#075c31",
                          borderTop: "2px solid #075c31",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ${finalTotal.toFixed(2)}
                      </td>
                      <td style={{ borderTop: "2px solid #075c31" }}></td>
                    </tr>
                  </tfoot>
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
                    title={availableCount === 0 ? "Add at least one available dive to proceed" : "Proceed to checkout"}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: availableCount === 0 ? "1px solid #cfd6dd" : "1px solid #075c31",
                      background: availableCount === 0 ? "#e9ecef" : "#dff5e8",
                      color: availableCount === 0 ? "#7a7f87" : "#075c31",
                      cursor: availableCount === 0 ? "not-allowed" : "pointer",
                      fontWeight: 900,
                      boxShadow: availableCount === 0 ? "none" : "0 1px 2px rgba(0,0,0,0.08)",
                      opacity: availableCount === 0 ? 1 : 1,
                    }}
                  >
                    Commit (Available Only)
                  </button>
                </div>

                <div style={{ fontSize: 12, marginTop: 8, color: "#5f6b76" }}>
                  {availableCount === 0
                    ? "Add at least one available dive to proceed."
                    : ""}
                </div>

                                {greenFinsModalOpen && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="green-fins-title"
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0, 0, 0, 0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: 12,
                        width: "100%",
                        maxWidth: 760,
                        maxHeight: "85vh",
                        overflowY: "auto",
                        padding: 20,
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <h3 id="green-fins-title" style={{ margin: 0 }}>
                          Green Fins Responsible Diving Agreement
                        </h3>

                        <button
                          type="button"
                          onClick={closeGreenFinsModal}
                          aria-label="Close Green Fins agreement"
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #cfd6dd",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Close
                        </button>
                      </div>

                      <p style={{ marginTop: 0 }}>
                        By selecting this option, I commit to following Green Fins environmental principles to protect coral reefs and marine life during my dive(s).
                      </p>

                      <p>
                        This operator supports Green Fins principles to protect our reefs.
                      </p>

                      <div style={{ marginBottom: 16, lineHeight: 1.55 }}>
                        <div>Perfect my buoyancy to avoid contact with the reef</div>
                        <div>Keep all equipment secured and streamlined</div>
                        <div>Never touch, stand on, or damage coral</div>
                        <div>Never chase, harass, or feed marine life</div>
                        <div>Maintain a respectful distance from all sea creatures</div>
                        <div>Never collect shells, coral, or marine souvenirs</div>
                        <div>Use reef-safe sunscreen only</div>
                        <div>Properly dispose of all waste</div>
                        <div>Follow my dive guide's environmental instructions</div>
                        <div>Help protect our oceans for future generations</div>
                      </div>

                      <div style={{ marginBottom: 16, lineHeight: 1.55 }}>
                        <div>I understand that:</div>
                        <div>- These practices protect fragile marine ecosystems</div>
                        <div>- My operator follows Green Fins standards</div>
                        <div>- This discount rewards responsible diving behavior</div>
                        <div>- I can take the free Green Fins Diver e-Course at greenfins.net</div>
                      </div>

                      <div style={{ fontSize: 12, color: "#5f6b76", marginBottom: 16 }}>
                        By continuing, you confirm that you have read and agree to follow Green Fins principles for this booking.
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={closeGreenFinsModal}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #cfd6dd",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={applyGreenFins}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #075c31",
                            background: "#e6f4ec",
                            color: "#075c31",
                            cursor: "pointer",
                            fontWeight: 800,
                          }}
                        >
                          Agree and Apply 10% Discount
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}