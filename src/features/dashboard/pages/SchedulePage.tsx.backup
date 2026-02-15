/**
 * ============================================================================
 * AQUORIX Pro Dashboard — Schedule Page (Phase B+ / Gate 2 → Phase C Bridge)
 * ============================================================================
 * File:        src/features/dashboard/pages/SchedulePage.tsx
 * Path:        /Users/larrymclean/CascadeProjects/aquorix-pro-admin/src/features/dashboard/pages/SchedulePage.tsx
 * Owner:       Larry McLean (LSM)
 * Author:      AQUORIX Engineering (with LSM)
 *
 * Created:     2025-12-20
 * Last Updated: 2025-12-27
 * Version:     v0.2.0
 * Status:      Active (Debug-first, /me authoritative)
 *
 * Purpose:
 *   - Render operator schedule using Scheduler API endpoints:
 *       GET /api/v1/operators/:operatorId/schedule/today
 *       GET /api/v1/operators/:operatorId/schedule/week?start_date=YYYY-MM-DD
 *
 * Canonical Rules (NO DRIFT):
 *   - /api/v1/me is the single source of truth for:
 *       - auth validity
 *       - routing_hint
 *       - tier context
 *       - operator context (operator_id may be null for Tier 1/2)
 *   - UI MUST NOT hardcode “Blue Current” / operator 143 as fallback.
 *   - If operator_id is null:
 *       - do NOT call scheduler endpoints
 *       - show a clear “No operator assigned yet” state (expected for Tier 1/2)
 *
 * Debug Philosophy (Larry requirement):
 *   - Debug info must be visible ON the page (not only DevTools).
 *
 * Change Log (NEVER DELETE ENTRIES — APPEND ONLY):
 *   - 2025-12-20 — v0.1.0 — Initial SchedulePage scaffold (Today/Week tabs, cards, states).
 *   - 2025-12-23 — v0.1.1 — Phase A bridge: added fallback operator 143 (seeded data).
 *   - 2025-12-27 — v0.2.0 — Phase B+ fix: remove operator 143 fallback; use /api/v1/me.
 *       - Operator resolution: AQX_OPERATOR_ID override → /me.operator_id → null-safe UI.
 *       - Added on-page debug panel: /me status, routing_hint, tier, operator_id, fetch URL.
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from "../../../utils/api";

type Capacity = {
  capacity_mode: 'vessel_limited' | 'shore_unlimited';
  max_capacity: number | null;
  confirmed_headcount: number;
  pending_headcount: number;
  available_if_confirmed_only: number | null;
  available_if_pending_reserved: number | null;
  is_over_capacity_confirmed_only: boolean | null;
  is_over_capacity_with_pending: boolean | null;
  capacity_note?: string | null;
};

type Session = {
  session_id: number;
  dive_site_name: string | null;
  session_type: string | null;
  dive_datetime_local: string | null;
  meet_time_local: string | null;
  dive_datetime_utc: string;
  meet_time_utc: string;
  capacity: Capacity;
};

type ScheduleResponse = {
  operator_id: number;
  timezone: string;
  session_count: number;
  sessions: Session[];
  week_start?: string | null;
};

type MeResponse = {
  routing_hint?: string;
  onboarding?: {
    is_complete?: boolean;
    completion_percentage?: number;
  };
  profile?: {
    tier_level?: number;
  };
  operator?: {
    operator_id?: number | null;
  };
  operator_context?: {
    operator_id?: number | null;
  };
};

// Production
const API_BASE = API_BASE_URL;

const ME_URL = `${API_BASE}/api/v1/me`;

/**
 * Supabase stores auth in localStorage under a key like:
 *   sb-<project-ref>-auth-token
 * Value is JSON and usually contains access_token at top-level.
 * We search for any key ending in "-auth-token" to avoid hardcoding project ref.
 */
