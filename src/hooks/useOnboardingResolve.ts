/*
 * File: useOnboardingResolve.ts
 * Path: src/hooks/useOnboardingResolve.ts
 * Description: React hook for AQUORIX onboarding. Calls backend /api/users/by-supabase-id with Supabase user ID, gets user data and onboarding status, and routes user based on completion status.
 * Author: AQUORIX Engineering
 * Created: 2025-09-13
 * Last Updated: 2025-09-19
 * Status: Updated to use new backend endpoint and single-source-of-truth logic
 * Dependencies: react, react-router-dom
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SupabaseUser {
  id: string;
  email: string;
}

interface BackendUserData {
  role: string;
  tier: string;
  email: string;
  onboarding_metadata?: {
    completion_percentage?: number;
    current_step?: number;
  };
  first_name?: string;
  last_name?: string;
  tier_level?: number;
}

export function useOnboardingResolve(supabaseUser: SupabaseUser | null) {
  const navigate = useNavigate();
  const [isResolved, setIsResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseUser?.id || isResolved) return;

    console.log('🔄 Checking user status with backend API:', supabaseUser.email);

    fetch(`http://localhost:3001/api/users/by-supabase-id/${supabaseUser.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        console.log('📡 API Response status:', res.status);

        if (res.status === 404) {
          console.log('🔀 User not found in backend, starting onboarding');
          setIsResolved(true);
          navigate('/onboarding');
          return null;
        }

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data: BackendUserData | null) => {
        if (!data) return;

        console.log('✅ Backend API response:', data);
        setIsResolved(true);

        const completionPercentage = data.onboarding_metadata?.completion_percentage || 0;
        const currentStep = data.onboarding_metadata?.current_step || 1;

        if (completionPercentage < 100) {
          console.log(`🔀 Resuming onboarding at step ${currentStep} (${completionPercentage}% complete)`);
          navigate('/onboarding');
        } else {
          // ✅ Onboarding complete → go to dashboard
          console.log('🔀 Onboarding complete, redirecting to dashboard');
          navigate('/dashboard');
        }
      })
      .catch(err => {
        console.error('❌ Backend user check error:', err);
        setError(err.message);
        setIsResolved(true);

        console.log('🔀 Error occurred, defaulting to onboarding');
        navigate('/onboarding');
      });
  }, [supabaseUser?.id, supabaseUser?.email, navigate, isResolved]);

  return { isResolved, error };
}