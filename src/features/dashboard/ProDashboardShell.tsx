import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import ProDashboardMock from './ProDashboardMock';

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
            <ProDashboardMock />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProDashboardShell;