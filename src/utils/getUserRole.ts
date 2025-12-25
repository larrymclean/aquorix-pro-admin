/*
 * File: getUserRole.ts
 * Path: src/utils/getUserRole.ts
 * Description: Simplified Login/Resume Logic using /api/v1/me as single authority (Phase B locked)
 * Author: Claude & ChatGPT collaboration with Larry McLean
 * Created: 2025-09-18
 * Version: 1.0.0
 * Last Updated: 2025-09-18
 * Status: Ready for implementation - Single Source of Truth approach
 *
 * Dependencies: supabaseClient
 *
 * Notes: Eliminates onboarding_users staging table dependency. Uses /api/v1/me as the canonical checkpoint for role/tier + onboarding routing.
 *
 * Change Log:
 * 2025-09-18 (Claude & ChatGPT): Complete refactor to eliminate dual-flow confusion. Implemented single source of truth using pro_profiles.onboarding_metadata for all resume logic and progress tracking.
 * 2025-12-25 - v1.0.1 - Migrated getUserRole + checkOnboardingStatus to /api/v1/me (remove legacy /by-supabase-id). Preserve error semantics + return shape. Fixed duplicate vars + token header syntax.
 */

import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface UserRole {
  role: string | null;
  tier: string | null;
  action: 'start_onboarding' | 'resume_onboarding' | 'dashboard' | 'no_access' | 'needs_setup' | 'error';
  redirect: string;
  progress?: {
    step: number;
    percentage: number;
  };
}

/**
 * FRONTEND: getUserRole() function - Single Source of Truth
 * Uses /api/v1/me for canonical context + onboarding routing.
 * Preserves error semantics:
 *  - no user => action:error redirect:/login
 *  - any failure => action:error redirect:/login
 */
export async function getUserRole(user: User | null): Promise<UserRole> {
  if (!user?.id) {
    return { role: null, tier: null, action: 'error', redirect: '/login' };
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      return { role: null, tier: null, action: 'error', redirect: '/login' };
    }

    const response = await fetch('/api/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!response.ok) {
      return { role: null, tier: null, action: 'error', redirect: '/login' };
    }

    const me = await response.json();

    const role: string | null = me?.operator?.affiliation ?? null;
    const tier: string | null = me?.aquorix_user?.tier ?? null;

    // Resilient onboarding resolution (no shape guessing required)
    const onboarding =
      me?.onboarding ??
      me?.aquorix_user?.profile?.onboarding_metadata ??
      me?.operator?.pro_profile?.onboarding_metadata ??
      null;

    const completionPercentage =
      typeof onboarding?.completion_percentage === 'number'
        ? onboarding.completion_percentage
        : (onboarding?.is_complete === true ? 100 : 0);

    const currentStep =
      typeof onboarding?.current_step === 'number'
        ? onboarding.current_step
        : 1;

    console.log('getUserRole debug:', {
      ok: me?.ok,
      routing_hint: me?.routing_hint,
      role,
      tier,
      onboarding_present: !!onboarding,
      completionPercentage,
      currentStep
    });

    // No onboarding => start fresh
    if (!onboarding) {
      return { role, tier, action: 'start_onboarding', redirect: '/onboarding/step1' };
    }

    // Complete => dashboard
    if (completionPercentage === 100 || me?.routing_hint === 'dashboard' || onboarding?.is_complete === true) {
      return { role, tier, action: 'dashboard', redirect: '/dashboard' };
    }

    // Incomplete => resume onboarding
    if (completionPercentage < 100) {
      return {
        role,
        tier,
        action: 'resume_onboarding',
        redirect: `/onboarding/step${currentStep}`,
        progress: { step: currentStep, percentage: completionPercentage }
      };
    }

    // fallback
    return { role, tier, action: 'needs_setup', redirect: '/account-setup' };

  } catch (error) {
    console.error('Error in getUserRole:', error);
    return { role: null, tier: null, action: 'error', redirect: '/login' };
  }
}

/**
 * Helper function to check if user needs onboarding
 * Preserves fail-closed semantics: on any error => needsOnboarding: true
 */
export async function checkOnboardingStatus(userId: string): Promise<{
  needsOnboarding: boolean;
  currentStep?: number;
  completionPercentage?: number;
}> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      return { needsOnboarding: true };
    }

    const response = await fetch('/api/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!response.ok) {
      return { needsOnboarding: true };
    }

    const me = await response.json();

    const onboarding =
      me?.onboarding ??
      me?.aquorix_user?.profile?.onboarding_metadata ??
      me?.operator?.pro_profile?.onboarding_metadata ??
      null;

    if (!onboarding) {
      return { needsOnboarding: true };
    }

    const completionPercentage =
      typeof onboarding?.completion_percentage === 'number'
        ? onboarding.completion_percentage
        : (onboarding?.is_complete === true ? 100 : 0);

    const currentStep =
      typeof onboarding?.current_step === 'number'
        ? onboarding.current_step
        : 1;

    return {
      needsOnboarding: completionPercentage < 100 && me?.routing_hint !== 'dashboard',
      currentStep,
      completionPercentage
    };

  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return { needsOnboarding: true };
  }
}