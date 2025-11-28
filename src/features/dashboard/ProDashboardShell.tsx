import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';

type Tier = 1 | 2 | 3;

interface ProDashboardShellProps {
  tier: Tier;
  operatorName: string;
  children: React.ReactNode;
}

export const ProDashboardShell: React.FC<ProDashboardShellProps> = ({
  tier,
  operatorName,
  children,
}) => {
  const themeClass = 'aqx-pro-dashboard-theme aqx-theme-dive-locker';

  return (
    <div className={themeClass}>
      <div className="aqx-dashboard-root">
        <Sidebar tier={tier} />
        <div className="aqx-right-pane">
          <TopNav operatorName={operatorName} />
          <main className="aqx-main">{children}</main>
        </div>
      </div>
    </div>
  );
};