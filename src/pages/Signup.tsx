/*
 * File: Signup.tsx
 * Path: src/pages/Signup.tsx
 * Description: AQUORIX signup page. Uses centralized getUserRole utility for post-signup role/tier resolution and redirect.
 * Author: AQUORIX Engineering
 * Created: 2025-07-07
 * Last Updated: 2025-09-16
 * Status: MVP, auth logic centralized
 * Dependencies: React, supabaseClient, getUserRole
 * Notes: Uses getUserRole for all role/tier logic. Robust error handling for all scenarios.
 * Change Log:
 *   2025-07-11 (AQUORIX Eng): Refactored to use getUserRole utility, improved error handling and redirect logic.
 *   2025-09-16 (AQUORIX Eng): Standardized container width to match onboarding flow consistency.
 */
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Auth.css';
import { getUserRole } from '../utils/getUserRole';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field: keyof SignupFormData, value: string): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Invalid email format';
      case 'phone':
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(value) ? '' : 'Invalid phone number';
      case 'username':
        if (value.trim().length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      case 'password':
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        const error = passwordRegex.test(value) ? '' : 'Must contain at least 8 characters, one uppercase letter, and one number';
        
        // Update password strength
        const strength = getPasswordStrength(value);
        setPasswordStrength(strength);
        return error;
      default:
        return '';
    }
  };

  const getPasswordStrength = (password: string): string => {
    if (password.length < 8) return 'Weak';
    if (password.length < 12) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate all fields
    const validationErrors = {} as Partial<SignupFormData>;
    (Object.keys(formData) as (keyof SignupFormData)[]).forEach(key => {
      validationErrors[key] = validateField(key, formData[key]);
    });
    
    if (Object.values(validationErrors).some(error => error)) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username.toLowerCase(),
            phone: formData.phone,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'pro_user'
          }
        }
      });

      if (authError) throw authError;

      // Store additional user data
      await supabase
        .from('user_profile')
        .insert([{
          user_id: user?.id,
          username: formData.username.toLowerCase(),
          phone: formData.phone,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'pro_user'
        }]);

      // Post-signup: fetch user and resolve role/tier for redirect
      const { data: { user: newUser } } = await supabase.auth.getUser();
      if (!newUser) {
        alert('User not found after signup.');
        setIsLoading(false);
        return;
      }

      // ✅ NEW: store Supabase ID in localStorage for dashboard
      localStorage.setItem("supabase_user_id", newUser.id);
      console.log('[Signup] Stored supabase_user_id in localStorage:', newUser.id);

      try {
        const { role, tier } = await getUserRole(newUser);
        let redirectPath = '/dashboard';
        if (role === 'admin') redirectPath = '/admin';
        else if (role === 'affiliate') redirectPath = '/dashboard'; // TODO: update if affiliate dashboard route changes
        else if (role === 'guest' || !role) {
          alert('No valid role found. Please contact support.');
          setIsLoading(false);
          return;
        }
        window.location.href = redirectPath;
      } catch (roleErr: any) {
        alert('Error determining user role: ' + (roleErr?.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
      alert(errorMessage);
      setIsLoading(false);
    }
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
          Sign Up
        </div>
        <div style={{ 
          color: '#222', 
          fontSize: 16, 
          marginBottom: 24, 
          textAlign: 'center' 
        }}>
          Create your AQUORIX Pro account
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                validateField('firstName', e.target.value);
              }}
              style={{ 
                width: '100%', 
                fontSize: 17, 
                padding: '12px 14px', 
                borderRadius: 6, 
                border: errors.firstName ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                marginBottom: 6
              }}
            />
            {errors.firstName && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.firstName}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                validateField('lastName', e.target.value);
              }}
              style={{ 
                width: '100%', 
                fontSize: 17, 
                padding: '12px 14px', 
                borderRadius: 6, 
                border: errors.lastName ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                marginBottom: 6
              }}
            />
            {errors.lastName && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.lastName}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                validateField('email', e.target.value);
              }}
              style={{ 
                width: '100%', 
                fontSize: 17, 
                padding: '12px 14px', 
                borderRadius: 6, 
                border: errors.email ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                marginBottom: 6
              }}
            />
            {errors.email && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                validateField('phone', e.target.value);
              }}
              style={{ 
                width: '100%', 
                fontSize: 17, 
                padding: '12px 14px', 
                borderRadius: 6, 
                border: errors.phone ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                marginBottom: 6
              }}
            />
            {errors.phone && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.phone}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                validateField('username', e.target.value);
              }}
              style={{ 
                width: '100%', 
                fontSize: 17, 
                padding: '12px 14px', 
                borderRadius: 6, 
                border: errors.username ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                marginBottom: 6
              }}
            />
            {errors.username && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.username}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validateField('password', e.target.value);
                }}
                autoComplete="new-password"
                aria-label="Password"
                style={{ 
                  width: '100%', 
                  fontSize: 17, 
                  padding: '12px 14px', 
                  borderRadius: 6, 
                  border: errors.password ? '1px solid #e74c3c' : '1px solid #c3d0e8',
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
            {errors.password && <span style={{ color: '#e74c3c', fontSize: 13 }}>{errors.password}</span>}
            {passwordStrength && (
              <div style={{ marginTop: 4 }}>
                <span style={{ 
                  fontSize: 12,
                  color: passwordStrength === 'Strong' ? '#22c55e' : passwordStrength === 'Medium' ? '#f59e0b' : '#ef4444'
                }}>
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
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
  );
};

export default Signup;