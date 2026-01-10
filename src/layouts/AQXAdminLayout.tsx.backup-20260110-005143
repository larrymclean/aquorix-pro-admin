/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Admin layout shell for AQUORIX Admin routes. Sidebar + TopNav + routed content via <Outlet />.

  Author: Larry McLean + AI Team
  Created: 2025-07-07
  Version: 2.0.2

  Last Updated: 2026-01-08
  Status: MVP+ (Phase C wiring)

  Dependencies:
  - react-router-dom Outlet
  - ThemeProvider + UserContext (tier-driven theme)
  - SidebarNavigation, TopNav
  - getMe (single boot call)

  Notes:
  - CRITICAL FIX: Layout MUST NOT render legacy AdminContent directly.
  - Phase C: Layout fetches /api/v1/me once and passes ui_mode + permissions down.

  Change Log:
    - 2026-01-06 - v2.0.0 (Author(s)): Larry McLean + AI Team
      - Replace legacy <AdminContent /> rendering with <Outlet />
      - Stabilize imports (remove duplicates)
      - Preserve tier-based theme selection
    - 2026-01-07 - v2.0.1 (Author(s)): Larry McLean + AI Team
      - Add imports; implement getMe() fetch-once pattern for TopNav
    - 2026-01-08 - v2.0.2 (Author(s)): Larry McLean + AI Team
      - Phase C: pass uiMode + permissions into SidebarNavigation (dynamic nav)
*/

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import SidebarNavigation from '../components/SidebarNavigation';
import TopNav from '../components/TopNav';

import { ThemeProvider } from '../components/ThemeProvider';
import { useUser } from '../components/UserContext';
import { getThemeByTier } from '../theme.config';

import '../styles/AQXAdmin.css';

import { getMe } from '../utils/api';
import type { MeResponse } from '../components/TopNav';
import type { UiMode, Permissions } from '../config/navigation';

const AQXAdminLayout: React.FC = () => {
  const { tier } = useUser();

  const themeName = getThemeByTier(tier).name;
  const themeKey = themeName === 'Bamboo Safari' ? 'bamboo' : 'marina';

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

    loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  const uiMode = (me?.ui_mode ?? 'admin') as UiMode;
  const permissions = (me?.permissions ?? {}) as Permissions;

  return (
    <ThemeProvider themeKey={themeKey}>
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