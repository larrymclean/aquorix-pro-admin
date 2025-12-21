/*
 File: App.tsx
 Path: src/App.tsx
 Description: Main entry for AQUORIX Pro/Admin Dashboard. Sets up routing and authentication guards for all app routes.
 Author: AQUORIX Engineering
 Version:1.3.0
 Created: 2025-07-07
 Last Updated: 2025-09-14
 Last Updated: 2025-11-28
 Status: Production, RBAC refactored
 Dependencies: React, React Router DOM, useAquorixUser
 Notes: Debug banner removed for production cleanup. Uses AQUORIX backend for all RBAC and dashboard context.
 Notes: Debug banner removed for production cleanup.
 Change Log:
 - 2025-07-07, AQUORIX Engineering: Refactored to add routing and auth guards.
 - 2025-07-08, AQUORIX Engineering: Remove debug banner for production cleanup.
 - 2025-07-11, AQUORIX Engineering: Update dashboard route guard to allow all eligible roles, add NotAuthorized route.
 - 2025-09-07, Removed Dashboard placeholder text, added import for dash test page
 - 2025-09-14, AQUORIX Engineering: Added Outlet import and fixed admin route RequireAuth wrapper to include children element.
 - 2025-11-28, Added routes for ProDashboardMock
 - 2025-12-04, Modified for new Pro Dashboard MVP v 1.1.3
*/

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AQXAdminLayout from './layouts/AQXAdminLayout';
import { ADMIN_DASHBOARD_ROLES } from './routes.config';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import SetPassword from './pages/SetPassword';
import RequireAuth from './components/RequireAuth';
import SystemHealth from './pages/admin/SystemHealth';
import { SystemHealthLogProvider } from './context/SystemHealthLogContext';
import './styles/AQXAdmin.css';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import ProDashboardShell from './features/dashboard/ProDashboardShell';
import ProDashboardMock from './features/dashboard/ProDashboardMock';
import SchedulePage from './features/dashboard/pages/SchedulePage';

function App() {
  // DEBUG: Confirm running source
  const debugBanner = null;

  return (
    <SystemHealthLogProvider>
      {debugBanner}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Admin routes - protected, all canonical internal admin roles */}
        <Route element={
          <RequireAuth allowedRoles={ADMIN_DASHBOARD_ROLES}>
            <Outlet />
          </RequireAuth>
        }>
          <Route path="/admin/*" element={<AQXAdminLayout />} />
          <Route path="/admin/system-health" element={<SystemHealth />} />
        </Route>
        
        {/* Dashboard – temporarily public for UI build */}
        <Route path="/dashboard" element={<ProDashboardShell />}>
          <Route index element={<ProDashboardMock />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>
        
        {/* Not Authorized route */}
        <Route path="/not-authorized" element={React.createElement(require('./pages/NotAuthorized').default)} />
        
        {/* Default: redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </SystemHealthLogProvider>
  );
}

export default App;