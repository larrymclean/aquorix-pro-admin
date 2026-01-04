/*
File: Step1Identity.tsx
Path: src/components/onboarding/Step1Identity.tsx
Description: AQUORIX onboarding Step 1 – Identity (UI-only).
               Collects identity fields and passes them to OnboardingWizard via onNext().
               NO backend writes from this component.
Author: Cascade AI Team (ChatGPT, Claude AI, Windsurf, Grok)
Version: v?
Created: 2025-07-13
Last Updated: 2025-12-28

Status: Phase B+ — Backend-authoritative onboarding (Wizard = single writer)
Dependencies: Needs update

Change Log:
- 2025-07-13 (Cascade): Initial scaffold with header, form, validation, and error handling.
- 2025-07-13 (Cascade): Updated to make phone number required (product rule).
- 2025-07-17 (Cascade): Refactored to MVP card layout, AQUORIX classes, and unified style. Removed CSS module.
- 2025-09-17 (Cascade): Added database persistence - upserts to pro_profiles table on form submission with identity data.
- 2025-12-28 - V? - Refactored to eleiminate Supabase call backs, aquorix database is king/prime driver
*/

import React, { useEffect, useMemo, useState } from 'react';

interface Step1IdentityProps {
  email: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialCountryCode?: string;
  initialPhone?: string;
  session: any;
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
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // keep fields in sync if wizard rehydrates values
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setCountryCode(initialCountryCode);
    setPhone(initialPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFirstName, initialLastName, initialCountryCode, initialPhone]);

  const normalizedPhoneDigits = useMemo(() => (phone || '').replace(/\D/g, ''), [phone]);

  const canContinue = useMemo(() => {
    return firstName.trim().length > 0 && lastName.trim().length > 0 && normalizedPhoneDigits.length >= 7;
  }, [firstName, lastName, normalizedPhoneDigits]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canContinue) {
      setError('Please enter first name, last name, and a valid phone number.');
      return;
    }

    onNext({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      countryCode: (countryCode || '+1').trim(),
      phone: normalizedPhoneDigits, // digits-only; wizard formats for DB
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: 980, marginTop: 40 }}>
      <div
        style={{
          display: 'flex',
          minHeight: 540,
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 2px 16px #0001',
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
            justifyContent: 'center',
          }}
        >
          <img src="/aqx-ctd-logo.svg" alt="AQUORIX Logo" style={{ width: 140, height: 140, marginBottom: 32 }} />
        </div>

        {/* Right Form Panel */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 32,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 28, color: '#2574d9', marginBottom: 8, textAlign: 'center' }}>
            Step 1: Identity
          </div>

          <div style={{ color: '#222', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
            Confirm your basic details so we can personalize your onboarding experience.
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email (read-only) */}
            <div style={{ marginBottom: 18 }}>
              <input
                type="text"
                value={email}
                readOnly
                style={{
                  width: '100%',
                  fontSize: 17,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: '1px solid #c3d0e8',
                  background: '#f7fafd',
                }}
              />
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 4 }}>Signed in as {email}</div>
            </div>

            {/* First Name */}
            <div style={{ marginBottom: 18 }}>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                style={{
                  width: '100%',
                  fontSize: 18,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: '1px solid #c3d0e8',
                }}
                required
              />
            </div>

            {/* Last Name */}
            <div style={{ marginBottom: 18 }}>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                style={{
                  width: '100%',
                  fontSize: 18,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: '1px solid #c3d0e8',
                }}
                required
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    width: 110,
                    fontSize: 17,
                    height: 46,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid #c3d0e8',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    lineHeight: 'normal',
                  }}
                  aria-label="Phone country code"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+91">+91</option>
                  <option value="+962">+962</option>
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                </select>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  style={{
                    flex: 1,
                    fontSize: 18,
                    padding: '12px 14px',
                    borderRadius: 6,
                    border: '1px solid #c3d0e8',
                  }}
                  required
                />
              </div>
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 4 }}>
                Digits only are fine — formatting is handled automatically.
              </div>
            </div>

            {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
              <button
                type="submit"
                disabled={!canContinue}
                style={{
                  background: !canContinue ? '#94a3b8' : '#2574d9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 22px',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: !canContinue ? 'not-allowed' : 'pointer',
                }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Session Debug Card (Dev Only) */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #197de115', padding: '1rem 1.5rem', margin: '24px auto 0', width: '100%', maxWidth: 980 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#197de1' }}>Session Info (dev only):</div>
        <pre style={{ fontSize: 13, color: '#223', background: '#f7fafd', borderRadius: 8, padding: 12, overflowX: 'auto', margin: 0 }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
};