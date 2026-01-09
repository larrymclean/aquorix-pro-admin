/*
 * File: ThemeProvider.tsx
 * Path: src/components/ThemeProvider.tsx
 * Description: Minimal React context provider for AQUORIX dashboard theme. Injects theme config and CSS class into subtree.
 * Author: AQUORIX Engineering & Design
 * Created: 2025-07-09
 * Last Updated: 2025-07-09
 * Status: MVP scaffold
 * Dependencies: theme.config.ts, React 18+
 * Notes: Extend with dynamic tier/user logic as needed. Start with static theme for MVP test.
 * Change Log:
 *   2025-07-09 (AQUORIX Eng): Initial minimal ThemeProvider scaffold.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { THEMES, ThemeConfig, ThemeKey } from '../theme.config';

interface ThemeProviderProps {
  themeKey?: ThemeKey; // 'marina' | 'bamboo'
  children: ReactNode;
}

interface ThemeContextValue {
  theme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ themeKey = 'marina', children }: ThemeProviderProps) => {
  const theme = THEMES[themeKey];
  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className={theme.cssClass}>{children}</div>
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeConfig {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx.theme;
}
