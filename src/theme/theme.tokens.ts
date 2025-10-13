/*
File: theme.tokens.ts
Path: src/theme/theme.tokens.ts
Description: Centralized AQUORIX theme tokens for colors, spacing, typography, buttons, borders, and modes. Used for consistent styling across onboarding and dashboard.
Author: Cascade AI
Created: 2025-07-13
Last Updated: 2025-07-13
Status: In Progress
Dependencies: None (imported by CSS modules and components)
Notes: Expand as new UI primitives are introduced. See docs/Onboarding_Base_Styles_and_Theme_Tokens.md
Change Log:
- 2025-07-13 (Cascade): Initial creation with core tokens, button, border, and mode categories.
*/

export const colors = {
  primary: '#0077B6', // Marina Blue Grid
  secondary: '#00B4D8',
  accent: '#FFD166', // Gold (Bamboo Safari)
  background: '#F8F9FA', // Pearl White
  text: '#222',
  error: '#D7263D',
  success: '#27AE60',
  warning: '#FFA500',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  round: '50%',
};

export const font = {
  family: 'Inter, Arial, sans-serif',
  sizeBase: '16px',
  sizeHeading: '2rem',
  weightRegular: 400,
  weightBold: 700,
};

export const buttons = {
  primaryBg: colors.primary,
  primaryText: '#fff',
  secondaryBorder: colors.primary,
  disabledOpacity: 0.6,
};

export const borders = {
  default: '1px solid #ccc',
  focus: `2px solid ${colors.accent}`,
};

export const modes = {
  light: {
    background: '#ffffff',
    card: '#f5f6f5',
    text: '#0a1e2a',
  },
  dark: {
    background: '#1b1b1b',
    card: '#2a2a2a',
    text: '#f0f0f0',
  },
};
