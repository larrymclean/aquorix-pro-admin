/*
  File: Step3ProfileSetup.tsx
  Path: src/components/onboarding/Step3ProfileSetup.tsx
  Description: AQUORIX onboarding Step 3 – Business Details (UI-only).
               Collects ONLY (required): business_name + country
               Optional: logo upload + short description (non-blocking)
               Then passes payload to OnboardingWizard via onNext(). NO business DB writes from client.
  Author: AQUORIX Engineering (Larry McLean + ChatGPT Lead)
  Created: 2025-09-05
  version: 1.2.4

  Last Updated: 2026-01-04
  Status: Phase B+ — Backend-authoritative onboarding (Wizard = single writer)
  Dependencies: React, Supabase (Storage only)

  Notes:
    - IMPORTANT: Do NOT write to diveoperators / affiliations / affiliates from client.
    - Storage upload is allowed (file hosting only). Backend persists logo_url where appropriate.
    - Tier 5 requirement: Step 3 required fields are ONLY business_name + country.
    - No localization work in MVP; no language inputs required.

  Change Log:
    - 2025-09-05..2025-09-16 (Cascade): Original pixel-accurate Step 3 + Supabase DB writes (legacy).
    - 2025-12-28 (Larry + ChatGPT Lead): Refactor to UI-only + optional Storage upload; pass payload to Wizard; remove all Supabase DB writes.
    - 2026-01-04 - v1.2.4 - Simplified required inputs to business_name + country only (Tier 5 MVP). Optional logo + description retained.
*/

