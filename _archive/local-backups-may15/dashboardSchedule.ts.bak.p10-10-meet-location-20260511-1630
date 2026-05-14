/*
  File: dashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/types/dashboardSchedule.ts
  Description:
    TypeScript types for Dashboard Schedule endpoints.

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.1.0

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Initial creation
    - 2026-05-09 - v1.1.0:
      - Add unified inventory fields from dashboard-schedule-v1 projection.
*/

export type DashboardScheduleSession = {
  // Unified inventory fields
  id?: string;
  unified_id?: string;
  type?: "dive" | "course" | string;
  title?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  timezone?: string;
  session_status?: string;
  ops_status?: string;
  capacity_total?: number | null;
  capacity_consumed?: number | null;
  capacity_remaining?: number | null;
  price_from_minor?: number | null;
  currency?: string | null;
  inventory_pointer?: {
    session_id?: number | null;
    course_run_id?: number | null;
    activity_session_id?: number | null;
  } | null;
  metadata?: Record<string, any> | null;

  // Legacy-compatible dashboard fields
  session_id: string | null;
  course_run_id?: string | null;
  itinerary_id?: string | null;
  itinerary_title: string;
  itinerary_date: string;

  team_id?: string | null;
  team_name: string;

  dive_site_id?: string | number | null;
  site_name: string;

  session_date: string;
  start_time: string;
  meet_time: string | null;
  session_type: string;
  notes?: string | null;
  vessel_name?: string | null;
  vessel_max_capacity?: number | null;
  is_cancelable?: boolean;
};

export type DashboardScheduleResponse = {
  ok: true;
  status: "success";
  contract?: string;
  contract_version?: string;
  source_contract?: string;
  source_contract_version?: string;
  operator_id: string;
  operator?: {
    operator_id: string;
    slug: string;
    name: string;
    timezone: string;
    currency?: string | null;
    operator_default_capacity?: number | null;
  };
  week: { start: string; end: string };
  sessions: DashboardScheduleSession[];
};
