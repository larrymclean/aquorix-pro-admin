/*
 * File: ThemeProvider.test.tsx
 * Path: src/components/ThemeProvider.test.tsx
 * Description: Minimal test for ThemeProvider context and class injection.
 * Author: AQUORIX Engineering & Design
 * Created: 2025-07-09
 * Last Updated: 2025-07-09
 * Status: MVP test
 * Dependencies: ThemeProvider, React Testing Library, Jest
 * Notes: Extend as ThemeProvider grows. Only tests static theme for now.
 * Change Log:
 *   2025-07-09 (AQUORIX Eng): Initial minimal test.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

describe('ThemeProvider', () => {
  function TestComponent() {
    const theme = useTheme();
    return <span data-testid="theme-name">{theme.name}</span>;
  }

  it('injects marina theme context and class', () => {
    render(
      <ThemeProvider themeKey="marina">
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-name').textContent).toBe('Marina Blue Grid');
    expect(document.querySelector('.aqx-pro-dashboard-theme')).toBeTruthy();
  });

  it('injects bamboo theme context and class', () => {
    render(
      <ThemeProvider themeKey="bamboo">
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-name').textContent).toBe('Bamboo Safari');
    expect(document.querySelector('.aqx-affiliate-dashboard-theme')).toBeTruthy();
  });

});
