/*
 * File: ThemeProvider.tsx
 * Path: src/components/ThemeProvider.tsx
 * Description: React context provider for AQUORIX dashboard theme.
 *              Phase C+ fix: applies theme CSS class to <html> (document.documentElement)
 *              so CSS variables are globally available to TopNav + Sidebar + Main.
 *
 * Author: AQUORIX Engineering & Design
 * Created: 2025-07-09
 * Version: 1.2.1
 *
 * Last Updated: 2026-01-10
 * Status: MVP scaffold (global theme scope)
 * Dependencies: theme.config.ts, React 18+
 *
 * Notes:
 * - Phase C contract: useTheme() MUST NOT crash shells that haven't mounted ThemeProvider yet.
 * - Default theme fallback is 'marina' when ThemeProvider is absent.
 * - Theme class attachment point is <html>. Components MUST NOT append theme-* classes.
 *
 * Change Log:
 *   2025-07-09 (AQUORIX Eng): Initial minimal ThemeProvider scaffold.
 *   2026-01-08 v1.2.0 (Larry McLean + AI Team): Make useTheme() safe (no throw) for cross-shell Sidebar reuse.
 *   2026-01-10 v1.2.1 (Larry McLean + AI Team):
 *     - Apply theme.cssClass to document.documentElement (<html>) for global token scope
 *     - Remove subtree wrapper theme scoping to prevent variable “leaks”
 */

import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { THEMES, ThemeConfig, ThemeKey } from '../theme.config';

interface ThemeProviderProps {
  themeKey?: ThemeKey;
  children: ReactNode;
}

interface ThemeContextValue {
  theme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function removeExistingThemeClasses(el: HTMLElement) {
  const toRemove: string[] = [];
  el.classList.forEach((c) => {
    // Keep this generic: remove any theme-ish class we own
    if (c.startsWith('theme-')) toRemove.push(c);
  });
  toRemove.forEach((c) => el.classList.remove(c));
}

export const ThemeProvider = ({ themeKey = 'marina', children }: ThemeProviderProps) => {
  const theme = useMemo(() => (THEMES[themeKey] ?? THEMES.marina), [themeKey]);

  useEffect(() => {
    const html = document.documentElement; // <html>
    removeExistingThemeClasses(html);

    if (theme?.cssClass) {
      html.classList.add(theme.cssClass);
    }

    return () => {
      if (theme?.cssClass) {
        html.classList.remove(theme.cssClass);
      }
    };
  }, [theme?.cssClass]);

  // No wrapper div with theme class — <html> is the canonical attachment point.
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

/**
 * Phase C contract:
 * - MUST NOT throw when ThemeProvider is absent.
 * - Returns default theme ('marina') as a safe fallback.
 */
export function useTheme(): ThemeConfig {
  const ctx = useContext(ThemeContext);
  return (ctx?.theme ?? THEMES.marina) as ThemeConfig;
}
