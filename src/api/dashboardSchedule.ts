/*
  File: dashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/api/dashboardSchedule.ts
  Description:
    Phase 5A API client for operator dashboard schedule.
    - Injects Supabase Bearer token
    - Supports optional week_start (omits param if undefined)
    - Normalizes backend { ok:false } responses into thrown errors
    - Maps known backend statuses to deterministic numeric status codes for UI banners

  Author: AQUORIX Team
  Created: 2026-02-15
  Version: 1.0.1

  Change Log:
    - 2026-02-15 - v1.0.1:
      - Omit week_start when undefined (prevents week_start=undefined)
      - Attach raw response to error.raw and normalize status codes (403/409)
*/

import { supabase } from "../lib/supabaseClient";

const DASHBOARD_BASE = "http://localhost:3001/api/v1/dashboard";

function mapBackendStatusToHttp(status: any): number | undefined {
  // Backend sometimes returns { status: "conflict" } with ok:false.
  // Normalize for deterministic UI banners.
  if (status === 403 || status === 409) return status;
  if (status === "forbidden") return 403;
  if (status === "conflict") return 409;
  return undefined;
}

export async function getDashboardSchedule(weekStart?: string) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  if (!token) {
    const err: any = new Error("Not authenticated (no Supabase session token)");
    err.status = 401;
    err.raw = null;
    throw err;
  }

  const url = new URL(`${DASHBOARD_BASE}/schedule`);
  if (weekStart && typeof weekStart === "string" && weekStart.trim().length > 0) {
    url.searchParams.set("week_start", weekStart.trim());
  }
  // else: omit week_start entirely so backend default logic works

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  let json: any = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  // Treat HTTP failure OR ok:false as an error
  if (!res.ok || json?.ok === false) {
    const msg =
      json?.message ||
      json?.error ||
      (res.ok ? "Backend returned ok:false" : res.statusText) ||
      "Schedule fetch failed";

    const err: any = new Error(msg);
    err.raw = json;

    // Prefer explicit HTTP code if present; otherwise map backend status string
    err.status =
      mapBackendStatusToHttp(json?.status) ??
      (typeof res.status === "number" && res.status ? res.status : undefined) ??
      500;

    throw err;
  }

  return json;
}
