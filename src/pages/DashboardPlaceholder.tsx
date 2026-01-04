/*
 * File: DashboardPlaceholder.tsx
 * Path: src/pages/DashboardPlaceholder.tsx
 * Description:
 *   Phase B+ Pro Dashboard entry point.
 *   - Replaces legacy redirect placeholder.
 *   - Mounts the real ProDashboardShell + default page (Schedule).
 *
 * Author: AQUORIX Engineering
 * Created: 2025-09-19
 * Updated: 2025-12-29
 *
 * Change Log:
 * 2025-12-29 - v1.1.0
 *   - Replace redirect-only placeholder with real Pro dashboard mount
 *   - Enables real branding via /api/v1/me in TopNav
 */

import React from 'react';
import ProDashboardShell from '../features/dashboard/ProDashboardShell';
import SchedulePage from '../features/dashboard/pages/SchedulePage';

export default function DashboardPlaceholder() {
  return (
    <ProDashboardShell>
      <SchedulePage />
    </ProDashboardShell>
  );
}