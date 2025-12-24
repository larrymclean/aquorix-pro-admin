/*
 * ============================================================================
 * File:        useOnboardingResolve.ts
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
 * ============================================================================
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../utils/fetchMe";

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

        const { status, data, error: fetchError } = await fetchMe();

        // Debug-friendly logs (safe; does not print full tokens)
        console.log("[useOnboardingResolve] /me HTTP status:", status);
        console.log("[useOnboardingResolve] /me payload:", data);

        if (fetchError) {
          // This is typically NO_SESSION or a session retrieval problem.
          console.warn("[useOnboardingResolve] fetchMe error:", fetchError);
        }

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

        // Single source of truth: routing_hint
        if (data.routing_hint === "dashboard") {
          setIsResolved(true);
          navigate("/dashboard");
          return;
        }

        // Default: onboarding
        setIsResolved(true);
        navigate("/onboarding");
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