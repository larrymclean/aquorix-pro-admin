/*
 * File: AuthCallback.tsx
 * Path: CascadeProjects/aquorix-pro-admin/src/pages/AuthCallback.tsx
 * Description: Handles Supabase auth callback + routes user into app.
 * Author: AQUORIX Engineering
 * Version: 1.1.0
 * Last Updated: 2026-01-03
 *
 * Notes:
 * - Dev mode React StrictMode may run effects twice; we guard with a ref.
 * - Keep UI stable (no oscillating messages).
 * - Left panel is logo-only (no "Command the Depths" text).
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/Auth.css';

type Status = 'working' | 'done' | 'error';

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

        // In most Supabase setups, the session is already established here if email was confirmed.
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data?.session;

        if (session?.user?.id) {
          setStatus('done');
          setMessage('Success. Continuing to onboarding…');

          // Give the UI a beat so it doesn’t look like a flash/flicker.
          window.setTimeout(() => {
            navigate('/onboarding', { replace: true });
          }, 350);

          return;
        }

        // No session: user likely needs to sign in again.
        setStatus('error');
        setMessage('No active session found. Please sign in.');

        window.setTimeout(() => {
          navigate('/login', { replace: true });
        }, 600);
      } catch (err: any) {
        console.error('[AuthCallback] error:', err);
        setStatus('error');
        setMessage(err?.message || 'Authentication failed. Please sign in again.');
        window.setTimeout(() => {
          navigate('/login', { replace: true });
        }, 800);
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
        margin: '40px auto 0'
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
          justifyContent: 'center'
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
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 26,
            color: '#2574d9',
            marginBottom: 8,
            letterSpacing: 0.5,
            textAlign: 'center'
          }}
        >
          {status === 'error' ? 'Sign-in issue' : 'Finishing sign-in'}
        </div>

        <div style={{ color: '#111827', fontSize: 16, marginBottom: 14, textAlign: 'center' }}>
          {message}
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: '#64748b'
          }}
        >
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
