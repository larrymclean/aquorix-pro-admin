/*
  File: dashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/types/dashboardSchedule.ts
  Description:
    TypeScript types for Phase 5 dashboard schedule endpoints.

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.0.0

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Initial creation
*/

export type DashboardScheduleSession = {
  session_id: string;
  itinerary_id?: string;
  itinerary_title: string;
  itinerary_date: string;

  team_id?: string;
  team_name: string;

  dive_site_id?: string;
  site_name: string;

  session_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  meet_time: string;    // HH:MM
  session_type: string; // shore | boat | etc.
  notes?: string | null;
};

export type DashboardScheduleResponse = {
  ok: true;
  status: "success";
  operator_id: string;
  week: { start: string; end: string };
  sessions: DashboardScheduleSession[];
};
