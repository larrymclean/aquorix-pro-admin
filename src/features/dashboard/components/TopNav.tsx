/*
  ============================================================================
  AQUORIX Legacy Pro TopNav (DEPRECATED)
  ============================================================================
  File:        TopNav.tsx
  Path:        src/features/dashboard/components/TopNav.tsx
  Description: Legacy Pro dashboard TopNav (Phase B) that previously fetched /api/v1/me.
               This file is DEPRECATED in Phase C. Kept to preserve history and prevent
               accidental reintroduction of duplicate boot calls.

  Author:      Larry McLean
  Created:     (legacy)
  Version:     1.0.1

  Last Updated: 2026-01-08
  Status:      Deprecated (Do Not Use)

  Notes:
  - CRITICAL: Single boot call invariant.
    This component MUST NOT fetch /api/v1/me.
  - Use the canonical TopNav instead:
    src/components/TopNav.tsx

  Change Log (append-only):
    - 2026-01-08 - v1.0.1 (Larry McLean + AI Team)
      - Deprecate legacy TopNav and re-export canonical TopNav
      - Remove duplicate /api/v1/me fetch behavior
*/

import TopNav from '../../../components/TopNav';
export default TopNav;