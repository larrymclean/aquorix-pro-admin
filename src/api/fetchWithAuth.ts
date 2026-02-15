/*
  File: fetchWithAuth.ts
  Path: /Users/larrymclean/CascadeProjects/aquorix-frontend/src/api/fetchWithAuth.ts
  Description:
    Centralized fetch wrapper that injects Authorization: Bearer <token>
    and normalizes errors for deterministic UI handling (403/409 banners).

  Author: AQUORIX Team
  Created: 2026-02-14
  Version: 1.0.0

  Change Log:
    - 2026-02-14 - v1.0.0:
      - Initial creation
*/

export type ApiErrorShape = {
  ok: false;
  status: number;
  code?: string;
  message: string;
  raw?: any;
};

type GetTokenFn = () => Promise<string>;

export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit,
  getToken: GetTokenFn
): Promise<T> {
  const token = await getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message =
      (data && (data.message || data.msg || data.error)) ||
      `Request failed with status ${res.status}`;

    const err: ApiErrorShape = {
      ok: false,
      status: res.status,
      code: data?.status || data?.error_code || data?.code,
      message,
      raw: data,
    };

    throw err;
  }

  return data as T;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
