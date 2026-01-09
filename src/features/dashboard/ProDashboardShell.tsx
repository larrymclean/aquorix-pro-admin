/*
  ============================================================================
  AQUORIX Pro Dashboard Shell (Phase C Unified)
  ============================================================================
  File:        ProDashboardShell.tsx
  Path:        src/features/dashboard/ProDashboardShell.tsx
  Description: Pro Dashboard route shell. Provides shared TopNav + shared SidebarNavigation
               and renders nested dashboard routes via <Outlet />.

  Author:      Larry McLean + AI Team
  Created:     2025-??-??
  Version:     1.5.0

  Last Updated: 2026-01-08
  Status:      Phase C Active (unified shell wiring)

  Dependencies:
  - react-router-dom Outlet
  - src/utils/api getMe()
  - src/components/TopNav (canonical)
  - src/components/SidebarNavigation (Phase C dynamic)
  - /api/v1/me boot contract (ui_mode + permissions)

  Notes:
  - CRITICAL: Single boot call invariant.
    ProDashboardShell fetches /api/v1/me exactly once via getMe().
    TopNav and SidebarNavigation MUST NOT fetch /api/v1/me.
  - CRITICAL: Do not import legacy dashboard components:
    - src/features/dashboard/components/Sidebar.tsx
    - src/features/dashboard/components/TopNav.tsx

  Change Log (append-only):
    - 2026-01-08 - v1.5.0 (Larry McLean + AI Team)
      - Unify Pro shell to use shared TopNav + Phase C SidebarNavigation
      - Implement single boot call via getMe() in shell
      - Pass uiMode + permissions into SidebarNavigation
      - Preserve existing collapse behavior at shell level
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import TopNav from '../../components/TopNav';
import SidebarNavigation from '../../components/SidebarNavigation';

import { getMe } from '../../utils/api';

// Keep the type local to avoid coupling to UI components.
// (If you later create src/types/me.ts, move this there.)
type MeBoot = {
  ok: boolean;
  authenticated: boolean;
  ui_mode: 'admin' | 'pro' | 'affiliate';
  permissions: Record<string, boolean>;
};

type ProDashboardShellProps = {
  children?: React.ReactNode;
};

const ProDashboardShell: React.FC<ProDashboardShellProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [me, setMe] = useState<MeBoot | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setMeLoading(true);
      try {
        const data = (await getMe()) as MeBoot;
        if (mounted) setMe(data);
      } catch (err) {
        console.error('[ProDashboardShell] getMe failed:', err);
        if (mounted) setMe(null);
      } finally {
        if (mounted) setMeLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  const uiMode = useMemo(() => (me?.ui_mode ?? 'pro'), [me]);
  const permissions = useMemo(() => (me?.permissions ?? {}), [me]);

  return (
    <div className="aqx-pro-dashboard-theme aqx-theme-dive-locker">
      {/* TOP NAV – full width (canonical TopNav) */}
      <header className="aqx-topnav">
        {/* TopNav already supports overrides in your admin layout; we keep consistent */}
        <TopNav meOverride={me as any} loadingOverride={meLoading} />
      </header>

      {/* LAYOUT ROW: sidebar + main */}
      <div className="aqx-dashboard-root">
        {/* SIDEBAR (shell owns sizing/background; component owns internal nav styling) */}
        <aside
          className={`aqx-sidebar ${isCollapsed ? 'aqx-sidebar--collapsed' : ''}`}
          style={{ backgroundColor: 'var(--sidebar-bg)' }}
        >
          <SidebarNavigation
            uiMode={uiMode}
            permissions={permissions as any}
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed((prev) => !prev)}
            loading={meLoading}
          />
        </aside>

        {/* MAIN COLUMN */}
        <div className="aqx-right-pane">
          <main className="aqx-main">{children ? children : <Outlet />}</main>
        </div>
      </div>
    </div>
  );
};

export default ProDashboardShell;