/*
  File: OverviewPage.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/features/dashboard/pages/OverviewPage.tsx
  Description:
    P10.12 Operator Overview MVP.
    Default Pro Dashboard landing surface showing today's operational schedule
    from the existing dashboard schedule API.

  Author: Larry McLean + ChatGPT
  Created: 2026-05-13
  Version: 0.1.2
  Status: ACTIVE - P10.14 shared session card wiring

  Change Log:
    - 2026-05-13 - v0.1.0:
      - Create live operator overview using useDashboardSchedule().
      - Show today's sessions, capacity summary, and quick actions.
    - 2026-05-13 - v0.1.1:
      - Polish overview layout to match approved Pro Dashboard mock style.
      - Remove noisy action links from schedule body.
    - 2026-05-14 - v0.1.2:
      - Wire Today’s Schedule rows to shared DashboardSessionCard presentation component.
*/

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, Waves } from "lucide-react";
import { useDashboardSchedule } from "../../../hooks/useDashboardSchedule";
import type { DashboardScheduleSession } from "../../../types/dashboardSchedule";
import DashboardSessionCard from "../components/DashboardSessionCard";

function todayYmd(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone || "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().split("T")[0];
  }

  return `${year}-${month}-${day}`;
}

function weekdayFromYmd(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export default function OverviewPage() {
  const { state } = useDashboardSchedule();
  const scheduleData = (state as any).data as any;
  const operatorTimezone = scheduleData?.operator?.timezone || "UTC";
  const today = todayYmd(operatorTimezone);

  const todaySessions = useMemo(() => {
    const sessions = Array.isArray(scheduleData?.sessions) ? scheduleData.sessions : [];
    return sessions
      .filter((session: DashboardScheduleSession) => session.session_date === today)
      .sort((a: DashboardScheduleSession, b: DashboardScheduleSession) =>
        (a.start_time || "").localeCompare(b.start_time || "")
      );
  }, [scheduleData, today]);

  const totals = useMemo(() => {
    return todaySessions.reduce(
      (acc: any, session: DashboardScheduleSession) => {
        acc.sessions += 1;
        acc.capacity += Number(session.capacity_total || 0);
        acc.consumed += Number(session.capacity_consumed || 0);
        acc.remaining += Number(session.capacity_remaining || 0);
        return acc;
      },
      { sessions: 0, capacity: 0, consumed: 0, remaining: 0 }
    );
  }, [todaySessions]);

  if (state.status === "loading") {
    return (
      <div className="aqx-overview-page">
        <div className="aqx-overview-schedule-card">Loading overview…</div>
      </div>
    );
  }

  if (state.status === "error" && !scheduleData) {
    return (
      <div className="aqx-overview-page">
        <div className="aqx-overview-schedule-card">Overview load failed.</div>
      </div>
    );
  }

  return (
    <div className="aqx-overview-page">
      <div className="aqx-overview-header">
        <h1>Overview</h1>
        <p>
          {weekdayFromYmd(today)} • {today} • Today’s operational snapshot.
        </p>
      </div>

      <div className="aqx-overview-metrics">
        <div className="aqx-overview-metric-card">
          <div className="aqx-overview-metric-top">
            <div className="aqx-overview-metric-label">Sessions today</div>
            <div className="aqx-overview-metric-icon">
              <Waves />
            </div>
          </div>
          <div className="aqx-overview-metric-value">{totals.sessions}</div>
          <div className="aqx-overview-metric-subtitle">Scheduled for today</div>
        </div>

        <div className="aqx-overview-metric-card">
          <div className="aqx-overview-metric-top">
            <div className="aqx-overview-metric-label">Divers / capacity</div>
            <div className="aqx-overview-metric-icon">
              <Users />
            </div>
          </div>
          <div className="aqx-overview-metric-value">
            {totals.consumed}/{totals.capacity}
          </div>
          <div className="aqx-overview-metric-subtitle">Confirmed + active holds</div>
        </div>

        <div className="aqx-overview-metric-card">
          <div className="aqx-overview-metric-top">
            <div className="aqx-overview-metric-label">Remaining seats</div>
            <div className="aqx-overview-metric-icon">
              <CalendarDays />
            </div>
          </div>
          <div className="aqx-overview-metric-value">{totals.remaining}</div>
          <div className="aqx-overview-metric-subtitle">Available today</div>
        </div>
      </div>

      <div className="aqx-overview-schedule-card">
        <div className="aqx-overview-schedule-header">
          <div>
            <div className="aqx-overview-schedule-title">Today’s Schedule</div>
            <div className="aqx-overview-schedule-help">
              Real sessions for the current operator.
            </div>
          </div>

          <Link className="aqx-overview-schedule-button" to="/dashboard/calendar">
            <CalendarDays />
            <span>View full calendar</span>
          </Link>
        </div>

        {todaySessions.length === 0 ? (
          <div className="aqx-overview-empty">
            No sessions scheduled for today. Open Schedule to create a session or generate from weekly templates.
          </div>
        ) : (
          <div className="aqx-overview-session-list">
            {todaySessions.map((session: DashboardScheduleSession) => (
              <DashboardSessionCard
                key={(session as any).unified_id || session.session_id}
                session={session}
                variant="overview"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}