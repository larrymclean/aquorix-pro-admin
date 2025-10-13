/*
File: OnboardingStatusCard.tsx
Path: src/components/onboarding/OnboardingStatusCard.tsx
Description: AQUORIX onboarding status card. Displays current onboarding step, user input data, and onboarding progress for the current session. Stacks above T&P Data Card. Modular and reusable for all onboarding steps.
Author: Cascade AI
Created: 2025-07-16
Last Updated: 2025-07-16
Status: Initial implementation
Dependencies: React, AQUORIX style guide
Notes: Update fields and logic as onboarding flow evolves. See onboarding step components for integration.
Change Log:
- 2025-07-16 (Cascade): Initial creation for onboarding V1.
*/

import React from 'react';

interface OnboardingStatusCardProps {
  step: number;
  totalSteps: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  passwordSet?: boolean;
  emailConfirmed?: boolean;
}

/**
 * OnboardingStatusCard - Displays onboarding progress and user input data.
 * Stacks above the Test & Prototype Data Card.
 */
const OnboardingStatusCard: React.FC<OnboardingStatusCardProps> = ({
  step,
  totalSteps,
  firstName,
  lastName,
  email,
  phone,
  passwordSet,
  emailConfirmed,
}) => {
  return (
    <div className="onboarding-status-card" style={{
      background: '#f5f9ff',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 4px rgba(40, 125, 225, 0.08)',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      width: '100%',
      maxWidth: 440,
      fontSize: '1rem',
      color: '#001C34',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Step {step} of {totalSteps}</div>
      <div style={{ marginBottom: 6 }}>First Name: <span style={{ fontWeight: 500 }}>{firstName || <em>—</em>}</span></div>
      <div style={{ marginBottom: 6 }}>Last Name: <span style={{ fontWeight: 500 }}>{lastName || <em>—</em>}</span></div>
      <div style={{ marginBottom: 6 }}>Email: <span style={{ fontWeight: 500 }}>{email || <em>—</em>}</span></div>
      <div style={{ marginBottom: 6 }}>Phone: <span style={{ fontWeight: 500 }}>{phone || <em>—</em>}</span></div>
      <div style={{ marginBottom: 6 }}>Password Set: <span style={{ fontWeight: 500 }}>{passwordSet ? 'Yes' : 'No'}</span></div>
      <div>Supabase Email Confirmed: <span style={{ fontWeight: 500 }}>{emailConfirmed ? 'Yes' : 'No'}</span></div>
    </div>
  );
};

export default OnboardingStatusCard;
