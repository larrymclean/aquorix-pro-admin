/*
  File: index.tsx
  Path: CascadeProjects/aquorix-pro-admin/src/index.tsx
  Description: App boot + user context bootstrap (NO ROUTING)
  Author: Larry McLean + AI Team
  Version: 1.0.3
  Last Updated: 2026-01-06

  Critical rules:
  - BootUserProvider MUST NOT navigate()
  - BootUserProvider MUST infer admin via tier_level/internal_admin/ui_mode (NOT routing_hint)

    Change Log:
    - 2025-11-27 - v1.0.1 (Author(s)): larry mcLean + ai team
      - Update
      
    - 2026-01-05 - v1.0.2(Author(s)): larry Mclean + ai team
      - Render a simple “Booting…” screen while page loads
    
    - 2026-01-06 - v1.0.3 - larry Mclean + ai team
      - Fix routing hint - Tier 0 comes back as routing_hint: "dashboard"
*/

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/AQXAdmin.css';
import './styles/TopNav.css';
import './styles/aqx-unified-style-guide.css';
import './styles/AuthOnboarding.css';
import './styles/dashboard.css';

import App from './App';
import { supabase } from './lib/supabaseClient';
import { UserProvider, type UserContextValue } from './components/UserContext';

const ME_URL = 'http://localhost:3001/api/v1/me';

type MeResponse =
  | {
      ok: true;
      authenticated: true;
      identity?: { supabase_user_id?: string; email?: string };
      aquorix_user?: { user_id?: string; tier?: string; tier_level?: number };
      operator?: { affiliation?: string | null } | null;
      internal_admin?: { admin_role?: string | null; admin_level?: number | null } | null;
      ui_mode?: string | null;
      routing_hint?: string | null;
    }
  | {
      ok: false;
      error?: string;
      message?: string;
      routing_hint?: string;
    };

function BootUserProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<UserContextValue | null>(null);

  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      try {
        // Safe fallback context so hooks never crash
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
          // Not logged in. Provide fallback context only.
          if (!isMounted) return;
          setValue(fallback);
          return;
        }

        // Pull authoritative context from backend
        const res = await fetch(ME_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          credentials: 'omit',
        });

        if (!res.ok) {
          console.error('[BootUserProvider] /me non-OK:', res.status);
          if (!isMounted) return;
          setValue({ ...fallback, user: session.user });
          return;
        }

        const meData = (await res.json()) as MeResponse;

        const tierLevelFromMe =
          (meData as any)?.aquorix_user?.tier_level ??
          (meData as any)?.tier_level ??
          null;

        const internalAdmin = (meData as any)?.internal_admin ?? null;
        const uiMode = (meData as any)?.ui_mode ?? null;

        const isAdmin =
          Number(tierLevelFromMe) === 0 ||
          Boolean(internalAdmin) ||
          String(uiMode).toLowerCase() === 'admin';

        // Role semantics:
        // - Admin: internal_admin.admin_role (fallback "admin")
        // - Others: operator.affiliation (fallback "")
        const adminRoleRaw = (meData as any)?.internal_admin?.admin_role ?? null;
        const affiliation = (meData as any)?.operator?.affiliation ?? null;

        const role = isAdmin
          ? (adminRoleRaw ? String(adminRoleRaw) : 'admin')
          : (affiliation ? String(affiliation) : '');

        // Tier: prefer tier_level if present; else infer admin vs non-admin
        const tier =
          typeof tierLevelFromMe === 'number'
            ? tierLevelFromMe
            : (isAdmin ? 0 : 1);

        if (!isMounted) return;
        setValue({ role, tier, user: session.user });
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