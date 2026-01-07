/*
  File: Step4Confirm.tsx
  Path: src/components/onboarding/Step4Confirm.tsx
  Description: AQUORIX onboarding Step 4 – Final confirmation page. Two-panel layout, summary/feedback card, loader/redirect, and debug info.
  Author: Cascade AI (with Larry McLean)
  Created: 2025-09-06
  Version: 1.3.0
  
  Last Updated: 2026-01-04
  Status: Production-ready, patched for canonical profileData keys (operator_name / business_name)
  
  Change Log:
    - 2026-01-04 (Larry + AI Team):
      - Fix business name display: Step 3 stores operator_name/business_name, not brandName.
      - Add safe fallback mapping for business name.
      
    - 2025-09-06 (Cascade): Two-panel layout, summary/feedback card, loader/redirect, debug card, and QA review. Matches Steps 1–3 for onboarding consistency.
*/

import React from 'react';

interface Step4ConfirmProps {
  identity: {
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  userEmail: string;
  passwordSet: boolean;
  session: any;
  profileData: {
    // Step3ProfileSetup emits operator_name + logo_url (+ optional fields)
    operator_name?: string;
    business_name?: string;
    brandName?: string;

    logo_url?: string | null;

    [key: string]: any;
  } | null;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const Step4Confirm: React.FC<Step4ConfirmProps> = ({
  identity,
  userEmail,
  passwordSet,
  session,
  profileData,
  onBack,
  onSubmit,
  submitting,
}) => {
  const businessName =
    (profileData?.operator_name && String(profileData.operator_name).trim()) ||
    (profileData?.business_name && String(profileData.business_name).trim()) ||
    (profileData?.brandName && String(profileData.brandName).trim()) ||
    '';

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

        {/* Right Confirmation Panel */}
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
            Step 4: Confirm Your Details
          </div>

          <div style={{ color: '#222', fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
            Review your information below. Make any changes if needed, then complete setup to enter your dashboard.
          </div>

          <div
            style={{
              background: '#f5f9ff',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 4px rgba(40,125,225,0.08)',
              padding: '1.25rem 1.5rem',
              margin: '0 auto 24px',
              width: '100%',
              maxWidth: 440,
              fontSize: '1rem',
              color: '#001c34',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 4 of 4</div>
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
              Business Name: <span style={{ fontWeight: 500 }}>{businessName}</span>
            </div>
            <div style={{ marginBottom: 6 }}>
              Password Set: <span style={{ fontWeight: 500 }}>{passwordSet ? 'Yes' : 'No'}</span>
            </div>
            <div>
              Supabase Email Confirmed:{' '}
              <span style={{ fontWeight: 500 }}>
                {session?.user?.email_confirmed_at ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 32 }}>
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
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              style={{
                background: '#2574d9',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '12px 22px',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                marginLeft: 16,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Completing Setup…' : 'Complete Setup'}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback/Status Card (duplicated below, as in Steps 1-3) */}
      <div
        style={{
          background: '#f5f9ff',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 4px rgba(40,125,225,0.08)',
          padding: '1.25rem 1.5rem',
          margin: '32px auto 24px',
          width: '100%',
          maxWidth: 440,
          fontSize: '1rem',
          color: '#001c34',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Step 4 of 4</div>
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
          Business Name: <span style={{ fontWeight: 500 }}>{businessName}</span>
        </div>
        <div style={{ marginBottom: 6 }}>
          Password Set: <span style={{ fontWeight: 500 }}>{passwordSet ? 'Yes' : 'No'}</span>
        </div>
        <div>
          Supabase Email Confirmed:{' '}
          <span style={{ fontWeight: 500 }}>
            {session?.user?.email_confirmed_at ? 'Yes' : 'No'}
          </span>
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
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#197de1' }}>
          Session Info (dev only):
        </div>
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

      <div style={{ height: 40 }} />
    </>
  );
};

export default Step4Confirm;