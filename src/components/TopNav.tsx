/*
  File: TopNav.tsx
  Path: src/components/TopNav.tsx
  Description: Top navigation bar for AQUORIX Admin Dashboard. Branding, search, settings, profile.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-08
  Status: MVP, production-ready
  Dependencies: React
  Notes: Minimal, upgrade with interactive menus post-MVP.
  Change Log:
    - 2025-07-07, AQUORIX Engineering: Initial MVP header and nav.
    - 2025-07-07, AQUORIX Engineering: Implement minimal profile dropdown with logout functionality.
    - 2025-07-08, AQUORIX Engineering: Remove all debug banners and debug text for production cleanup.
    - 2025-07-08, AQUORIX Engineering: Remove light cream background from search icon for clean look.
    - 2025-07-08, AQUORIX Engineering: Replace Settings text with gear icon in nav.
    - 2025-07-08, AQUORIX Engineering: Update gear icon to classic cog/gear SVG for clarity.
    - 2025-07-08, AQUORIX Engineering: Add notifications bell icon to top nav.
    - 2025-07-08, AQUORIX Engineering: Make notifications bell interactive with dropdown and badge.
    - 2025-07-08, AQUORIX Engineering: Add minimal settings dropdown (Theme Toggle, Help Center) to settings icon. Remove Change Password and Log Out as they are covered under profile.
    - 2025-07-08, AQUORIX Engineering: Align settings dropdown styling with profile and notifications dropdowns for consistency.
*/

import React, { useState, useEffect } from 'react';
import SidebarNavigation from './SidebarNavigation';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/TopNav.css';
import { useTheme } from './ThemeProvider';
import { ThemeKey, THEMES } from '../theme.config';

/*
  File: TopNav.tsx
  Path: src/components/TopNav.tsx
  Description: Top navigation bar for AQUORIX Admin Dashboard. Branding, search, settings, profile, hamburger (mobile).
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-07
  Status: MVP, production-ready
  Dependencies: React
  Notes: Hamburger menu for mobile MVP.
  Change Log:
    - 2025-07-07, AQUORIX Engineering: Add hamburger menu for mobile sidebar toggle.
*/

/*
  File: TopNav.tsx
  Path: src/components/TopNav.tsx
  Description: Top navigation bar for AQUORIX Admin Dashboard. Branding, search, settings, profile, hamburger (mobile), theme-aware.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-09
  Status: MVP, theme integration
  Dependencies: React, ThemeProvider, theme.config.ts
  Notes: Now supports theme context/prop for dynamic theming.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Refactor for theme context/prop integration.
    - 2025-07-07 to 2025-07-08, see previous logs for MVP and profile fixes.
*/

/*
  File: TopNav.tsx
  Path: src/components/TopNav.tsx
  Description: Top navigation bar for AQUORIX Admin Dashboard. Branding, search, settings, profile, hamburger (mobile), theme-aware.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-09
  Status: MVP, theme integration
  Dependencies: React, ThemeProvider, theme.config.ts
  Notes: Now requires a ThemeProvider parent for theme context. All theme config is sourced from context.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Refactor to require ThemeProvider (no fallback prop). Fix hooks lint.
    - 2025-07-09, AQUORIX Engineering: Refactor for theme context/prop integration.
    - 2025-07-07 to 2025-07-08, see previous logs for MVP and profile fixes.
*/

