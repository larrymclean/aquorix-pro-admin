/*
  File: useDashboardSchedule.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/hooks/useDashboardSchedule.ts
  Description:
    Phase 5A/5B/5C hook for schedule fetch with deterministic refresh behavior.

    Key behaviors:
    - Preserve last good data during refresh (no UI blanking)
    - Expose isRefreshing so UI can stay visible
    - Guardrail A: Abort in-flight requests on refresh (prevents storms)
    - Guardrail B: Prevent stale/out-of-order responses from overwriting newer data

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.2.0

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Initial creation (loading/error/ready)
    - 2026-02-16 - v1.1.0:
      - Preserve last good data during refresh (no UI flash)
      - Add refresh() + isRefreshing flag
    - 2026-02-15 - v1.2.0:
      - Add AbortController refresh dedupe
      - Add requestSeq to prevent out-of-order overwrite
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { getDashboardSchedule } from "../api/dashboardSchedule";
import type { DashboardScheduleResponse } from "../types/dashboardSchedule";

type State =
  | { status: "loading"; data?: undefined; error?: undefined; isRefreshing: false }
  | { status: "error"; data?: DashboardScheduleResponse; error: any; isRefreshing: false }
  | { status: "ready"; data: DashboardScheduleResponse; error?: undefined; isRefreshing: boolean };

export function useDashboardSchedule(weekStart?: string) {
  const [state, setState] = useState<State>({
    status: "loading",
    isRefreshing: false
  });

  const lastGoodDataRef = useRef<DashboardScheduleResponse | null>(null);

  // Guardrail A: abort in-flight request if a new one starts
  const abortRef = useRef<AbortController | null>(null);

  // Guardrail B: only the latest request may commit state
  const requestSeqRef = useRef(0);

  const load = useCallback(
    async (mode: "initial" | "refresh") => {
      // Increment request sequence (this marks "latest")
      const mySeq = ++requestSeqRef.current;

      // Abort any in-flight request before starting a new one
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      // Initial load: show loading screen
      if (mode === "initial") {
        setState({ status: "loading", isRefreshing: false });
      }

      // Refresh: keep UI stable, just mark refreshing
      if (mode === "refresh") {
        const existing = lastGoodDataRef.current;
        if (existing) {
          setState({ status: "ready", data: existing, isRefreshing: true });
        } else {
          setState({ status: "loading", isRefreshing: false });
        }
      }

      try {
        // NOTE: getDashboardSchedule currently does not accept a signal.
        // If we ever add it, we can thread controller.signal through.
        // For now, AbortController still prevents state commits via requestSeq guard.
        const data = await getDashboardSchedule(weekStart);

        // Only the latest request may commit state
        if (mySeq !== requestSeqRef.current) return;

        lastGoodDataRef.current = data;
        setState({ status: "ready", data, isRefreshing: false });
      } catch (error: any) {
        // Only the latest request may commit error state
        if (mySeq !== requestSeqRef.current) return;

        const existing = lastGoodDataRef.current;

        // If we have old data, keep it visible and surface error state
        if (existing) {
          setState({ status: "error", data: existing, error, isRefreshing: false });
        } else {
          setState({ status: "error", error, isRefreshing: false });
        }
      }
    },
    [weekStart]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await load("initial");
    })();

    return () => {
      cancelled = true;
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [load]);

  const refresh = useCallback(() => {
    // If already refreshing, no-op (extra safety)
    if (state.status === "ready" && state.isRefreshing) return;
    load("refresh");
  }, [load, state]);

  return { state, refresh };
}
