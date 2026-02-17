/**
 * ============================================================================
 * AQUORIX API -
 * ============================================================================
 * File:        src/components/TopNav.tsx
 * Purpose:     Top nav (brand + actions).
 * Version:     v1.0.3
 * Created:     2025-12-29
 * Updated:     2026-01-13
 * Author:      Larry McLean + AI Team
 * Project:     AQUORIX™ API Project
 *
 * Description:
 * - Top navigation bar for dashboard shell
 * - Displays brand identity (operator > affiliate > user display)
 * - Uses /api/v1/me as the single boot authority (canonical keys)
 *
 * Change Log:
 * -----------
 * v1.?.?  - 12-29-25 - Locked branding logic...
 * v1.0.1  - 2026-01-07 - Larry McLean & ChatGPT
 *   - Refactor to canonical /api/v1/me keys (user.display_name, user.avatar_url, operator.name/logo_url)
 *   - Remove direct Supabase session fetch from TopNav (uses getMe via api helper)
 *   - Keep branding precedence: operator > user
 * v1.0.2  - 2026-01-07 - Larry McLean & ChatGPT
 *   - Fix header File path to match actual location (src/components/TopNav.tsx)
 *   - Add optional prop override to avoid duplicate /me fetch (Layout can pass me)
 *   - Keep safe fallback: fetch /me only if override not provided
 * v1.0.3  - 2026-01-13 - Larry McLean + AI Team
 *   - FIX: Remove getMe/getMeJson mismatch (TopNav now imports and uses getMe consistently)
 *   - FIX: Ensure TopNav never fetches when meOverride is provided
 *
 * Notes:
 * - Do NOT alter existing changelog entries
 * - Always append new changes with version bump
 * - Follow semantic versioning: MAJOR.MINOR.PATCH
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Bell, HelpCircle, User as UserIcon } from 'lucide-react';
import { getMe } from '../utils/api';

export type MeResponse = {
  api_version?: string;
  ok: boolean;
  authenticated: boolean;
  routing_hint?: 'login' | 'onboarding' | 'dashboard' | string;
  ui_mode?: 'admin' | 'pro' | 'affiliate' | string;

  user?: {
    user_id?: number;
    email?: string;
    tier_level?: number;
    display_name?: string | null;
    avatar_url?: string | null;
  };

  // Canonical permissions bag (backend may include)
  permissions?: Record<string, boolean>;

  operator?: {
    operator_id?: number | string | null;
    name?: string | null;
    logo_url?: string | null;
  };

  affiliate?: {
    affiliate_id?: number | string | null;
    name?: string | null;
    logo_url?: string | null;
  };
};

type TopNavProps = {
  /**
   * Optional: Provide /api/v1/me payload from a parent (Layout/Provider)
   * to avoid duplicate /me fetches.
   */
  meOverride?: MeResponse | null;

  /**
   * Optional: If parent is fetching /me, pass loading state for skeleton UI.
   */
  loadingOverride?: boolean;
};

function safeInitials(displayName?: string | null, email?: string | null) {
  const name = (displayName || '').trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return `${parts[0][0]}`.toUpperCase();
  }
  const e = (email || '').trim();
  if (e) return e[0].toUpperCase();
  return 'A';
}

const TopNav: React.FC<TopNavProps> = ({ meOverride, loadingOverride }) => {
  const [meLocal, setMeLocal] = useState<MeResponse | null>(null);
  const [loadingLocal, setLoadingLocal] = useState<boolean>(true);

  const me = meOverride !== undefined ? meOverride : meLocal;
  const loading = loadingOverride !== undefined ? loadingOverride : loadingLocal;

  useEffect(() => {
    // If parent provides me (even null), do not fetch here.
    if (meOverride !== undefined) return;

    let mounted = true;

    async function loadMe() {
      setLoadingLocal(true);
      try {
        const res = await getMe();
        if (!res.ok) throw new Error(`getMe HTTP ${res.status}`);
        const data = (await res.json()) as MeResponse;

        if (mounted) {
          setMeLocal(data);
        }
      } catch (err) {
        console.error('[TopNav] getMe failed:', err);
        if (mounted) {
          setMeLocal(null);
        }
      } finally {
        if (mounted) setLoadingLocal(false);
      }
    }

    void loadMe();

    return () => {
      mounted = false;
    };
  }, [meOverride]);

  const brand = useMemo(() => {
    const userEmail = me?.user?.email ?? null;
    const userDisplay = me?.user?.display_name ?? null;
    const userAvatar = me?.user?.avatar_url ?? null;

    const operatorName = me?.operator?.name ?? null;
    const operatorLogo = me?.operator?.logo_url ?? null;

    const affiliateName = me?.affiliate?.name ?? null;
    const affiliateLogo = me?.affiliate?.logo_url ?? null;

    // --- Locked branding precedence (canonical-only) ---
    // 1) Operator (Tier 2–4)
    // 2) Affiliate (Tier 5)
    // 3) User display_name (Tier 0/1 fallback)
    // 4) Email
    const displayName =
      operatorName ||
      affiliateName ||
      userDisplay ||
      userEmail ||
      'AQUORIX Pro';

    // Logo precedence:
    // operator.logo_url > affiliate.logo_url > user.avatar_url > null
    const logoUrl = operatorLogo || affiliateLogo || userAvatar || null;

    const initials = safeInitials(userDisplay || displayName, userEmail);

    return {
      displayName,
      logoUrl,
      initials,
    };
  }, [me]);

  return (
    <>
      <div className="aqx-topnav-left">
        <div className="aqx-topnav-logo" aria-label="Brand logo">
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
            <img src={brand.logoUrl} alt={`${brand.displayName} logo`} />
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
          <div className="aqx-topnav-label">{loading ? 'Loading…' : 'Brand'}</div>
          <div className="aqx-topnav-operator-name">
            {loading ? 'AQUORIX' : brand.displayName}
          </div>
        </div>
      </div>

      <div className="aqx-topnav-actions">
        <button className="aqx-btn-icon" aria-label="Notifications" type="button">
          <Bell />
        </button>
        <button className="aqx-btn-icon" aria-label="Help" type="button">
          <HelpCircle />
        </button>
        <button className="aqx-btn-primary" type="button">
          <UserIcon />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

export default TopNav;
