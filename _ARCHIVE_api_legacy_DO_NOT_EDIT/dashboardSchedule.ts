/*
  File: dashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/api/dashboardSchedule.ts
  Description:
    API calls for Phase 5 dashboard schedule endpoints.
    Uses Supabase session access_token as Authorization: Bearer <token>.

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.0.0

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Initial creation
*/

import { fetchWithAuth } from "./fetchWithAuth";
import type { DashboardScheduleResponse } from "../types/dashboardSchedule";
import { supabase } from "../lib/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);

  const token = data?.session?.access_token;
  if (!token) throw new Error("Not authenticated (no session access_token).");

  return token;
}

/**
 * Phase 5A: Read-only schedule.
 * NOTE: We intentionally do NOT require week_start yet.
 * We rely on backend default week behavior to avoid timezone churn.
 */
export async function getDashboardSchedule(weekStart?: string) {
  const qs = weekStart ? `?week_start=${encodeURIComponent(weekStart)}` : "";
  const url = `${API_BASE_URL}/api/v1/dashboard/schedule${qs}`;

  return fetchWithAuth<DashboardScheduleResponse>(
    url,
    { method: "GET" },
    getAccessToken
  );
}
