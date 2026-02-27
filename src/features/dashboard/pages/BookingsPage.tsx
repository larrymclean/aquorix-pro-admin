/*
  File:        BookingsPage.tsx
  Path:        /Users/larrymclean/CascadeProjects/aquorix-frontend/src/features/dashboard/pages/BookingsPage.tsx
  Description:
    Phase 8.7 (P0): Phone-first Bookings Queue page.
    - Calls GET /api/v1/dashboard/bookings via apiFetch (injects Bearer token)
    - Renders phone-first booking cards with deterministic badges + filter chips
    - No backend changes. No new endpoints.

  Author: AQUORIX Team
  Created: 2026-02-27
  Version: 0.3.0

  Change Log (append-only):
    - 2026-02-27 - v0.1.0:
      - Initial scaffold page (placeholder UI)
    - 2026-02-27 - v0.2.0:
      - Wire GET /api/v1/dashboard/bookings and render raw payload for capture
    - 2026-02-27 - v0.3.0:
      - Phone-first queue UI: cards + status badges + filter chips + safe sort
*/

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

type ApiWeek = { start: string; end: string };

type ApiBooking = {
  booking_id: string;
  booking_status: string;

  payment_status: "paid" | "unpaid" | string;
  payment_currency: string;
  payment_amount_minor: string;
  payment_amount: string;

  hold_expires_at: string | null;

  paid_at: string | null;

  requires_manual_review_derived: boolean;
  manual_review_required?: boolean;
  manual_review_reason?: string | null;

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
  session_date: string; // YYYY-MM-DD
  start_time: string; // "13:00"
  site_name: string;

  itinerary_title: string;

  itinerary_slot?: string | null;
  itinerary_type?: string | null;
  itinerary_location_type?: string | null;
};

type ApiResponse = {
  ok: boolean;
  status: string;
  operator_id: string;
  week: ApiWeek;
  bookings: ApiBooking[];
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: ApiResponse };

type FilterKey = "all" | "needs_review" | "paid" | "unpaid" | "expired" | "cancelled";

function formatDate(yyyyMmDd: string) {
  // Safe: display as YYYY-MM-DD (keep deterministic; avoid locale surprises)
  return yyyyMmDd || "unknown-date";
}

function formatMoney(currency: string, amount: string) {
  // Backend already gives formatted payment_amount ("50.00") so just present it.
  const cur = currency || "—";
  const amt = amount || "—";
  return `${cur} ${amt}`;
}

function badgeStyle(kind: "ok" | "warn" | "danger" | "neutral"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    color: "#111827",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  if (kind === "ok") return { ...base, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)" };
  if (kind === "warn") return { ...base, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)" };
  if (kind === "danger") return { ...base, background: "rgba(220,38,38,0.10)", border: "1px solid rgba(220,38,38,0.30)" };
  return { ...base, background: "rgba(0,0,0,0.04)" };
}

function getUiBadge(b: ApiBooking): { label: string; kind: "ok" | "warn" | "danger" | "neutral" } {
  // Deterministic mapping from your backend-derived ui_status
  const s = (b.ui_status || "").toLowerCase();

  if (s === "paid_confirmed") return { label: "Paid • Confirmed", kind: "ok" };
  if (s === "paid_manual_review") return { label: "Paid • Manual Review", kind: "warn" };
  if (s === "payment_link_expired") return { label: "Payment Link Expired", kind: "danger" };
  if (s === "cancelled") return { label: "Cancelled", kind: "neutral" };

  // Fallbacks
  if ((b.payment_status || "").toLowerCase() === "paid") return { label: "Paid", kind: "ok" };
  if ((b.payment_status || "").toLowerCase() === "unpaid") return { label: "Unpaid", kind: "warn" };

  return { label: b.ui_status || "Unknown", kind: "neutral" };
}

function matchesFilter(b: ApiBooking, filter: FilterKey): boolean {
  const ui = (b.ui_status || "").toLowerCase();
  const pay = (b.payment_status || "").toLowerCase();
  const book = (b.booking_status || "").toLowerCase();

  if (filter === "all") return true;
  if (filter === "needs_review") return Boolean(b.requires_manual_review_derived);
  if (filter === "paid") return pay === "paid";
  if (filter === "unpaid") return pay === "unpaid";
  if (filter === "expired") return ui === "payment_link_expired";
  if (filter === "cancelled") return ui === "cancelled" || book === "cancelled";
  return true;
}

function safeCompare(a?: string | null, b?: string | null) {
  return (a || "").localeCompare(b || "");
}

function sortBookings(list: ApiBooking[]): ApiBooking[] {
  // Primary: session_date asc
  // Secondary: start_time asc
  // Tertiary: created_at desc (newest first) to keep stable
  return [...list].sort((x, y) => {
    const d = safeCompare(x.session_date, y.session_date);
    if (d !== 0) return d;

    const t = safeCompare(x.start_time, y.start_time);
    if (t !== 0) return t;

    // created_at desc
    return safeCompare(y.created_at, x.created_at);
  });
}

