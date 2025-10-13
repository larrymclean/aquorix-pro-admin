/*
File: TestProtoSessionTile.tsx
Path: src/components/onboarding/TestProtoSessionTile.tsx
Description: AQUORIX onboarding utility tile. Displays current Supabase session, user, and onboarding state for test/prototype/debug purposes. Mirrors SystemHealth session info for onboarding QA.
Author: Cascade AI
Created: 2025-07-14
Last Updated: 2025-07-14
Status: Dev-only, non-prod, QA utility
Dependencies: React, Supabase client, theme.tokens.ts
Notes: Remove or hide in production. Update fields as needed for onboarding state QA.
Change Log:
- 2025-07-14 (Cascade): Initial scaffold for onboarding session/test data tile.
*/

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import styles from './Step1Identity.module.css'; // Reuse for tile layout

interface UserSessionInfo {
  email?: string;
  user_id?: string;
  role?: string;
  tier?: string;
  session?: any;
  user?: any;
  app_metadata?: any;
  user_metadata?: any;
  jwt_claims?: any;
  onboarding_flags?: any;
  role_source?: string;
  session_expiry?: number | string;
  current_path?: string;
}

const TestProtoSessionTile: React.FC = () => {
  const [sessionInfo, setSessionInfo] = useState<UserSessionInfo>({});

  useEffect(() => {
    let mounted = true;
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      // Example: derive role/tier/flags from metadata or claims if present
      const role = user?.app_metadata?.role || user?.user_metadata?.role;
      const tier = user?.user_metadata?.tier;
      const jwt_claims = user?.app_metadata?.claims || null;
      // Add any onboarding flags/logic as needed
      const onboarding_flags = user?.user_metadata?.onboarding_flags;
      const role_source = user?.app_metadata?.role ? 'app_metadata' : (user?.user_metadata?.role ? 'user_metadata' : undefined);
      const session_expiry = session?.expires_at;
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
          current_path: window.location.pathname
        });
      }
    };
    fetchSession();
    return () => { mounted = false; };
  }, []);

  return (
    <div className={styles.tile} style={{ marginTop: 32, background: 'var(--color-tile-bg, #f4faff)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginBottom: 12 }}>Test and Prototype Data</h3>
      <div style={{ fontSize: 14, color: '#444', marginBottom: 8 }}>
        <strong>Session Info (dev only):</strong>
      </div>
      <pre style={{ fontSize: 12, background: '#eef6fa', borderRadius: 6, padding: 12, overflowX: 'auto' }}>
        {JSON.stringify(sessionInfo, null, 2)}
      </pre>
      <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
        This tile is for onboarding QA/dev only. Remove or hide before production.
      </div>
    </div>
  );
};

export default TestProtoSessionTile;
