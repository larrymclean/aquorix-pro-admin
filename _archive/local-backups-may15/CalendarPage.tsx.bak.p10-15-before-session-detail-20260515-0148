/*
  File: CalendarPage.tsx
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/features/dashboard/pages/CalendarPage.tsx
  Description:
    P10.13 Calendar V-Now MVP.
    Lightweight FullCalendar view of real operator sessions from the existing
    dashboard schedule API.

  Author: Larry McLean + ChatGPT
  Created: 2026-05-14
  Version: 0.1.0
  Status: ACTIVE - P10.13 Calendar V-Now MVP

  Change Log:
    - 2026-05-14 - v0.1.0:
      - Add dedicated /dashboard/calendar page.
      - Render real schedule sessions in FullCalendar month/week/day views.
      - Keep Viking scope simple: real events, click-through placeholder,
        operator-local timezone where available, responsive, stable.
*/

import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDashboardSchedule } from "../../../hooks/useDashboardSchedule";
import type { DashboardScheduleSession } from "../../../types/dashboardSchedule";

function eventTitle(session: DashboardScheduleSession) {
  const site = session.site_name || session.title || "Session";
  const type = session.session_type ? session.session_type.toUpperCase() : "DIVE";
  return `${site} • ${type}`;
}

function eventStart(session: DashboardScheduleSession) {
  if (session.starts_at) return session.starts_at;
  if (session.session_date && session.start_time) {
    return `${session.session_date}T${session.start_time}`;
  }
  return session.session_date;
}

export default function CalendarPage() {
  const { state } = useDashboardSchedule();
  const scheduleData = (state as any).data as any;

  const events = useMemo(() => {
    const sessions = Array.isArray(scheduleData?.sessions) ? scheduleData.sessions : [];

    return sessions
      .filter((session: DashboardScheduleSession) => Boolean(session.session_date))
      .map((session: DashboardScheduleSession) => ({
        id: String((session as any).unified_id || session.session_id || session.id),
        title: eventTitle(session),
        start: eventStart(session),
        extendedProps: {
          session,
        },
      }));
  }, [scheduleData]);

  if (state.status === "loading") {
    return (
      <div className="aqx-overview-page">
        <div className="aqx-overview-schedule-card">Loading calendar…</div>
      </div>
    );
  }

  if (state.status === "error" && !scheduleData) {
    return (
      <div className="aqx-overview-page">
        <div className="aqx-overview-schedule-card">Calendar load failed.</div>
      </div>
    );
  }

  return (
    <div className="aqx-overview-page">
      <div className="aqx-overview-header">
        <h1>Calendar</h1>
        <p>
          Operator calendar for real scheduled sessions. Calendar V-Now is intentionally simple.
        </p>
      </div>

      <div className="aqx-overview-schedule-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
          eventClick={(info) => {
            const session = info.event.extendedProps.session as DashboardScheduleSession;
            window.alert(
              `${session.site_name || "Session"}\n${session.session_date || ""} ${session.start_time || ""}\nSession details/edit panel coming next.`
            );
          }}
        />
      </div>
    </div>
  );
}