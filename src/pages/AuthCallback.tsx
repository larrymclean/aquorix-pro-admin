/*
 * File: AuthCallback.tsx
 * Path: src/pages/AuthCallback.tsx
 * Description: Handles Supabase auth callback + routes user into app.
 * Author: AQUORIX Engineering
 * Version: 1.2.0
 * Last Updated: 2026-01-06
 *
 * CRITICAL FIX:
 * - Never hardcode /onboarding.
 * - If session exists, call /api/v1/me and route by routing_hint:
 *   admin -> /admin/overview
 *   dashboard -> /dashboard
 *   onboarding -> /onboarding
 * - If no session -> /login
 *
 * Notes:
 * - Dev mode React StrictMode may run effects twice; we guard with a ref.
 * - Keep UI stable (no oscillating messages).
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/Auth.css';
import API_BASE_URL from "../utils/api";

type Status = 'working' | 'done' | 'error';

type MeResponse = {
  ok?: boolean;
  routing_hint?: 'admin' | 'dashboard' | 'onboarding' | string;
  onboarding?: { is_complete?: boolean };
};

// Production
const ME_URL = `${API_BASE_URL}/api/v1/me`;

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const ranRef = useRef(false);

  const [status, setStatus] = useState<Status>('working');
  const [message, setMessage] = useState<string>('Signing you in…');

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      try {
        setStatus('working');
        setMessage('Signing you in…');

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data?.session;

        if (!session?.access_token) {
          setStatus('error');
          setMessage('No active session found. Please sign in.');
          window.setTimeout(() => navigate('/login', { replace: true }), 400);
          return;
        }

        // Backend is authority for routing
        const res = await fetch(ME_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          credentials: 'omit',
        });

        if (res.status === 401) {
          setStatus('error');
          setMessage('Session expired. Please sign in again.');
          window.setTimeout(() => navigate('/login', { replace: true }), 450);
          return;
        }

        if (!res.ok) {
          throw new Error(`/me returned HTTP ${res.status}`);
        }

        const meData = (await res.json()) as MeResponse;

        setStatus('done');

        const hint = meData.routing_hint;

        if (hint === 'admin') {
          setMessage('Success. Routing to admin dashboard…');
          window.setTimeout(() => navigate('/admin/overview', { replace: true }), 250);
          return;
        }

        if (hint === 'dashboard') {
          setMessage('Success. Routing to dashboard…');
          window.setTimeout(() => navigate('/dashboard', { replace: true }), 250);
          return;
        }

        if (hint === 'onboarding') {
          setMessage('Success. Continuing to onboarding…');
          window.setTimeout(() => navigate('/onboarding', { replace: true }), 250);
          return;
        }

        // Safe fallback
        setMessage('Success. Continuing…');
        window.setTimeout(() => navigate('/login', { replace: true }), 300);
      } catch (err: any) {
        console.error('[AuthCallback] error:', err);
        setStatus('error');
        setMessage(err?.message || 'Authentication failed. Please sign in again.');
        window.setTimeout(() => navigate('/login', { replace: true }), 500);
      }
    };

    void run();
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 540,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        marginTop: 40,
        maxWidth: 800,
        margin: '40px auto 0',
      }}
    >
      {/* Left Branding Panel (logo-only) */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #2574d9 0%, #0a3167 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src="/aqx-ctd-logo.svg" alt="AQUORIX Logo" style={{ width: 140, height: 140 }} />
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          background: '#fff',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 26,
            color: '#2574d9',
            marginBottom: 8,
            letterSpacing: 0.5,
            textAlign: 'center',
          }}
        >
          {status === 'error' ? 'Sign-in issue' : 'Finishing sign-in'}
        </div>

        <div style={{ color: '#111827', fontSize: 16, marginBottom: 14, textAlign: 'center' }}>{message}</div>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          (If this doesn’t continue automatically, go back to{' '}
          <a href="/login" style={{ color: '#2574d9', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </a>
          .)
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;