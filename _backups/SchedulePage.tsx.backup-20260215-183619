/*
  File: SchedulePage.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/features/dashboard/pages/SchedulePage.tsx
  Description:
    Phase 5A: Render operator-scoped weekly schedule from backend API.
    Phase 5B: Provide a stable, high-contrast Create Test Session button + deterministic refresh.

    Key fixes:
    - Button is always visible (no flash).
    - Button is high-contrast and does NOT appear disabled due to faint styling.
    - Soft-disable: we do NOT use the native "disabled" attribute (avoids browser dimming).
    - We await refresh() so "Creating…" state is stable and the proof loop is deterministic.

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.2.1

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Phase 5A initial wiring: GET /api/v1/dashboard/schedule and render grouped list
    - 2026-02-15 - v1.0.1:
      - Phase 5AB: Add create import (debug)
    - 2026-02-16 - v1.2.0:
      - Keep button visible during refresh (no flash)
    - 2026-02-16 - v1.2.1:
      - High-contrast button styling (no “dimmed” look)
      - Soft-disable (no native disabled attribute)
      - Await refresh() for a stable proof loop
*/

import React, { useMemo, useState } from "react";
import { useDashboardSchedule } from "../../../hooks/useDashboardSchedule";
import type { DashboardScheduleSession } from "../../../types/dashboardSchedule";
import { createDashboardSession } from "../../../api/dashboardSchedule";

function groupByDate(sessions: DashboardScheduleSession[]) {
  const map: Record<string, DashboardScheduleSession[]> = {};
  for (const s of sessions) {
    const key = s.session_date || "unknown-date";
    if (!map[key]) map[key] = [];
    map[key].push(s);
  }

  for (const k of Object.keys(map)) {
    map[k].sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  }

  const dates = Object.keys(map).sort((a, b) => a.localeCompare(b));
  return { dates, map };
}

function ErrorBanner({ error }: { error: any }) {
  const status = error?.status;
  const message = error?.message || "Unknown error";

  if (status === 403) {
    return (
      <div style={styles.bannerWarn}>
        <strong>403 — No operator affiliation.</strong>
        <div>This user is not linked to any operator. (Data state problem)</div>
      </div>
    );
  }

  if (status === 409) {
    const count = error?.raw?.affiliation_count;
    return (
      <div style={styles.bannerWarn}>
        <strong>409 — Multiple operator affiliations.</strong>
        <div>Operator selection required (Phase 6). Current affiliations: {count ?? "unknown"}.</div>
        <div style={{ marginTop: 6, opacity: 0.85 }}>
          Fix for now: ensure exactly ONE active row in{" "}
          <code>aquorix.user_operator_affiliations</code>.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.bannerError}>
      <strong>Schedule load failed.</strong>
      <div>{message}</div>
    </div>
  );
}

