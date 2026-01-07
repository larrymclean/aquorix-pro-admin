/*
 * ============================================================================
 * File:        useOnboardingResolve.ts
 * Version:     1.1.1
 * Path:        src/hooks/useOnboardingResolve.ts
 * Project:     AQUORIX Pro Dashboard
 * ============================================================================
 * Description:
 *   React hook that resolves post-auth routing using the backend as the
 *   single source of truth. This hook calls:
 *
 *     GET {API_BASE_URL}/api/v1/me   (via fetchMe)
 *
 *   and routes the user based on:
 *     - me.ok
 *     - me.routing_hint ("dashboard" | "onboarding")
 *
 *   IMPORTANT:
 *   - We do NOT call /api/users/by-supabase-id anymore.
 *   - We do NOT try to infer onboarding completion client-side.
 *   - We do NOT decode tokens here. We trust /api/v1/me.
 *
 * Author:      AQUORIX Engineering
 * Created:     2025-09-13
 * Updated:     2026-01-05
 *
 * Change Log (append-only):
 * --------------------------------------------------------------------------
 * v1.0.0  2025-09-13  AQUORIX Engineering
 *   - Initial version (legacy resolver using /api/users/by-supabase-id)
 *
 * v1.1.0  2025-12-24  Larry McLean
 *   - Replace legacy resolver with single-source-of-truth /api/v1/me
 *   - Route strictly by routing_hint from backend
 *   - Remove all /by-supabase-id usage to prevent routing drift
 * 
 * v1.1.1 2026-01-05  Larry McLean
 *  - Fix src/hooks/useOnboardingResolve.ts (FULL-FILE REPLACEMENT)
 * ============================================================================
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface SupabaseUser {
  id: string;
  email: string;
}

/**
 * Hook return shape
 */
type UseOnboardingResolveResult = {
  isResolved: boolean;
  error: string | null;
};

/**
 * useOnboardingResolve
 * - Input: supabaseUser (from Supabase session/user)
 * - Output: { isResolved, error }
 *
 * Routing rules (deterministic):
 *  - If no supabase user => do nothing (caller handles /login or anonymous)
 *  - If /me returns 401 or NO_SESSION => go /login
 *  - If /me returns ok:true + routing_hint:"dashboard" => go /dashboard
 *  - Else => go /onboarding
 */
export function useOnboardingResolve(supabaseUser: SupabaseUser | null): UseOnboardingResolveResult {
  const navigate = useNavigate();

  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: nothing to resolve if no auth user
    if (!supabaseUser?.id) return;

    // Guard: do not re-run once resolved (prevents loops)
    if (isResolved) return;

    const run = async () => {
      try {
        console.log("[useOnboardingResolve] Resolving route for:", supabaseUser.email);

        // Get token from Supabase session (no decoding here)
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (!token) {
          console.warn("[useOnboardingResolve] NO_SESSION (no access token)");
          setIsResolved(true);
          navigate("/login");
          return;
        }

        const resp = await fetch("/api/v1/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const status = resp.status;
        const data = await resp.json().catch(() => null);

        // Debug-friendly logs (safe; does not print full tokens)
        console.log("[useOnboardingResolve] /me HTTP status:", status);
        console.log("[useOnboardingResolve] /me payload:", data);

        // 401 (or status=0 from fetchMe error) => treat as not logged in
        if (status === 401 || status === 0) {
          setIsResolved(true);
          navigate("/login");
          return;
        }

        // If backend is not OK, safest default is onboarding (keeps user moving)
        if (!data?.ok) {
          setIsResolved(true);
          navigate("/onboarding");
          return;
        }

        // Single source of truth: routing_hint (DIR: include Tier 0 admin)
        if (data?.routing_hint === "admin") {
          setIsResolved(true);
          navigate("/admin", { replace: true });
          return;
        }

        if (data?.routing_hint === "dashboard") {
          setIsResolved(true);
          navigate("/dashboard", { replace: true });
          return;
        }

        if (data?.routing_hint === "onboarding") {
          setIsResolved(true);
          navigate("/onboarding", { replace: true });
          return;
        }

        // Fallbacks: if backend didn't provide a known routing_hint
        if (data?.onboarding?.is_complete === true) {
          setIsResolved(true);
          navigate("/dashboard", { replace: true });
          return;
        }

        // Default: onboarding
        setIsResolved(true);
        navigate("/onboarding", { replace: true });


      } catch (err: any) {
        console.error("[useOnboardingResolve] Fatal resolver error:", err?.message || err);
        setError(err?.message || "Resolver failed");
        setIsResolved(true);

        // Fail-safe: keep user moving
        navigate("/onboarding");
      }
    };

    run();
  }, [supabaseUser?.id, supabaseUser?.email, navigate, isResolved]);

  return { isResolved, error };
}