/*
  File: SidebarNavigation.tsx
  Path: src/components/SidebarNavigation.tsx
  Description: Phase C sidebar navigation driven by uiMode + permissions.
               IMPORTANT: Sidebar MUST NOT apply theme-* classes.
               ThemeProvider is the ONLY theme attachment point.

  Author: Larry McLean + AI Team
  Created: 2025-07-07
  Version: 2.2.4
  Last Updated: 2026-01-10
  Status: Active (Phase C.1 parity pass)

  Locked rules:
  - Sidebar MUST NOT fetch /api/v1/me.
  - Sidebar MUST NOT append theme-* classes.
  - Shell owns sidebar container background (.aqx-sidebar uses --sidebar-bg).

  Change Log:
    - 2026-01-10 - v2.2.4 (Larry McLean + AI Team)
      - Remove theme cssClass injection from component root (ThemeProvider only)
*/

import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './SidebarNavigation.css';

import {
  Home,
  Users,
  Activity,
  FileText,
  Calendar,
  ClipboardList,
  User,
  DollarSign,
  PanelLeftClose,
  PanelLeftOpen,
  CircleDot,
} from 'lucide-react';

import type { UiMode, Permissions, NavItem } from '../config/navigation';
import { resolveVisibleNav } from '../config/navigation';

export type SidebarNavigationProps = {
  uiMode: UiMode;
  permissions: Permissions;

  // Controlled collapse (parent owns state)
  isCollapsed?: boolean;
  onToggle?: () => void;

  // Optional UI state
  loading?: boolean;
};

type ResolvedItem = NavItem & { isDisabled?: boolean; reason?: string };

function isActivePath(currentPath: string, itemPath: string) {
  // MVP “feels right” behavior: highlight nested pages under a section
  return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  overview: Home,
  users: Users,
  health: Activity,
  audit: FileText,
  calendar: Calendar,
  bookings: ClipboardList,
  profile: User,
  commissions: DollarSign,
};

function getIcon(iconKey?: string) {
  const key = (iconKey || '').toLowerCase();
  return ICON_MAP[key] || CircleDot;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  uiMode,
  permissions,
  isCollapsed = false,
  onToggle,
  loading = false,
}) => {
  const location = useLocation();

  const groups = useMemo(() => {
    try {
      return resolveVisibleNav(uiMode, permissions);
    } catch (err) {
      console.error('[SidebarNavigation] resolveVisibleNav failed:', err);
      return [];
    }
  }, [uiMode, permissions]);

  // Phase C.1: Render flat list (no group headings)
  const flatItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  return (
    <div className={['aqx-sidenav', isCollapsed ? 'aqx-sidenav--collapsed' : ''].join(' ').trim()}>
      <nav className="aqx-sidenav__nav" aria-label="Sidebar navigation">
        {loading ? (
          <div className="aqx-sidenav__loading">{!isCollapsed ? 'Loading…' : '…'}</div>
        ) : (
          <ul className="aqx-sidenav__list">
            {flatItems.map((item: ResolvedItem) => {
              const active = isActivePath(location.pathname, item.path);
              const Icon = getIcon(item.iconKey);

              if (item.isDisabled) {
                return (
                  <li
                    key={item.path}
                    className={[
                      'aqx-sidenav__item',
                      active ? 'is-active' : '',
                      'is-disabled',
                    ].join(' ').trim()}
                  >
                    <div
                      className="aqx-sidenav__link is-disabled"
                      title={item.reason || 'Unavailable'}
                      aria-disabled="true"
                    >
                      <span className="aqx-sidenav__icon" aria-hidden="true">
                        <Icon className="aqx-sidenav__svg" aria-hidden="true" />
                      </span>

                      {!isCollapsed && (
                        <span className="aqx-sidenav__label">
                          {item.label}
                          <span className="aqx-sidenav__badge">
                            {item.reason || 'Unavailable'}
                          </span>
                        </span>
                      )}
                    </div>
                  </li>
                );
              }

              return (
                <li
                  key={item.path}
                  className={['aqx-sidenav__item', active ? 'is-active' : ''].join(' ').trim()}
                >
                  <Link to={item.path} className="aqx-sidenav__link">
                    <span className="aqx-sidenav__icon" aria-hidden="true">
                      <Icon className="aqx-sidenav__svg" aria-hidden="true" />
                    </span>
                    {!isCollapsed && <span className="aqx-sidenav__label">{item.label}</span>}
                  </Link>
                </li>
              );
            })}

            {/* MVP parity: Toggle lives in nav under Settings */}
            {onToggle ? (
              <li className="aqx-sidenav__item aqx-sidenav__toggle-item">
                <button
                  type="button"
                  className="aqx-sidebar-toggle"
                  onClick={onToggle}
                  aria-label="Toggle sidebar"
                  title="Toggle sidebar"
                >
                  {isCollapsed ? (
                    <PanelLeftOpen aria-hidden="true" />
                  ) : (
                    <PanelLeftClose aria-hidden="true" />
                  )}
                </button>
              </li>
            ) : null}
          </ul>
        )}
      </nav>

      <div className="aqx-sidenav__brand-footer">
        <div className="aqx-sidenav__brand">
          <img
            src="/nautilus-icon.png"
            alt="AQUORIX icon"
            className="aqx-brand-icon"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          {!isCollapsed && <span>AQUORIX</span>}
        </div>

        {!isCollapsed && (
          <>
            <div className="aqx-sidenav__tagline">Command the Depths ™</div>
            <div className="aqx-sidenav__version">Version: 1.0.0</div>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarNavigation;
