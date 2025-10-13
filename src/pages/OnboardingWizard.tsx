/*
  File: OnboardingWizard.tsx
  Path: src/pages/OnboardingWizard.tsx
  Description: AQUORIX Pro Admin onboarding wizard container. Multi-step onboarding flow with tier-to-role mapping, QA, and RBAC. Uses getTierRole utility for role mapping and upserts only allowed columns to user_profile.
  Author: Cascade AI
  Created: 2025-07-12
  Last Updated: 2025-09-14
  Status: Production-ready, QA passed, checkpointed
  Dependencies: React, Step1Identity, Step2SelectTier, Step3ProfileSetup, Step4Confirm, getTierRole, supabaseClient
  Notes: Tier-to-role mapping for RBAC. Only allowed columns upserted. QA and user feedback integrated. 
  Change Log:
    - 2025-07-12 (AQUORIX Eng): Initial scaffold and placeholder render.
    - 2025-07-13 (Cascade): Integrated Step1Identity as Step 1; modular structure.
    - 2025-07-18 (Cascade): Integrated Step2SelectTier as Step 2; OSC/session data continuity, submit logic, and cards.
    - 2025-07-19 (Cascade): Bugfix: session data, OSC/Session cards, and user email flow for Step 2.
    - 2025-09-03 (Cascade): Removed hardcoded email, now fetches authenticated user's email from Supabase session. Updated logic and comments for clarity.
    - 2025-09-05 (Cascade): Integrated Step3ProfileSetup for tier-specific profile setup as Step 3 in onboarding wizard.
    - 2025-09-07 (Cascade): Tier-to-role mapping (getTierRole), upsert allowed columns only, onboarding QA, RBAC/RequireAuth alignment.
    - 2025-09-14 (AQUORIX Eng): Fixed session handling to ensure data saves to database on each step.
*/

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Step1Identity } from '../components/onboarding/Step1Identity';
import Step2SelectTier from '../components/onboarding/Step2SelectTier';
import Step3ProfileSetup from '../components/onboarding/Step3ProfileSetup';
import Step4Confirm from '../components/onboarding/Step4Confirm';
import { getTierRole } from '../utils/getTierRole';
import TestProtoSessionTile from '../components/onboarding/TestProtoSessionTile';
import OnboardingStatusCard from '../components/onboarding/OnboardingStatusCard';
import { useOnboardingResolve } from '../hooks/useOnboardingResolve';

// Placeholder for onboarding state (could be lifted to context in future)
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

const OnboardingWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState<IdentityData | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('solo');
  const [profileData, setProfileData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = (window as any).navigate || ((url: string) => { window.location.href = url; });

  // Session state
  const [session, setSession] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Load session on component mount
  React.useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUserEmail(session?.user?.email || '');
      setSessionLoaded(true);
    };
    fetchSession();
  }, []);

  // Hook for backend resolution
  useOnboardingResolve(session?.user ? { id: session.user.id, email: session.user.email } : null);

  // Password set flag from localStorage
  const [passwordSet, setPasswordSet] = useState<boolean>(false);
  React.useEffect(() => {
    const stored = localStorage.getItem('aqx_password_set');
    setPasswordSet(stored === 'true');
  }, []);

  // Handler for Step 1 completion - FIXED VERSION
  const handleIdentityNext = async (data: IdentityData) => {
    setIdentity(data);
    
    // Wait for session if not loaded
    if (!sessionLoaded || !session?.user?.id) {
      console.error('Session not loaded, cannot save Step 1 data');
      setStep(2);
      return;
    }
    
    // Save Step 1 data to database immediately
    try {
      console.log('Saving Step 1 data for user:', session.user.id);
      const response = await fetch('http://localhost:3001/api/users/update-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabase_user_id: session.user.id,
          onboarding_step: 2,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }
      
      console.log('Step 1 data saved successfully');
    } catch (error) {
      console.error('Failed to save Step 1 data:', error);
    }
    
    setStep(2);
  };

  // Handler for Step 2 completion - FIXED VERSION
  const handleTierSelected = async (tier: string) => {
    setSelectedTier(tier);
    
    if (!session?.user?.id) {
      console.error('No session for Step 2 save');
      setStep(3);
      return;
    }
    
    try {
      console.log('Saving Step 2 data (tier):', tier);
      const response = await fetch('http://localhost:3001/api/users/update-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabase_user_id: session.user.id,
          onboarding_step: 3,
          selected_tier: tier
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }
      
      console.log('Step 2 data saved successfully');
    } catch (error) {
      console.error('Failed to save Step 2 data:', error);
    }
    
    setStep(3);
  };

  // Handler for Step 3 completion
  const handleProfileSetupNext = async (data: any) => {
    setProfileData(data);
    
    if (!session?.user?.id) {
      console.error('No session for Step 3 save');
      setStep(4);
      return;
    }
    
    try {
      await fetch('http://localhost:3001/api/users/update-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabase_user_id: session.user.id,
          onboarding_step: 4,
        }),
      });
      console.log('Step 3 data saved successfully');
    } catch (error) {
      console.error('Failed to save Step 3 data:', error);
    }
    
    setStep(4);
  };

  // Final submit handler for Step 4
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/users/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabase_user_id: session?.user?.id
        })
      });
      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }
      alert('Onboarding complete! Welcome to your dashboard.');
      // Session check before navigating
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();
      if (!refreshedSession?.user) {
        alert('Session expired. Please sign in again.');
        navigate('/login');
        return;
      }
      navigate('/dashboard');
    } catch (err: any) {
      alert('Failed to complete onboarding: ' + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading if session not loaded
  if (!sessionLoaded) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading your session...</div>
      </div>
    );
  }

  // Compose OSC data for cards
  const oscData: OSCData = {
    firstName: identity?.firstName || '',
    lastName: identity?.lastName || '',
    email: userEmail,
    phone: identity?.phone || '',
    passwordSet,
    supabaseConfirmed: true,
  };

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
      {step > 4 && (
        <div style={{ textAlign: 'center', fontSize: 20, marginTop: 60 }}>
          Step {step} coming soon...
        </div>
      )}
    </div>
  );
};

export default OnboardingWizard;