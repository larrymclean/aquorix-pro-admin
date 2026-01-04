/*
  File: Step2SelectTier.tsx
  Path: src/components/onboarding/Step2SelectTier.tsx
  Description: AQUORIX onboarding Step 2 — Tier selection (UI-only).
               Emits a tier string to OnboardingWizard via onTierSelected().
               Includes OnboardingStatusCard, Step1 DB debug card, and Session debug card.
               NO backend writes from this component.
  Author: Cascade AI Team (ChatGPT, Claude AI, Windsurf, Grok) with Larry McLean
  Created: 2025-07-18
  Version: 1.2.1
  Last Updated: 2026-01-03
  Status: Phase B+ — Backend-authoritative onboarding (Wizard = single writer)
*/

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Step1Identity.module.css';
import OnboardingStatusCard from './OnboardingStatusCard';

const TIERS = [
  {
    value: 'solo',
    title: 'Tier 1 - Solo Professional',
    desc: 'You are an individual Instructor, Divemaster, or Freediving Instructor. You operate independently on shore, on boats, or internationally. AQUORIX provides you with a branded personal profile, calendar, media tools, and a hosted website to grow your business.',
    badge: 'Free - No In-App Upsell',
    paid: false,
  },
  {
    value: 'entrepreneur',
    title: 'Tier 2 - Solo Pro Entrepreneur',
    desc: 'You are a self-managed Instructor, Divemaster, or Freediving Pro who also sells your own trips, courses, or media. AQUORIX supports your business with booking tools, POS, and a fully hosted, customizable website.',
    badge: 'Paid - Pricing TBD',
    paid: true,
  },
  {
    value: 'dive_center',
    title: 'Tier 3 - Dive Center',
    desc: 'You operate a physical dive shop or training center with staff. Offer certifications, shore or boat dives, and rentals. AQUORIX connects your schedule, team, courses, and guest bookings into one unified system.',
    badge: 'Paid - Pricing TBD',
    paid: true,
  },
  {
    // CRITICAL: must match OnboardingWizard.mapTierToLevel()
    value: 'integrated_operator',
    title: 'Tier 4 - Integrated Operator',
    desc: 'You manage a multi-location dive business, liveaboard, or resort. Your operation may include lodging, food, transport, and multiple vessels. AQUORIX gives you offline-ready dashboards, Island Mode, and end-to-end control.',
    badge: 'Paid - Pricing TBD',
    paid: true,
  },
  {
    value: 'affiliate',
    title: 'Tier 5 - Affiliate',
    desc: "You refer or assist guests with dive bookings. Whether you're a hotel front desk, tour concierge, or OTA partner. AQUORIX provides simple referral tools, QR code generation, commission tracking, and white-labeled options to support your guest experience.",
    badge: 'Paid - Pricing TBD',
    paid: true,
  },
];

interface Step2SelectTierProps {
  oscData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordSet: boolean;
    supabaseConfirmed: boolean;
  };
  sessionData?: any;
  accessToken?: string;
  onTierSelected: (tier: string) => void;
  onBack?: () => void; // NEW
}

const Step2SelectTier: React.FC<Step2SelectTierProps> = ({
  oscData,
  sessionData,
  accessToken,
  onTierSelected,
  onBack,
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSelect = (tier: string) => {
    setSelectedTier(tier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTier) onTierSelected(selectedTier);
  };

  return (
    <div>
      <div className={styles.authContainer}>
        <div className={styles.authContent}>
          <div className={styles.authIllustration}>
            <img
              alt="AQUORIX Logo"
              className={styles.authLogo}
              src="/aqx-ctd-logo.svg"
              style={{ width: 140, height: 140, marginBottom: 32 }}
            />
          </div>

          <div className={styles.authForm}>
            <div className={styles.authHeader}>
              <h1>Step 2: Choose Your AQUORIX Tier</h1>
              <p>Select the tier that best reflects how you operate in the dive industry. We'll customize your tools and dashboard accordingly.</p>
            </div>

            <form className={styles.authFormContainer} onSubmit={handleSubmit}>
              <div className={styles.tierContainer}>
                {TIERS.map((tier) => (
                  <div
                    key={tier.value}
                    className={clsx(styles.tierCard, selectedTier === tier.value && styles.selected)}
                    onClick={() => handleSelect(tier.value)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedTier === tier.value}
                    aria-label={tier.title}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelect(tier.value);
                    }}
                  >
                    <div className={styles.tierTitle}>{tier.title}</div>

                    {tier.value === 'affiliate' && (
                      <div className={styles.tierSubtitle}>(Hotel, B&amp;B, or Travel Concierge)</div>
                    )}

                    <div className={styles.tierDesc}>{tier.desc}</div>

                    <div className={styles.tierFooter}>
                      <div className={styles.tierPriceBadge}>{tier.badge}</div>
                      {selectedTier === tier.value && <div className={styles.checkmark}>&#10003;</div>}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className={[styles.authButton, selectedTier ? styles.ready : ''].join(' ')}
                disabled={!selectedTier}
                aria-disabled={!selectedTier}
                style={{ height: 48, fontSize: '1.1rem', borderRadius: 8 }}
              >
                Select Tier
              </button>

              {/* Back button (primary style) */}
              <button
                type="button"
                onClick={() => onBack?.()}
                className={[styles.authButton, styles.ready].join(' ')}
                style={{ height: 44, fontSize: '1rem', borderRadius: 8, marginTop: 10 }}
              >
                Back
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* OSC Card Below */}
      <div className={styles.cardSection}>
        <OnboardingStatusCard
          step={2}
          totalSteps={4}
          firstName={oscData.firstName}
          lastName={oscData.lastName}
          email={oscData.email}
          phone={oscData.phone}
          passwordSet={oscData.passwordSet}
          emailConfirmed={oscData.supabaseConfirmed}
        />
      </div>

      {/* Step 1 DB Debug Card */}
      <Step1DebugCard supabaseUserId={sessionData?.user?.id || ''} accessToken={accessToken} />

      {/* Session Data Card */}
      {sessionData && (
        <div className={styles.cardSection}>
          <div className={styles.sessionCardTitle}>Session Info (dev only):</div>
          <pre className={styles.sessionCardPre}>{JSON.stringify(sessionData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

interface Step1DebugCardProps {
  supabaseUserId: string;
  accessToken?: string;
}

const Step1DebugCard: React.FC<Step1DebugCardProps> = ({ supabaseUserId, accessToken }) => {
  const [data, setData] = useState<{ first_name: string; last_name: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseUserId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/onboarding/step1/${supabaseUserId}`, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch(() => {
        setData(null);
        setError('Not found');
      })
      .finally(() => setLoading(false));
  }, [supabaseUserId, accessToken]);

  return (
    <div style={{ marginTop: 24, padding: 16, border: '1.5px solid #b3d9f7', borderRadius: 8, background: '#f8fcff' }}>
      <h4>Step 1 Data Saved (from DB)</h4>
      {loading ? (
        <div>Loading...</div>
      ) : data ? (
        <>
          <div><strong>First Name:</strong> {data.first_name}</div>
          <div><strong>Last Name:</strong> {data.last_name}</div>
          <div><strong>Phone:</strong> {data.phone}</div>
        </>
      ) : (
        <div style={{ color: '#b00', fontWeight: 500 }}>{error || 'Not found'}</div>
      )}
    </div>
  );
};

export default Step2SelectTier;