/*
  File:        api.ts
  Path:        src/utils/api.ts
  Project:     AQUORIX Pro Dashboard
  Version:     1.0.0
  Last Updated: 2026-01-13

  Description:
    Single source of truth for API base URL + helpers.
    - Supports Render/production via REACT_APP_API_BASE_URL
    - Keeps localhost fallback for local dev
    - Provides:
        apiUrl(path) -> string
        getMe(token?) -> Response
        getMeJson<T>(token?) -> parsed JSON

  IMPORTANT:
    - getMe() returns a Response (so callers can check res.ok / status)
    - getMeJson() returns parsed JSON for callers that just want data
*/

import { supabase } from "../lib/supabaseClient";

// Normalize base URL (strip trailing slashes)
export const API_BASE_URL: string =
  (process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:3001");

// Legacy compatibility (some older code does: import API_BASE_URL from "../utils/api")
export default API_BASE_URL;

export function apiUrl(path: string): string {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Fetch helper that injects Bearer token.
 * If token not provided, it attempts to pull it from Supabase session.
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
  token?: string
): Promise<Response> {
  let accessToken = token;

  if (!accessToken) {
    const { data } = await supabase.auth.getSession();
    accessToken = data?.session?.access_token || undefined;
  }

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Do not force Content-Type for GET requests with no body.
  return fetch(apiUrl(path), {
    ...init,
    headers,
    cache: "no-store",
    credentials: "include",
  });
}

/**
 * /api/v1/me - returns Response
 */
export async function getMe(token?: string): Promise<Response> {
  return apiFetch("/api/v1/me", { method: "GET" }, token);
}

/**
 * /api/v1/me - returns parsed JSON
 */
export async function getMeJson<T = unknown>(token?: string): Promise<T> {
  const res = await getMe(token);
  if (!res.ok) throw new Error(`getMe HTTP ${res.status}`);
  return (await res.json()) as T;
}
