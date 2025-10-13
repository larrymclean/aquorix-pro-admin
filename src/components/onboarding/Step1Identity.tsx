/*
File: Step1Identity.tsx
Path: src/components/onboarding/Step1Identity.tsx
Description: Onboarding Step 1 – Identity form for AQUORIX onboarding wizard. MVP card layout with left-side gradient/logo and right-side form. Uses AQUORIX unified style classes, validation, and accessibility.
Author: Cascade AI
Created: 2025-07-13
Last Updated: 2025-09-16
Status: In Progress
Dependencies: React, ErrorBanner, AQUORIX unified style guide, Supabase
Notes: Refactored to MVP onboarding card style. No CSS module. All logic and validation preserved. Database persistence to pro_profiles table on form submission.
Change Log:
- 2025-07-13 (Cascade): Initial scaffold with header, form, validation, and error handling.
- 2025-07-13 (Cascade): Updated to make phone number required (product rule).
- 2025-07-17 (Cascade): Refactored to MVP card layout, AQUORIX classes, and unified style. Removed CSS module.
- 2025-09-17 (Cascade): Added database persistence - upserts to pro_profiles table on form submission with identity data.
*/

import React, { useState } from 'react';
import { ErrorBanner } from '../common/ErrorBanner';
import { supabase } from '../../lib/supabaseClient';

interface Step1IdentityProps {
  email: string; // Pre-filled from Supabase session
  initialFirstName?: string;
  initialLastName?: string;
  initialCountryCode?: string;
  initialPhone?: string;
  session: any; // Supabase session for user ID
  onNext: (data: { firstName: string; lastName: string; countryCode: string; phone: string }) => void;
}

export const Step1Identity: React.FC<Step1IdentityProps> = ({
  email,
  initialFirstName = '',
  initialLastName = '',
  initialCountryCode = '+1',
  initialPhone = '',
  session,
  onNext,
}) => {
  // Local state for controlled inputs
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ firstName: false, lastName: false, countryCode: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);

  // Fetch onboarding_metadata on mount
  React.useEffect(() => {
    async function fetchOnboardingMetadata() {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('pro_profiles(onboarding_metadata)')
        .eq('supabase_user_id', session.user.id)
        .single();
      const proProfiles = data?.pro_profiles;
      let metadata: any = undefined;
      if (Array.isArray(proProfiles)) {
        metadata = proProfiles[0]?.onboarding_metadata;
      } else if (proProfiles && typeof proProfiles === 'object') {
        metadata = (proProfiles as { onboarding_metadata?: any }).onboarding_metadata;
      }
      if (metadata?.step1_completed) {
        setStep1Completed(true);
      }
    }
    fetchOnboardingMetadata();
  }, [session?.user?.id]);

  // Validation rules
  const nameRegex = /^[A-Za-zÀ-ÿ'\- ]{2,}$/;
  const phoneRegex = /^[0-9]{7,15}$/;

  const validate = () => {
    if (!firstName.trim()) return 'First name is required.';
    if (!nameRegex.test(firstName)) return 'First name must be at least 2 letters.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!nameRegex.test(lastName)) return 'Last name must be at least 2 letters.';
    if (!countryCode) return 'Country code is required.';
    if (!phone.trim()) return 'Phone number is required.';
    if (!phoneRegex.test(phone)) return 'Phone number must be 7-15 digits.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, countryCode: true, phone: true });
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Prevent duplicate POST if already completed
    if (step1Completed) {
      onNext({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        countryCode,
        phone: phone.trim(),
      });
      return;
    }

    setError(null);
    setSubmitting(true);
    
    try {
      // Debug logging
      console.log('Step 1 - Session user ID:', session?.user?.id);
      console.log('Step 1 - Form data:', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: `${countryCode} ${phone.trim()}`
      });

      // POST to AQUORIX backend API
      const response = await fetch('/api/onboarding/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabase_user_id: session.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          email
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Step 1 API error:', errorText);
        throw new Error(errorText || 'Failed to save profile data.');
      }

      // Navigate to next step
      onNext({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        countryCode,
        phone: phone.trim(),
      });
      
    } catch (err: any) {
      console.error('Step 1 submission error:', err);
      setError('Failed to save profile data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-illustration">
          <img alt="AQUORIX Logo" className="auth-logo" src="/aqx-ctd-logo.svg" />
        </div>
        <div className="auth-form">
          <div className="auth-header">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  Step 1 of 4 – Identity
  <span
    className="Step1Identity_tooltip"
    tabIndex={0}
    aria-label="Enter your legal first and last name. Email is pre-filled from your account."
    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
  >
    <img
      src="/ob-identity-torso-60.svg"
      alt="Identity icon"
      width={42}
      height={42}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      aria-hidden="true"
      tabIndex={-1}
    />
  </span>
</h1>
            <p>Welcome to the AQUORIX Pro Dashboard</p>
          </div>
          <form className="auth-form-container" onSubmit={handleSubmit} autoComplete="off" aria-labelledby="step1-identity-header">
            <div className="form-group">
              <input
                placeholder="First Name"
                id="firstName"
                className="Step1Identity_input"
                aria-required="true"
                aria-invalid={!!error && touched.firstName && !firstName.trim()}
                autoComplete="off"
                type="text"
                value={firstName}
                name="firstName"
                onChange={e => setFirstName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, firstName: true }))}
                autoFocus
              />
            </div>
            <div className="form-group">
              <input
                placeholder="Last Name"
                id="lastName"
                className="Step1Identity_input"
                aria-required="true"
                aria-invalid={!!error && touched.lastName && !lastName.trim()}
                autoComplete="off"
                type="text"
                value={lastName}
                name="lastName"
                onChange={e => setLastName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, lastName: true }))}
              />
            </div>
            <div className="form-group">
              <input
                placeholder="Email"
                id="email"
                className="Step1Identity_input"
                readOnly
                tabIndex={-1}
                aria-readonly="true"
                autoComplete="off"
                type="email"
                value={email}
                name="email"
              />
            </div>
            <div className="form-group" style={{ display: 'flex', gap: 8, flexDirection: 'row', alignItems: 'flex-end' }}>
              <div style={{ flex: '0 0 100px', display: 'flex', flexDirection: 'column' }}>
                <select
                  id="countryCode"
                  name="countryCode"
                  className="auth-select-tall"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  aria-label="Country Code"
                >
                  <option value="+1">+1</option>
                  <option value="+33">+33</option>
                  <option value="+44">+44</option>
                  <option value="+49">+49</option>
                  <option value="+61">+61</option>
                  <option value="+65">+65</option>
                  <option value="+81">+81</option>
                  <option value="+91">+91</option>
                  <option value="+353">+353</option>
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input
                  placeholder="Phone Number"
                  id="phone"
                  className="Step1Identity_input"
                  aria-required="true"
                  aria-invalid={!!error && touched.phone && !phone.trim()}
                  autoComplete="off"
                  type="tel"
                  value={phone}
                  name="phone"
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                />
              </div>
            </div>
            {error && <ErrorBanner message={error} />}
            <button
              type="submit"
              className="auth-button"
              disabled={submitting || !!validate()}
              aria-disabled={submitting || !!validate()}
            >
              {submitting ? 'Saving...' : 'Next →'}
            </button>
            
          </form>
          <div style={{ textAlign: 'center', fontSize: 14, color: '#7b8ca6', marginTop: 18 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#2574d9', textDecoration: 'none', fontWeight: 500 }}>
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};