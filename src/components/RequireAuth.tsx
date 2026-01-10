/*
  File: RequireAuth.tsx
  Path: src/components/RequireAuth.tsx
  Description: Route gate only. Checks Supabase session and allows/denies access.
               MUST NOT call /api/v1/me (shell/layout owns /me).
  Author: Larry McLean + AI Team
  Version: 2.0.0
  Last Updated: 2026-01-10
  Status: Locked (Phase C)

  Locked rules:
  - NO /api/v1/me calls here.
  - No role/tier inference here.
  - If session missing -> redirect to /login.

  Change Log:
    - 2026-01-10 - v2.0.0 (Larry McLean + AI Team)
      - Simplify RequireAuth to gate-only
      - Remove /api/v1/me dependency to eliminate double-boot flicker
*/

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type RequireAuthProps = {
  children: React.ReactElement;
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[RequireAuth] Supabase session error:', error);
          if (!mounted) return;
          setIsAuthed(false);
          return;
        }

        const hasSession = Boolean(data.session?.access_token);
        if (!mounted) return;
        setIsAuthed(hasSession);
      } catch (err) {
        console.error('[RequireAuth] Session check failed:', err);
        if (!mounted) return;
        setIsAuthed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Checking session…</div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
