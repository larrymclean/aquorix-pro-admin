/*
  File: OnboardingWizard.tsx
  Path: src/pages/OnboardingWizard.tsx
  Description: AQUORIX Pro Admin onboarding wizard container (Steps 1–4)

  Author: AQUORIX Engineering (Larry McLean + AI Team)
  Created: 2025-07-12
  Last Updated: 2025-12-27
  Status: Phase B+ — Deterministic public signup onboarding flow

  CRITICAL FIXES (2025-12-27):
  - Switched legacy /api/users/* calls → /api/onboarding/*
  - Removed /api/users/promote dependency (legacy)
  - Updated payload keys to backend contract:
      supabase_user_id, current_step, completed_steps, completion_percentage, tier_level (optional)
  - Added Authorization: Bearer <access_token> consistently
  - Removed hardcoded localhost (uses relative /api/*; CRA proxy handles local routing)
  - Removed useOnboardingResolve() from inside wizard to prevent navigation churn (DIR)
  - Tier mapping supports current UI emitted values (e.g., "entrepreneur") while persisting canonical tier_level
*/

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabaseClient';
import { Step1Identity } from '../components/onboarding/Step1Identity';
import Step2SelectTier from '../components/onboarding/Step2SelectTier';
import Step3ProfileSetup from '../components/onboarding/Step3ProfileSetup';
import Step4Confirm from '../components/onboarding/Step4Confirm';

import TestProtoSessionTile from '../components/onboarding/TestProtoSessionTile';
import OnboardingStatusCard from '../components/onboarding/OnboardingStatusCard';

interface IdentityData {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
}

interface OSCData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passwordSet: boolean;
  supabaseConfirmed: boolean;
}

function buildAuthHeaders(accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  return headers;
}

