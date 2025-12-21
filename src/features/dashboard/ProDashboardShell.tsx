/**
 * ============================================================================
 * AQUORIX Pro Dashboard Shell
 * ============================================================================
 * File: src/features/dashboard/ProDashboardShell.tsx
 * Purpose:
 *   - Provides the Pro Dashboard layout chrome (TopNav + Sidebar + Main pane)
 *   - Acts as a route shell for nested dashboard pages via <Outlet />
 * Version: 1.4.0
 * Status: MVP Phase A (Scheduler Read Integration)
 * Notes:
 *   - Keeps Dive Locker theme wrapper intact
 *   - Child routes render inside <main> via React Router <Outlet />
 * ============================================================================
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';

const ProDashboardShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="aqx-pro-dashboard-theme aqx-theme-dive-locker">
      {/* TOP NAV – full width */}
      <header className="aqx-topnav">
        <TopNav />
      </header>

      {/* LAYOUT ROW: sidebar + main */}
      <div className="aqx-dashboard-root">
        {/* SIDEBAR */}
        <aside
          className={`aqx-sidebar ${isCollapsed ? 'aqx-sidebar--collapsed' : ''}`}
          style={{ backgroundColor: 'var(--sidebar-bg)' }}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(prev => !prev)}
          />
        </aside>

        {/* MAIN COLUMN */}
        <div className="aqx-right-pane">
          <main className="aqx-main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProDashboardShell;