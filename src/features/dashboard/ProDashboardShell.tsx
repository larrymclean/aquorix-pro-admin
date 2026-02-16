/*
  ============================================================================
  AQUORIX Pro Dashboard Shell (Phase C Unified + Canonical Theme)
  ============================================================================
  File:        ProDashboardShell.tsx
  Path:        src/features/dashboard/ProDashboardShell.tsx
  Description: Dashboard route shell. Fetches /api/v1/me once via getMe(),
               applies canonical theme via ThemeProvider, and renders chrome.

               Phase 6 addition:
               - If user has multiple operator affiliations AND no active_operator_id,
                 show OperatorSelectorModal and require selection before proceeding.

  Author:      Larry McLean + AI Team
  Version:     1.6.2
  Last Updated: 2026-02-16
  Status:      Phase C Locked --> Phase 6 Viking Build

  Locked rules:
  - Single boot call invariant: Shell fetches /api/v1/me exactly once on boot.
  - TopNav and SidebarNavigation MUST NOT fetch /api/v1/me.
  - Theme class attachment point is ThemeProvider only (theme-*).
  - Boot-gate chrome: do not render TopNav/Sidebar until me is loaded (no flicker).

  Change Log (append-only):
    - 2026-01-10 - v1.6.0 (Larry McLean + AI Team)
      - Apply canonical theme based on me.ui_mode (admin/pro/affiliate)
      - Remove legacy hardcoded theme class
      - Boot-gate chrome to prevent theme flicker
    - 2026-02-16 - v1.6.1 (Larry McLean + AI Team)
      - Phase 6: initial operator selector wiring attempt (imports + scaffolding)
    - 2026-02-16 - v1.6.2 (Larry McLean + AI Team)
      - Phase 6: FIX React structure (render modal inside return)
      - Phase 6: Add /me-driven gate (multi-affiliation + missing active_operator_id)
      - Phase 6: On select -> POST /api/v1/operator/active -> refetch /me -> setMe()
*/

import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import TopNav from "../../components/TopNav";
import SidebarNavigation from "../../components/SidebarNavigation";

import { ThemeProvider } from "../../components/ThemeProvider";
import { getMe, setActiveOperator } from "../../utils/api";

import OperatorSelectorModal, {
  OperatorAffiliation
} from "./components/OperatorSelectorModal";

type OperatorContext = {
  affiliation_count?: number;
  active_operator_id?: string | null;
  affiliations?: OperatorAffiliation[];
};

type MeBoot = {
  ok: boolean;
  authenticated?: boolean;
  routing_hint?: string;
  ui_mode?: "admin" | "pro" | "affiliate";
  permissions?: Record<string, boolean>;

  // Phase 6:
  operator_context?: OperatorContext;

  // (optional extras that may exist; keeping flexible)
  user?: Record<string, unknown>;
  profile?: Record<string, unknown>;
  onboarding?: Record<string, unknown>;
};

type ProDashboardShellProps = {
  children?: React.ReactNode;
};

const ProDashboardShell: React.FC<ProDashboardShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [me, setMe] = useState<MeBoot | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  // Phase 6 selector UI state
  const [showOperatorSelector, setShowOperatorSelector] = useState(false);
  const [operatorSelectError, setOperatorSelectError] = useState<string | null>(null);
  const [operatorSelectSubmitting, setOperatorSelectSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // Boot: fetch /api/v1/me exactly once
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function boot() {
      setMeLoading(true);
      try {
        const res = await getMe();
        if (!res.ok) throw new Error(`getMe HTTP ${res.status}`);
        const data = (await res.json()) as MeBoot;
        if (mounted) setMe(data);
      } catch (err) {
        console.error("[ProDashboardShell] getMe failed:", err);
        if (mounted) setMe(null);
      } finally {
        if (mounted) setMeLoading(false);
      }
    }

    void boot();

    return () => {
      mounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Phase 6: /me-driven gate
  // If multi-affiliation AND no active_operator_id -> force selection modal
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (meLoading) return;
    if (!me) return;

    const oc = me.operator_context;
    if (!oc) {
      setShowOperatorSelector(false);
      return;
    }

    const affiliationCount = Number(oc.affiliation_count || 0);
    const activeOp = oc.active_operator_id;

    if (affiliationCount > 1 && (!activeOp || String(activeOp).trim() === "")) {
      setShowOperatorSelector(true);
    } else {
      setShowOperatorSelector(false);
    }
  }, [meLoading, me]);

  // ---------------------------------------------------------------------------
  // Phase 6: Selection handler
  // On click: POST /api/v1/operator/active, then refetch /me and setMe()
  // ---------------------------------------------------------------------------
  async function handleSelectOperator(operatorId: string) {
    setOperatorSelectError(null);
    setOperatorSelectSubmitting(true);

    try {
      const res = await setActiveOperator(operatorId);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `setActiveOperator HTTP ${res.status}${txt ? ` - ${txt}` : ""}`
        );
      }

      // Refetch /me after user action (allowed; not a second "boot" fetch)
      const meRes = await getMe();
      if (!meRes.ok) throw new Error(`getMe(after select) HTTP ${meRes.status}`);
      const freshMe = (await meRes.json()) as MeBoot;
      setMe(freshMe);

      setShowOperatorSelector(false);
    } catch (e: any) {
      setOperatorSelectError(e?.message || "Failed to set active operator");
    } finally {
      setOperatorSelectSubmitting(false);
    }
  }

  // Derived UI state
  const uiMode = useMemo(() => (me?.ui_mode ?? "pro"), [me]);
  const permissions = useMemo(() => (me?.permissions ?? {}), [me]);

  // Canonical theme mapping (LOCKED)
  const themeKey = useMemo(() => {
    if (uiMode === "admin") return "blue-steel";
    if (uiMode === "affiliate") return "bamboo-safari";
    return "dive-locker";
  }, [uiMode]);

  // Boot-gate chrome (prevents flicker)
  if (meLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Booting AQUORIX…</div>
      </div>
    );
  }

  const affiliations =
    (me?.operator_context?.affiliations || []) as OperatorAffiliation[];

  return (
    <ThemeProvider themeKey={themeKey as any}>
      {/* Phase 6: Operator selection modal (rendered INSIDE return, correctly) */}
      <OperatorSelectorModal
        isOpen={showOperatorSelector}
        affiliations={affiliations}
        activeOperatorId={me?.operator_context?.active_operator_id || null}
        isSubmitting={operatorSelectSubmitting}
        error={operatorSelectError}
        onSelectOperator={handleSelectOperator}
      />

      <div className="aqx-pro-dashboard-theme">
        {/* TOP NAV – full width */}
        <header className="aqx-topnav">
          <TopNav meOverride={me as any} loadingOverride={meLoading} />
        </header>

        {/* LAYOUT ROW: sidebar + main */}
        <div className="aqx-dashboard-root">
          <aside
            className={`aqx-sidebar ${isCollapsed ? "aqx-sidebar--collapsed" : ""}`}
            style={{ backgroundColor: "var(--sidebar-bg)" }}
          >
            <SidebarNavigation
              uiMode={uiMode as any}
              permissions={permissions as any}
              isCollapsed={isCollapsed}
              onToggle={() => setIsCollapsed((prev) => !prev)}
              loading={meLoading}
            />
          </aside>

          <div className="aqx-right-pane">
            <main className="aqx-main">{children ? children : <Outlet />}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProDashboardShell;