export default function SchedulePage() {
  const { state, refresh } = useDashboardSchedule();
  const [isCreating, setIsCreating] = useState(false);

  // Soft-disable: busy if we are creating or the hook is currently refreshing
  const isBusy = isCreating || (state.status === "ready" && state.isRefreshing);

  async function handleTestCreate() {
    if (isBusy) return;

    setIsCreating(true);
    try {
      // IMPORTANT: must be inside the currently displayed week to show up immediately.
      // (Your screenshot week: 2026-02-09 → 2026-02-15, so 2026-02-14 is correct.)
      await createDashboardSession({
        itinerary_id: 1,
        team_id: 1,
        dive_site_id: 67,
        dive_datetime: "2026-02-14T10:00:00Z",
        meet_time: "2026-02-14T09:30:00Z",
        session_type: "shore",
        notes: "Phase 5B test session"
      });

      // Deterministic proof loop: await refresh so UI state is stable.
      await refresh();
    } catch (err: any) {
      alert(err?.message || "Create failed");
    } finally {
      setIsCreating(false);
    }
  }

  // During first-load only, show loading card (button still visible above it).
  const hasData = (state as any)?.data?.sessions;
  const scheduleData = (state as any)?.data;

  const grouped = useMemo(() => {
    if (!scheduleData?.sessions) return null;
    return groupByDate(scheduleData.sessions);
  }, [scheduleData]);

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Schedule</h1>

      {/* Keep ops moving: show banner if error, but don’t nuke the page if we have data */}
      {state.status === "error" ? <ErrorBanner error={(state as any).error} /> : null}

      {/* Toolbar: button must never look disabled unless truly busy */}
      <div style={styles.toolbar}>
        <button
          onClick={handleTestCreate}
          aria-disabled={isBusy ? "true" : "false"}
          style={{
            ...styles.primaryButton,
            ...(isBusy ? styles.primaryButtonBusy : null)
          }}
        >
          {isCreating ? "Creating…" : "+ Create Test Session"}
        </button>

        {state.status === "ready" && state.isRefreshing ? (
          <div style={styles.statusText}>Refreshing…</div>
        ) : null}
      </div>

      {/* First load */}
      {state.status === "loading" && !hasData ? (
        <div style={styles.card}>Loading schedule…</div>
      ) : null}

      {/* No data at all */}
      {state.status === "error" && !hasData ? (
        <div style={styles.card}>Unable to load schedule.</div>
      ) : null}

      {/* Normal render */}
      {scheduleData?.sessions ? (
        <>
          <div style={styles.meta}>
            <div>
              <strong>Operator:</strong> {scheduleData.operator_id}
            </div>
            <div>
              <strong>Week:</strong> {scheduleData.week.start} → {scheduleData.week.end}
            </div>
            <div>
              <strong>Sessions:</strong> {scheduleData.sessions.length}
            </div>
          </div>

          {!grouped || grouped.dates.length === 0 ? (
            <div style={styles.card}>No sessions scheduled for this week.</div>
          ) : (
            grouped.dates.map((date) => (
              <div key={date} style={styles.dayBlock}>
                <div style={styles.dayHeader}>{date}</div>

                <div style={styles.dayList}>
                  {grouped.map[date].map((s) => (
                    <div key={s.session_id} style={styles.sessionRow}>
                      <div style={styles.timeCol}>
                        <div>
                          <strong>{s.start_time}</strong>
                        </div>
                        <div style={styles.subtle}>Meet {s.meet_time}</div>
                      </div>

                      <div style={styles.mainCol}>
                        <div style={styles.titleLine}>
                          <strong>{s.site_name}</strong>{" "}
                          <span style={styles.subtle}>({s.session_type})</span>
                        </div>
                        <div style={styles.subtle}>
                          {s.itinerary_title} • {s.team_name}
                        </div>
                        {s.notes ? <div style={styles.notes}>{s.notes}</div> : null}
                      </div>

                      <div style={styles.idCol}>
                        <div style={styles.subtle}>#{s.session_id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      ) : null}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 16,
    maxWidth: 1100,
    margin: "0 auto",
  },
  h1: {
    fontSize: 22,
    margin: "8px 0 12px",
  },
  toolbar: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    opacity: 0.75,
  },

  // High-contrast primary button (no “disabled-looking” faint fill)
  primaryButton: {
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#00D4FF",          // Neon Cyan brand
    color: "#003846",               // Dark text for contrast
    fontWeight: 800,
    letterSpacing: 0.2,
    boxShadow: "0 1px 0 rgba(0,0,0,0.18)",
    userSelect: "none",
  },
  primaryButtonBusy: {
    cursor: "not-allowed",
    opacity: 0.65,
  },

  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    marginBottom: 14,
  },
  card: {
    padding: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
  },
  dayBlock: {
    marginBottom: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    overflow: "hidden",
  },
  dayHeader: {
    padding: "10px 12px",
    background: "rgba(255,255,255,0.06)",
    fontWeight: 700,
  },
  dayList: {
    padding: 10,
    display: "grid",
    gap: 10,
  },
  sessionRow: {
    display: "grid",
    gridTemplateColumns: "110px 1fr 70px",
    gap: 12,
    padding: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
  },
  timeCol: {},
  mainCol: {},
  idCol: {
    textAlign: "right",
  },
  subtle: {
    opacity: 0.75,
    fontSize: 13,
  },
  titleLine: {
    marginBottom: 4,
  },
  notes: {
    marginTop: 8,
    fontSize: 13,
    opacity: 0.9,
  },
  bannerWarn: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,200,0,0.45)",
    background: "rgba(255,200,0,0.12)",
    marginBottom: 12
  },
  bannerError: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,0,0,0.45)",
    background: "rgba(255,0,0,0.12)",
    marginBottom: 12
  },
};