async function postStep1(params: {
  accessToken?: string;
  supabase_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}) {
  const res = await fetch('/api/onboarding/step1', {
    method: 'POST',
    headers: buildAuthHeaders(params.accessToken),
    body: JSON.stringify({
      supabase_user_id: params.supabase_user_id,
      email: params.email,
      first_name: params.first_name,
      last_name: params.last_name,
      phone: params.phone,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`step1 failed (${res.status}) ${txt}`);
  }

  return res.json();
}

async function postUpdateStep(params: {
  accessToken?: string;
  supabase_user_id: string;
  current_step: number;
  completed_steps: number[];
  completion_percentage: number;
  tier_level?: number;
  selected_tier?: string;
}) {
  const res = await fetch('/api/onboarding/update-step', {
    method: 'POST',
    headers: buildAuthHeaders(params.accessToken),
    body: JSON.stringify({
      supabase_user_id: params.supabase_user_id,
      current_step: params.current_step,
      completed_steps: params.completed_steps,
      completion_percentage: params.completion_percentage,
      ...(typeof params.tier_level === 'number' ? { tier_level: params.tier_level } : {}),
      ...(params.selected_tier ? { selected_tier: params.selected_tier } : {}),
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`update-step failed (${res.status}) ${txt}`);
  }

  return res.json();
}

/**
 * Tier string (UI) → tier_level (DB canonical)
 * Step2SelectTier currently emits: solo | entrepreneur | dive_center | affiliate
 */
function mapTierToLevel(tierString: string): { tier_level: number; canonical: string } {
  const t = (tierString || '').trim();

  if (t === 'solo') return { tier_level: 1, canonical: 'solo' };

  // Legacy alias emitted by current UI
  if (t === 'entrepreneur') return { tier_level: 2, canonical: 'solo_pro_entrepreneur' };

  // Future-proof canonical value (if UI updated later)
  if (t === 'solo_pro_entrepreneur') return { tier_level: 2, canonical: 'solo_pro_entrepreneur' };

  if (t === 'dive_center') return { tier_level: 3, canonical: 'dive_center' };
  if (t === 'integrated_operator') return { tier_level: 4, canonical: 'integrated_operator' };
  if (t === 'affiliate') return { tier_level: 5, canonical: 'affiliate' };

  return { tier_level: 1, canonical: 'solo' };
}

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState<IdentityData | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('solo');
  const [profileData, setProfileData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const userEmail = session?.user?.email || '';
  const supabaseUserId = session?.user?.id || '';
  const accessToken = session?.access_token || '';

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);
      setSessionLoaded(true);
    };
    fetchSession();
  }, []);

  const [passwordSet, setPasswordSet] = useState<boolean>(false);
  useEffect(() => {
    const stored = localStorage.getItem('aqx_password_set');
    setPasswordSet(stored === 'true');
  }, []);

  const oscData: OSCData = useMemo(() => {
    return {
      firstName: identity?.firstName || '',
      lastName: identity?.lastName || '',
      email: userEmail,
      phone: identity?.phone || '',
      passwordSet,
      supabaseConfirmed: true,
    };
  }, [identity, userEmail, passwordSet]);

  const handleIdentityNext = async (data: IdentityData) => {
    setIdentity(data);

    if (!sessionLoaded || !supabaseUserId) {
      alert('Session not loaded. Please sign in again.');
      navigate('/login');
      return;
    }

    try {
      await postStep1({
        accessToken,
        supabase_user_id: supabaseUserId,
        email: userEmail,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      });

      await postUpdateStep({
        accessToken,
        supabase_user_id: supabaseUserId,
        current_step: 2,
        completed_steps: [1],
        completion_percentage: 25,
      });
    } catch (err: any) {
      console.error('Step 1 save failed:', err);
      alert(`Step 1 save failed: ${err?.message || err}`);
    }

    setStep(2);
  };

  const handleTierSelected = async (tier: string) => {
    setSelectedTier(tier);

    if (!sessionLoaded || !supabaseUserId) {
      alert('Session not loaded. Please sign in again.');
      navigate('/login');
      return;
    }

    const mapped = mapTierToLevel(tier);

    try {
      await postUpdateStep({
        accessToken,
        supabase_user_id: supabaseUserId,
        current_step: 3,
        completed_steps: [1, 2],
        completion_percentage: 50,
        tier_level: mapped.tier_level,
        selected_tier: mapped.canonical,
      });
    } catch (err: any) {
      console.error('Step 2 save failed:', err);
      alert(`Step 2 save failed: ${err?.message || err}`);
    }

    setStep(3);
  };

  const handleProfileSetupNext = async (data: any) => {
    setProfileData(data);

    if (!sessionLoaded || !supabaseUserId) {
      alert('Session not loaded. Please sign in again.');
      navigate('/login');
      return;
    }

    try {
      await postUpdateStep({
        accessToken,
        supabase_user_id: supabaseUserId,
        current_step: 4,
        completed_steps: [1, 2, 3],
        completion_percentage: 75,
      });
    } catch (err: any) {
      console.error('Step 3 update-step failed:', err);
      alert(`Step 3 save failed: ${err?.message || err}`);
    }

    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      const { data } = await supabase.auth.getSession();
      const refreshedSession = data?.session || null;

      if (!refreshedSession?.user?.id) {
        alert('Session missing or expired. Please sign in again.');
        navigate('/login');
        return;
      }

      await postUpdateStep({
        accessToken: refreshedSession.access_token,
        supabase_user_id: refreshedSession.user.id,
        current_step: 4,
        completed_steps: [1, 2, 3, 4],
        completion_percentage: 100,
      });

      alert('Onboarding complete! Welcome to your dashboard.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Final seal failed:', err);
      alert(`Failed to complete onboarding: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!sessionLoaded) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading your session...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Session Required</h2>
        <p>Please sign in to continue onboarding.</p>
        <button onClick={() => navigate('/login')}>Go to Sign In</button>
      </div>
    );
  }

  return (
    <div className="onboarding-vertical-stack" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {step === 1 && (
        <>
          <Step1Identity
            email={userEmail}
            initialFirstName={identity?.firstName || ''}
            initialLastName={identity?.lastName || ''}
            initialCountryCode={identity?.countryCode || '+1'}
            initialPhone={identity?.phone || ''}
            session={session}
            onNext={handleIdentityNext}
          />
          <OnboardingStatusCard
            step={1}
            totalSteps={4}
            firstName={identity?.firstName || ''}
            lastName={identity?.lastName || ''}
            email={userEmail}
            phone={identity?.phone || ''}
            passwordSet={passwordSet}
            emailConfirmed={true}
          />
          <div className="session-card-stack" style={{ marginTop: 32, width: '100%' }}>
            <TestProtoSessionTile />
          </div>
        </>
      )}

      {step === 2 && (
        <Step2SelectTier
          oscData={oscData}
          sessionData={session}
          onTierSelected={handleTierSelected}
        />
      )}

      {step === 3 && (
        <Step3ProfileSetup
          tier={selectedTier}
          onNext={handleProfileSetupNext}
          onBack={() => setStep(2)}
          identity={identity}
          userEmail={userEmail}
          passwordSet={passwordSet}
          session={session}
        />
      )}

      {step === 4 && (
        <Step4Confirm
          identity={identity}
          userEmail={userEmail}
          passwordSet={passwordSet}
          session={session}
          profileData={profileData}
          onBack={() => setStep(3)}
          onSubmit={handleFinalSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default OnboardingWizard;