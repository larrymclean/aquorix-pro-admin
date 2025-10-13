/*
File: themeRegistry.ts
Path: src/theme/themeRegistry.ts
Description: AQUORIX theme metadata registry for onboarding theme selection, previews, and dashboard theming.
Author: Cascade AI
Created: 2025-07-13
Last Updated: 2025-07-13
Status: In Progress
Dependencies: Used by ThemeSelector, onboarding, and settings components.
Notes: Add or update theme objects as new themes are introduced.
Change Log:
- 2025-07-13 (Cascade): Initial creation with Dive Locker and Bamboo Safari.
*/

export const themeRegistry = {
  'dive-locker': {
    id: 'dive-locker',
    label: 'Dive Locker',
    className: 'aqx-pro-dashboard-theme',
    description: 'Clean, confident, aquatic precision.',
    previewImage: '/themes/dive-locker-thumb.png',
  },
  'bamboo-safari': {
    id: 'bamboo-safari',
    label: 'Bamboo Safari',
    className: 'aqx-affiliate-dashboard-theme',
    description: 'Boutique, earthy tones with luxury safari motif.',
    previewImage: '/themes/bamboo-safari-thumb.png',
  },
  // Add more themes as needed
};
