/*
  File: AdminOverview.tsx
  Path: src/pages/admin/AdminOverview.tsx
  Description: Admin landing page for AQUORIX Internal (Tier 0). Minimal MVP overview for routing validation and future expansion.

  Author: Larry McLean + AI Team
  Created: 2026-01-06
  Version: 1.0.0

  Last Updated: 2026-01-06
  Status: MVP (routing + layout validation)

  Notes:
  - This replaces legacy AdminContent-based rendering by providing a real routed page.
  - Keep this page intentionally simple until Phase C pages are finalized.

  Change Log:
    - 2026-01-06 - v1.0.0 (Author(s)): Larry McLean + AI Team
      - Initial Admin overview page (placeholder for real modules)
*/

import React from 'react';

const AdminOverview: React.FC = () => {
  return (
    <div style={{ padding: '1.25rem' }}>
      <h1 style={{ margin: 0 }}>AQUORIX Admin</h1>
      <p style={{ marginTop: '0.5rem', opacity: 0.85 }}>
        Internal tools and platform controls. (MVP routing confirmed.)
      </p>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Quick Links</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>System Health</li>
            <li>User Lookup (coming next)</li>
            <li>Operator Provisioning (coming next)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;