/*
 * File: Login.tsx
 * Path: src/pages/Login.tsx
 * Description: AQUORIX login page. Uses centralized getUserRole utility for post-login role/tier resolution and redirect.
 * Author: AQUORIX Engineering
 * Created: 2025-07-07
 * Last Updated: 2025-09-16
 * Status: MVP, auth logic centralized
 * Dependencies: React, supabaseClient, getUserRole
 * Notes: Uses getUserRole for all role/tier logic. Robust error handling for all scenarios.
 * Change Log:
 *   2025-07-11 (AQUORIX Eng): Refactored to use getUserRole utility, improved error handling and redirect logic.
 *   2025-07-11 (AQUORIX Eng): Added robust error trapping, UI feedback, and retry button to login flow.
 *   2025-09-16 (AQUORIX Eng): Standardized container width to match onboarding flow consistency.
 */
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Auth.css';
import { getUserRole } from '../utils/getUserRole';

interface LoginCredentials {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle user login and post-auth role/tier resolution.
   * Robust error trapping and UI feedback.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Transform identifier based on format
      const loginEmail = credentials.identifier.includes('@') 
        ? credentials.identifier 
        : `${credentials.identifier}@placeholder.com`;

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: credentials.password
      });

      if (authError) {
        setError(authError.message);
        console.error('[Login] Supabase login error:', authError);
      } else {
        // Handle remember me
        if (credentials.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // Redirect based on user role/tier (centralized)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('User not found after login.');
          console.error('[Login] No user returned after login.');
          return;
        }

        // ✅ NEW: store Supabase ID in localStorage for dashboard
        localStorage.setItem("supabase_user_id", user.id);

        try {
          const { role, tier } = await getUserRole(user);
          let redirectPath = '/dashboard';
          const internalAdminRoles = ['admin', 'support', 'moderator', 'dev', 'exec', 'ops'];
          if (role && internalAdminRoles.includes(role)) {
            redirectPath = '/admin/overview';
            console.log('[Login][DEBUG] Internal admin role detected, redirecting to', redirectPath, 'role:', role, 'tier:', tier);
          } else if (tier && ['solo', 'entrepreneur', 'dive_center', 'complex'].includes(tier)) {
            redirectPath = '/dashboard';
            console.log('[Login][DEBUG] Pro user, redirecting to', redirectPath, 'role:', role, 'tier:', tier);
          } else if (tier === 'affiliate') {
            redirectPath = '/partner';
            console.log('[Login][DEBUG] Partner user, redirecting to', redirectPath, 'role:', role, 'tier:', tier);
          } else if (!role || role === 'guest' || role === 'authenticated' || role === '-') {
            console.log('[Login][DEBUG] New user detected, redirecting to /onboarding', 'role:', role, 'tier:', tier);
            window.location.href = '/onboarding';
            return;
          } else {
            setError('No valid role found. Please contact support.');
            console.error('[Login] No valid role found for user:', user, 'role:', role, 'tier:', tier);
            return;
          }
          window.location.href = redirectPath;
        } catch (roleErr: any) {
          setError('Error determining user role: ' + (roleErr?.message || 'Unknown error'));
          console.error('[Login] Error in getUserRole:', roleErr);
        }
      }

    } catch (error) {
      setError('An unexpected error occurred during login.');
      console.error('[Login] Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retry login handler
   */
  const handleRetry = () => {
    setError('');
    setIsLoading(false);
  };

  // State for password visibility toggle (AQUORIX standards)
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
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
          Sign In
        </div>
        <div style={{ 
          color: '#222', 
          fontSize: 16, 
          marginBottom: 24, 
          textAlign: 'center' 
        }}>
          Welcome back to AQUORIX Pro
        </div>

        <form onSubmit={handleLogin} className="onboarding-form">
          {/* Error Display Section */}
          {error && (
            <div style={{ 
              color: '#e74c3c', 
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 6,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: 14
            }}>
              <strong>Login Error:</strong> {error}
              <button
                type="button"
                style={{ 
                  background: '#f1f5fa', 
                  color: '#2574d9', 
                  border: '1px solid #c3d0e8', 
                  borderRadius: 4, 
                  padding: '4px 12px', 
                  fontSize: 12,
                  marginLeft: 12,
                  cursor: 'pointer'
                }}
                onClick={handleRetry}
                disabled={isLoading}
              >
                Retry
              </button>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Email / Username / Phone"
              value={credentials.identifier}
              onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
              style={{ 
                width: '100%', 
                fontSize: 17, 
                padding: '12px 14px', 
                borderRadius: 6, 
                border: '1px solid #c3d0e8',
                marginBottom: 6
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                autoComplete="current-password"
                aria-label="Password"
                style={{ 
                  width: '100%', 
                  fontSize: 17, 
                  padding: '12px 14px', 
                  borderRadius: 6, 
                  border: '1px solid #c3d0e8',
                  marginBottom: 6
                }}
              />
              <span style={{ position: 'absolute', right: 12, top: 12, cursor: 'pointer' }}>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: 0
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0072e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.71 3.31-4.93 6-6.29M1 1l22 22"/>
                      <path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c.94 0 1.81-.34 2.47-.91"/>
                      <path d="M12 5c2.76 0 5.26 1.12 7.07 2.93M17.94 6.06A10.94 10.94 0 0 1 23 12c-1.21 2.71-3.31 4.93-6 6.29"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0072e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="12" rx="10" ry="7"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 20,
            fontSize: 14
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
              />
              Remember me
            </label>
            <a href="/reset-password" style={{ color: '#2574d9', textDecoration: 'none' }}>
              Forgot password?
            </a>
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

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