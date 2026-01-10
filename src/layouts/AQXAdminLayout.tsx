/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Admin layout shell for AQUORIX Admin routes. Sidebar + TopNav + routed content via <Outlet />.

  Author: Larry McLean + AI Team
  Created: 2025-07-07
  Version: 2.1.0

  Last Updated: 2026-01-10
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

  Change Log:
    - 2026-01-10 - v2.1.0 (Larry McLean + AI Team)
      - Theme selection moved to me.ui_mode (single authority)
      - Remove tier-driven theme mapping (BootUserProvider is session-only now)
      - Boot-gate chrome to prevent theme flicker
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import SidebarNavigation from '../components/SidebarNavigation';
import TopNav from '../components/TopNav';

import { ThemeProvider } from '../components/ThemeProvider';
import { getMe } from '../utils/api';

import type { MeResponse } from '../components/TopNav';
import type { UiMode, Permissions } from '../config/navigation';

import '../styles/AQXAdmin.css';

const AQXAdminLayout: React.FC = () => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      setMeLoading(true);
      try {
        const data = (await getMe()) as MeResponse;
        if (mounted) setMe(data);
      } catch (err) {
        console.error('[AQXAdminLayout] getMe failed:', err);
        if (mounted) setMe(null);
      } finally {
        if (mounted) setMeLoading(false);
      }
    }

    void loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  const uiMode = useMemo(() => (me?.ui_mode ?? 'admin') as UiMode, [me]);
  const permissions = useMemo(() => (me?.permissions ?? {}) as Permissions, [me]);

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
      <div className="aqx-admin-layout">
        <SidebarNavigation
          uiMode={uiMode}
          permissions={permissions}
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((prev) => !prev)}
          loading={meLoading}
        />

        <div className="content-wrapper">
          <TopNav meOverride={me} loadingOverride={meLoading} />
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AQXAdminLayout;
