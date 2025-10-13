/*
  File: UserContext.tsx
  Path: src/components/UserContext.tsx
  Description: Minimal React context for providing user role/tier to dashboard subtree. Enables dynamic theme selection and RBAC.
  Author: AQUORIX Engineering
  Created: 2025-07-09
  Last Updated: 2025-07-09
  Status: MVP, theme integration
  Dependencies: React
  Notes: Wrap dashboard routes in UserProvider. Update as user model evolves.
  Change Log:
    - 2025-07-09, AQUORIX Engineering: Initial creation for theme/tier context.
*/

import React, { createContext, useContext } from 'react';

import { User } from '@supabase/supabase-js';

export interface UserContextValue {
  role: string;
  tier: number;
  user?: User;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ value, children }: { value: UserContextValue; children: React.ReactNode }) => (
  <UserContext.Provider value={value}>{children}</UserContext.Provider>
);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
