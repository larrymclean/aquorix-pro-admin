/*
 * File: theme.config.ts
 * Path: src/theme.config.ts
 * Description: Central theme registry for AQUORIX dashboard. Defines all theme classes, tokens, and layout refs for dynamic theming.
 * Author: AQUORIX Engineering & Design
 * Created: 2025-07-09
 * Last Updated: 2025-07-09
 * Status: MVP scaffold
 * Dependencies: MarinaPortalLayout, BambooSafariLayout, CSS Modules, React Context
 * Notes: Extend this config as new themes/tiers are added. Do not hardcode theme logic elsewhere.
 * Change Log:
 *   2025-07-09 (AQUORIX Eng): Initial creation for dashboard extension project.
 */

// Types for theme registry
export type ThemeKey = 'marina' | 'bamboo';

export interface ThemeConfig {
  name: string;
  cssClass: string;
  layout: React.ComponentType<any>;
  colors: Record<string, string>;
  logoUrl?: string;
}

// Placeholder imports for layouts (replace with actual imports as implemented)
// import { MarinaPortalLayout } from './layouts/MarinaPortalLayout';
// import { BambooSafariLayout } from './layouts/BambooSafariLayout';

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  marina: {
    name: 'Marina Blue Grid',
    cssClass: 'aqx-pro-dashboard-theme',
    layout: undefined as any, // Replace with MarinaPortalLayout,
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
    name: 'Bamboo Safari',
    cssClass: 'aqx-affiliate-dashboard-theme',
    layout: undefined as any, // Replace with BambooSafariLayout,
    colors: {
      green: '#5b7f4a',
      gold: '#e9c46a',
      beige: '#f7f1e1',
      earth: '#a98467',
      safariBlack: '#22231a',
    },
    logoUrl: '/assets/bamboo-logo.svg',
  },
};

// Utility: Get theme config by tier (1–4 = marina, 5 = bamboo)
export function getThemeByTier(tier: number): ThemeConfig {
  if (tier >= 1 && tier <= 4) return THEMES.marina;
  if (tier === 5) return THEMES.bamboo;
  // Default fallback
  return THEMES.marina;
}