function getSupabaseAccessToken(): string | null {
  try {
    // 1) Prefer the exact key if present (fast path)
    const direct = localStorage.getItem('sb-spltrqrscqmtrfknvycj-auth-token');
    if (direct) {
      const parsed = JSON.parse(direct);
      if (typeof parsed?.access_token === 'string') return parsed.access_token;
      if (typeof parsed?.session?.access_token === 'string') return parsed.session.access_token;
    }

    // 2) Generic scan (safe fallback)
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (!k.endsWith('-auth-token')) continue;

      const raw = localStorage.getItem(k);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (typeof parsed?.access_token === 'string') return parsed.access_token;
      if (typeof parsed?.session?.access_token === 'string') return parsed.session.access_token;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Operator resolution order (NO GUESSING):
 *  1) localStorage AQX_OPERATOR_ID (dev override)
 *  2) /api/v1/me operator_id
 *  3) null (Tier 1/2 expected) → do not fetch schedule
 */
function resolveOperatorIdFromStorage(): number | null {
  const fromStorage = Number(localStorage.getItem('AQX_OPERATOR_ID'));
  if (Number.isFinite(fromStorage) && fromStorage > 0) return fromStorage;
  return null;
}

function fmtLocal(dt: string | null): string {
  if (!dt) return '—';
  return dt.replace('T', ' ');
}

function toYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function CapacityLine({ c }: { c: Capacity }) {
  if (c.capacity_mode === 'shore_unlimited') {
    return <span>Shore (no cap)</span>;
  }

  const max = c.max_capacity ?? 0;
  const confirmed = c.confirmed_headcount ?? 0;
  const pending = c.pending_headcount ?? 0;
  const over = c.is_over_capacity_with_pending;

  return (
    <span style={{ fontWeight: 600 }}>
      {confirmed}+{pending} / {max}{' '}
      {over ? <span style={{ marginLeft: 8 }}>⚠️ Overbook risk</span> : null}
    </span>
  );
}

