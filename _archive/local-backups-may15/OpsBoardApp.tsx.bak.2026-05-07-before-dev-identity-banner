/*
 * File: OpsBoardApp.tsx
 * Path: src/features/ops-board/OpsBoardApp.tsx
 * Description: Live API React MVP shell for AQUORIX Dive Ops Board.
 * Author: Larry McLean + ChatGPT
 * Created: 2026-05-03
 * Version: 0.4.0
 * Status: P10.7-C3 live API render
 *
 * Change Log:
 * - 2026-05-03: v0.1.0 - Initial standalone route shell.
 * - 2026-05-03: v0.2.0 - Replace drifted layout with approved Ops Board wireframe structure.
 * - 2026-05-03: v0.3.0 - Add per-session PAX card column after session details.
 * - 2026-05-05: v0.4.0 - Render Ops Board rows from /api/v1/ops-board live API data.
 */

import React from 'react';
import './styles/opsBoard.css';
import { apiFetch } from '../../utils/api';

type OpsBoardSession = {
  id: string;
  type: 'dive' | 'course';
  title: string;
  session_status: string;
  ops_status: string;
  capacity_total: number | null;
  capacity_consumed: number;
  capacity_remaining: number;
  start_time: string;
  site_name: string;
  session_type: string;
  session_date: string;
  duration_days?: number | null;
  metadata?: {
    vessel_name?: string | null;
    lead_guide_name?: string | null;
    instructor_name?: string | null;
    location?: string | null;
    course_start_date?: string | null;
    course_end_date?: string | null;
  };
};

type OpsBoardSummary = {
  booking_count: number;
  confirmed_pax: number;
  active_hold_pax: number;
  waitlist_pax: number;
  manual_review_count: number;
  manual_review_pax: number;
  has_pickups: boolean;
  pickup_count: number;
  has_notes: boolean;
  nitrox_requested_count: number;
  nitrox_cert_verified_count: number;
  rental_gear_count: number;
  own_gear_count: number;
  has_minors: boolean;
};

type OpsBoardApiResponse = {
  ok: boolean;
  generated_at: string;
  operator: {
    slug: string;
    name: string;
    timezone: string;
    currency: string;
    operator_default_capacity: number;
  };
  window: {
    type: string;
    start: string;
    end: string;
  };
  sessions: OpsBoardSession[];
  session_summaries: Record<string, OpsBoardSummary>;
  aggregates: {
    total_sessions: number;
    total_pax: number;
    confirmed_pax_total: number;
    active_hold_pax_total: number;
    waitlist_pax_total: number;
    nitrox_total: number;
    rental_gear_total: number;
    manual_review_total: number;
    pickup_total: number;
    minor_session_count: number;
  };
};

function AlphaFlag() {
  return (
    <span className="title-icon">
      <svg viewBox="0 0 64 42" width="38" height="28" aria-label="Alpha boat dive flag">
        <path d="M4 4 H30 V38 H4 Z" fill="#ffffff" stroke="#0a6c9b" strokeWidth="4" />
        <path d="M30 4 H60 L48 21 L60 38 H30 Z" fill="#0a6c9b" stroke="#0a6c9b" strokeWidth="4" />
        <path d="M30 4 V38" stroke="#ffffff" strokeWidth="5" />
      </svg>
    </span>
  );
}

function DiverDownFlag() {
  return (
    <span className="title-icon">
      <svg viewBox="0 0 64 42" width="38" height="28" aria-label="Diver down shore dive flag">
        <rect x="5" y="5" width="54" height="32" fill="#d71920" stroke="#9c1117" strokeWidth="3" />
        <path d="M14 6 L54 36" stroke="#ffffff" strokeWidth="10" strokeLinecap="square" />
      </svg>
    </span>
  );
}

function CourseBookIcon() {
  return (
    <span className="title-icon">
      <svg viewBox="0 0 64 42" width="34" height="25" aria-label="Course book icon">
        <path d="M10 8 H29 C33 8 36 10 38 13 V35 C35 33 32 32 28 32 H10 Z" fill="#0a6c9b" />
        <path d="M38 13 C40 10 43 8 47 8 H54 V32 H46 C42 32 40 33 38 35 Z" fill="#248dc1" />
        <path d="M38 13 V35" stroke="#ffffff" strokeWidth="3" />
      </svg>
    </span>
  );
}

function SunIcon() {
  return (
    <svg className="sun-icon" viewBox="0 0 64 64" aria-label="Sunny">
      <circle cx="32" cy="32" r="14" fill="#ffd33d" stroke="#d08a00" strokeWidth="3" />
      <circle cx="26" cy="26" r="4" fill="#fff3b0" opacity="0.75" />
      <g stroke="#f2a900" strokeWidth="5" strokeLinecap="round">
        <line x1="32" y1="4" x2="32" y2="13" />
        <line x1="32" y1="51" x2="32" y2="60" />
        <line x1="4" y1="32" x2="13" y2="32" />
        <line x1="51" y1="32" x2="60" y2="32" />
        <line x1="12" y1="12" x2="18" y2="18" />
        <line x1="46" y1="46" x2="52" y2="52" />
        <line x1="52" y1="12" x2="46" y2="18" />
        <line x1="18" y1="46" x2="12" y2="52" />
      </g>
    </svg>
  );
}

