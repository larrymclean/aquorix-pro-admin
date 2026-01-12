/*
  ============================================================================
  AQUORIX Pro Dashboard Shell (Phase C Unified + Canonical Theme)
  ============================================================================
  File:        ProDashboardShell.tsx
  Path:        src/features/dashboard/ProDashboardShell.tsx
  Description: Dashboard route shell. Fetches /api/v1/me once via getMe(),
               applies canonical theme via ThemeProvider, and renders chrome.

  Author:      Larry McLean + AI Team
  Version:     1.6.0
  Last Updated: 2026-01-10
  Status:      Phase C Locked

  Locked rules:
  - Single boot call invariant: Shell fetches /api/v1/me exactly once.
  - TopNav and SidebarNavigation MUST NOT fetch /api/v1/me.
  - Theme class attachment point is ThemeProvider only (theme-*).
  - Boot-gate chrome: do not render TopNav/Sidebar until me is loaded (no flicker).

  Change Log (append-only):
    - 2026-01-10 - v1.6.0 (Larry McLean + AI Team)
      - Apply canonical theme based on me.ui_mode (admin/pro/affiliate)
      - Remove legacy hardcoded theme class
      - Boot-gate chrome to prevent theme flicker
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import TopNav from '../../components/TopNav';
import SidebarNavigation from '../../components/SidebarNavigation';

import { ThemeProvider } from '../../components/ThemeProvider';
import { getMe } from '../../utils/api';

type MeBoot = {
  ok: boolean;
  authenticated: boolean;
  ui_mode?: 'admin' | 'pro' | 'affiliate';
  permissions?: Record<string, boolean>;
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
        const res = await getMe();
        if (!res.ok) throw new Error(`getMe HTTP ${res.status}`);
        const data = (await res.json()) as MeBoot;
        if (mounted) setMe(data);

      } catch (err) {
        console.error('[ProDashboardShell] getMe failed:', err);
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

  const uiMode = useMemo(() => (me?.ui_mode ?? 'pro'), [me]);
  const permissions = useMemo(() => (me?.permissions ?? {}), [me]);

  // Canonical theme mapping (LOCKED)
  const themeKey = useMemo(() => {
    if (uiMode === 'admin') return 'blue-steel';
    if (uiMode === 'affiliate') return 'bamboo-safari';
    return 'dive-locker';
  }, [uiMode]);

  // Boot-gate chrome (prevents flicker)
  if (meLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Booting AQUORIX…</div>
      </div>
    );
  }

  return (
    <ThemeProvider themeKey={themeKey as any}>
      <div className="aqx-pro-dashboard-theme">
        {/* TOP NAV – full width */}
        <header className="aqx-topnav">
          <TopNav meOverride={me as any} loadingOverride={meLoading} />
        </header>

        {/* LAYOUT ROW: sidebar + main */}
        <div className="aqx-dashboard-root">
          <aside
            className={`aqx-sidebar ${isCollapsed ? 'aqx-sidebar--collapsed' : ''}`}
            style={{ backgroundColor: 'var(--sidebar-bg)' }}
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
