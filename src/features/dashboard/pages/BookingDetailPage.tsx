/*
  File:        BookingDetailPage.tsx
  Path:        /Users/larrymclean/CascadeProjects/aquorix-frontend/src/features/dashboard/pages/BookingDetailPage.tsx
  Description:
    Phase 8.7 (P1): Booking detail page (phone-first).
    - Route: /dashboard/bookings/:bookingId
    - Data source:
        1) Prefer navigation state (booking object passed from BookingsPage)
        2) Fallback: reload GET /api/v1/dashboard/bookings and find by booking_id
    - No backend changes. No mutations.

  Author: AQUORIX Team
  Created: 2026-02-27
  Version: 0.2.0

  Change Log (append-only):
    - 2026-02-27 - v0.1.0:
      - Initial detail page scaffold + fallback loader
    - 2026-02-27 - v0.2.0:
      - Phone-first sections + deterministic display helpers
*/

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

type ApiBooking = {
  booking_id: string;
  booking_status: string;

  payment_status: string;
  payment_currency: string;
  payment_amount: string;

  hold_expires_at: string | null;
  paid_at: string | null;

  requires_manual_review_derived: boolean;
  manual_review_reason: string | null;

  ui_status: string;

  headcount: number;

  guest_name: string;
  guest_email: string;
  guest_phone: string | null;

  special_requests: string | null;
  source: string;

  created_at: string;
  updated_at: string;

  session_id: string;
  itinerary_id: string;

  dive_datetime_local: string;
  session_date: string;
  start_time: string;
  site_name: string;

  itinerary_title: string;

  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;

  stripe_charge_currency: string | null;
  stripe_charge_amount_minor: string | null;

  fx_rate_estimate: string | null;
  fx_rate_source: string | null;
};

type ApiResponse = {
  ok: boolean;
  status: string;
  operator_id: string;
  week: { start: string; end: string };
  bookings: ApiBooking[];
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "not_found" }
  | { status: "error"; message: string }
  | { status: "ok"; booking: ApiBooking; operatorId?: string };

