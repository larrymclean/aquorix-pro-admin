/*
  File: navigation.ts
  Path: src/config/navigation.ts
  Description: Phase C navigation config (grouped) driven by ui_mode + permissions from /api/v1/me.
               IMPORTANT: permissions are the only gating input. tier_level is display-only.

  Author: Larry McLean + AI Team
  Created: 2026-01-08
  Version: 1.0.0

  Last Updated: 2026-01-08
  Status: Active (Phase C)

  Change Log (append-only):
    - 2026-01-08 - v1.0.0 (Larry McLean + AI Team)
      - Create Phase C nav config driven by ui_mode + permissions
      - Use only canonical permission keys present in /api/v1/me today
      - Support grouped nav + hide/disabled display modes
*/

export type UiMode = 'admin' | 'pro' | 'affiliate';

export type DisplayMode = 'show' | 'hide' | 'disabled';

export type PermissionKey =
  | 'can_use_admin_tools'
  | 'can_use_operator_tools'
  | 'can_use_affiliate_tools'
  | 'can_view_schedule'
  | 'can_edit_profile'
  | 'can_manage_operator'
  | 'can_edit'
  | 'can_approve'
  | 'can_modify_config';

export type Permissions = Partial<Record<PermissionKey, boolean>>;

export interface NavItem {
  label: string;
  path: string;

  // Which shell(s) this item belongs to
  uiModes: UiMode[];

  // Permission gating: AND semantics (all must be true)
  requiredPermissions?: PermissionKey[];

  // Default behavior when unauthorized: hide (Phase C default)
  display?: DisplayMode;

  // For disabled items only
  disabledReason?: string;

  // Keep icons simple for now; we can map iconKey -> Lucide later
  iconKey?: string;
}

export interface NavGroup {
  group: string;
  uiModes: UiMode[];
  items: NavItem[];
}

export const NAV_CONFIG: NavGroup[] = [
  // -----------------------------
  // ADMIN
  // -----------------------------
  {
    group: 'Platform',
    uiModes: ['admin'],
    items: [
      {
        label: 'Overview',
        path: '/admin/overview',
        uiModes: ['admin'],
        iconKey: 'overview',
      },
      {
        label: 'Users',
        path: '/admin/users',
        uiModes: ['admin'],
        iconKey: 'users',
        requiredPermissions: ['can_use_admin_tools'],
      },
      {
        label: 'System Health',
        path: '/admin/system-health',
        uiModes: ['admin'],
        iconKey: 'health',
        requiredPermissions: ['can_modify_config'],
      },
      {
        label: 'Audit Log',
        path: '/admin/audit',
        uiModes: ['admin'],
        iconKey: 'audit',
        display: 'disabled',
        disabledReason: 'Coming soon',
      },
    ],
  },

  // -----------------------------
  // PRO
  // -----------------------------
  {
    group: 'Operations',
    uiModes: ['pro'],
    items: [
      {
        label: 'Overview',
        path: '/dashboard',
        uiModes: ['pro'],
        iconKey: 'overview',
        requiredPermissions: ['can_use_operator_tools'],
      },
      {
        label: 'Schedule',
        path: '/dashboard/schedule',
        uiModes: ['pro'],
        iconKey: 'calendar',
        requiredPermissions: ['can_view_schedule'],
      },
      {
        label: 'Bookings',
        path: '/dashboard/bookings',
        uiModes: ['pro'],
        iconKey: 'bookings',
        display: 'disabled',
        disabledReason: 'Coming soon',
      },
    ],
  },
  {
    group: 'Account',
    uiModes: ['pro'],
    items: [
      {
        label: 'Profile',
        path: '/dashboard/profile',
        uiModes: ['pro'],
        iconKey: 'profile',
        requiredPermissions: ['can_edit_profile'],
      },
    ],
  },

  // -----------------------------
  // AFFILIATE
  // -----------------------------
  {
    group: 'Partner',
    uiModes: ['affiliate'],
    items: [
      {
        label: 'Overview',
        path: '/partner/overview',
        uiModes: ['affiliate'],
        iconKey: 'overview',
        requiredPermissions: ['can_use_affiliate_tools'],
      },
      {
        label: 'Commissions',
        path: '/partner/commissions',
        uiModes: ['affiliate'],
        iconKey: 'commissions',
        display: 'disabled',
        disabledReason: 'Coming soon',
      },
    ],
  },
];

/**
 * Returns only nav groups relevant to a ui_mode.
 */
export function getNavForMode(uiMode: UiMode): NavGroup[] {
  return NAV_CONFIG.filter((g) => g.uiModes.includes(uiMode));
}

/**
 * Filter items by permissions.
 * Phase C policy:
 * - Default unauthorized behavior: HIDE
 * - If display === 'disabled', keep item but mark disabled
 */
export function resolveVisibleNav(
  uiMode: UiMode,
  permissions: Permissions
): Array<NavGroup & { items: Array<NavItem & { isDisabled?: boolean; reason?: string }> }> {
  const groups = getNavForMode(uiMode);

  return groups
    .map((group) => {
      const resolvedItems = group.items
        .map((item) => {
          const required = item.requiredPermissions ?? [];
          const allowed = required.every((k) => Boolean(permissions?.[k]));

          if (allowed) return { ...item, isDisabled: false };

          const display = item.display ?? 'hide';

          if (display === 'disabled') {
            return {
              ...item,
              isDisabled: true,
              reason: item.disabledReason || 'Unavailable',
            };
          }

          // hide by default
          return null;
        })
        .filter(Boolean) as Array<NavItem & { isDisabled?: boolean; reason?: string }>;

      return { ...group, items: resolvedItems };
    })
    .filter((g) => g.items.length > 0);
}