/*
  File: OnboardingWizard.tsx
  Path: src/pages/OnboardingWizard.tsx
  Description: AQUORIX Pro Admin onboarding wizard container (Steps 1–4)

  Author: AQUORIX Engineering (Larry McLean + AI Team)
  Created: 2025-07-12
  Version: 1.2.5

  Last Updated: 2026-01-05
  Status: MVP LOCK — Deterministic public signup onboarding flow (Wizard = single writer)

  CHANGE LOG:
  - 2026-01-05 - v1.2.5
    - Step 4 now calls POST /api/onboarding/complete (backend stamps onboarding_completed_at + step4/100%).
    - Keep /api/onboarding/update-step available for mid-flow progress updates (Steps 1–3).
  - 2026-01-04 - v1.2.4
    - Step 3 payload includes: country, website, description (backend accepts; Tier 5 requires country)
    - No route/directory changes; Smart Dashboard remains single codebase
*/

import React, { useEffect, useMemo, useRef, useState } from 'react';
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

function uniqSortedSteps(steps: number[]) {
  return Array.from(new Set(steps)).sort((a, b) => a - b);
}

function computeDisplayName(firstName: string, lastName: string) {
  const raw = `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim();
  return raw.replace(/\s+/g, ' ');
}

async function fetchMe(accessToken: string) {
  const res = await fetch('/api/v1/me', {
    method: 'GET',
    headers: buildAuthHeaders(accessToken),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.error || data?.message || `fetch /api/v1/me failed (${res.status})`;
    throw new Error(msg);
  }

  if (!data?.ok) {
    throw new Error(data?.error || 'ME_NOT_OK');
  }

  return data;
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

async function postStep3(params: {
  accessToken?: string;
  supabase_user_id: string;
  tier_level: number;
  operator_name: string;
  country: string | null;
  logo_url: string | null;
  contact_info: any;
  website: string | null;
  description: string | null;
  is_test: boolean;
}) {
  const res = await fetch('/api/onboarding/step3', {
    method: 'POST',
    headers: buildAuthHeaders(params.accessToken),
    body: JSON.stringify({
      supabase_user_id: params.supabase_user_id,
      tier_level: params.tier_level,
      operator_name: params.operator_name,
      country: params.country,
      logo_url: params.logo_url,
      contact_info: params.contact_info,
      website: params.website,
      description: params.description,
      is_test: params.is_test,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`step3 failed (${res.status}) ${txt}`);
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
 * POST /api/onboarding/complete
 * Backend stamps:
 * - pro_profiles.onboarding_completed_at
 * - onboarding_metadata: step4, completed_steps, 100%
 */
async function postComplete(params: { accessToken?: string; supabase_user_id: string }) {
  const res = await fetch('/api/onboarding/complete', {
    method: 'POST',
    headers: buildAuthHeaders(params.accessToken),
    body: JSON.stringify({
      supabase_user_id: params.supabase_user_id,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`complete failed (${res.status}) ${txt}`);
  }

  return res.json();
}

/**
 * Tier string (UI) → tier_level (DB canonical)
 * Step2SelectTier emits: solo | entrepreneur | dive_center | integrated_operator | affiliate
 */
function mapTierToLevel(tierString: string): { tier_level: number; canonical: string } {
  const t = (tierString || '').trim();

  if (t === 'solo') return { tier_level: 1, canonical: 'solo' };
  if (t === 'entrepreneur') return { tier_level: 2, canonical: 'solo_pro_entrepreneur' };
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

  const didHydrateRef = useRef(false);

  const [session, setSession] = useState<any>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const userEmail = session?.user?.email || '';
  const supabaseUserId = session?.user?.id || '';
  const accessToken = session?.access_token || '';

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      if (!sessionLoaded) return;
      if (!accessToken) return;
      if (!supabaseUserId) return;
      if (didHydrateRef.current) return;

      try {
        const me = await fetchMe(accessToken);

        const onboarding = me?.onboarding || {};
        const currentStep = typeof onboarding.current_step === 'number' ? onboarding.current_step : 1;

        const tierLevel = me?.aquorix_user?.tier_level ?? null;

        const selectedTierFromMe =
          tierLevel === 1 ? 'solo' :
          tierLevel === 2 ? 'entrepreneur' :
          tierLevel === 3 ? 'dive_center' :
          tierLevel === 4 ? 'integrated_operator' :
          tierLevel === 5 ? 'affiliate' :
          'solo';

        const prof = me?.aquorix_user?.profile || {};
        const hydratedIdentity: IdentityData | null =
          (prof.first_name || prof.last_name || prof.phone)
            ? {
                firstName: prof.first_name || '',
                lastName: prof.last_name || '',
                countryCode: '+962',
                phone: prof.phone || '',
              }
            : null;

        const op = me?.operator || {};
        const hydratedProfileData = {
          operator_name: op?.name || '',
          logo_url: op?.logo_url || null,
        };

        if (!mounted) return;

        if (hydratedIdentity) setIdentity(hydratedIdentity);
        if (tierLevel) setSelectedTier(selectedTierFromMe);

        if (hydratedProfileData.operator_name || hydratedProfileData.logo_url) {
          setProfileData(hydratedProfileData);
        }

        setStep((prev) => Math.max(prev, currentStep));
        didHydrateRef.current = true;
      } catch (e) {
        console.warn('[OnboardingWizard] hydration skipped:', (e as any)?.message || e);
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, [sessionLoaded, accessToken, supabaseUserId]);

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
      phone: identity ? `${identity.countryCode} ${identity.phone}` : '',
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

    // Best-effort Supabase displayName
    const displayName = computeDisplayName(data.firstName, data.lastName);
    if (displayName) {
      const { error } = await supabase.auth.updateUser({
        data: { displayName, full_name: displayName, name: displayName },
      });
      if (error) {
        console.warn('[OnboardingWizard] Failed to set Supabase displayName:', error.message || error);
      }
    }

    try {
      await postStep1({
        accessToken,
        supabase_user_id: supabaseUserId,
        email: userEmail,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: `${data.countryCode} ${data.phone}`,
      });

      await postUpdateStep({
        accessToken,
        supabase_user_id: supabaseUserId,
        current_step: 2,
        completed_steps: uniqSortedSteps([1]),
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
        completed_steps: uniqSortedSteps([1, 2]),
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

    const mapped = mapTierToLevel(selectedTier);

    const operator_name =
      (typeof data?.operator_name === 'string' && data.operator_name.trim()) ||
      (typeof data?.business_name === 'string' && data.business_name.trim()) ||
      '';

    const logo_url = (data?.logo_url ?? null) as string | null;

    const country =
      (typeof data?.country === 'string' && data.country.trim()) ||
      (typeof data?.contact_info?.address?.country === 'string' && data.contact_info.address.country.trim()) ||
      null;

    const contact_info = data?.contact_info ?? null;
    const website = (typeof data?.website === 'string' && data.website.trim()) ? data.website.trim() : null;
    const description = (typeof data?.description === 'string' && data.description.trim()) ? data.description.trim() : null;

    const is_test = typeof data?.is_test === 'boolean' ? data.is_test : true;

    if (!operator_name) {
      alert('Step 3 is missing business name. Please enter a business/display name.');
      return;
    }

    try {
      const step3Result = await postStep3({
        accessToken,
        supabase_user_id: supabaseUserId,
        tier_level: mapped.tier_level,
        operator_name,
        country,
        logo_url,
        contact_info,
        website,
        description,
        is_test,
      });

      setProfileData({
        ...data,
        operator_name,
        operator_id: step3Result?.operator_id ?? null,
        affiliate: step3Result?.affiliate ?? null,
      });

      await postUpdateStep({
        accessToken,
        supabase_user_id: supabaseUserId,
        current_step: 4,
        completed_steps: uniqSortedSteps([1, 2, 3]),
        completion_percentage: 75,
      });
    } catch (err: any) {
      console.error('Step 3 step3/update-step failed:', err);
      alert(`Step 3 save failed: ${err?.message || err}`);
      return;
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

      // ✅ MVP LOCK: backend finalizes completion + stamps onboarding_completed_at
      await postComplete({
        accessToken: refreshedSession.access_token,
        supabase_user_id: refreshedSession.user.id,
      });

      // Optional belt+suspenders (safe). Keeps metadata consistent even if complete evolves later.
      await postUpdateStep({
        accessToken: refreshedSession.access_token,
        supabase_user_id: refreshedSession.user.id,
        current_step: 4,
        completed_steps: uniqSortedSteps([1, 2, 3, 4]),
        completion_percentage: 100,
      });

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
    <div
      className="onboarding-vertical-stack"
      style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
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
          accessToken={accessToken}
          onTierSelected={handleTierSelected}
          onBack={() => setStep(1)}
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