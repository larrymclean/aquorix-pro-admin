/*
File: Onboarding.tsx
Path: src/pages/Onboarding.tsx
Description: AQUORIX onboarding flow for new users. Handles tier/role selection, profile completion, and RBAC-compliant onboarding logic. Enforces canonical roles and writes to user_profile. 
Author: AQUORIX Engineering
Created: 2025-07-11
Last Updated: 2025-07-11
Status: MVP scaffold, DIR-compliant, punchlist phase
Dependencies: React, Supabase client, getUserRole, RBAC matrix
Notes: Only canonical roles per tier are selectable. RBAC enforced post-onboarding. See Pro_User_Roles_and_Dashboard_Feature_Matrix.md.
Change Log:
- 2025-07-11 (AQUORIX Eng): Initial MVP onboarding scaffold. Role selection strictly per approved matrix.
- 2025-07-11 (AQUORIX Eng): Fix import path for Supabase client to lib/supabaseClient (DIR, PM-approved).
- 2025-07-11 (AQUORIX Eng): Fix Supabase upsert call: use onConflict: 'user_id' (string) to resolve TS2769 error (DIR, PM-approved).
- 2025-07-12 (AQUORIX Eng): Enforce onboarding RBAC: redirect if has_onboarded, apply theme class by tier (DIR, PM-approved).
*/

import React from 'react';
import OnboardingWizard from './OnboardingWizard';

const Onboarding: React.FC = () => {
  return <OnboardingWizard />;
};

export default Onboarding;
