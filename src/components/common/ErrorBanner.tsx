/*
File: ErrorBanner.tsx
Path: src/components/common/ErrorBanner.tsx
Description: Simple error banner for displaying inline validation or API errors in onboarding and other flows.
Author: Cascade AI
Created: 2025-07-13
Last Updated: 2025-07-13
Status: MVP
Dependencies: React
Notes: Style with theme tokens in parent or global CSS.
Change Log:
- 2025-07-13 (Cascade): Initial MVP creation for onboarding error display.
*/

import React from 'react';

interface ErrorBannerProps {
  message: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => (
  <div role="alert" style={{
    background: 'var(--color-error, #D7263D)',
    color: '#fff',
    padding: '0.75em 1em',
    borderRadius: '4px',
    margin: '8px 0',
    fontWeight: 600,
    fontSize: '1rem',
    letterSpacing: '0.01em',
    boxShadow: '0 2px 6px rgba(215,38,61,0.08)'
  }}>
    {message}
  </div>
);
