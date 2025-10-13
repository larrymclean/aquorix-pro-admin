/*
 * File: getUserRole.ts
 * Path: src/utils/getUserRole.ts
 * Description: Simplified Login/Resume Logic using pro_profiles as single checkpoint. Clean, PHP-style approach - one source of truth for user state.
 * Author: Claude & ChatGPT collaboration with Larry McLean
 * Created: 2025-09-18
 * Last Updated: 2025-09-18
 * Status: Ready for implementation - Single Source of Truth approach
 * Dependencies: supabaseClient
 * Notes: Eliminates onboarding_users staging table dependency. Uses users + pro_profiles as single checkpoint system with onboarding_metadata for progress tracking.
 * Change Log:
 * 2025-09-18 (Claude & ChatGPT): Complete refactor to eliminate dual-flow confusion. Implemented single source of truth using pro_profiles.onboarding_metadata for all resume logic and progress tracking.
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

interface ProProfile {
  onboarding_metadata: {
    completion_percentage?: number;
    current_step?: number;
    started_at?: string;
    last_activity?: string;
    completed_steps?: number[];
    step1_completed?: boolean;
    step2_completed?: boolean;
    step3_completed?: boolean;
    step4_completed?: boolean;
  } | null;
  first_name: string | null;
  last_name: string | null;
  tier_level: number | null;
}

interface UserData {
  role: string;
  tier: string;
  email: string;
  pro_profiles: ProProfile | null;
}

/**
 * FRONTEND: getUserRole() function - Single Source of Truth
 * Replace your existing getUserRole with this simplified version
 */
export async function getUserRole(user: User | null): Promise<UserRole> {
  if (!user?.id) {
    return {
      role: null,
      tier: null,
      action: 'error',
      redirect: '/login'
    };
  }

  try {
    // 🔄 Replace Supabase query with backend API call
    const response = await fetch(`/api/users/by-supabase-id/${user.id}`);
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();

    // Debug logging for onboarding logic
    const profile: ProProfile | null = data || null;
    const metadata = profile?.onboarding_metadata;
    console.log('getUserRole debug:', {
      hasData: !!data,
      profile,
      metadata,
      completionPercentage: metadata?.completion_percentage
    });

    // Check onboarding completion status
    if (!metadata) {
      // User exists but no onboarding metadata - start fresh
      return {
        role: data.role,
        tier: data.tier,
        action: 'start_onboarding',
        redirect: '/onboarding/step1'
      };
    }

    const completionPercentage = metadata.completion_percentage || 0;
    const currentStep = metadata.current_step || 1;

    if (completionPercentage === 100) {
      return { role: data.role, tier: data.tier, action: 'dashboard', redirect: '/dashboard' };
    }

    if (completionPercentage < 100) {
      return {
        role: data.role,
        tier: data.tier,
        action: 'resume_onboarding',
        redirect: `/onboarding/step${currentStep}`,
        progress: { step: currentStep, percentage: completionPercentage }
      };
    }

    // fallback (should never hit)
    return { role: data.role, tier: data.tier, action: 'needs_setup', redirect: '/account-setup' };

  } catch (error) {
    console.error('Error in getUserRole:', error);
    return { role: null, tier: null, action: 'error', redirect: '/login' };
  }
}


/**
 * Helper function to check if user needs onboarding
 */
export async function checkOnboardingStatus(userId: string): Promise<{
  needsOnboarding: boolean;
  currentStep?: number;
  completionPercentage?: number;
}> {
  try {
    const response = await fetch(`/api/users/by-supabase-id/${userId}`);
    if (!response.ok) {
      return { needsOnboarding: true };
    }
    const data = await response.json();

    const metadata = data?.onboarding_metadata;

    if (!metadata) {
      return { needsOnboarding: true };
    }

    const completionPercentage = metadata.completion_percentage || 0;
    const currentStep = metadata.current_step || 1;

    return {
      needsOnboarding: completionPercentage < 100,
      currentStep,
      completionPercentage
    };

  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return { needsOnboarding: true };
  }
}

/**
 * USAGE EXAMPLES:
 * 
 * 1. In your login component:
 *    const userState = await getUserRole(user);
 *    if (userState.action === 'resume_onboarding') {
 *      router.push(userState.redirect);
 *    }
 * 
 * 2. Quick status check:
 *    const status = await checkOnboardingStatus(user.id);
 *    if (status.needsOnboarding) {
 *      // Redirect to onboarding
 *    }
 * 
 * 3. Resume logic:
 *    - User logs in → check pro_profiles.onboarding_metadata
 *    - If < 100% → redirect to /onboarding/step{current_step}
 *    - If 100% → redirect to appropriate dashboard
 */