type OpsRowProps = {
  time: string;
  type: string;
  title: React.ReactNode;
  sub: string;
  badges: React.ReactNode;
  pax: number;
  rosterTitle?: string;
  rosterNotice?: React.ReactNode;
  status: React.ReactNode;
  cancelled?: boolean;
};

function OpsRow({
  time,
  type,
  title,
  sub,
  badges,
  pax,
  rosterTitle = 'Roster',
  rosterNotice,
  status,
  cancelled = false,
}: OpsRowProps) {
  return (
    <div className={cancelled ? 'ops-row cancelled-row' : 'ops-row'}>
      <div className="time">{time}</div>
      <div className="type">{type}</div>

      <div className="session-details">
        <div className="title">{title}</div>
        <div className="sub">{sub}</div>
        <div className="badges">{badges}</div>
      </div>

      <div className="pax-card">
        <div className="pax-number">{pax}</div>
        <div className="pax-label">PAX</div>
      </div>

      <div className="roster roster-notice">
        <div className="roster-title">{rosterTitle}</div>
        <div className="cancel-note">{rosterNotice}</div>
      </div>

      {status}
    </div>
  );
}

function formatBoardDate(dateText: string): string {
  const [yyyy, mm, dd] = dateText.split('-').map((part) => parseInt(part, 10));
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  return date
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .toUpperCase();
}

function formatSyncTime(generatedAt: string, timezone: string): string {
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) return '--:--';

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone || 'UTC',
  });
}

function getSessionIcon(session: OpsBoardSession): React.ReactNode {
  if (session.type === 'course') return <CourseBookIcon />;
  if (session.session_type === 'boat') return <AlphaFlag />;
  return <DiverDownFlag />;
}

function getSubLine(session: OpsBoardSession): string {
  if (session.type === 'course') {
    const instructor = session.metadata?.instructor_name || 'Instructor TBD';
    const location = session.metadata?.location || 'Training';
    const days = session.duration_days ? ` — Day 1 of ${session.duration_days}` : '';
    return `${instructor} — ${location}${days}`;
  }

  const guide = session.metadata?.lead_guide_name || 'Guide TBD';
  const vessel = session.metadata?.vessel_name || 'SHORE';
  return `${guide} — ${vessel}`;
}

function getBadges(session: OpsBoardSession, summary: OpsBoardSummary | undefined): React.ReactNode {
  const badges: string[] = [];

  if (summary?.active_hold_pax) badges.push(`HOLD ${summary.active_hold_pax}`);
  if (summary?.waitlist_pax) badges.push(`WAIT ${summary.waitlist_pax}`);
  if (summary?.pickup_count) badges.push(`PU ${summary.pickup_count}`);
  if (summary?.nitrox_requested_count) badges.push(`EAN ${summary.nitrox_requested_count}`);
  if (summary?.rental_gear_count) badges.push(`GEAR ${summary.rental_gear_count}`);
  if (summary?.has_minors) badges.push('MINOR');
  if (summary?.has_notes) badges.push('NOTE');

  if (summary?.manual_review_count) {
    badges.push(`REVIEW ${summary.manual_review_count}`);
  }

  if (badges.length === 0) return 'READY';

  return badges.join(' | ');
}

function getStatus(session: OpsBoardSession): React.ReactNode {
  if (session.session_status === 'cancelled' || session.ops_status === 'cancelled') {
    return (
      <div className="status cancelled">
        <div className="status-number">0</div>
        <div className="status-label">SPOTS</div>
      </div>
    );
  }

  const remaining = Math.max(session.capacity_remaining || 0, 0);
  const statusClass = remaining <= 2 ? 'status nearly-full' : 'status available';

  return (
    <div className={statusClass}>
      <div className="status-number">{remaining}</div>
      <div className="status-label">SPOTS</div>
    </div>
  );
}

function getRosterNotice(session: OpsBoardSession, summary: OpsBoardSummary | undefined): string {
  if (session.session_status === 'cancelled' || session.ops_status === 'cancelled') {
    return 'See staff for more information.';
  }

  if (!summary || summary.booking_count === 0) {
    return 'No roster yet.';
  }

  return 'Roster details loading.';
}

