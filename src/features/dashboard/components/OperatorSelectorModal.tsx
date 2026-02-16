/*
  File:        OperatorSelectorModal.tsx
  Path:        src/features/dashboard/components/OperatorSelectorModal.tsx
  Description: Phase 6 UI gate: modal selector for multi-affiliation users.
               Shows operator affiliations from /api/v1/me and allows user to pick one.
               Does NOT fetch /api/v1/me itself. Caller supplies affiliations + handlers.

  Author:      Larry McLean
  Created:     2026-02-16
  Version:     1.0.0

  Last Updated: 2026-02-16
  Status:      ACTIVE (Phase 6)

  Change Log:
    - 2026-02-16 - v1.0.0 (Larry McLean):
      - Initial modal selector for operator affiliations (Phase 6).
*/

import React from "react";

export type OperatorAffiliation = {
  operator_id: string; // backend returns strings in your /me payload
  name: string;
  slug: string;
  role?: string;
};

type Props = {
  isOpen: boolean;
  affiliations: OperatorAffiliation[];
  activeOperatorId?: string | null;
  isSubmitting?: boolean;
  error?: string | null;
  onSelectOperator: (operatorId: string) => void;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const modalStyle: React.CSSProperties = {
  width: "min(680px, 92vw)",
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 8px 40px rgba(0,0,0,0.25)"
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 12
};

const itemBtnStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 14,
  background: "#fff",
  cursor: "pointer"
};

export default function OperatorSelectorModal(props: Props) {
  const {
    isOpen,
    affiliations,
    activeOperatorId,
    isSubmitting = false,
    error,
    onSelectOperator
  } = props;

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Select Operator">
      <div style={modalStyle}>
        <h2 style={{ margin: 0 }}>Select Operator</h2>
        <p style={{ marginTop: 8, marginBottom: 8 }}>
          Your account has access to multiple operators. Choose one to scope your dashboard.
        </p>

        {error ? (
          <div
            style={{
              border: "1px solid #f2b8b5",
              background: "#fdecea",
              padding: 10,
              borderRadius: 8,
              marginTop: 10
            }}
          >
            <strong>Selection failed:</strong> {error}
          </div>
        ) : null}

        <div style={listStyle}>
          {affiliations.map((a) => {
            const isActive = activeOperatorId && String(activeOperatorId) === String(a.operator_id);

            return (
              <button
                key={a.operator_id}
                style={{
                  ...itemBtnStyle,
                  borderColor: isActive ? "#111" : "#ddd",
                  opacity: isSubmitting ? 0.7 : 1
                }}
                disabled={isSubmitting}
                onClick={() => onSelectOperator(String(a.operator_id))}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {a.slug} {a.role ? `• ${a.role}` : ""}
                    </div>
                  </div>
                  {isActive ? (
                    <div style={{ fontSize: 12, fontWeight: 700 }}>CURRENT</div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
          Note: This selection is saved and will persist across sessions.
        </p>
      </div>
    </div>
  );
}
