/*
  File: useDashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/hooks/useDashboardSchedule.ts
  Description:
    Minimal hook for Phase 5A schedule fetch + deterministic error handling.

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.0.0

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Initial creation
*/

import { useEffect, useState } from "react";
import { getDashboardSchedule } from "../api/dashboardSchedule";
import type { DashboardScheduleResponse } from "../types/dashboardSchedule";

type State =
  | { status: "loading" }
  | { status: "error"; error: any }
  | { status: "ready"; data: DashboardScheduleResponse };

export function useDashboardSchedule(weekStart?: string) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: "loading" });
      try {
        const data = await getDashboardSchedule(weekStart);
        if (!cancelled) setState({ status: "ready", data });
      } catch (error) {
        if (!cancelled) setState({ status: "error", error });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [weekStart]);

  return state;
}
