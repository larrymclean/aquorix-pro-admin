# AQUORIX Pro Admin Onboarding Flow – Kickoff Summary

**Purpose:**  
Guide new users (Tiers 1–5) through a secure, theme-aware, multi-step onboarding process, ensuring correct role/tier assignment and complete profile data before dashboard access.

---

## 1. Onboarding Flow Overview

| Step | Name                | Key Fields/Actions                                      | Notes                                  |
|------|---------------------|--------------------------------------------------------|----------------------------------------|
| 1    | Identity            | Full Name (required), Email (readonly), Phone (opt.)   | Email pre-filled from Supabase session |
| 2    | Role & Tier         | Role (dropdown), Tier (auto or dropdown), Theme select | Theme selector (optional, with preview)|
| 3    | Profile Info        | Org Name, Website (opt.), Location, Dive Region (opt.) | Fields adjust by role/tier             |
| 4    | Confirmation        | Summary, Terms & Conditions (checkbox), Submit         | Final review, triggers onboarding flag |

- **Progress is saved after each step** (Supabase primary, sessionStorage fallback).
- **Onboarding is mandatory** for all users; no skipping.
- **Upon completion:** `has_onboarded = true` in `user_profile`, user is redirected to their tier dashboard.

---

## 2. Core UI Components

| Component           | Responsibility                                       | File Location (planned)            |
|---------------------|------------------------------------------------------|------------------------------------|
| Onboarding.tsx      | Entry wrapper, handles route guard & theming         | `src/pages/Onboarding.tsx`         |
| OnboardingWizard.tsx| Step logic container, manages state/progress         | `src/pages/OnboardingWizard.tsx`   |
| StepHeader.tsx      | Step title, progress indicator                       | `src/components/StepHeader.tsx`    |
| Step1Identity.tsx   | Identity form fields                                 | `src/components/onboarding/Step1Identity.tsx` |
| Step2RoleTier.tsx   | Role, tier, and theme selection                      | `src/components/onboarding/Step2RoleTier.tsx` |
| Step3ProfileInfo.tsx| Profile/organization info                            | `src/components/onboarding/Step3ProfileInfo.tsx` |
| Step4Confirm.tsx    | Review, terms, submit                                | `src/components/onboarding/Step4Confirm.tsx` |
| ThemeSelector.tsx   | Optional theme picker with thumbnails                | `src/components/onboarding/ThemeSelector.tsx` |
| ErrorBanner.tsx     | Inline error display                                 | `src/components/common/ErrorBanner.tsx`       |

---

## 3. Theming & State Management

- **Theme class** (`.aqx-pro-dashboard-theme` or `.aqx-affiliate-dashboard-theme`) is applied at the root based on tier or user selection.
- **Theme selection** is optional; defaults by tier if not chosen.
- **State** is managed in React (Context or local state) and persisted to Supabase after each step.

---

## 4. Edge Cases & Technical Constraints

- **Resume onboarding** from any device (state fetched on login).
- **If Supabase/local storage unavailable:** Show error, prompt reload.
- **Accessibility:** WCAG 2.1 AA, Lighthouse-audited, ARIA labels, keyboard nav.
- **No CAPTCHA in V1**; rate limiting and audit logging via Supabase.
- **Welcome email** sent on completion; dashboard tour in V2.

---

## 5. Next Steps

- Circulate this summary for immediate feedback.
- Begin wireframe mockups for each onboarding step and the theme selector.
- Outline initial base styles using AQUORIX theme tokens and CSS modules.
