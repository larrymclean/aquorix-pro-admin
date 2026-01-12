/*
 * ============================================================================
 * File:        Login.tsx
 * Version:     1.2.3
 * Path:        src/pages/Login.tsx
 * Project:     AQUORIX Pro Dashboard
 * ============================================================================
 * Description:
 *   Login page for AQUORIX Pro users.
 *
 *   This implementation:
 *   - Authenticates via Supabase
 *   - Delegates ALL post-login routing decisions to /api/v1/me
 *   - Eliminates hardcoded redirects and legacy user lookups
 *
 * Architectural Rule:
 *   Frontend does NOT decide onboarding vs dashboard.
 *   Backend (/api/v1/me) is the single source of truth.
 *
 * Author:      AQUORIX Engineering
 * Created:     2025-08-01
 * Updated:     2026-01-12
 *
 * Change Log (append-only):
 * --------------------------------------------------------------------------
 * v1.0.0  2025-08-01  AQUORIX Engineering
 *   - Initial login implementation
 *
 * v1.1.0  2025-12-24  Larry McLean
 *   - Replace manual redirects with /api/v1/me routing
 *   - Remove window.location.href usage
 *   - Align login flow with onboarding resolver
 *
 * v1.2.0  2025-12-25  Larry McLean
 *   - Restore complete two-panel UI (gradient + logo)
 *   - Preserve all original styling and UX elements
 *   - Integrate /api/v1/me routing while maintaining UI integrity
 *   - Add comprehensive error handling and console logging
 *   - Professional logging output (no emoji characters)
 *   - Add explicit fetch method and cache control
 *   - Form disabled during loading state
 *
 * v1.2.1  2026-01-05 Larry McLean
 *   - Added console logging to track AQX Admin Login
 *
 * v1.2.2  2026-01-06 Larry McLean + AI Team
 *   - Change admin routing from /admin to /admin/overview
 *
 * v1.2.3  2026-01-12 Larry McLean + AI Team
 *   - Remove hardcoded localhost API calls
 *   - Route /api/v1/me through API base (REACT_APP_API_BASE_URL)
 *
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import API_BASE from '../utils/api';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Auth method (MVP): Supabase email/password.
      // Do NOT fabricate emails for username/phone until we implement a real mapping layer.
      const loginEmail = credentials.identifier.trim();

      if (!loginEmail.includes('@')) {
        setError('Please sign in with your email address.');
        console.error('[Login] Identifier is not an email. MVP requires email/password.');
        return;
      }

      // 1. Supabase authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: credentials.password
      });

      if (authError || !data.session) {
        setError(authError?.message || 'Login failed');
        console.error('[Login] Supabase authentication failed:', authError);
        return;
      }

      console.log('[Login] Supabase authentication successful');

      // v1.2.1 debug console log
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        console.error('[Login] getSession error:', sessionErr);
      } else {
        console.log('[Login] ACCESS TOKEN (copy this):', sessionData?.session?.access_token);
      }

      // Handle remember me
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // 2. Call /api/v1/me to determine routing
      // DIR: Never hardcode localhost in production builds. Use API_BASE.
      try {
        const base = String(API_BASE || '').replace(/\/+$/, '');
        const meUrl = `${base}/api/v1/me`;

        const response = await fetch(meUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
            'Content-Type': 'application/json'
          },
          cache: 'no-store',
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('[Login] Unauthorized response from /me endpoint, redirecting to login');
            navigate('/login');
            return;
          }
          if (response.status === 404) {
            console.log('[Login] User not found in AQUORIX database, redirecting to onboarding');
            navigate('/onboarding');
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const meData = await response.json();

        console.log('[Login] /me endpoint response:', {
          ok: meData.ok,
          routing_hint: meData.routing_hint,
          onboarding_complete: meData.onboarding?.is_complete
        });

        // 3. Route based on backend decision (DIR: backend is authority)
        if (meData.ok) {
          if (meData.routing_hint === 'admin') {
            console.log('[Login] Routing to admin');
            navigate('/admin/overview', { replace: true });
            return;
          }

          if (meData.routing_hint === 'dashboard') {
            console.log('[Login] Routing to dashboard');
            navigate('/dashboard', { replace: true });
            return;
          }

          if (meData.routing_hint === 'onboarding') {
            console.log('[Login] Routing to onboarding');
            navigate('/onboarding', { replace: true });
            return;
          }

          // Safety fallback: if backend says ok but routing_hint is unknown,
          // prefer onboarding unless explicitly complete.
          if (meData.onboarding?.is_complete === true) {
            console.log('[Login] Fallback routing to dashboard (onboarding complete)');
            navigate('/dashboard', { replace: true });
            return;
          }

          console.log('[Login] Fallback routing to onboarding');
          navigate('/onboarding', { replace: true });
          return;
        }

        // If meData.ok is not true, keep the user moving safely
        console.log('[Login] /me not ok; routing to onboarding');
        navigate('/onboarding', { replace: true });
      } catch (meError: unknown) {
        console.error('[Login] /me endpoint call failed:', meError);
        setError('Failed to load user context. Please try again.');
      }
    } catch (error: unknown) {
      console.error('[Login] Unexpected error:', error);
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Left Branding Panel */}
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
        <img
          src="/aqx-ctd-logo.svg"
          alt="AQUORIX Logo"
          style={{ width: 140, height: 140, marginBottom: 32 }}
        />
      </div>

      {/* Right Form Panel */}
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
            fontSize: 28,
            color: '#2574d9',
            marginBottom: 8,
            letterSpacing: 0.5,
            textAlign: 'center'
          }}
        >
          Sign In
        </div>
        <div
          style={{
            color: '#222',
            fontSize: 16,
            marginBottom: 24,
            textAlign: 'center'
          }}
        >
          Welcome back to AQUORIX Pro
        </div>

        <form onSubmit={handleLogin} className="onboarding-form">
          {/* Error Display */}
          {error && (
            <div
              style={{
                color: '#e74c3c',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                padding: '12px 16px',
                marginBottom: 20,
                fontSize: 14
              }}
            >
              <strong>Login Error:</strong> {error}
            </div>
          )}

          {/* Email/Username Input */}
          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Email / Username / Phone"
              value={credentials.identifier}
              onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
              disabled={isLoading}
              required
              style={{
                width: '100%',
                fontSize: 17,
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid #c3d0e8',
                marginBottom: 6,
                cursor: isLoading ? 'not-allowed' : 'text',
                opacity: isLoading ? 0.6 : 1
              }}
            />
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: 18 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={isLoading}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  fontSize: 17,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: '1px solid #c3d0e8',
                  marginBottom: 6,
                  cursor: isLoading ? 'not-allowed' : 'text',
                  opacity: isLoading ? 0.6 : 1
                }}
              />
              <span style={{ position: 'absolute', right: 12, top: 12, cursor: 'pointer' }}>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    padding: 0,
                    opacity: isLoading ? 0.6 : 1
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0072e5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.71 3.31-4.93 6-6.29M1 1l22 22" />
                      <path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c.94 0 1.81-.34 2.47-.91" />
                      <path d="M12 5c2.76 0 5.26 1.12 7.07 2.93M17.94 6.06A10.94 10.94 0 0 1 23 12c-1.21 2.71-3.31 4.93-6 6.29" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0072e5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <ellipse cx="12" cy="12" rx="10" ry="7" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </span>
            </div>
          </div>

          {/* Remember Me / Forgot Password */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              fontSize: 14
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <input
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                disabled={isLoading}
              />
              Remember me
            </label>
            <a href="/reset-password" style={{ color: '#2574d9', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#94a3b8' : '#2574d9',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '12px 22px',
              fontWeight: 700,
              fontSize: 18,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginBottom: 16
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', fontSize: 14, color: '#7b8ca6' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#2574d9', textDecoration: 'none', fontWeight: 500 }}>
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
