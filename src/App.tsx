/*
 File: App.tsx
 Path: src/App.tsx
 Description: Main entry for AQUORIX Pro/Admin Dashboard. Sets up routing and authentication guards for all app routes.
 Author: AQUORIX Engineering
 Version:1.3.1
 Created: 2025-07-07
 Last Updated: 2025-12-30
 Status: Production, RBAC refactored
 Dependencies: React, React Router DOM, useAquorixUser
 Notes: Adds AuthCallback route to support Supabase Confirm Email flow.
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

import ProDashboardShell from './features/dashboard/ProDashboardShell';
import ProDashboardMock from './features/dashboard/ProDashboardMock';
import SchedulePage from './features/dashboard/pages/SchedulePage';

import AuthCallback from './pages/AuthCallback';

function App() {
  // DEBUG: Confirm running source
  const debugBanner = null;

  return (
    <SystemHealthLogProvider>
      {debugBanner}
      <Routes>
        {/* Auth callback landing (email confirm / magic link / etc.) */}
        <Route path="/" element={<AuthCallback />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Admin routes - protected */}
        <Route
          element={
            <RequireAuth allowedRoles={ADMIN_DASHBOARD_ROLES}>
              <Outlet />
            </RequireAuth>
          }
        >
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

        {/* Default: send unknown routes to callback (so confirmations don't get bounced to /login prematurely) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SystemHealthLogProvider>
  );
}

export default App;