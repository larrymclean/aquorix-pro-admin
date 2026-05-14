/*
  File: DashboardSessionCard.tsx
  Path: src/features/dashboard/components/DashboardSessionCard.tsx
  Description:
    P10.14 shared dashboard session presentation card.
    Presentational only. Reflects backend/API session truth without calculating operational truth.

  Author: Larry McLean + ChatGPT
  Created: 2026-05-14
  Version: 0.1.1
  Status: ACTIVE - P10.14 Shared Session Presentation Layer

  Change Log:
    - 2026-05-14 - v0.1.0:
      - Extract Overview session row rendering into shared presentational card.
    - 2026-05-14 - v0.1.1:
      - Add schedule variant support with optional price, debug label, and action slot.
*/

import React from "react";
import type { DashboardScheduleSession } from "../../../types/dashboardSchedule";

type DashboardSessionCardProps = {
  session: DashboardScheduleSession;
  variant?: "overview" | "schedule";
  priceLabel?: string;
  debugLabel?: string;
  actions?: React.ReactNode;
};

function statusLabel(value: string | null | undefined) {
  if (!value) return "unknown";
  return value.replace(/_/g, " ");
}

function getLeadName(session: DashboardScheduleSession) {
  return (
    (session.metadata as any)?.lead_guide_name ||
    (session.metadata as any)?.instructor_name ||
    "TBD"
  );
}

function getLocationOrVessel(session: DashboardScheduleSession) {
  if (session.type === "course") {
    return (session.metadata as any)?.location || "—";
  }

  return session.vessel_name || "—";
}

export default function DashboardSessionCard({
  session,
  variant = "overview",
  priceLabel,
  debugLabel,
  actions,
}: DashboardSessionCardProps) {
  return (
    <div className={`aqx-dashboard-session-card aqx-dashboard-session-card--${variant}`}>
      <div className="aqx-dashboard-session-time">
        <div className="aqx-dashboard-session-start">{session.start_time}</div>
        <div className="aqx-dashboard-session-meet">Meet {session.meet_time || "—"}</div>
        {session.meet_location ? (
          <div className="aqx-dashboard-session-location">{session.meet_location}</div>
        ) : null}
      </div>

      <div className="aqx-dashboard-session-main">
        <div className="aqx-dashboard-session-title-line">
          <div className="aqx-dashboard-session-title">{session.site_name}</div>
          <span className="aqx-dashboard-session-pill">
            {(session.type || "dive").toUpperCase()}
          </span>
          <span className="aqx-dashboard-session-pill-muted">
            {session.session_type || "—"}
          </span>
          <span className="aqx-dashboard-session-pill-muted">
            {statusLabel(session.ops_status)}
          </span>
        </div>

        <div className="aqx-dashboard-session-meta">
          {variant === "schedule"
            ? `${session.itinerary_title || "Session"} • ${session.team_name || "Team"}`
            : `Vessel: ${session.vessel_name || "TBD"} • Staff: ${getLeadName(session)}`}
        </div>

        {variant === "schedule" ? (
          <div className="aqx-dashboard-session-metrics">
            <div>
              <div className="aqx-dashboard-session-metric-label">Capacity</div>
              <div className="aqx-dashboard-session-metric-value">
                {session.capacity_consumed ?? 0}/{session.capacity_total ?? "—"}
              </div>
            </div>

            <div>
              <div className="aqx-dashboard-session-metric-label">Remaining</div>
              <div className="aqx-dashboard-session-metric-value">
                {session.capacity_remaining ?? "—"}
              </div>
            </div>

            <div>
              <div className="aqx-dashboard-session-metric-label">Price</div>
              <div className="aqx-dashboard-session-metric-value">
                {priceLabel || "Price TBD"}
              </div>
            </div>

            <div>
              <div className="aqx-dashboard-session-metric-label">
                {session.type === "course" ? "Location" : "Vessel"}
              </div>
              <div className="aqx-dashboard-session-metric-value">
                {getLocationOrVessel(session)}
              </div>
            </div>

            <div>
              <div className="aqx-dashboard-session-metric-label">Staff</div>
              <div className="aqx-dashboard-session-metric-value">{getLeadName(session)}</div>
            </div>
          </div>
        ) : null}

        {session.session_status === "cancelled" ? (
          <div className="aqx-dashboard-session-cancelled">
            Cancelled — visible for operational awareness.
          </div>
        ) : null}

        {session.notes ? (
          <div className="aqx-dashboard-session-notes">{session.notes}</div>
        ) : null}
      </div>

      {variant === "overview" ? (
        <div className="aqx-dashboard-session-capacity">
          <div className="aqx-dashboard-session-capacity-label">Capacity</div>
          <div className="aqx-dashboard-session-capacity-value">
            {session.capacity_consumed ?? 0}/{session.capacity_total ?? "—"}
          </div>
          <div className="aqx-dashboard-session-capacity-sub">
            {session.capacity_remaining ?? "—"} remaining
          </div>
        </div>
      ) : null}

      {variant === "schedule" ? (
        <div className="aqx-dashboard-session-actions">
          {debugLabel ? <div className="aqx-dashboard-session-debug">{debugLabel}</div> : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}