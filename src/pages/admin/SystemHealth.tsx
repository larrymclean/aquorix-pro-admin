/*
  File: SystemHealth.tsx
  Path: src/pages/admin/SystemHealth.tsx
  Description: System Health & Debug Log page for AQUORIX Admin Dashboard. Renders live system health log entries from SystemHealthLogContext for QA/testing.
  Author: AQUORIX Engineering
  Created: 2025-07-08
  Last Updated: 2025-07-12
  Status: MVP, live debug log integration
  Dependencies: React, SystemHealthLogContext
  Notes: Use logSystemHealth from context to write log entries from anywhere in the app. QA/dev only.
  Change Log:
    - 2025-07-12, AQUORIX Eng: Integrate SystemHealthLogContext, render live logs for QA/debugging.
    - 2025-07-08, AQUORIX Eng: Initial placeholder page.
*/

import React, { useEffect, useState } from 'react';
import { useSystemHealthLog } from '../../context/SystemHealthLogContext';
import { supabase } from '../../lib/supabaseClient';
import { getUserRole } from '../../utils/getUserRole';
import { useLocation } from 'react-router-dom';

interface UserSessionInfo {
  email?: string;
  user_id?: string;
  role?: string;
  tier?: number;
  session?: any;
  user?: any;
  app_metadata?: any;
  user_metadata?: any;
  jwt_claims?: any;
  onboarding_flags?: any;
  role_source?: string;
  session_expiry?: string;
  current_path?: string;
}

// (removed duplicate import)

const SystemHealth: React.FC = () => {
  const { log, clearLog } = useSystemHealthLog();
  const [sessionInfo, setSessionInfo] = useState<UserSessionInfo>({});
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        let role = '';
        let tier = 0;
        let role_source = 'unknown';
        let onboarding_flags = undefined;
        // 1. Try JWT/app_metadata
        let jwtRole = (user as any)?.app_metadata?.role || (user as any)?.user_metadata?.role;
        if (typeof jwtRole === 'string') {
          role = jwtRole.trim().toLowerCase();
          tier = 1; // fallback, will be set by getUserRole
          role_source = 'jwt/app_metadata';
        }
        // 2. Try user_profile table (fetch onboarding flags if present)
        try {
          if (user) {
            const { data, error } = await supabase
              .from('user_profile')
              .select('role, tier, has_onboarded, onboarding_step, flags')
              .eq('user_id', user.id)
              .single();
            if (data) {
              onboarding_flags = {
                has_onboarded: data.has_onboarded,
                onboarding_step: data.onboarding_step,
                flags: data.flags
              };
              if (typeof data.role === 'string') {
                role = data.role.trim().toLowerCase();
                tier = data.tier ?? 1;
                role_source = 'user_profile';
              }
            }
            if (error) {/* swallow for now */}
          }
        } catch {}
        // 3. Fallback: email heuristic
        if (!role && user?.email?.endsWith('@aquorix.com')) {
          role = 'admin';
          tier = 0;
          role_source = 'email fallback';
        }
        // 4. Session expiry
        let session_expiry = session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : '-';
        // 5. JWT claims (decode if possible)
        let jwt_claims = undefined;
        if (session?.access_token) {
          try {
            const base64Url = session.access_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            jwt_claims = JSON.parse(atob(base64));
          } catch {}
        }
        if (mounted) {
          setSessionInfo({
            email: user?.email,
            user_id: user?.id,
            role,
            tier,
            session,
            user,
            app_metadata: user?.app_metadata,
            user_metadata: user?.user_metadata,
            jwt_claims,
            onboarding_flags,
            role_source,
            session_expiry,
            current_path: location.pathname
          });
        }
      } catch (err) {
        if (mounted) setSessionInfo({});
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>System Health & Debug Log</h1>
      <div style={{ background: '#f7f7fa', border: '1px solid #e0e0e0', borderRadius: 6, padding: 16, marginBottom: 24 }}>
        <strong>Session/User Context</strong>
        <div style={{ fontSize: 15, margin: '8px 0' }}>
          <div><b>Email:</b> {sessionInfo.email || <span style={{ color: '#b71c1c' }}>Not logged in</span>}</div>
          <div><b>User ID:</b> {sessionInfo.user_id || '-'}</div>
          <div><b>Role:</b> {sessionInfo.role || '-'}</div>
          <div><b>Tier:</b> {typeof sessionInfo.tier === 'number' ? sessionInfo.tier : '-'}</div>
          <div><b>Role Source:</b> {sessionInfo.role_source || '-'}</div>
          <div><b>Session Expiry:</b> {sessionInfo.session_expiry || '-'}</div>
          <div><b>Current Path:</b> {sessionInfo.current_path || '-'}</div>
          {sessionInfo.onboarding_flags && (
            <div style={{ marginTop: 6 }}>
              <b>Onboarding/Feature Flags:</b>
              <pre style={{ fontSize: 12, background: '#f3f3f7', border: '1px solid #eee', borderRadius: 4, padding: 8, marginTop: 2, maxWidth: 600, overflowX: 'auto' }}>{JSON.stringify(sessionInfo.onboarding_flags, null, 2)}</pre>
            </div>
          )}
        </div>
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', color: '#1976d2' }}>app_metadata / user_metadata</summary>
          <pre style={{ fontSize: 12, background: '#f9f9fa', border: '1px solid #eee', borderRadius: 4, padding: 8, marginTop: 6, maxHeight: 200, overflowX: 'auto' }}>{JSON.stringify({ app_metadata: sessionInfo.app_metadata, user_metadata: sessionInfo.user_metadata }, null, 2)}</pre>
        </details>
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', color: '#1976d2' }}>Decoded JWT Claims</summary>
          <pre style={{ fontSize: 12, background: '#f9f9fa', border: '1px solid #eee', borderRadius: 4, padding: 8, marginTop: 6, maxHeight: 200, overflowX: 'auto' }}>{JSON.stringify(sessionInfo.jwt_claims, null, 2)}</pre>
        </details>
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', color: '#1976d2' }}>Raw Supabase Session/User Data</summary>
          <pre style={{ fontSize: 12, background: '#f9f9fa', border: '1px solid #eee', borderRadius: 4, padding: 8, marginTop: 6, maxHeight: 300, overflowX: 'auto' }}>
            {JSON.stringify({ session: sessionInfo.session, user: sessionInfo.user }, null, 2)}
          </pre>
        </details>
      </div>
      <button onClick={clearLog} style={{ marginBottom: 16, background: '#eee', border: '1px solid #ccc', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>Clear Log</button>
      {log.length === 0 ? (
        <p style={{ color: '#888' }}>No log entries yet. System health log will appear here as you interact with the app.</p>
      ) : (
        <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Time</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Level</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Message</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
                <td style={{ padding: 8 }}>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: 8, color: entry.level === 'error' ? '#e53935' : entry.level === 'warn' ? '#fbc02d' : '#1976d2' }}>{entry.level}</td>
                <td style={{ padding: 8 }}>{entry.message}</td>
                <td style={{ padding: 8, fontFamily: 'monospace', fontSize: 12 }}>{entry.data ? JSON.stringify(entry.data, null, 2) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SystemHealth;