const SchedulePage: React.FC = () => {
  const [tab, setTab] = useState<'today' | 'week'>('today');

  const [meLoading, setMeLoading] = useState(false);
  const [meError, setMeError] = useState<string>('');
  const [me, setMe] = useState<MeResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<ScheduleResponse | null>(null);

  const weekStartDate = useMemo(() => toYMD(new Date()), []);

  const operatorIdOverride = useMemo(() => resolveOperatorIdFromStorage(), []);

  const token = useMemo(() => getSupabaseAccessToken(), []);

  const operatorIdFromMe = useMemo(() => {
    const a = me?.operator?.operator_id;
    const b = me?.operator_context?.operator_id;
    const val = (typeof a === 'number' ? a : b);
    return typeof val === 'number' && val > 0 ? val : null;
  }, [me]);

  const operatorId = operatorIdOverride ?? operatorIdFromMe; // may be null

  const scheduleUrl = useMemo(() => {
    if (!operatorId) return null;

    return tab === 'today'
      ? `${API_BASE}/api/v1/operators/${operatorId}/schedule/today`
      : `${API_BASE}/api/v1/operators/${operatorId}/schedule/week?start_date=${weekStartDate}`;
  }, [operatorId, tab, weekStartDate]);

  async function fetchMe() {
    setMeLoading(true);
    setMeError('');
    setMe(null);

    try {
      if (!token) {
        throw new Error('No Supabase access token found in localStorage.');
      }

      const res = await fetch(ME_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`ME HTTP ${res.status}: ${body}`);
      }

      const json = (await res.json()) as MeResponse;
      setMe(json);
    } catch (e: any) {
      setMeError(e?.message || 'Failed to fetch /api/v1/me.');
    } finally {
      setMeLoading(false);
    }
  }

  async function fetchSchedule() {
    setLoading(true);
    setError('');
    setData(null);

    try {
      if (!scheduleUrl) {
        // This is a controlled “no operator yet” state.
        setLoading(false);
        return;
      }

      const res = await fetch(scheduleUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

      const json = (await res.json()) as ScheduleResponse;
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Schedule fetch failed.');
    } finally {
      setLoading(false);
    }
  }

  // On mount: fetch /me (authoritative context)
  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When tab or operatorId changes: fetch schedule (if operator exists)
  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, operatorId]);

  return (
    <div style={{ padding: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Schedule</div>
          <div style={{ opacity: 0.75, fontSize: 13, lineHeight: 1.4 }}>
            Scheduler API (v1.2.0) • Operator: {operatorId ?? '— (none)'} • {data?.timezone || '…'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setTab('today')}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: tab === 'today' ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: 'inherit',
              cursor: 'pointer'
            }}
          >
            Today
          </button>

          <button
            onClick={() => setTab('week')}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: tab === 'week' ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: 'inherit',
              cursor: 'pointer'
            }}
          >
            Week
          </button>

          <button
            onClick={fetchMe}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: 'inherit',
              cursor: 'pointer'
            }}
          >
            Refresh /me
          </button>
        </div>
      </div>

      {/* Debug Panel (always visible — Larry requirement) */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(0,0,0,0.18)',
          fontSize: 12,
          lineHeight: 1.5
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Debug (SchedulePage)</div>

        <div style={{ display: 'grid', gap: 4 }}>
          <div>
            <span style={{ opacity: 0.75 }}>Token:</span>{' '}
            {token ? `FOUND (starts: ${token.slice(0, 18)}…)` : 'MISSING'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>/me:</span>{' '}
            {meLoading ? 'loading…' : meError ? `ERROR → ${meError}` : me ? 'OK' : '—'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>routing_hint:</span> {me?.routing_hint ?? '—'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>tier_level:</span>{' '}
            {me?.profile?.tier_level ?? '—'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>operator_id override (AQX_OPERATOR_ID):</span>{' '}
            {operatorIdOverride ?? '—'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>operator_id from /me:</span>{' '}
            {operatorIdFromMe ?? '—'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>operator_id effective:</span>{' '}
            {operatorId ?? '—'}
          </div>

          <div>
            <span style={{ opacity: 0.75 }}>schedule URL:</span>{' '}
            {scheduleUrl ?? 'BLOCKED (no operator_id)'}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginTop: 12 }}>
        {!operatorId ? (
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>No operator assigned (expected for Tier 1/2)</div>
            <div style={{ opacity: 0.85, fontSize: 13, lineHeight: 1.5 }}>
              This account has no operator context yet, so Schedule is blocked by design.
              <br />
              When Tier 3/4 sealing runs, /me will return operator_id and Schedule will go live automatically.
              <br />
              Dev override: set <code>AQX_OPERATOR_ID</code> in localStorage to test schedule without sealing.
            </div>
          </div>
        ) : loading ? (
          <div style={{ padding: 12 }}>Loading schedule…</div>
        ) : error ? (
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Schedule Error</div>
            <div style={{ opacity: 0.85, marginBottom: 10 }}>{error}</div>
            <button
              onClick={fetchSchedule}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.08)',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : !data ? (
          <div style={{ padding: 12 }}>No data.</div>
        ) : data.session_count === 0 ? (
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>No sessions found</div>
            <div style={{ opacity: 0.8, fontSize: 13, lineHeight: 1.5 }}>
              There are no scheduled sessions for this operator for the selected period.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {data.sessions.map((s) => (
              <div
                key={s.session_id}
                style={{
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(0,0,0,0.12)',
                  padding: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontWeight: 900 }}>
                    {s.dive_site_name || 'Dive Site'} <span style={{ opacity: 0.6 }}>#{s.session_id}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 13, opacity: 0.9 }}>
                    <div>Dive: {fmtLocal(s.dive_datetime_local)}</div>
                    <div>Meet: {fmtLocal(s.meet_time_local)}</div>
                  </div>
                </div>

                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 12, opacity: 0.9 }}>
                  <div style={{ fontSize: 13 }}>
                    Type: <span style={{ fontWeight: 800 }}>{s.session_type || '—'}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <CapacityLine c={s.capacity} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
