/*
 * File: Signup.tsx
 * Path: CascadeProjects/aquorix-pro-admin/src/pages/Signup.tsx
 * Description: AQUORIX signup page. Handles Supabase "Confirm email" flow gracefully.
 * Author: AQUORIX Engineering
 * Version: 1.2.3
 * Created: 2025-07-07
 * Last Updated: 2026-01-02
 *
 * Status: MVP (email confirmation supported)
 * Dependencies: React, supabaseClient
 *
 * Change Log:
 * 02-06-2026 - v1.2.3
 * - Fix single line email redirect
 * 
 * 01-02-2026 - v1.2.2
 * - Removed First Name / Last Name fields from /signup (identity captured in Onboarding Step 1).
 * - Removed "Command the Depths" text from left panel (logo only).
 * - Removed first_name / last_name metadata from Supabase signUp().
 *
 * 01-02-2026 - v1.2.1
 * - Signup does NOT attempt post-signup routing.
 * - Signup does NOT insert into user_profile (handled by backend onboarding flow / /api/v1/me pipeline).
 * - User confirms email, then AuthCallback handles routing.
 *
 * 12-31-2025 - v1.2.0
 * - When "Confirm email" is enabled in Supabase, signUp() commonly returns NO session.
 * - In that case, we show a "Check your email" confirmation screen and do NOT attempt redirects.
 * - We also prevent double-submit to avoid 429 rate limits.
 */

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Auth.css';

interface SignupFormData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getPasswordStrength = (password: string): string => {
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
  };

  const validateField = (field: keyof SignupFormData, value: string): string => {
    switch (field) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      case 'password': {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        const err = passwordRegex.test(value) ? '' : 'Must contain 8+ chars, 1 uppercase letter, and 1 number';
        setPasswordStrength(getPasswordStrength(value));
        return err;
      }
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrors({});

    // Validate
    const validationErrors: Partial<SignupFormData> = {};
    (Object.keys(formData) as (keyof SignupFormData)[]).forEach((key) => {
      const msg = validateField(key, formData[key]);
      if (msg) validationErrors[key] = msg;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          // Make sure Supabase uses our app callback route after verification
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            // Identity is collected in Onboarding Step 1 (NOT here)
            role: 'pro_user'
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Success state: do NOT try to read user/session or route.
      // Confirm email first, then AuthCallback routes.
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.message || 'An error occurred during signup';
      console.error('[Signup] error:', err);
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Password visibility toggle
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
        <img src="/aqx-ctd-logo.svg" alt="AQUORIX Logo" style={{ width: 140, height: 140, marginBottom: 0 }} />
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
            fontSize: 28,
            color: '#2574d9',
            marginBottom: 8,
            letterSpacing: 0.5,
            textAlign: 'center'
          }}
        >
          Sign Up
        </div>

        {!isSuccess ? (
          <>
            <div style={{ color: '#222', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
              Create your AQUORIX Pro account
            </div>

            <form onSubmit={handleSubmit} className="onboarding-form">
              <div className="form-group" style={{ marginBottom: 18 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    fontSize: 17,
                    padding: '12px 14px',
                    borderRadius: 6,
                    border: errors.email ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                    marginBottom: 6,
                    opacity: isLoading ? 0.7 : 1
                  }}
                />
                {errors.email && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.email}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      fontSize: 17,
                      padding: '12px 14px',
                      borderRadius: 6,
                      border: errors.password ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                      marginBottom: 6,
                      opacity: isLoading ? 0.7 : 1
                    }}
                  />
                  <span style={{ position: 'absolute', right: 12, top: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={isLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        padding: 0
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
                {errors.password && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.password}</span>}
                {passwordStrength && (
                  <div style={{ marginTop: 4 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color:
                          passwordStrength === 'Strong'
                            ? '#22c55e'
                            : passwordStrength === 'Medium'
                              ? '#f59e0b'
                              : '#ef4444'
                      }}
                    >
                      Password strength: {passwordStrength}
                    </span>
                  </div>
                )}
              </div>

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
                {isLoading ? 'Creating Account…' : 'Create Account'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 14, color: '#7b8ca6' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#2574d9', textDecoration: 'none', fontWeight: 500 }}>
                  Sign In
                </a>
              </div>
            </form>
          </>
        ) : (
          <>
            <div style={{ color: '#111827', fontSize: 16, marginBottom: 16, textAlign: 'center' }}>
              Check your inbox to confirm your email.
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: 14,
                color: '#334155',
                fontSize: 14,
                lineHeight: 1.45
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Next steps</div>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                <li>Open the confirmation email from Supabase.</li>
                <li>Click the confirmation link.</li>
                <li>You’ll return here and we’ll continue onboarding automatically.</li>
              </ol>
              <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
                If you don’t see it, check spam/junk or wait a minute and try again.
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <a href="/login" style={{ color: '#2574d9', textDecoration: 'none', fontWeight: 600 }}>
                Back to Sign In
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
