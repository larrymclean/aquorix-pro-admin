import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  Waves,
  Ship,
  BarChart2,
  DollarSign,
  Settings,
  PanelLeftClose,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/dashboard/schedule', label: 'Schedule', icon: Calendar },
  { to: '/dashboard/bookings', label: 'Bookings', icon: ClipboardList },
  { to: '/dashboard/team', label: 'Team', icon: Users },
  { to: '/dashboard/sites', label: 'Dive Sites', icon: Waves },
  { to: '/dashboard/fleet', label: 'Fleet', icon: Ship },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart2 },
  { to: '/dashboard/payments', label: 'Payments', icon: DollarSign },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <>
      <nav className="aqx-sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                [
                  'sidebar-item',
                  isActive ? 'sidebar-item--active' : '',
                ]
                  .join(' ')
                  .trim()
              }
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Settings */}
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            [
              'sidebar-item',
              isActive ? 'sidebar-item--active' : '',
            ]
              .join(' ')
              .trim()
          }
        >
          <Settings />
          <span>Settings</span>
        </NavLink>

        {/* Toggle under Settings */}
        <button
          type="button"
          id="aqx-sidebar-toggle"
          className="aqx-sidebar-toggle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
        >
          <PanelLeftClose />
        </button>
      </nav>

      <div className="aqx-sidebar-footer">
        <div className="aqx-sidebar-brand">
          <img
            src="/nautilus-icon.png"
            alt="AQUORIX icon"
            className="aqx-brand-icon"
          />
          <span>AQUORIX</span>
        </div>
        <div className="aqx-sidebar-tagline">Command the Depths ™</div>
        <div className="aqx-sidebar-version">Version: 1.0.0</div>
      </div>
    </>
  );
};

export default Sidebar;