/*
 * File: theme.config.ts
 * Path: src/theme.config.ts
 * Description: Central theme registry for AQUORIX dashboard. Defines all theme classes, tokens, and layout refs for dynamic theming.
 * Author: AQUORIX Engineering & Design
 * Created: 2025-07-09
 * Last Updated: 2026-01-10
 * Status: MVP scaffold (Phase D: Canonicalization Pass)
 * Dependencies: ThemeProvider.tsx, themes.css
 * Notes:
 * - Extend this config as new themes/tiers are added.
 * - Do not hardcode theme logic elsewhere.
 * - cssClass MUST match classes in src/styles/themes.css exactly.
 * Change Log (append-only):
 *   - 2026-01-10 - v1.3.0 (Larry McLean + AI Team):
 *     - Add canonical dashboard themes: blue-steel (Admin), dive-locker (Pro), bamboo-safari (Affiliate)
 *     - Keep legacy keys but migrate cssClass to new theme-* classes
 *     - Add Tier 0 mapping to Blue Steel
 */

import type { ComponentType } from 'react';

// Types for theme registry
export type ThemeKey =
  | 'marina' // legacy key (kept for compatibility)
  | 'bamboo' // legacy key (kept for compatibility)
  | 'blue-steel'
  | 'dive-locker'
  | 'bamboo-safari';

export interface ThemeConfig {
  name: string;
  cssClass: string;
  layout: ComponentType<any>;
  colors: Record<string, string>;
  logoUrl?: string;
}

// Placeholder imports for layouts (replace with actual imports as implemented)
// import { MarinaPortalLayout } from './layouts/MarinaPortalLayout';
// import { BambooSafariLayout } from './layouts/BambooSafariLayout';
// import { BlueSteelLayout } from './layouts/BlueSteelLayout';
// import { DiveLockerLayout } from './layouts/DiveLockerLayout';

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  /**
   * Legacy keys kept for backward compatibility.
   * Canonical cssClass values are now theme-* (from src/styles/themes.css).
   */
  marina: {
    name: 'Marina Blue Grid (Legacy Key)',
    cssClass: 'theme-dive-locker', // IMPORTANT: canonical Pro theme class
    layout: undefined as any,
    colors: {
      blue: '#1b4d6f',
      aqua: '#00d4ff',
      lightAqua: '#74a8d4',
      lightCobalt: '#248dc1',
      slateGray: '#4a5c6a',
      pearlWhite: '#f5f6f5',
      lightSkyBlue: '#d0edf6',
    },
    logoUrl: '/assets/marina-logo.svg',
  },

  bamboo: {
    name: 'Bamboo Safari (Legacy Key)',
    cssClass: 'theme-bamboo-safari', // IMPORTANT: canonical Affiliate theme class
    layout: undefined as any,
    colors: {
      green: '#5b7f4a',
      gold: '#e9c46a',
      beige: '#f7f1e1',
      earth: '#a98467',
      safariBlack: '#22231a',
    },
    logoUrl: '/assets/bamboo-logo.svg',
  },

  /**
   * Canonical keys (preferred going forward)
   */
  'blue-steel': {
    name: 'Blue Steel (Admin)',
    cssClass: 'theme-blue-steel',
    layout: undefined as any,
    colors: {
      deepAqua: '#1b4d6f',
      cobalt: '#0a6c9b',
      lightCobalt: '#248dc1',
      neonCyan: '#00d4ff',
      slate: '#4a5c6a',
      pearl: '#f5f6f5',
    },
    logoUrl: '/assets/aqx-admin-logo.svg',
  },

  'dive-locker': {
    name: 'Dive Locker (Pro)',
    cssClass: 'theme-dive-locker',
    layout: undefined as any,
    colors: {
      deepAqua: '#1b4d6f',
      cobalt: '#0a6c9b',
      lightCobalt: '#248dc1',
      neonCyan: '#00d4ff',
      slate: '#4a5c6a',
      pearl: '#f5f6f5',
    },
    logoUrl: '/assets/aqx-pro-logo.svg',
  },

  'bamboo-safari': {
    name: 'Bamboo Safari (Affiliate)',
    cssClass: 'theme-bamboo-safari',
    layout: undefined as any,
    colors: {
      bamboo: '#3f704d',
      moss: '#a3b18a',
      sand: '#f5f3e7',
      gold: '#d6b36a',
      ink: '#14110b',
    },
    logoUrl: '/assets/aqx-affiliate-logo.svg',
  },
};

// Utility: Get theme config by tier
// Tier 0 = Admin (Blue Steel)
// Tier 1–4 = Pro (Dive Locker)
// Tier 5 = Affiliate (Bamboo Safari)
export function getThemeByTier(tier: number): ThemeConfig {
  if (tier === 0) return THEMES['blue-steel'];
  if (tier >= 1 && tier <= 4) return THEMES['dive-locker'];
  if (tier === 5) return THEMES['bamboo-safari'];

  // Default fallback
  return THEMES['dive-locker'];
}
