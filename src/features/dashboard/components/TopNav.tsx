/**
 * ============================================================================
 * AQUORIX API - 
 * ============================================================================
 * File:        src/features/dashboard/components
 * Purpose:     Top nav...
 * Version:     v1.0.?
 * Created:     ?
 * Updated:     2025-12-29
 * Author:      Larry McLean
 * Project:     AQUORIX™ API Project
 *
 * Description:
 * - Top nav
 *
 * Change Log:
 * -----------
 * v1.?.? - 12-29-25 - Locked branding logic...
 *
 * Notes:
 * - Do NOT alter existing changelog entries
 * - Always append new changes with version bump
 * - Follow semantic versioning: MAJOR.MINOR.PATCH
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Bell, HelpCircle, User as UserIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

type MeResponse = {
  ok: boolean;
  authenticated: boolean;
  identity?: {
    supabase_user_id?: string;
    email?: string;
  };
  aquorix_user?: {
    user_id?: string | number;
    tier_level?: number;
    tier_label?: string;
    role?: string;
    created_at?: string;
    legacy_tier?: string | null;
    profile?: {
      first_name?: string | null;
      last_name?: string | null;
      phone?: string | null;
      business_name?: string | null;
      pro_logo_url?: string | null;
    };
  };
  operator?: {
    operator_id?: string | number | null;
    name?: string | null;
    logo_url?: string | null;
    timezone?: string | null;
    affiliation_type?: string | null;
  };
};

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function safeInitials(first?: string | null, last?: string | null, email?: string | null) {
  const f = (first || '').trim();
  const l = (last || '').trim();
  if (f && l) return `${f[0]}${l[0]}`.toUpperCase();
  if (f) return `${f[0]}`.toUpperCase();
  if (email && email.length > 0) return email[0].toUpperCase();
  return 'A';
}

const TopNav: React.FC = () => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      setLoading(true);

      // 1) Get Supabase session token
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken || sessionErr) {
        if (mounted) {
          setMe(null);
          setLoading(false);
        }
        return;
      }

      // 2) Fetch /api/v1/me
      const resp = await fetch(`${API_BASE}/api/v1/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // If token expired, UI will still be stable; RequireAuth/Login flow can handle re-auth
      const data = (await resp.json()) as MeResponse;

      if (mounted) {
        setMe(data);
        setLoading(false);
      }
    }

    loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  const brand = useMemo(() => {
    const email = me?.identity?.email ?? null;

    const tierLevel = me?.aquorix_user?.tier_level ?? null;

    const first = me?.aquorix_user?.profile?.first_name ?? null;
    const last = me?.aquorix_user?.profile?.last_name ?? null;

    const operatorName = me?.operator?.name ?? null;
    const operatorLogo = me?.operator?.logo_url ?? null;

    const businessName = me?.aquorix_user?.profile?.business_name ?? null;
    const proLogo = me?.aquorix_user?.profile?.pro_logo_url ?? null;

    // --- Locked branding logic ---
    // Tier 3/4: operator name + operator logo
    // Tier 2: operator name + operator logo (sole proprietor operator)
    // Tier 1: textual personal brand (name)
    const displayName =
      operatorName ||
      businessName ||
      [first, last].filter(Boolean).join(' ') ||
      email ||
      'AQUORIX Pro';

    const logoUrl =
      operatorLogo ||
      proLogo ||
      null;

    const initials = safeInitials(first, last, email);

    return {
      tierLevel,
      displayName,
      logoUrl,
      initials,
    };
  }, [me]);

  return (
    <>
      <div className="aqx-topnav-left">
        <div className="aqx-topnav-logo" aria-label="Operator logo">
          {loading ? (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.10)',
              }}
            />
          ) : brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={`${brand.displayName} logo`}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.10)',
              }}
              title="No logo (text brand)"
            >
              {brand.initials}
            </div>
          )}
        </div>

        <div className="aqx-topnav-operator-block">
          <div className="aqx-topnav-label">
            {loading ? 'Loading…' : 'Brand'}
          </div>
          <div className="aqx-topnav-operator-name">
            {loading ? 'AQUORIX' : brand.displayName}
          </div>
        </div>
      </div>

      <div className="aqx-topnav-actions">
        <button className="aqx-btn-icon" aria-label="Notifications">
          <Bell />
        </button>
        <button className="aqx-btn-icon" aria-label="Help">
          <HelpCircle />
        </button>
        <button className="aqx-btn-primary">
          <UserIcon />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default TopNav;