/*
  File: index.tsx
  Path: CascadeProjects/aquorix-pro-admin/src/index.tsx
  Description: App boot + session bootstrap (NO /api/v1/me calls)
  Author: Larry McLean + AI Team
  Version: 1.1.0
  Last Updated: 2026-01-10

  Critical rules (LOCKED):
  - BootUserProvider MUST NOT call /api/v1/me (session-only)
  - Shell/Layout is the single /api/v1/me authority
  - Theme is applied by ThemeProvider in shell/layout (theme-* classes)

  Change Log:
    - 2026-01-10 - v1.1.0 (Larry McLean + AI Team)
      - Remove /api/v1/me boot fetch from index boot layer
      - Keep Supabase session bootstrap only (prevents double-boot + flicker)
*/

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/aqx-unified-style-guide.css';
import './styles/AuthOnboarding.css';
import './styles/dashboard.css';
import './styles/themes.css';

import App from './App';
import { supabase } from './lib/supabaseClient';
import { UserProvider, type UserContextValue } from './components/UserContext';

function BootUserProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<UserContextValue | null>(null);

  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      try {
        // SAFE FALLBACK: do not infer tier/role here (no /me calls).
        // Shell/layout will fetch /api/v1/me and apply correct theme + permissions.
        const fallback: UserContextValue = { role: '', tier: 0 };

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[BootUserProvider] Supabase session error:', error);
          if (!isMounted) return;
          setValue(fallback);
          return;
        }

        const session = data.session;
        if (!session?.access_token) {
          // Not logged in: provide fallback context only.
          if (!isMounted) return;
          setValue(fallback);
          return;
        }

        // Logged in: provide session user only (still no /me calls here).
        if (!isMounted) return;
        setValue({ ...fallback, user: session.user });
      } catch (err) {
        console.error('[BootUserProvider] Boot failed:', err);
        if (!isMounted) return;
        setValue({ role: '', tier: 0 });
      }
    };

    void boot();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!value) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Booting AQUORIX…</div>
      </div>
    );
  }

  return <UserProvider value={value}>{children}</UserProvider>;
}

const rootEl = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <BootUserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BootUserProvider>
  </React.StrictMode>
);
