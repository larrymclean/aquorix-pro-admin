/*
  File: SidebarNavigation.tsx
  Path: src/components/SidebarNavigation.tsx
  Description: Sidebar navigation for AQUORIX Admin Dashboard MVP. Only MVP routes. Now theme-aware via ThemeProvider.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-09
  Status: MVP, theme integration
  Dependencies: React, react-router-dom, ThemeProvider
  Notes: Now uses theme context for theme class.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Refactor for theme context integration.
    - 2025-07-07 to 2025-07-08, see previous logs for MVP and nav updates.
*/

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SidebarNavigation.css';
import { useTheme } from './ThemeProvider';

const navItems = [
  {
    label: 'Overview',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="16"/></svg>,
    to: '/admin/overview'
  },
  {
    label: 'User Management',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    to: '/admin/users'
  },
  {
    label: 'Profile',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a10 10 0 0 1 13 0"/></svg>,
    to: '/admin/profile'
  },
  {
    label: 'Calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    to: '/admin/calendar'
  },
  {
    label: 'System Health',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="10" rx="2"/>
        <polyline points="8 17 8 21 16 21 16 17"/>
        <polyline points="12 7 12 3"/>
        <polyline points="4 7 4 3"/>
        <polyline points="20 7 20 3"/>
        <polyline points="4 17 4 21"/>
        <polyline points="20 17 20 21"/>
      </svg>
    ),
    to: '/admin/system-health'
  },
  {
    label: 'Dive Center Mgmt',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="8" rx="2"/>
        <circle cx="7" cy="12" r="1.5"/>
        <circle cx="17" cy="12" r="1.5"/>
        <path d="M12 8v8"/>
      </svg>
    ),
    to: '/admin/dive-center'
  },
  {
    label: 'Project Status',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M7 12h10M7 16h7"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
      </svg>
    ),
    to: '/admin/project-status'
  },

  {
    label: 'Affiliate Management',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="10" rx="2"/>
        <path d="M8 11h8M8 15h8"/>
        <circle cx="7" cy="11" r="1.5"/>
        <circle cx="17" cy="15" r="1.5"/>
      </svg>
    ),
    to: '/admin/affiliates'
  },
  {
    label: 'Island Mode',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21c0-2.5-2-4.5-5-4.5s-5 2-5 4.5" />
        <path d="M12 17V3" />
        <path d="M12 3c-1.5 2-4.5 2-6 0" />
        <path d="M12 3c1.5 2 4.5 2 6 0" />
        <path d="M8 7c-1.5-1-4 0-4 2" />
        <path d="M16 7c1.5-1 4 0 4 2" />
        <circle cx="12" cy="21" r="1" />
      </svg>
    ),
    to: '/admin/island-mode'
  }
];

const SidebarNavigation: React.FC = () => {
  // --- Theme logic: use context for theme class ---
  const activeTheme = useTheme();
  const location = useLocation();

  return (
    <aside className={`sidebar ${activeTheme.cssClass}`}>
      <div className="sidebar__header">
        <img src="/aqx-square-naut-white-96x96.svg" alt="AQUORIX Logo" className="sidebar-logo" />
        <span className="sidebar-title">AQUORIX Admin</span>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className={location.pathname === item.to ? 'active' : ''}>
              <Link to={item.to}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNavigation;
