/*
  File: AdminContent.tsx
  Path: src/components/AdminContent.tsx
  Description: Handles routing for admin dashboard MVP sections. Renders the correct page based on the nested route. Now theme-aware via ThemeProvider.
  Author: AQUORIX Engineering
  Created: 2025-07-07
  Last Updated: 2025-07-09
  Status: MVP, theme integration
  Dependencies: React, react-router-dom, ThemeProvider
  Notes: Now uses theme context for theme class.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Refactor for theme context integration.
    - 2025-07-07 to 2025-07-08, see previous logs for MVP and routing updates.
*/

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Overview from '../pages/admin/Overview';
import UserManagement from '../pages/admin/UserManagement';
import AuditLog from '../pages/admin/AuditLog';
import Profile from '../pages/admin/Profile';
import Settings from '../pages/admin/Settings';
import Reports from '../pages/admin/Reports';
import SystemHealth from '../pages/admin/SystemHealth';
import DiveCenterMgmt from '../pages/admin/DiveCenterMgmt';
import ProjectStatus from '../pages/admin/ProjectStatus';
import IslandMode from '../pages/admin/IslandMode';
import AffiliateManagement from '../pages/admin/AffiliateManagement';
import Calendar from '../pages/admin/Calendar';

import '../styles/AQXAdmin.css';
import { useTheme } from './ThemeProvider';

const AdminContent = () => {
  // --- Theme logic: use context for theme class ---
  const activeTheme = useTheme();
  return (
    <div className={`content-area ${activeTheme.cssClass}`}>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit-log" element={<AuditLog />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="system-health" element={<SystemHealth />} />
        <Route path="dive-center" element={<DiveCenterMgmt />} />
        <Route path="project-status" element={<ProjectStatus />} />
        <Route path="island-mode" element={<IslandMode />} />
        <Route path="profile" element={<Profile />} />
        <Route path="affiliates" element={<AffiliateManagement />} />
        <Route path="calendar" element={<Calendar />} />
        {/* Default: redirect to overview */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default AdminContent;
