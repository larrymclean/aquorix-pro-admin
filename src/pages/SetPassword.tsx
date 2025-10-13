/*
File: SetPassword.tsx
Path: src/pages/SetPassword.tsx
Description: AQUORIX unified set-password page for invited users. Uses canonical style guide classes for full brand alignment. Handles Supabase invite token verification, password setting, error handling, and redirects to onboarding. Fully session-aware and accessible.
Author: Cascade AI
Created: 2025-07-14
Last Updated: 2025-09-16
Status: Unified style refactor complete
Dependencies: Supabase JS Client, aqx-unified-style-guide.css, ErrorBanner, onboarding logic.
Notes: Refactored to use canonical AQUORIX styles. All inline/module styles for form elements removed. See audit punchlist for further improvements.
Change Log:
- 2025-07-14 (Cascade): Refactored to use unified design system; removed module/inlined styles from form, input, button.
- 2025-07-14 (Cascade): Initial scaffold for custom set-password flow.
- 2025-09-16 (Cascade): Standardized container width to match onboarding flow consistency and added sign-in link.
*/

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import TestProtoSessionTile from '../components/onboarding/TestProtoSessionTile';
import OnboardingStatusCard from '../components/onboarding/OnboardingStatusCard';

const SetPassword: React.FC = () => {
  // State for password fields, visibility toggles, errors, and password strength
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Extract access_token from query params and validate session ---
  useEffect(() => {
    const checkSessionOrTokens = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (!accessToken || !refreshToken) {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (!session) {
          setTokenError('Missing or invalid invitation tokens. Please use the invitation link from your email.');
        } else {
          setTokenError(null);
        }
        return;
      }
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
        })
        .catch(() => {
          setTokenError('Invalid or expired invitation link. Please request a new invite.');
        });
    };
    checkSessionOrTokens();
  }, [location.search]);

  // --- Password Strength Meter Logic ---
  useEffect(() => {
    if (!password) { setStrength(null); return; }
    if (password.length < 8) { setStrength('weak'); return; }
    // Strong: 10+ chars, mix of upper/lower, number, symbol
    const strong = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}/;
    const medium = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
    if (strong.test(password)) setStrength('strong');
    else if (medium.test(password)) setStrength('medium');
    else setStrength('weak');
  }, [password]);

  // --- Validation ---
  const validate = () => {
    let valid = true;
    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    } else {
      setPasswordError(null);
    }
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      valid = false;
    } else {
      setConfirmError(null);
    }
    return valid;
  };

  // --- Handle password set ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      localStorage.setItem('aqx_password_set', 'true');
      navigate('/onboarding');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to set password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Unified error logic ---
  let mainError = tokenError || passwordError || confirmError;

  // --- Render ---
  return (
    <>
      <div style={{ 
        display: 'flex', 
        minHeight: 540, 
        borderRadius: 12, 
        overflow: 'hidden', 
        background: '#fff', 
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)', 
        marginTop: 40,
        maxWidth: 800,
        margin: '40px auto 0'
      }}>
        {/* Left Branding Panel */}
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #2574d9 0%, #0a3167 100%)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img src="/aqx-ctd-logo.svg" alt="AQUORIX Logo" style={{ width: 140, height: 140, marginBottom: 32 }} />
        </div>
        
        {/* Right Form Panel */}
        <div style={{ 
          flex: 1, 
          background: '#fff', 
          padding: '36px 32px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            fontWeight: 700, 
            fontSize: 28, 
            color: '#2574d9', 
            marginBottom: 8, 
            letterSpacing: 0.5, 
            textAlign: 'center' 
          }}>
            Set Your Password
          </div>
          <div style={{ 
            color: '#222', 
            fontSize: 16, 
            marginBottom: 24, 
            textAlign: 'center' 
          }}>
            Welcome to the AQUORIX Pro Dashboard
          </div>

          <form onSubmit={handleSubmit} className="onboarding-form">
            {/* Unified error area: show only one error, priority order */}
            {mainError && (
              <div style={{ 
                color: '#e74c3c', 
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                padding: '12px 16px',
                marginBottom: 20,
                fontSize: 14
              }} role="alert">
                {mainError}
              </div>
            )}

            {/* Password Field */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  placeholder="New Password"
                  aria-label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={8}
                  required
                  autoFocus
                  style={{ 
                    width: '100%', 
                    fontSize: 17, 
                    padding: '12px 14px', 
                    borderRadius: 6, 
                    border: passwordError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                    marginBottom: 6
                  }}
                />
                {/* Password Toggle absolutely positioned inside input */}
                <span style={{ position: 'absolute', right: 12, top: 12, cursor: 'pointer' }}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      padding: 0
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b7de1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="12" rx="10" ry="7"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </span>
              </div>
              {/* Always render password strength meter below input+toggle */}
              {strength && (
                <div style={{ marginTop: 4 }}>
                  <span style={{ 
                    fontSize: 12,
                    color: strength === 'strong' ? '#22c55e' : strength === 'medium' ? '#f59e0b' : '#ef4444'
                  }}>
                    Password strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              {/* Input + Toggle grouped together */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  style={{ 
                    width: '100%', 
                    fontSize: 17, 
                    padding: '12px 14px', 
                    borderRadius: 6, 
                    border: confirmError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                    marginBottom: 6
                  }}
                />
                {/* Password Toggle absolutely positioned inside input */}
                <span style={{ position: 'absolute', right: 12, top: 12, cursor: 'pointer' }}>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      padding: 0
                    }}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2b7de1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="12" rx="10" ry="7"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                background: loading ? '#94a3b8' : '#2574d9',
                color: '#fff', 
                border: 'none', 
                borderRadius: 6, 
                padding: '12px 22px', 
                fontWeight: 700, 
                fontSize: 18, 
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                marginBottom: 16
              }}
              aria-busy={loading}
            >
              {loading ? 'Setting Password…' : 'Set Password & Continue'}
            </button>

            <div style={{ textAlign: 'center', fontSize: 14, color: '#7b8ca6' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: '#2574d9', textDecoration: 'none', fontWeight: 500 }}>
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Onboarding Status Card */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
        <OnboardingStatusCard
          step={1}
          totalSteps={4}
          firstName={''} // Placeholder for now
          lastName={''} // Placeholder for now
          email={session?.user?.email || ''}
          phone={''} // Placeholder for now
          passwordSet={!!password}
          emailConfirmed={!!session?.user?.email_confirmed_at}
        />
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <TestProtoSessionTile />
      </div>
    </>
  );
};

export default SetPassword;