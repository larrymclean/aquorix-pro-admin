/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Main layout for AQUORIX Admin Dashboard. Sidebar, top nav, and content wrapper.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-07
  Status: MVP, production-ready
  Dependencies: React, SidebarNavigation, TopNav, AdminContent
  Notes: Minimal, update as layout evolves.
  Change Log:
    - 2025-07-07, AQUORIX Engineering: Initial MVP layout.
*/

import React from 'react';
import SidebarNavigation from '../components/SidebarNavigation';
import TopNav from '../components/TopNav';
import AdminContent from '../components/AdminContent';
import '../styles/AQXAdmin.css';
import '../styles/TopNav.css';

/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Main layout for AQUORIX Admin Dashboard. Sidebar, top nav, and content wrapper. Now theme-aware via ThemeProvider.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-09
  Status: MVP, theme integration
  Dependencies: React, ThemeProvider, SidebarNavigation, TopNav, AdminContent
  Notes: Now wraps children in ThemeProvider for theme context.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Wrap in ThemeProvider for theme context (marina).
    - 2025-07-07, AQUORIX Engineering: Initial MVP layout.
*/

import { ThemeProvider } from '../components/ThemeProvider';
import { useUser } from '../components/UserContext';
import { getThemeByTier } from '../theme.config';

/*
  File: AQXAdminLayout.tsx
  Path: src/layouts/AQXAdminLayout.tsx
  Description: Main layout for AQUORIX Admin Dashboard. Sidebar, top nav, and content wrapper. Now theme-aware via ThemeProvider and dynamic user tier.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-09
  Status: MVP, dynamic theme integration
  Dependencies: React, ThemeProvider, UserContext, SidebarNavigation, TopNav, AdminContent
  Notes: Dynamically selects theme based on user tier. Requires UserProvider upstream.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Dynamic theme selection via user tier.
    - 2025-07-09, AQUORIX Engineering: Wrap in ThemeProvider for theme context (static).
    - 2025-07-07, AQUORIX Engineering: Initial MVP layout.
*/

const AQXAdminLayout: React.FC = () => {
  const { tier } = useUser();
  const themeKey = getThemeByTier(tier).name === 'Bamboo Safari' ? 'bamboo' : 'marina'; // Defensive: ensure correct key
  return (
    <ThemeProvider themeKey={themeKey}>
      <div className="aqx-admin-layout">
        <SidebarNavigation />
        <div className="content-wrapper">
          <TopNav />
          <AdminContent />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AQXAdminLayout;
