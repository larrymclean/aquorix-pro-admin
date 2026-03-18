/*
  File:        BookingCard.tsx
  Path:        /Users/larrymclean/CascadeProjects/aquorix-frontend/src/features/dashboard/components/BookingCard.tsx
  Description:
    Phase 9G Dashboard Truth MVP:
    Presentational booking summary card for operator-facing dashboard queue.

    This component is intentionally dumb/presentational:
    - Receives a fully prepared booking object from backend/API layer
    - Displays high-priority operational booking truth
    - Does not make API calls
    - Does not infer booking lifecycle
    - Does not mutate state

    Doctrine:
    - Backend defines truth; UI reflects truth
    - Booking header is the primary card unit
    - Booking items / sessions are summarized, not re-derived here
    - Keep styling simple, stable, and easy to refine later

  Author: AQUORIX Team
  Created: 2026-03-15
  Version: 0.1.0

  Change Log (append-only):
    - 2026-03-15 - v0.1.0
      - Initial developer-ready skeleton for BookingCard MVP
*/

import React from "react";

export type BookingCardData = {
  booking_id: string | number;
  guest_name: string;
  guest_email?: string | null;
  guest_phone?: string | null;

  booking_status: string;
  payment_status: string;
  ui_status: string;

  total_pax?: number | null;
  item_count?: number | null;

  first_session_at_local?: string | null;
  last_session_at_local?: string | null;

  booking_items_summary?: string | null;
  sites_summary?: string | null;

  payment_currency?: string | null;
  payment_amount?: string | null;
  payment_amount_minor?: string | number | null;

  stripe_charge_currency?: string | null;
  stripe_charge_amount_minor?: string | number | null;

  source?: string | null;
  created_at?: string | null;
};

type BookingCardProps = {
  booking: BookingCardData;
  onOpen?: (booking: BookingCardData) => void;
};

function labelize(value?: string | null): string {
  if (!value) return "—";
  return String(value).replace(/_/g, " ");
}