export default function BookingsPage() {
  const [state, setState] = useState<LoadState>({ status: "idle" });
  const [filter, setFilter] = useState<FilterKey>("all");
  const nav = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setState({ status: "loading" });

      try {
        const res = await apiFetch("/api/v1/dashboard/bookings", { method: "GET" });
        const json = (await res.json().catch(() => ({}))) as any;

        if (!res.ok || json?.ok === false) {
          const msg = json?.message || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        if (isMounted) setState({ status: "ok", data: json as ApiResponse });
      } catch (err: any) {
        if (isMounted) setState({ status: "error", message: err?.message || "Load failed" });
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const bookings = useMemo(() => {
    if (state.status !== "ok") return [];
    const raw = state.data.bookings || [];
    const filtered = raw.filter((b) => matchesFilter(b, filter));
    return sortBookings(filtered);
  }, [state, filter]);

  const counts = useMemo(() => {
    if (state.status !== "ok") {
      return { all: 0, needs_review: 0, paid: 0, unpaid: 0, expired: 0, cancelled: 0 };
    }
    const raw = state.data.bookings || [];
    const c = {
      all: raw.length,
      needs_review: raw.filter((b) => matchesFilter(b, "needs_review")).length,
      paid: raw.filter((b) => matchesFilter(b, "paid")).length,
      unpaid: raw.filter((b) => matchesFilter(b, "unpaid")).length,
      expired: raw.filter((b) => matchesFilter(b, "expired")).length,
      cancelled: raw.filter((b) => matchesFilter(b, "cancelled")).length,
    };
    return c;
  }, [state]);

  return (
    <div style={styles.page}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h1 style={styles.h1}>Bookings</h1>

        {state.status === "ok" ? (
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Operator <strong>#{state.data.operator_id}</strong> • Week {state.data.week?.start} → {state.data.week?.end}
          </div>
        ) : null}
      </div>

      {state.status === "loading" || state.status === "idle" ? <div style={styles.card}>Loading bookings…</div> : null}

      {state.status === "error" ? (
        <div style={styles.bannerError}>
          <strong>Bookings load failed.</strong>
          <div style={{ marginTop: 6 }}>{state.message}</div>
        </div>
      ) : null}

      {state.status === "ok" ? (
        <>
          {/* Filter chips */}
          <div style={styles.chipsRow}>
            <Chip label={`All (${counts.all})`} active={filter === "all"} onClick={() => setFilter("all")} />
            <Chip
              label={`Needs Review (${counts.needs_review})`}
              active={filter === "needs_review"}
              onClick={() => setFilter("needs_review")}
            />
            <Chip label={`Paid (${counts.paid})`} active={filter === "paid"} onClick={() => setFilter("paid")} />
            <Chip label={`Unpaid (${counts.unpaid})`} active={filter === "unpaid"} onClick={() => setFilter("unpaid")} />
            <Chip label={`Expired (${counts.expired})`} active={filter === "expired"} onClick={() => setFilter("expired")} />
            <Chip
              label={`Cancelled (${counts.cancelled})`}
              active={filter === "cancelled"}
              onClick={() => setFilter("cancelled")}
            />
          </div>

          {/* Cards */}
          <div style={{ height: 10 }} />

          {bookings.length === 0 ? (
            <div style={styles.card}>No bookings match this filter.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bookings.map((b) => (
                <BookingCard
                  key={b.booking_id}
                  b={b}
                  onOpen={() => nav(`/dashboard/bookings/${b.booking_id}`, { state: { booking: b } })}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function Chip(props: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      style={{
        ...styles.chip,
        ...(props.active ? styles.chipActive : null),
      }}
    >
      {props.label}
    </button>
  );
}

function BookingCard({ b, onOpen }: { b: ApiBooking; onOpen: () => void }) {
  const badge = getUiBadge(b);

  const needsReview = Boolean(b.requires_manual_review_derived);

  return (
    <button
      onClick={onOpen}
      style={{ ...styles.card, textAlign: "left", cursor: "pointer" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis" }}>
            {b.guest_name || "Guest"}{" "}
            <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.7 }}>• x{b.headcount ?? "—"}</span>
          </div>

          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
            <strong>{b.site_name || "Site"}</strong> • {formatDate(b.session_date)} • {b.start_time || "—"}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={badgeStyle(badge.kind)}>{badge.label}</span>

            {needsReview ? <span style={badgeStyle("warn")}>Needs Review</span> : null}

            <span style={badgeStyle("neutral")}>{formatMoney(b.payment_currency, b.payment_amount)}</span>

            <span style={badgeStyle("neutral")}>
              Pay: {(b.payment_status || "unknown").toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "right", fontSize: 12, opacity: 0.8 }}>
          <div>
            <strong>#{b.booking_id}</strong>
          </div>
          <div style={{ marginTop: 6 }}>{(b.source || "—").toUpperCase()}</div>
        </div>
      </div>

      {/* Footer details */}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.08)", fontSize: 12, opacity: 0.85 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <span>
            Session <strong>#{b.session_id}</strong>
          </span>
          <span>
            Itinerary <strong>#{b.itinerary_id}</strong>
          </span>
          <span>
            Status <strong>{(b.booking_status || "—").toUpperCase()}</strong>
          </span>
          {b.paid_at ? <span>Paid at {b.paid_at}</span> : null}
          {b.hold_expires_at ? <span>Hold expires {b.hold_expires_at}</span> : null}
          {b.manual_review_reason ? <span>Review: {b.manual_review_reason}</span> : null}
        </div>
      </div>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 16, maxWidth: 900 },
  h1: { fontSize: 22, fontWeight: 900, margin: "6px 0 12px" },

  card: {
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: 14,
    background: "#fff",
  },

  bannerError: {
    border: "1px solid rgba(220, 38, 38, 0.35)",
    background: "rgba(220, 38, 38, 0.08)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(0,0,0,0.03)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },

  chipActive: {
    background: "rgba(0, 212, 255, 0.22)",
    border: "1px solid rgba(0, 212, 255, 0.55)",
  },
};
