/**
 * ============================================================================
 * AQUORIX Pro Dashboard - Schedule Page (Phase A)
 * ============================================================================
 * File: src/features/dashboard/pages/SchedulePage.tsx
 * Purpose:
 *   - Fetch and render live schedule data from Scheduler API v1.2.0
 *   - MVP: Today view (primary) + Week view (secondary)
 * Version: 0.1.0
 * Notes:
 *   - Phase A uses dev bridge operator_id=143 (Blue Current) until Phase B
 *   - Shows loading/error states and capacity warnings
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';

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

const API_BASE = 'http://localhost:3001';
const DEV_OPERATOR_ID = 143;

function fmtLocal(dt: string | null): string {
  if (!dt) return '—';
  // dt is already local string "YYYY-MM-DDTHH:mm:ss" (no Z)
  return dt.replace('T', ' ');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<ScheduleResponse | null>(null);

  const weekStartDate = useMemo(() => {
    // Phase A: hardcode a stable seeded date if needed; otherwise “today” in local timezone is fine.
    // Using 2025-12-20 matches your seeded sessions for Blue Current.
    return '2025-12-20';
  }, []);

  async function fetchSchedule() {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const url =
        tab === 'today'
          ? `${API_BASE}/api/v1/operators/${DEV_OPERATOR_ID}/schedule/today`
          : `${API_BASE}/api/v1/operators/${DEV_OPERATOR_ID}/schedule/week?start_date=${weekStartDate}`;

      const res = await fetch(url, {
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

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Schedule</div>
          <div style={{ opacity: 0.75, fontSize: 13 }}>
            Live Scheduler API (v1.2.0) • Operator {DEV_OPERATOR_ID} • {data?.timezone || '…'}
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

          {/* Phase A: Month/Year tabs exist but can be inert */}
          <button
            disabled
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: 'inherit',
              opacity: 0.4
            }}
          >
            Month
          </button>
          <button
            disabled
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: 'inherit',
              opacity: 0.4
            }}
          >
            Year
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div style={{ padding: 12 }}>Loading schedule…</div>
        ) : error ? (
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Schedule Error</div>
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
            <div style={{ fontWeight: 800, marginBottom: 6 }}>No sessions found</div>
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
                  <div style={{ fontWeight: 800 }}>
                    {s.dive_site_name || 'Dive Site'} <span style={{ opacity: 0.6 }}>#{s.session_id}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 13, opacity: 0.9 }}>
                    <div>Dive: {fmtLocal(s.dive_datetime_local)}</div>
                    <div>Meet: {fmtLocal(s.meet_time_local)}</div>
                  </div>
                </div>

                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 12, opacity: 0.9 }}>
                  <div style={{ fontSize: 13 }}>
                    Type: <span style={{ fontWeight: 700 }}>{s.session_type || '—'}</span>
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