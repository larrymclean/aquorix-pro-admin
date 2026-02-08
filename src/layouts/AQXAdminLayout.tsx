/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Admin layout shell for AQUORIX Admin routes.
               Phase C unified shell: ThemeProvider + TopNav + SidebarNavigation + <Outlet />.

  Author: Larry McLean + AI Team
  Created: 2025-07-07
  Version: 2.1.1

  Last Updated: 2026-02-08
  Status: MVP+ (Phase C locked)

  Dependencies:
  - react-router-dom Outlet
  - ThemeProvider (ui_mode-driven theme)
  - SidebarNavigation, TopNav
  - getMe (single boot call)

  Locked rules:
  - Layout fetches /api/v1/me once (via getMe)
  - Theme derived from me.ui_mode (NOT from UserContext tier)
  - Boot-gate chrome (no flicker)
  - Uses Phase C layout primitives (aqx-topnav/aqx-sidebar/aqx-main) to avoid CSS drift
  - NO legacy admin stylesheet imports (single styling source of truth)

  Change Log:
    - 2026-01-10 - v2.1.0 (Larry McLean + AI Team)
      - Theme selection moved to me.ui_mode (single authority)
      - Remove tier-driven theme mapping (BootUserProvider is session-only now)
      - Boot-gate chrome to prevent theme flicker
    - 2026-02-08 - v2.1.1 (Larry McLean + AI Team)
      - Fix: Use Phase C shell primitives so SidebarNavigation renders with correct height/background/contrast
      - Fix: Remove legacy AQXAdmin.css import to prevent competing layout rules
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import SidebarNavigation from '../components/SidebarNavigation';
import TopNav from '../components/TopNav';

import { ThemeProvider } from '../components/ThemeProvider';
import { getMe } from '../utils/api';

import type { MeResponse } from '../components/TopNav';
import type { UiMode, Permissions } from '../config/navigation';

const AQXAdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [me, setMe] = useState<MeResponse | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setMeLoading(true);
      try {
        const res = await getMe();
        if (!res.ok) throw new Error(`getMe HTTP ${res.status}`);
        const data = (await res.json()) as MeResponse;
        if (mounted) setMe(data);
      } catch (err) {
        console.error('[AQXAdminLayout] getMe failed:', err);
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

  const uiMode = useMemo(() => (me?.ui_mode ?? 'admin') as UiMode, [me]);
  const permissions = useMemo(() => (me?.permissions ?? {}) as Permissions, [me]);

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
              uiMode={uiMode}
              permissions={permissions}
              isCollapsed={isCollapsed}
              onToggle={() => setIsCollapsed((prev) => !prev)}
              loading={meLoading}
            />
          </aside>

          <div className="aqx-right-pane">
            <main className="aqx-main">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AQXAdminLayout;