function getLocalYmd(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getLocalIsoDow(d: Date) {
  // JS: 0=Sun..6=Sat -> ISO: 1=Mon..7=Sun
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

function getLocalWeekStartYmd(d: Date) {
  const isoDow = getLocalIsoDow(d); // 1..7
  const monday = new Date(d);
  monday.setDate(d.getDate() - (isoDow - 1));
  return getLocalYmd(monday);
}

function formatMoney(currency: string, amount: string) {
  const cur = currency || "—";
  const amt = amount || "—";
  return `${cur} ${amt}`;
}

function labelize(s?: string | null) {
  if (!s) return "—";
  return String(s).replace(/_/g, " ");
}

function looksUtcIso(s?: string | null) {
  if (!s) return false;
  // Common UTC ISO patterns: ends with 'Z' or includes +HH:MM / -HH:MM
  return /Z$/.test(s) || /[+-]\d{2}:\d{2}$/.test(s);
}

function formatIsoForDisplay(s?: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s); // fallback: show raw
  // Deterministic, locale-safe display (no user locale surprises)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function labelDiveDatetime(s?: string | null) {
  if (!s) return "—";
  // If it looks UTC-ish, label it explicitly to avoid “wrong time” confusion.
  if (looksUtcIso(s)) return `${formatIsoForDisplay(s)} (UTC)`;
  // Otherwise treat as “local as provided”
  return `${formatIsoForDisplay(s)} (local)`;
}

export default function BookingDetailPage() {
  const nav = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation() as any;

  const navBooking = location?.state?.booking as ApiBooking | undefined;
  const navWeekStart = location?.state?.weekStart as string | undefined;

  const [state, setState] = useState<LoadState>(() => {
    if (navBooking) return { status: "ok", booking: navBooking };
    return { status: "idle" };
  });

  useEffect(() => {
    let isMounted = true;

    async function loadFallback() {
      if (navBooking) return; // already have it
      if (!bookingId) return;

      setState({ status: "loading" });

      try {
        const weekStart = navWeekStart || getLocalWeekStartYmd(new Date());
        const res = await apiFetch(`/api/v1/dashboard/bookings?week_start=${encodeURIComponent(weekStart)}`, { method: "GET" });
        const json = (await res.json().catch(() => ({}))) as any;

        if (!res.ok || json?.ok === false) {
          const msg = json?.message || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        const data = json as ApiResponse;
        const found = (data.bookings || []).find((b) => String(b.booking_id) === String(bookingId));

        if (!found) {
          if (isMounted) setState({ status: "not_found" });
          return;
        }

        if (isMounted) setState({ status: "ok", booking: found, operatorId: data.operator_id });
      } catch (err: any) {
        if (isMounted) setState({ status: "error", message: err?.message || "Load failed" });
      }
    }

    loadFallback();
    return () => {
      isMounted = false;
    };
  }, [bookingId, navBooking]);

  const booking = state.status === "ok" ? state.booking : null;

  const sections = useMemo(() => {
    if (!booking) return null;

    const needsReview = Boolean(booking.requires_manual_review_derived);

    return {
      header: {
        title: booking.guest_name || "Guest",
        subtitle: `${booking.site_name || "Site"} • ${booking.session_date || "—"} • ${booking.start_time || "—"}`,
        metaRightTop: `#${booking.booking_id}`,
        metaRightBottom: (booking.source || "—").toUpperCase(),
      },
      statusRow: {
        ui: labelize(booking.ui_status).toUpperCase(),
        booking: (booking.booking_status || "—").toUpperCase(),
        payment: (booking.payment_status || "—").toUpperCase(),
        needsReview,
        reviewReason: booking.manual_review_reason,
      },
    };
  }, [booking]);

  return (
    <div style={styles.page}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <button onClick={() => nav(-1)} style={styles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.h1}>Booking</h1>
      </div>

      {state.status === "loading" || state.status === "idle" ? <div style={styles.card}>Loading booking…</div> : null}

      {state.status === "error" ? (
        <div style={styles.bannerError}>
          <strong>Booking load failed.</strong>
          <div style={{ marginTop: 6 }}>{state.message}</div>
        </div>
      ) : null}

      {state.status === "not_found" ? <div style={styles.card}>Booking not found.</div> : null}

      {state.status === "ok" && booking && sections ? (
        <>
          {/* Header Card */}
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 950, marginBottom: 6 }}>{sections.header.title}</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{sections.header.subtitle}</div>
              </div>

              <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}>
                <div style={{ fontWeight: 900 }}>{sections.header.metaRightTop}</div>
                <div style={{ marginTop: 6 }}>{sections.header.metaRightBottom}</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span style={pill("neutral")}>{sections.statusRow.ui}</span>
              <span style={pill("neutral")}>BOOKING: {sections.statusRow.booking}</span>
              <span style={pill(sections.statusRow.payment === "PAID" ? "ok" : "warn")}>PAY: {sections.statusRow.payment}</span>
              {sections.statusRow.needsReview ? <span style={pill("warn")}>NEEDS REVIEW</span> : null}
              {sections.statusRow.reviewReason ? <span style={pill("warn")}>REASON: {labelize(sections.statusRow.reviewReason)}</span> : null}
            </div>
          </div>

          {/* Payment */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Payment</div>
            <Row k="Amount" v={formatMoney(booking.payment_currency, booking.payment_amount)} />
            <Row k="Paid At" v={booking.paid_at || "—"} />
            <Row k="Hold Expires" v={booking.hold_expires_at || "—"} />
            <Row k="Checkout Session" v={booking.stripe_checkout_session_id || "—"} mono />
            <Row k="Payment Intent" v={booking.stripe_payment_intent_id || "—"} mono />
            <Row
              k="Charge"
              v={
                booking.stripe_charge_currency && booking.stripe_charge_amount_minor
                  ? `${booking.stripe_charge_currency} ${booking.stripe_charge_amount_minor} (minor)`
                  : "—"
              }
            />
            <Row
              k="FX"
              v={booking.fx_rate_estimate ? `${booking.fx_rate_estimate} (${booking.fx_rate_source || "source unknown"})` : "—"}
            />
          </div>

          {/* Guest */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Guest</div>
            <Row k="Name" v={booking.guest_name || "—"} />
            <Row k="Email" v={booking.guest_email || "—"} mono />
            <Row k="Phone" v={booking.guest_phone || "—"} mono />
            <Row k="Headcount" v={String(booking.headcount ?? "—")} />
            <Row k="Requests" v={booking.special_requests || "—"} />
          </div>

          {/* Session */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Session</div>
            <Row k="Session ID" v={booking.session_id || "—"} />
            <Row k="Itinerary ID" v={booking.itinerary_id || "—"} />
            <Row k="Itinerary Title" v={booking.itinerary_title || "—"} />
            <Row k="Dive Date" v={booking.session_date || "—"} />
            <Row k="Start Time" v={booking.start_time || "—"} />
            <Row k="Dive Datetime" v={labelDiveDatetime(booking.dive_datetime_local)} mono />
            <Row k="Site" v={booking.site_name || "—"} />
          </div>

          {/* Actions (disabled for now) */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Actions</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>
              Actions are intentionally disabled until we lock the UI workflow. Backend approve/reject endpoints exist, but we are not wiring mutations in Phase 8.7 P1.
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button disabled style={styles.actionBtnDisabled}>Approve Booking</button>
              <button disabled style={styles.actionBtnDisabled}>Cancel Booking</button>
              <button disabled style={styles.actionBtnDisabled}>Resend Payment Link</button>
              <button disabled style={styles.actionBtnDisabled}>Mark Manual Review Resolved</button>
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 10 }}>
            Created: {booking.created_at} • Updated: {booking.updated_at} {state.operatorId ? `• Operator #${state.operatorId}` : ""}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Row(props: { k: string; v: string; mono?: boolean }) {
  return (
    <div style={styles.row}>
      <div style={styles.k}>{props.k}</div>
      <div style={{ ...styles.v, ...(props.mono ? styles.mono : null) }}>{props.v}</div>
    </div>
  );
}

function pill(kind: "ok" | "warn" | "danger" | "neutral"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  if (kind === "ok") return { ...base, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)" };
  if (kind === "warn") return { ...base, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)" };
  if (kind === "danger") return { ...base, background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.30)" };
  return { ...base, background: "rgba(0,0,0,0.04)" };
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 16, maxWidth: 900 },
  h1: { fontSize: 22, fontWeight: 950, margin: 0 },

  backBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(0,0,0,0.02)",
    cursor: "pointer",
    fontWeight: 900,
  },

  card: {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: 14,
    background: "#fff",
    marginBottom: 12,
  },

  bannerError: {
    border: "1px solid rgba(220, 38, 38, 0.35)",
    background: "rgba(220, 38, 38, 0.08)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  sectionTitle: { fontSize: 14, fontWeight: 950, marginBottom: 10 },

  row: {
    display: "flex",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  k: { width: 140, fontSize: 12, fontWeight: 900, opacity: 0.75 },
  v: { flex: 1, fontSize: 12, fontWeight: 700, opacity: 0.9, wordBreak: "break-word" },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },

  actionBtnDisabled: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(0,0,0,0.04)",
    cursor: "not-allowed",
    fontWeight: 950,
    opacity: 0.65,
  },
};
