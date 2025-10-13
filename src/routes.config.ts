/*
 * File: routes.config.ts
 * Path: src/routes.config.ts
 * Description: Centralized route configuration for AQUORIX Pro/Admin Dashboard. Defines all app routes, allowed roles/tiers, and dashboard theming for maintainability and auditability.
 * Author: AQUORIX Engineering
 * Created: 2025-07-11
 * Last Updated: 2025-07-11
 * Status: MVP, active
 * Dependencies: React Router, role/tier logic
 * Notes: All route guards and theming should reference this config as the single source of truth.
 * Change Log:
 *   2025-07-11 (AQUORIX Eng): Initial creation. Migrated all route/role/tier logic from App.tsx.
 *   2025-07-11 (AQUORIX Eng): Updated DASHBOARD_ROLES and allowedRoles to match canonical matrix; added onboarding route config.
 *   2025-07-11 (AQUORIX Eng): Update dashboard route to use DashboardPlaceholder from pages/ (DIR, PM-approved).
 */

export type RouteConfig = {
  path: string;
  element: React.ComponentType<any>;
  allowedRoles: string[];
  minTier?: number;
  maxTier?: number;
  themeClass?: string | ((tier: number) => string); // Can be a string or a function returning a class
  children?: RouteConfig[];
};

// Dashboard-eligible roles (canonical, lowercase, enforced everywhere)
// See RBAC matrix below for dashboard types and canonical role/tier mapping.
export const DASHBOARD_ROLES = [
  'pro_user',      // Tiers 1/2
  'owner',         // Tiers 3/4
  'manager',       // Tier 3
  'staff',         // Tiers 3/4 (view/edit own, view all)
  'ops_manager',   // Tier 4
  'hospitality_manager', // Tier 4
  'concierge',     // Tier 5
  'agent'          // Tier 5
];

// Internal Admin Dashboard Roles (Tier 0)
export const ADMIN_DASHBOARD_ROLES = [
  'admin', 'support', 'moderator', 'dev', 'exec', 'ops'
];

/**
 * RBAC/Dashboard Matrix (Canonical)
 * 1. Internal Admin Dashboard (Tier 0): admin, support, moderator, dev, exec, ops
 * 2. Pro Dashboard (Tier 1–4): pro_user, owner, manager, staff, ops_manager, hospitality_manager
 * 3. Affiliate Dashboard (Tier 5): concierge, agent
 *
 * Internal admin users always see the internal dashboard variant (not the pro/affiliate dashboards).
 */

// Partner Portal (tier 5) roles
export const PARTNER_DASHBOARD_ROLES = [
  'concierge', 'agent'
];

// Route configuration array
export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard/*',
    element: require('./pages/DashboardPlaceholder').default,
    allowedRoles: DASHBOARD_ROLES, // Pro dashboard (tiers 1–4 only)
    minTier: 1,
    maxTier: 4,
    themeClass: 'aqx-pro-dashboard-theme',
  },
  {
    path: '/partner/*',
    element: require('./pages/PartnerDashboardPlaceholder').default, // Placeholder, replace with real component
    allowedRoles: PARTNER_DASHBOARD_ROLES, // Partner Portal (tier 5 only)
    minTier: 5,
    maxTier: 5,
    themeClass: 'aqx-partner-dashboard-theme',
  },
  {
    path: '/onboarding',
    element: require('./pages/Onboarding').default,
    allowedRoles: [
      'pro_user', 'owner', 'manager', 'staff', 'ops_manager', 'hospitality_manager', 'concierge', 'agent'
    ], // All roles eligible for onboarding
    minTier: 1,
    maxTier: 5,
    themeClass: (tier: number) => (tier === 5 ? 'aqx-affiliate-dashboard-theme' : 'aqx-pro-dashboard-theme'),
  },
  {
    path: '/admin/*',
    element: require('./layouts/AQXAdminLayout').default,
    allowedRoles: ADMIN_DASHBOARD_ROLES, // All internal admin roles (tier 0)
  },
  {
    path: '/not-authorized',
    element: require('./pages/NotAuthorized').default,
    allowedRoles: [], // Public
  },
  // Add more routes as needed
];
