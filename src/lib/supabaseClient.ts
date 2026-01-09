/*
  File: supabaseClient.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-pro-admin/src/lib/supabaseClient.ts
  Description:
    Supabase client singleton for AQUORIX PRO Admin frontend.
    NOTE: CRA uses process.env.REACT_APP_* for browser env injection.
    Do NOT log secrets to console.

  Author: Larry & AI team
  Created: 2025-07-13
  Version: v1.0.1

  Last Updated: 2026-01-07
  Status: Active

  Change Log:
    - 2026-01-07 - v1.0.1 (Larry McLean & ChatGPT):
      - Standardized env lookup for CRA (REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY)
      - Removed logging of anon key
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabaseClient] Missing env vars. Check .env.local for REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);