const TopNav: React.FC = () => {
  // --- Theme logic: always use context (ThemeProvider required) ---
  const activeTheme = useTheme();

  // --- Settings dropdown state ---
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  // --- Theme toggle state (local only) ---
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'Issue', message: 'User escalation required', time: '2 min ago', unread: true },
    { id: 2, type: 'Mail', message: 'New message from client', time: '10 min ago', unread: false },
    { id: 3, type: 'Activity', message: 'Business activity alert', time: '1 hr ago', unread: true },
  ]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userInitials, setUserInitials] = useState<string>('');
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setProfileLoading(true);
    supabase.auth.getUser().then(async ({ data, error }: { data: { user: any } | null, error: any }) => {
      if (error || !data?.user) {
        setUserEmail('');
        setUserName('');
        setUserInitials('');
        setProfileLoading(false);
        return;
      }
      const user = data.user;
      let name = '';
      let email = user.email || '';
      // Try to get name from user_metadata or fallback
      if (user.user_metadata && user.user_metadata.full_name) {
        name = user.user_metadata.full_name;
      } else if (user.user_metadata && user.user_metadata.name) {
        name = user.user_metadata.name;
      } else {
        // Optionally fetch from user_profile table if used
        const { data: profile, error: profileError } = await supabase
          .from('user_profile')
          .select('full_name')
          .eq('user_id', user.id)
          .single();
        if (!profileError && profile && profile.full_name) {
          name = profile.full_name;
        }
      }
      // Compute initials
      let initials = '';
      if (name) {
        initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
      } else if (email) {
        initials = email[0].toUpperCase();
      }
      if (mounted) {
        setUserEmail(email);
        setUserName(name || email);
        setUserInitials(initials);
        setProfileLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleHamburgerClick = () => {
    setDrawerOpen((prev) => !prev);
  };

  // --- Apply theme CSS class to top-level nav for visual verification ---
  return (
    <nav className={`topnav ${activeTheme.cssClass}`}>


      <div className="nav-left">

        {/* Hamburger menu for mobile */}
        <button
          className="hamburger"
          aria-label="Open sidebar menu"
          onClick={handleHamburgerClick}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h2 className="nav-title">AQUORIX Pro</h2>
      </div>
      <div className="nav-right">
        <div className="nav-item" aria-label="Search">
          {/* Magnifying glass SVG icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0072e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div className="nav-item nav-settings" aria-label="Settings" style={{ position: 'relative' }}>
          {/* Gear SVG icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0072e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', cursor: 'pointer' }} aria-hidden="true" focusable="false" onClick={() => setSettingsOpen((v) => !v)}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.65l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.03 7.03 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65a7.03 7.03 0 0 0-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.65l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.65l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.38 1.08.72 1.69.98l.38 2.65A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .5-.42l.38-2.65c.61-.26 1.17-.6 1.69-.98l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.65l-2.11-1.65z" />
          </svg>
          {settingsOpen && (
            <div
              className="settings-dropdown"
              role="menu"
              tabIndex={-1}
              aria-label="Settings menu"
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                borderRadius: 8,
                minWidth: 220,
                zIndex: 1000,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') setSettingsOpen(false);
              }}
            >
              <button
                className="settings-dropdown-item"
                role="menuitem"
                tabIndex={0}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  borderRadius: 0,
                  fontSize: 15,
                  color: '#222',
                  cursor: 'pointer',
                  outline: 'none',
                  borderBottom: '1px solid #f4f4f4',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f6fafd')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
                onClick={() => { setTheme(theme === 'light' ? 'dark' : 'light'); setSettingsOpen(false); }}
              >
                {theme === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
              </button>
              <button
                className="settings-dropdown-item"
                role="menuitem"
                tabIndex={0}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  borderRadius: 0,
                  fontSize: 15,
                  color: '#222',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f6fafd')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
                onClick={() => { setSettingsOpen(false); window.open('https://aquorix.com/support', '_blank'); }}
              >
                Help Center
              </button>
            </div>
          )}
        </div>
        <div className="nav-item nav-profile" style={{position: 'relative'}}>
          <svg className="profile-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={() => setProfileOpen(v => !v)} style={{cursor: 'pointer'}}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {profileOpen && (
            <div
              className="profile-dropdown"
              role="menu"
              tabIndex={-1}
              aria-label="Profile menu"
              style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', borderRadius: 8, minWidth: 220, zIndex: 1000, padding: 0 }}
              onKeyDown={e => {
                if (e.key === 'Escape') setProfileOpen(false);
              }}
            >
              <div className="profile-dropdown-header">
                {profileLoading ? (
                  <div className="profile-avatar" aria-label="Loading">...</div>
                ) : (
                  <>
                    <span className="profile-avatar" aria-label="User initials">{userInitials}</span>
                    <div className="profile-user-info">
                      {(userName && userName !== userEmail) && (
                        <span className="profile-user-name">{userName}</span>
                      )}
                      <span className="profile-user-email">{userEmail}</span>
                    </div>
                  </>
                )}
              </div>
              <button
                className="profile-dropdown-item"
                style={{width:'100%',padding:'10px 18px',border:'none',background:'none',textAlign:'left',cursor:'pointer',fontWeight:500}}
                onClick={async () => {
                  await supabase.auth.signOut();
                  setProfileOpen(false);
                  navigate('/login');
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Sidebar drawer for mobile */}
      {drawerOpen && (
        <div className="mobile-sidebar-drawer" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            {/* SidebarNavigation rendered for mobile drawer */}
            <SidebarNavigation />
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;