function formatDisplayDateTime(value?: string | null): string {
  if (!value) return "—";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function formatDisplayDate(value?: string | null): string {
  if (!value) return "—";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function formatMoney(
  currency?: string | null,
  amount?: string | null,
  amountMinor?: string | number | null
): string {
  if (amount && currency) return `${currency} ${amount}`;

  if (amountMinor !== undefined && amountMinor !== null && currency) {
    const n = Number(amountMinor);
    if (Number.isFinite(n)) {
      const divisor = String(currency).toUpperCase() === "JOD" ? 1000 : 100;
      return `${currency} ${(n / divisor).toFixed(2)}`;
    }
  }

  if (currency) return `${currency} —`;
  return "—";
}

function getUiStatusTone(
  uiStatus: string
): "success" | "warning" | "danger" | "neutral" | "info" {
  const s = String(uiStatus || "").toLowerCase();

  if (s === "paid_confirmed") return "success";
  if (s === "paid_manual_review") return "warning";
  if (s === "awaiting_payment") return "info";
  if (s === "payment_link_expired") return "danger";
  if (s === "cancelled") return "neutral";

  return "neutral";
}

function getStatusPillStyle(
  tone: "success" | "warning" | "danger" | "neutral" | "info"
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    lineHeight: 1,
    border: "1px solid rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
  };

  if (tone === "success") {
    return {
      ...base,
      background: "rgba(16,185,129,0.12)",
      border: "1px solid rgba(16,185,129,0.35)",
      color: "#065f46",
    };
  }

  if (tone === "warning") {
    return {
      ...base,
      background: "rgba(245,158,11,0.12)",
      border: "1px solid rgba(245,158,11,0.35)",
      color: "#92400e",
    };
  }

  if (tone === "danger") {
    return {
      ...base,
      background: "rgba(220,38,38,0.10)",
      border: "1px solid rgba(220,38,38,0.30)",
      color: "#991b1b",
    };
  }

  if (tone === "info") {
    return {
      ...base,
      background: "rgba(59,130,246,0.10)",
      border: "1px solid rgba(59,130,246,0.28)",
      color: "#1d4ed8",
    };
  }

  return {
    ...base,
    background: "rgba(0,0,0,0.04)",
    color: "#374151",
  };
}

export default function BookingCard({ booking, onOpen }: BookingCardProps) {
  const {
    booking_id,
    guest_name,
    booking_status,
    payment_status,
    ui_status,
    total_pax,
    item_count,
    first_session_at_local,
    last_session_at_local,
    booking_items_summary,
    sites_summary,
    payment_currency,
    payment_amount,
    payment_amount_minor,
    source,
    created_at,
  } = booking;

  const uiTone = getUiStatusTone(ui_status);

  function handleOpen() {
    if (onOpen) onOpen(booking);
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      style={styles.card}
      aria-label={`Open booking ${booking_id}`}
    >
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <div style={styles.bookingId}>Booking #{booking_id}</div>
          <div style={styles.guestName}>{guest_name || "Guest"}</div>
        </div>

        <div style={styles.headerRight}>
          <span style={getStatusPillStyle(uiTone)}>
            {labelize(ui_status).toUpperCase()}
          </span>
        </div>
      </div>

      <div style={styles.metaRow}>
        <span style={styles.metaText}>
          <strong>{total_pax ?? 0}</strong> Divers
        </span>
        <span style={styles.metaDivider}>|</span>
        <span style={styles.metaText}>
          <strong>{item_count ?? 0}</strong> Sessions
        </span>
        <span style={styles.metaDivider}>|</span>
        <span style={styles.metaText}>
          {formatMoney(payment_currency, payment_amount, payment_amount_minor)}
        </span>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Booking Window</div>
        <div style={styles.sectionValue}>
          {formatDisplayDateTime(first_session_at_local)}
          {last_session_at_local && last_session_at_local !== first_session_at_local ? (
            <> → {formatDisplayDateTime(last_session_at_local)}</>
          ) : null}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Sites</div>
        <div style={styles.sectionValue}>
          {sites_summary || "—"}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Sessions</div>
        <div style={styles.sectionValueSmall}>
          {booking_items_summary || "—"}
        </div>
      </div>

      <div style={styles.footerRow}>
        <div style={styles.footerLeft}>
          <div style={styles.footerText}>
            Booking: <strong>{labelize(booking_status).toUpperCase()}</strong>
          </div>
          <div style={styles.footerText}>
            Payment: <strong>{labelize(payment_status).toUpperCase()}</strong>
          </div>
        </div>

        <div style={styles.footerRight}>
          <div style={styles.footerText}>
            Source: <strong>{String(source || "—").toUpperCase()}</strong>
          </div>
          <div style={styles.footerText}>
            Created: <strong>{formatDisplayDate(created_at)}</strong>
          </div>
        </div>
      </div>

      <div style={styles.openHint}>View Details →</div>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    width: "100%",
    textAlign: "left",
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 16,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  headerLeft: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  headerRight: {
    flexShrink: 0,
  },

  bookingId: {
    fontSize: 12,
    fontWeight: 900,
    color: "#475569",
    letterSpacing: "0.02em",
  },

  guestName: {
    fontSize: 20,
    fontWeight: 950,
    color: "#0f172a",
    lineHeight: 1.15,
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },

  metaText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: 700,
  },

  metaDivider: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 700,
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: 900,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  sectionValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.4,
  },

  sectionValueSmall: {
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
    lineHeight: 1.45,
    wordBreak: "break-word",
  },

  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-end",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    paddingTop: 12,
    flexWrap: "wrap",
  },

  footerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  footerRight: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    textAlign: "right",
  },

  footerText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: 600,
  },

  openHint: {
    fontSize: 12,
    fontWeight: 900,
    color: "#0ea5e9",
    alignSelf: "flex-end",
  },
};