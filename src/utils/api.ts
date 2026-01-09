/*
  File:         api.ts
  Path:         src/utils/api.ts
  Description:

  Author:       Larry mcLean & ChatGPT
  Created:      2026-01-07
  Version:      1.0.0

  Last Updated: 2026-01-07
  Status:       Active

  Change Log:
  - 2026-01-07 - v1.0.0 (Author(s)): Larry McLean
    - Added header text data
  - YYYY-MM-DD - vX.Y.Z (Author(s)):
      - bullet
*/

import { supabase } from '../lib/supabaseClient';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Get current Supabase access token
 */
async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Authenticated fetch helper for protected endpoints
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  return response;
}

/**
 * Typed /api/v1/me call (boot authority)
 */
export async function getMe() {
  const res = await fetchWithAuth('/api/v1/me');

  if (!res.ok) {
    throw new Error(`getMe failed: ${res.status}`);
  }

  return res.json();
}