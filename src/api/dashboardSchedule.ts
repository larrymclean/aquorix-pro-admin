/*
  File: dashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/api/dashboardSchedule.ts
  Description:
    Phase 5A + 5B API client for operator dashboard schedule.
    - Injects Supabase Bearer token
    - Supports read + create + cancel
    - Deterministic error normalization (403/409)

  Author: AQUORIX Team
  Created: 2026-02-15
  Version: 1.1.0

  Change Log:
    - 2026-02-16 - v1.1.0:
      - Added createDashboardSession()
      - Added cancelDashboardSession()
*/

import { supabase } from "../lib/supabaseClient";

const DASHBOARD_BASE = "http://localhost:3001/api/v1/dashboard";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error("Not authenticated (no Supabase session token)");
  return token;
}

function mapBackendStatusToHttp(status: any): number | undefined {
  if (status === 403 || status === 409) return status;
  if (status === "forbidden") return 403;
  if (status === "conflict") return 409;
  return undefined;
}

export async function getDashboardSchedule(weekStart?: string) {
  const token = await getAccessToken();

  const url = new URL(`${DASHBOARD_BASE}/schedule`);
  if (weekStart && weekStart.trim().length > 0) {
    url.searchParams.set("week_start", weekStart.trim());
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.ok === false) {
    const err: any = new Error(json?.message || "Schedule fetch failed");
    err.status =
      mapBackendStatusToHttp(json?.status) ??
      res.status ??
      500;
    err.raw = json;
    throw err;
  }

  return json;
}

/* ================================
   PHASE 5B — CREATE SESSION
================================ */

export async function createDashboardSession(payload: {
  itinerary_id: number;
  team_id: number;
  dive_site_id: number;
  dive_datetime: string;
  meet_time?: string;
  notes?: string;
  session_type?: string;
  vessel_id?: number;
}) {
  const token = await getAccessToken();

  const res = await fetch(`${DASHBOARD_BASE}/schedule/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.message || "Create session failed");
  }

  return json;
}

/* ================================
   PHASE 5B — CANCEL SESSION
================================ */

export async function cancelDashboardSession(session_id: number) {
  const token = await getAccessToken();

  const res = await fetch(
    `${DASHBOARD_BASE}/schedule/sessions/${session_id}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.message || "Cancel session failed");
  }

  return json;
}