import React, { useMemo, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Step3ProfileSetupProps {
  tier: string;
  onNext: (data: any) => void;
  onBack: () => void;
  identity: {
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  userEmail: string;
  passwordSet: boolean;
  session: any;
}

const LOGO_BUCKET = 'logos'; // must exist in Supabase Storage

const Step3ProfileSetup: React.FC<Step3ProfileSetupProps> = ({
  tier,
  onNext,
  onBack,
  identity,
  userEmail,
  passwordSet,
  session,
}) => {
  // Required
  const [brandName, setBrandName] = useState('');
  const [country, setCountry] = useState('');

  // Optional
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => setTouched((p) => ({ ...p, [k]: true }));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNonTrivial = (v: any, min = 2) => typeof v === 'string' && v.trim().length >= min;

  const isValid = useMemo(() => {
    return isNonTrivial(brandName, 2) && isNonTrivial(country, 2);
  }, [brandName, country]);

  const canSubmit = isValid && !isSubmitting;

  const showBrandError = touched.brandName && !isNonTrivial(brandName, 2);
  const showCountryError = touched.country && !isNonTrivial(country, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      setError('Accepted formats: PNG, JPEG, SVG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Max file size is 2MB.');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadLogoToStorage = async (file: File): Promise<string> => {
    const supabaseUserId: string | undefined = session?.user?.id;
    if (!supabaseUserId) throw new Error('NO_SUPABASE_SESSION');

    const fileExt = file.name.split('.').pop() || 'png';
    const safeBrand = (brandName || 'business')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\-_\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40);

    // Tier-neutral storage path
    const objectPath = `profiles/${supabaseUserId}/${safeBrand}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(objectPath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(objectPath);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) throw new Error('NO_PUBLIC_URL');

    return publicUrl;
  };

  const markAllRequiredTouched = () => {
    setTouched((p) => ({ ...p, brandName: true, country: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      markAllRequiredTouched();
      setError('Please complete required fields before continuing.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      let logo_url: string | null = null;

      if (logoFile) {
        try {
          logo_url = await uploadLogoToStorage(logoFile);
        } catch (logoErr) {
          console.error('[Step3] Logo upload failed:', logoErr);
          logo_url = null;
          setError('Saved, but logo upload failed. You can upload later.');
        }
      }

      // IMPORTANT:
      // - operator_name is used as the canonical business display name in backend step3 for all tiers.
      // - country is sent as top-level "country" for Tier 5 simplicity.
      // - For compatibility, we also include contact_info.address.country (backend accepts either).
      const payload = {
        operator_name: brandName.trim(),
        country: country.trim(),
        logo_url,
        website: website.trim() || null,
        description: description.trim() || null,
        contact_info: {
          address: {
            country: country.trim(),
          },
        },
        tier,
      };

      onNext(payload);
    } catch (err) {
      console.error('[Step3] submit error:', err);
      setError('Failed to continue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          minHeight: 520,
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 2px 16px #0001',
          marginTop: 40,
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
            justifyContent: 'center',
            paddingTop: 32,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 28,
              color: '#2574d9',
              marginBottom: 8,
              letterSpacing: 0.5,
              textAlign: 'center',
            }}
          >
            Step 3: Business Details
          </div>

          <div style={{ color: '#222', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
            Required: Business Name and Country. Optional: Logo and Description.
          </div>

          <form className="onboarding-form" onSubmit={handleSubmit}>
            {/* Business Name (REQUIRED) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onBlur={() => touch('brandName')}
                placeholder="Business / Display Name"
                style={{
                  width: '100%',
                  fontSize: 18,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: showBrandError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                  marginBottom: 6,
                }}
                required
                aria-required="true"
              />
              {showBrandError && <div className="fieldError">Business name is required.</div>}
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                This is your public display name. For affiliates, this is the business name.
              </div>
            </div>

            {/* Country (REQUIRED) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onBlur={() => touch('country')}
                style={{
                  width: '100%',
                  fontSize: 17,
                  height: 46,
                  padding: '0 14px',
                  borderRadius: 6,
                  border: showCountryError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                  marginBottom: 6,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  lineHeight: 'normal',
                }}
                aria-required="true"
                required
              >
                <option value="">Select country</option>
                <option value="AU">Australia</option>
                <option value="BR">Brazil</option>
                <option value="CA">Canada</option>
                <option value="CR">Costa Rica</option>
                <option value="DE">Germany</option>
                <option value="EG">Egypt</option>
                <option value="FJ">Fiji</option>
                <option value="FR">France</option>
                <option value="ID">Indonesia</option>
                <option value="IT">Italy</option>
                <option value="JP">Japan</option>
                <option value="JO">Jordan</option>
                <option value="MY">Malaysia</option>
                <option value="MV">Maldives</option>
                <option value="MX">Mexico</option>
                <option value="PH">Philippines</option>
                <option value="SA">Saudi Arabia</option>
                <option value="ZA">South Africa</option>
                <option value="ES">Spain</option>
                <option value="TH">Thailand</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
              </select>
              {showCountryError && <div className="fieldError">Country is required.</div>}
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                Used for routing, defaults, and future affiliate verification workflows.
              </div>
            </div>

            {/* Description (optional) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description (optional)"
                style={{
                  width: '100%',
                  fontSize: 16,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: '1px solid #c3d0e8',
                  minHeight: 64,
                  marginBottom: 6,
                  resize: 'vertical',
                }}
                maxLength={500}
              />
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                Optional for now. This can populate the affiliate profile later (max 500 chars).
              </div>
            </div>

            {/* Website (optional) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website (optional)"
                style={{
                  width: '100%',
                  fontSize: 17,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: '1px solid #c3d0e8',
                  marginBottom: 6,
                }}
              />
            </div>

            {/* Logo Upload (optional) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#2574d9', marginBottom: 6 }}>
                Upload Your Logo <span style={{ color: '#888', fontWeight: 400 }}>(Optional)</span>
              </div>

              {logoPreview && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 16 }}>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{
                      maxWidth: 200,
                      maxHeight: 120,
                      width: 'auto',
                      height: 'auto',
                      borderRadius: 8,
                      border: '1px solid #c3d0e8',
                      background: '#f6fafd',
                      display: 'block',
                      padding: 0,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    style={{
                      background: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '7px 18px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Remove Logo
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  style={{
                    background: '#f1f5fa',
                    color: '#2574d9',
                    border: '1px solid #c3d0e8',
                    borderRadius: 6,
                    padding: '10px 18px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    marginRight: 12,
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </button>
                <span
                  style={{
                    fontSize: 15,
                    color: '#223',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {logoFile ? logoFile.name : 'No file chosen'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>

              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 4 }}>
                Accepted formats: PNG, JPEG, or SVG. Max size: 2MB.
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ color: '#e74c3c', marginBottom: 12 }}>
                {error}
              </div>
            )}

            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: '#f1f5fa',
                  color: '#2574d9',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 22px',
                  fontWeight: 600,
                  fontSize: 17,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                style={{
                  background: !canSubmit ? '#94a3b8' : '#2574d9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 22px',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: !canSubmit ? 'not-allowed' : 'pointer',
                  marginLeft: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Onboarding Status Card */}
      <div
        style={{
          background: '#f5f9ff',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 4px rgba(40,125,225,0.08)',
          padding: '1.25rem 1.5rem',
          margin: '32px auto 0',
          width: '100%',
          maxWidth: 440,
          fontSize: '1rem',
          color: '#001c34',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 3 of 4</div>
        <div style={{ marginBottom: 6 }}>
          First Name: <span style={{ fontWeight: 500 }}>{identity?.firstName || ''}</span>
        </div>
        <div style={{ marginBottom: 6 }}>
          Last Name: <span style={{ fontWeight: 500 }}>{identity?.lastName || ''}</span>
        </div>
        <div style={{ marginBottom: 6 }}>
          Email: <span style={{ fontWeight: 500 }}>{userEmail}</span>
        </div>
        <div style={{ marginBottom: 6 }}>
          Password Set: <span style={{ fontWeight: 500 }}>{passwordSet ? 'Yes' : 'No'}</span>
        </div>
        <div>
          Supabase Email Confirmed:{' '}
          <span style={{ fontWeight: 500 }}>{session?.user?.email_confirmed_at ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .fieldError {
          color: #e74c3c;
          font-size: 13px;
          font-weight: 600;
          margin: 2px 0 6px 0;
        }
      `}</style>
    </>
  );
};

export default Step3ProfileSetup;