/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Admin layout shell for AQUORIX Admin routes. Sidebar + TopNav + routed content via <Outlet />.

  Author: Larry McLean + AI Team
  Created: 2025-07-07
  Version: 2.0.0

  Last Updated: 2026-01-06
  Status: MVP+ (correct routing architecture)

  Dependencies:
  - react-router-dom Outlet
  - ThemeProvider + UserContext (tier-driven theme)
  - SidebarNavigation, TopNav

  Notes:
  - CRITICAL FIX: This layout MUST NOT render legacy AdminContent directly.
  - Routed pages now render via <Outlet /> (e.g., /admin, /admin/system-health)

  Change Log:
    - 2026-01-06 - v2.0.0 (Author(s)): Larry McLean + AI Team
      - Replace legacy <AdminContent /> rendering with <Outlet />
      - Stabilize imports (remove duplicates)
      - Preserve tier-based theme selection
*/

import React from 'react';
import { Outlet } from 'react-router-dom';

import SidebarNavigation from '../components/SidebarNavigation';
import TopNav from '../components/TopNav';

import { ThemeProvider } from '../components/ThemeProvider';
import { useUser } from '../components/UserContext';
import { getThemeByTier } from '../theme.config';

import '../styles/AQXAdmin.css';
import '../styles/TopNav.css';

const AQXAdminLayout: React.FC = () => {
  const { tier } = useUser();

  // Keep your existing defensive mapping (Tier 0 should not accidentally get affiliate themes)
  const themeName = getThemeByTier(tier).name;
  const themeKey = themeName === 'Bamboo Safari' ? 'bamboo' : 'marina';

  return (
    <ThemeProvider themeKey={themeKey}>
      <div className="aqx-admin-layout">
        <SidebarNavigation />
        <div className="content-wrapper">
          <TopNav />
          {/* Routed admin pages render here */}
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AQXAdminLayout;