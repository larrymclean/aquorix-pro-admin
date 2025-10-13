/*
  File: Step2SelectTier.tsx
  Path: src/components/onboarding/Step2SelectTier.tsx
  Description: Onboarding Step 2 component for AQUORIX Pro Dashboard - Tier selection with OSC and Session Data Cards. Fully integrated with onboarding flow. 
  Author: Cascade AI (with Larry McLean)
  Created: 2025-07-18
  Last Updated: 2025-07-19
  Status: MVP integration, ready for onboarding
  Dependencies: React, onboarding context, OSC Card, Session Data Card, CSS Module (Step1Identity.module.css)
  Notes: Follows AQUORIX commenting standard. Uses new name 'Integrated Operator' for Tier 4. 
  Change Log:
    - 2025-07-18 (Cascade): Initial creation, React conversion, style integration, onboarding context hooks added.
    - 2025-07-19 (Cascade): Bugfix: OSC and Session cards now stack below onboarding card. No logic change.

*/

import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Step1Identity.module.css';
import OnboardingStatusCard from './OnboardingStatusCard';
// import OSCDataCard from './OSCDataCard'; // Uncomment if exists
// import SessionDataCard from './SessionDataCard'; // Uncomment if exists
// import { OnboardingContext } from '../../context/OnboardingContext'; // Uncomment if exists

// AQUORIX Onboarding Step 2: Select Tier

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
    value: 'complex',
    title: 'Tier 4 - Integrated Operator',
    desc: 'You manage a multi-location dive business, liveaboard, or resort. Your operation may include lodging, food, transport, and multiple vessels. AQUORIX gives you offline-ready dashboards, Island Mode, and end-to-end control.',
    badge: 'Paid - Pricing TBD',
    paid: true,
  },
  {
    value: 'affiliate',
    title: 'Tier 5 - Affiliate',
    desc: 'You refer or assist guests with dive bookings. Whether you\'re a hotel front desk, tour concierge, or OTA partner. AQUORIX provides simple referral tools, QR code generation, commission tracking, and white-labeled options to support your guest experience.',
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
  onTierSelected: (tier: string) => void;
}

const Step2SelectTier: React.FC<Step2SelectTierProps> = ({ oscData, sessionData, onTierSelected }) => {
  // const { onboarding, setOnboarding } = useContext(OnboardingContext); // Uncomment if using context
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSelect = (tier: string) => {
    setSelectedTier(tier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTier) {
      onTierSelected(selectedTier);
    }
  };

  return (
    <div>
      <div className={styles.authContainer}>
        <div className={styles.authContent}>
          <div className={styles.authIllustration}>
            <img alt="AQUORIX Logo" className={styles.authLogo} src="/aqx-ctd-logo.svg" style={{ width: 140, height: 140, marginBottom: 32 }} />
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
                  >
                    <div className={styles.tierTitle}>{tier.title}</div>
                    {tier.value === 'affiliate' && (
                      <div className={styles.tierSubtitle}>(Hotel, B&B, or Travel Concierge)</div>
                    )}
                    <div className={styles.tierDesc}>{tier.desc}</div>
                    <div className={styles.tierFooter}>
                      <div className={styles.tierPriceBadge}>{tier.badge}</div>
                      {selectedTier === tier.value && (
                        <div className={styles.checkmark}>&#10003;</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className={[
                  styles.authButton,
                  selectedTier ? styles.ready : '',
                ].join(' ')}
                disabled={!selectedTier}
                aria-disabled={!selectedTier}
                style={{ height: 48, fontSize: '1.1rem', borderRadius: 8 }}
              >
                Select Tier
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* OSC Card Below - OUTSIDE OF .authContainer */}
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
      {/* Step 1 DB Debug Card - Always Visible */}
      <Step1DebugCard supabaseUserId={sessionData?.user?.id || ''} />
      {/* Session Data Card Below - OUTSIDE OF .authContainer */}
      {sessionData && (
        <div className={styles.cardSection}>
          <div className={styles.sessionCardTitle}>Session Info (dev only):</div>
          <pre className={styles.sessionCardPre}>
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

/*
  Step1DebugCard: Always shows latest Step 1 DB data or not found message.
  Props: supabaseUserId (string)
  Follows AQUORIX commenting standard.
  Last Updated: 2025-09-17 (Cascade)
*/

interface Step1DebugCardProps {
  supabaseUserId: string;
}

const Step1DebugCard: React.FC<Step1DebugCardProps> = ({ supabaseUserId }) => {
  const [data, setData] = useState<{ first_name: string; last_name: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseUserId) return;
    setLoading(true);
    fetch(`/api/onboarding/step1/${supabaseUserId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setData)
      .catch(() => {
        setData(null);
        setError('Not found');
      })
      .finally(() => setLoading(false));
  }, [supabaseUserId]);

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
