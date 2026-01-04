/*
  File: Step3ProfileSetup.tsx
  Path: src/components/onboarding/Step3ProfileSetup.tsx
  Description: AQUORIX onboarding Step 3 – Business & Professional Details (UI-only).
               Collects operator/business details, optionally uploads a logo to Supabase Storage (dumb file store),
               then passes a payload to OnboardingWizard via onNext(). NO business DB writes from client.
  Author: AQUORIX Engineering (Larry McLean + ChatGPT Lead)
  Created: 2025-09-05
  version: 1.2.x

  Last Updated: 2026-01-03
  Status: Phase B+ — Backend-authoritative onboarding (Wizard = single writer)
  Dependencies: React, Supabase (Storage only)
  Notes:
    - IMPORTANT: Do NOT write to diveoperators / affiliations from client.
    - Storage upload is allowed (file hosting only). The logo_url is persisted by backend /api/onboarding/step3.
    - Branding requirement satisfied: if no upload, logo_url remains null and dashboard shows default logo.
  Change Log:
    - 2025-09-05..2025-09-16 (Cascade): Original pixel-accurate Step 3 + Supabase DB writes (legacy).
    - 2025-12-28 (Larry + ChatGPT Lead): Refactor to UI-only + optional Storage upload; pass payload to Wizard; remove all Supabase DB writes.
    - 2026-01-03 - v1.2.x - Added jordan country code to dropdown step 3. - aria-label="Business Phone Country Code"
    - 2026-01-03 - Enforce required business address fields + touched-only inline errors + disable submit until valid
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

type BusinessAddress = {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

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
  const [brandName, setBrandName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessCountryCode, setBusinessCountryCode] = useState('+1');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [businessAddress, setBusinessAddress] = useState<BusinessAddress>({
    street: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ touched-only inline validation (no noisy UX)
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => setTouched((p) => ({ ...p, [k]: true }));

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validation helpers (deterministic)
   */
  const isNonTrivial = (v: any, min = 2) => typeof v === 'string' && v.trim().length >= min;

  const isAddressValid = useMemo(() => {
    return (
      isNonTrivial(businessAddress.street, 4) &&
      isNonTrivial(businessAddress.city, 2) &&
      isNonTrivial(businessAddress.region, 2) &&
      isNonTrivial(businessAddress.country, 2)
    );
  }, [businessAddress.street, businessAddress.city, businessAddress.region, businessAddress.country]);

  const isBusinessValid = useMemo(() => {
    return isNonTrivial(brandName, 2) && isAddressValid;
  }, [brandName, isAddressValid]);

  const canSubmit = isBusinessValid && !isSubmitting;

  const showBrandError = touched.brandName && !isNonTrivial(brandName, 2);
  const showStreetError = touched.street && !isNonTrivial(businessAddress.street, 4);
  const showCityError = touched.city && !isNonTrivial(businessAddress.city, 2);
  const showRegionError = touched.region && !isNonTrivial(businessAddress.region, 2);
  const showCountryError = touched.country && !isNonTrivial(businessAddress.country, 2);

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandName(e.target.value);
  };

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

  /**
   * Upload logo to Supabase Storage (dumb file store).
   * Returns a public URL or null.
   *
   * IMPORTANT:
   * - This function does NOT write to business DB.
   * - Backend will persist logo_url into aquorix.diveoperators.logo_url.
   */
  const uploadLogoToStorage = async (file: File): Promise<string> => {
    const supabaseUserId: string | undefined = session?.user?.id;
    if (!supabaseUserId) {
      throw new Error('NO_SUPABASE_SESSION');
    }

    const fileExt = file.name.split('.').pop() || 'png';
    // Use a deterministic, user-scoped path to avoid collisions
    const safeBrand = (brandName || 'operator')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\-_\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40);

    const objectPath = `operators/${supabaseUserId}/${safeBrand}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(objectPath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(objectPath);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      throw new Error('NO_PUBLIC_URL');
    }

    return publicUrl;
  };

  const buildContactInfo = () => {
    const phoneValue = businessPhone ? `${businessCountryCode} ${businessPhone}` : null;

    return {
      phone: phoneValue,
      address: {
        street: businessAddress.street.trim() || null,
        city: businessAddress.city.trim() || null,
        region: businessAddress.region.trim() || null,
        postalCode: businessAddress.postalCode.trim() || null,
        country: businessAddress.country || null,
      },
    };
  };

  const markAllRequiredTouched = () => {
    setTouched((p) => ({
      ...p,
      brandName: true,
      street: true,
      city: true,
      region: true,
      country: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gate: enforce required fields (and reveal inline errors)
    if (!isBusinessValid) {
      markAllRequiredTouched();
      setError('Please complete all required fields before continuing.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Optional: upload logo first so we can send logo_url to the wizard/backend.
      let logo_url: string | null = null;

      if (logoFile) {
        try {
          logo_url = await uploadLogoToStorage(logoFile);
        } catch (logoErr) {
          console.error('[Step3] Logo upload failed:', logoErr);
          // Non-blocking: brand requirement still met via default logo at dashboard.
          // We proceed without a logo_url.
          logo_url = null;
          setError('Business saved successfully, but logo upload failed. You can upload it later.');
        }
      }

      const payload = {
        // For backend step3:
        operator_name: brandName.trim(),
        logo_url, // may be null
        contact_info: buildContactInfo(),
        website: website.trim() || null,
        description: description.trim() || null,

        // Optional: UI/debug metadata (wizard can ignore)
        tier,
      };

      // UI-only component: hand off to wizard orchestrator.
      onNext(payload);
    } catch (err: any) {
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
          minHeight: 540,
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
            Step 3: Business &amp; Professional Details
          </div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
            Tell us about your dive operation. We'll customize your tools and dashboard accordingly.
          </div>

          <form className="onboarding-form" onSubmit={handleSubmit}>
            {/* Brand Name (REQUIRED) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <input
                type="text"
                value={brandName}
                onChange={handleBrandNameChange}
                onBlur={() => touch('brandName')}
                placeholder="Enter your brand name here"
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
              {showBrandError && <div className="fieldError">Brand name is required.</div>}
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                Enter your brand name. This can be your business DBA name or your name. As an independent Dive
                Leader, we help promote your name as your brand.
              </div>
            </div>

            {/* Business Phone (optional) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 8, flexDirection: 'row', alignItems: 'flex-end' }}>
                <div style={{ flex: '0 0 100px', display: 'flex', flexDirection: 'column' }}>
                  <select
                    id="businessCountryCode"
                    name="businessCountryCode"
                    value={businessCountryCode}
                    onChange={(e) => setBusinessCountryCode(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: 17,
                      height: 46,
                      padding: '0 8px',
                      borderRadius: 6,
                      border: '1px solid #c3d0e8',
                      marginBottom: 6,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      lineHeight: 'normal',
                    }}
                    aria-label="Business Phone Country Code"
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+65">+65</option>
                    <option value="+81">+81</option>
                    <option value="+91">+91</option>
                    <option value="+353">+353</option>
                    <option value="+49">+49</option>
                    <option value="+33">+33</option>
                    <option value="+962">+962</option>
                    <option value="+966">+966</option>
                    <option value="+971">+971</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <input
                    placeholder="Business phone"
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value.replace(/\D/g, ''))}
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
              </div>
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                Phone number for your business or operation.
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
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                Your business or personal website (optional).
              </div>
            </div>

            {/* Business Address (REQUIRED: street/city/region/country) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#2574d9', marginBottom: 8 }}>
                Business Address
              </div>

              <input
                type="text"
                value={businessAddress.street}
                onChange={(e) => setBusinessAddress({ ...businessAddress, street: e.target.value })}
                onBlur={() => touch('street')}
                placeholder="Street Address"
                style={{
                  width: '100%',
                  fontSize: 17,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: showStreetError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                  marginBottom: 6,
                }}
                aria-required="true"
              />
              {showStreetError && <div className="fieldError">Street address is required.</div>}

              <input
                type="text"
                value={businessAddress.city}
                onChange={(e) => setBusinessAddress({ ...businessAddress, city: e.target.value })}
                onBlur={() => touch('city')}
                placeholder="City"
                style={{
                  width: '100%',
                  fontSize: 17,
                  padding: '12px 14px',
                  borderRadius: 6,
                  border: showCityError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                  marginBottom: 6,
                  marginTop: 6,
                }}
                aria-required="true"
              />
              {showCityError && <div className="fieldError">City is required.</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={businessAddress.region}
                    onChange={(e) => setBusinessAddress({ ...businessAddress, region: e.target.value })}
                    onBlur={() => touch('region')}
                    placeholder="State / Region"
                    style={{
                      width: '100%',
                      fontSize: 17,
                      padding: '12px 14px',
                      borderRadius: 6,
                      border: showRegionError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                      marginBottom: 6,
                    }}
                    aria-required="true"
                  />
                  {showRegionError && <div className="fieldError">State / region is required.</div>}
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={businessAddress.postalCode}
                    onChange={(e) => setBusinessAddress({ ...businessAddress, postalCode: e.target.value })}
                    placeholder="Postal Code (optional)"
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
              </div>

              <select
                value={businessAddress.country}
                onChange={(e) => setBusinessAddress({ ...businessAddress, country: e.target.value })}
                onBlur={() => touch('country')}
                style={{
                  width: '100%',
                  fontSize: 17,
                  height: 46,
                  padding: '0 14px',
                  borderRadius: 6,
                  border: showCountryError ? '1px solid #e74c3c' : '1px solid #c3d0e8',
                  marginBottom: 6,
                  marginTop: 6,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  lineHeight: 'normal',
                }}
                aria-required="true"
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
                Primary business location or headquarters
              </div>
            </div>

            {/* Description (optional) */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your business or services"
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
                maxLength={400}
              />
              <div style={{ color: '#7b8ca6', fontSize: 13, marginTop: 2 }}>
                Describe your business, specialties, or services (max 400 chars).
              </div>
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
                      marginLeft: 8,
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
                Accepted formats: PNG, JPEG, or SVG. Max size: 2MB. Square or landscape preferred. 200x200 px
                (recommended).
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
                className="primary-submit"
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

      {/* Onboarding Status Card (Step Summary) */}
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
          Phone: <span style={{ fontWeight: 500 }}>{identity?.phone || ''}</span>
        </div>
        <div style={{ marginBottom: 6 }}>
          Password Set: <span style={{ fontWeight: 500 }}>{passwordSet ? 'Yes' : 'No'}</span>
        </div>
        <div>
          Supabase Email Confirmed:{' '}
          <span style={{ fontWeight: 500 }}>{session?.user?.email_confirmed_at ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {/* Session Debug Card (Dev Only) */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 4px #197de115',
          padding: '1rem 1.5rem',
          margin: '24px auto 0',
          width: '100%',
          maxWidth: 540,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#197de1' }}>Session Info (dev only):</div>
        <pre
          style={{
            fontSize: 13,
            color: '#223',
            background: '#f7fafd',
            borderRadius: 8,
            padding: 12,
            overflowX: 'auto',
            margin: 0,
          }}
        >
          {JSON.stringify(session, null, 2)}
        </pre>
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