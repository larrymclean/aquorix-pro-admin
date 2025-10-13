// utils/getTierRole.ts
// Utility to map onboarding tier to allowed role for user_profile
/*
 * File: getTierRole.ts
 * Path: src/utils/getTierRole.ts
 * Description: Maps onboarding tier (user_tier string) to allowed role for user_profile.
 * Author: AQUORIX Engineering
 * Created: 2025-07-11
 * Last Updated: 2025-09-14
 * Status: Updated for string-based tier system
 * Change Log:
 *   2025-07-11 (AQUORIX Eng): Initial implementation (number-based).
 *   2025-09-14 (AQUORIX Eng): Updated to accept string user_tier values.
 */

export const getTierRole = (tier: string): string => {
  switch (tier) {
    case 'solo':
      return 'pro_user';
    case 'entrepreneur':
      return 'entrepreneur_user';
    case 'dive_center':
      return 'manager';
    case 'complex':
      return 'director';
    case 'affiliate':
      return 'agent';
    default:
      return 'pro_user';
  }
};
