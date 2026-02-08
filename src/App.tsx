/*
 File: App.tsx
 Path: src/App.tsx
 Description: Main entry for AQUORIX Pro/Admin Dashboard.
 Version: 1.5.1
 Last Updated: 2026-01-06

 Phase C Lock:
 - Tier 0 Admin lands on /dashboard (shared shell)
 - /admin/* routes removed to prevent legacy gravity + churn
 - / -> /login
 - /signin -> /login
 - AuthCallback only on /auth/callback

 Change Log:
 - 2026-02-07 - v1.5.1 - DIR Fix: Add /admin/* routes
*/

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import SetPassword from './pages/SetPassword';

import RequireAuth from './components/RequireAuth';
import { SystemHealthLogProvider } from './context/SystemHealthLogContext';

import ProDashboardShell from './features/dashboard/ProDashboardShell';
import ProDashboardMock from './features/dashboard/ProDashboardMock';
import SchedulePage from './features/dashboard/pages/SchedulePage';

import AuthCallback from './pages/AuthCallback';

import AQXAdminLayout from './layouts/AQXAdminLayout';
import AdminOverview from './pages/admin/AdminOverview';

function App() {
  return (
    <SystemHealthLogProvider>
      <Routes>
        {/* Default entry */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        {/* Supabase auth callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Admin (Tier 0) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AQXAdminLayout />
            </RequireAuth>
          }
        >
          {/* Default /admin -> /admin/overview */}
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
        </Route>

        {/* Dashboard (ALL authenticated users: admin + pro + affiliate) */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <ProDashboardShell />
            </RequireAuth>
          }
        >
          <Route index element={<ProDashboardMock />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>

        {/* Not Authorized */}
        <Route path="/not-authorized" element={React.createElement(require('./pages/NotAuthorized').default)} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </SystemHealthLogProvider>
  );
}

export default App;