import React from 'react';
import { NavLink } from 'react-router-dom';

type Tier = 1 | 2 | 3;

interface SidebarProps {
  tier: Tier;
}

interface NavItem {
  path: string;
  label: string;
  tiers: Tier[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Overview', tiers: [1, 2, 3] },
  { path: '/dashboard/schedule', label: 'Schedule', tiers: [1, 2, 3] },
  { path: '/dashboard/settings', label: 'Settings', tiers: [1, 2, 3] },
];

export const Sidebar: React.FC<SidebarProps> = ({ tier }) => {
  const items = NAV_ITEMS.filter((item) => item.tiers.includes(tier));

  return (
    <aside className="aqx-sidebar">
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--aqx-slate-light)', letterSpacing: '0.12em' }}>
          Aquorix
        </div>
        <div style={{ fontWeight: 600, marginTop: 4 }}>Pro Dashboard</div>
      </div>
      <nav style={{ padding: '8px 0' }}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              'sidebar-item ' + (isActive ? 'sidebar-item--active' : '')
            }
            style={{
              display: 'block',
              padding: '8px 20px',
              textDecoration: 'none',
              color: 'var(--aqx-slate)',
              fontSize: 14,
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};