function OpsBoardApp() {
  const [data, setData] = React.useState<OpsBoardApiResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadOpsBoardApi() {
      try {
        const res = await apiFetch('/api/v1/ops-board?window=today', { method: 'GET' });
        const json = (await res.json()) as OpsBoardApiResponse;

        console.log('AQX OPS BOARD API STATUS:', res.status);
        console.log(
          'AQX OPS BOARD API BODY:',
          JSON.stringify(json, null, 2)
        );

        if (!res.ok || !json.ok) {
          throw new Error(`Ops Board API failed with HTTP ${res.status}`);
        }

        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        console.error('AQX OPS BOARD API ERROR:', err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown Ops Board API error');
        }
      }
    }

    loadOpsBoardApi();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="ops-board">
        <div className="strip">AQUORIX OPS BOARD API ERROR</div>
        <div className="cancel-note">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ops-board">
        <div className="strip">LOADING AQUORIX OPS BOARD...</div>
      </div>
    );
  }

  const boardDate = formatBoardDate(data.window.start);
  const syncTime = formatSyncTime(data.generated_at, data.operator.timezone);

  return (
    <div className="ops-board">
      <div className="ops-top">
        <div className="ops-brand">
          <img src="/operator-logo.png" alt={`${data.operator.name} Logo`} />
          <div className="ops-operator-name">{data.operator.name.toUpperCase()}</div>
        </div>

        <div className="ops-weather">
          <div className="weather-icon-wrap"><SunIcon /></div>
          <div>
            <div className="weather-main">SUNNY</div>
            <div className="weather-sub">AIR 29°C | WATER 24°C | WIND LIGHT</div>
          </div>
        </div>

        <div className="date-time">{boardDate}&nbsp;&nbsp;{syncTime}</div>
      </div>

      <div className="sync">
        <span className="online-dot"></span>
        <span>ONLINE | LAST SYNC: {syncTime}</span>
      </div>

      <div className="strip">
        {data.aggregates.total_pax} PAX | {data.aggregates.pickup_total} PU | {data.aggregates.nitrox_total} EAN | 0 TX | {data.aggregates.rental_gear_total} GEAR | REVIEW {data.aggregates.manual_review_total} | WAIT {data.aggregates.waitlist_pax_total} | HOLD {data.aggregates.active_hold_pax_total}
      </div>

      {data.sessions.map((session) => {
        const summary = data.session_summaries[session.id];
        const isCancelled = session.session_status === 'cancelled' || session.ops_status === 'cancelled';
        const pax = summary ? summary.confirmed_pax + summary.active_hold_pax : session.capacity_consumed;

        return (
          <OpsRow
            key={session.id}
            time={session.start_time}
            type={session.type === 'course' ? 'COURSE' : 'DIVE'}
            title={<>{session.title} {getSessionIcon(session)}</>}
            sub={getSubLine(session)}
            badges={getBadges(session, summary)}
            pax={pax}
            cancelled={isCancelled}
            rosterTitle={isCancelled ? 'Cancelled' : 'Roster'}
            rosterNotice={getRosterNotice(session, summary)}
            status={getStatus(session)}
          />
        );
      })}

      <div className="legend">
        <span><span className="legend-pill legend-ok">✓</span> Ready</span>
        <span><span className="legend-pill legend-warn">!</span> Needs check-in</span>
        <span><span className="legend-pill legend-attention">⚠</span> Needs attention</span>
        <span><span className="legend-pill legend-ean">EAN</span> Nitrox</span>
        <span><span className="legend-pill legend-tx">Tx</span> Trimix</span>
      </div>

      <div className="bottom-bar">
        <div className="dan-box">
          <img className="dan-logo" src="/assets/images/logos/divers-alert-network-logo.svg" alt="Divers Alert Network" />
          <div className="dan-text">
            <div className="dan-label">Emergency Hotline</div>
            <div className="dan-phone">+1-919-684-9111</div>
          </div>
        </div>

        <div>
          <div className="message-box">
            Please remember to bring your passport for all boat trips. You must leave a 24 hour surface interval after diving before flying.
          </div>
          <div className="footer-center">
            <span>Powered by AQUORIX</span>
            <svg className="nautilus-mark" viewBox="0 0 64 64" aria-label="AQUORIX nautilus placeholder">
              <path d="M50 32 C50 42 42 50 32 50 C21 50 14 43 14 33 C14 23 21 16 31 16 C39 16 45 22 45 30 C45 37 40 42 33 42 C27 42 23 38 23 33 C23 28 27 24 32 24 C36 24 39 27 39 31 C39 34 36 37 33 37 C30 37 28 35 28 32 C28 30 30 28 32 28" fill="none" stroke="#0a6c9b" strokeWidth="5" strokeLinecap="round" />
              <circle cx="32" cy="32" r="27" fill="none" stroke="#248dc1" strokeWidth="3" />
            </svg>
          </div>
        </div>

        <div className="qr-area">
          <div className="qr-text">SCAN TO REGISTER<span>Forms • Waivers • Updates</span></div>
          <div className="qr-box" aria-label="QR code placeholder"></div>
        </div>
      </div>
    </div>
  );
}

export default OpsBoardApp;