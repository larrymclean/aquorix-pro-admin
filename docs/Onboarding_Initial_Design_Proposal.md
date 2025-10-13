# AQUORIX Pro Admin Onboarding Flow  
**Initial Technical Design Proposal**  
**Date:** 2025-07-13  
**Status:** Draft for Team Review

---

## 1. Overview

This document outlines the current and proposed technical architecture for the AQUORIX Pro Admin onboarding flow, including authentication, onboarding scaffolding, route guards, Supabase integration, and anticipated user experience. It serves as a baseline for further business requirements, functional specifications, and QA documentation.

---

## 2. Technology Stack

- **Frontend:** React (TypeScript), modular component architecture
- **Backend/DB:** Supabase (Postgres, Auth, RLS, Functions)
- **State Management:** React Context (planned), Supabase client
- **Styling/Theming:** AQUORIX theme tokens (Dive Locker, Bamboo Safari), CSS modules
- **Routing:** React Router (assumed)
- **Authentication:** Supabase Auth (email/password, social logins planned)
- **RBAC:** Enforced via Supabase RLS and in-app logic

---

## 3. Current Implementation & Scaffolding

### a. Authentication & Entry

- **Sign In:**  
  - Users authenticate via Supabase Auth (email/password).
  - On successful login, user session is established and persisted.
  - New users are directed to onboarding; returning users are routed based on onboarding status.
- **Tested Path:**  
  - New user (`test@injdepthscuba.com`) signs up, lands on `/onboarding`.

### b. Onboarding Route & Scaffold

- **Route:** `/onboarding`
- **Entry File:** `src/pages/Onboarding.tsx`
  - Renders the `OnboardingWizard` component.
- **Wizard Container:** `src/pages/OnboardingWizard.tsx`
  - Currently a placeholder; modular, multi-step onboarding flow to be implemented.

### c. Route Guard Logic

- **Purpose:**  
  - Prevent access to dashboard or other protected routes until onboarding is complete.
  - Redirect users based on onboarding status and RBAC.
- **Implementation (Planned/Stubbed):**
  - If `user_profile.has_onboarded` is `false`, force redirect to `/onboarding`.
  - If onboarding is complete, allow access to `/dashboard` and other features.

### d. Dashboard Access

- **Route:** `/dashboard`
- **Guard:** Only accessible after onboarding is marked complete in Supabase.

---

## 4. Integration Points

### a. Supabase

- **User Profile Table:**  
  - Stores onboarding status, role, tier, and profile metadata.
- **RBAC:**  
  - Enforced via Supabase RLS and mirrored in frontend logic.
- **Onboarding Completion:**  
  - Onboarding wizard will update `has_onboarded` flag and other profile fields.

### b. Theming

- **Theme Applied:**  
  - Dive Locker (pro users) or Bamboo Safari (affiliates) applied based on user tier at onboarding.
- **CSS Classes:**  
  - `.aqx-pro-dashboard-theme` or `.aqx-affiliate-dashboard-theme` set at root.

---

## 5. User Experience (UX) & Flow

### a. Entry Scenarios

- **New User:**  
  - Signs up → Authenticated → Redirected to `/onboarding` → Completes onboarding → Redirected to `/dashboard`.
- **Returning User (incomplete onboarding):**  
  - Logs in → Redirected to `/onboarding` (cannot access dashboard).
- **Returning User (complete onboarding):**  
  - Logs in → Redirected to `/dashboard`.

### b. Onboarding Steps (Planned)

- **Step 1:** Role & Tier Selection (RBAC-compliant)
- **Step 2:** Profile Information
- **Step 3:** Preferences & Settings
- **Step 4:** Confirmation & Finish

### c. Validation & Error Handling

- All steps will include validation and clear error messages.
- Incomplete onboarding prevents access to main app features.

---

## 6. Next Steps & Recommendations

1. **Design Onboarding Steps:**  
   - Define required fields, steps, and business logic.
2. **Implement OnboardingWizard:**  
   - Modular, stepwise React components.
   - Integrate with Supabase for data persistence.
3. **Enhance Route Guards:**  
   - Ensure robust protection and seamless redirects.
4. **Test Additional Entry Points:**  
   - Social login, invite flows, returning users, edge cases.
5. **Documentation:**  
   - Use this document as a base for business requirements and functional specs.

---

## 7. Appendix: Current Scaffold Map

| File                                   | Purpose                                   | Status         |
|-----------------------------------------|-------------------------------------------|---------------|
| src/pages/Onboarding.tsx                | Onboarding route entry, renders wizard    | Scaffolded    |
| src/pages/OnboardingWizard.tsx          | Main wizard container (steps TBD)         | Placeholder   |
| Supabase Auth (backend)                 | Authentication & session management       | Live/Tested   |
| Route guard logic (frontend, planned)   | Access control based on onboarding status | Stubbed       |
| Theming (CSS classes, tokens)           | Visual consistency per user tier          | Available     |

---

## 8. Team Input & Open Questions

To ensure the onboarding flow and supporting documentation meet all business and technical needs, please provide feedback on the following:

### Business Requirements
- What are the required data fields for each onboarding step (e.g., profile, preferences, compliance)?
- Are there any conditional flows (e.g., different steps for pro users vs. affiliates)?
- What are the success criteria for onboarding completion?
- Should onboarding be skippable for any user types, or is it mandatory for all?

### Functional Specifications
- Which external integrations (if any) need to be included during onboarding (e.g., CRM, analytics, notifications)?
- What error states or edge cases should be explicitly handled (e.g., session timeout, duplicate users)?
- Are there any accessibility or localization requirements for onboarding?

### Technical/Architectural
- Should onboarding state be tracked only in Supabase, or also in local/session storage for resilience?
- Are there any anticipated scaling or performance concerns with the onboarding flow?
- What is the preferred approach for theme switching and persistence across onboarding and dashboard?

### QA & Testing
- What are the critical user journeys/scenarios to cover in manual and automated tests?
- Are there any compliance or audit requirements for onboarding data capture?

### General
- Are there any planned future onboarding entry points (e.g., SSO, invitations, mobile)?
- Any other business rules or constraints the engineering team should be aware of?

---

**Prepared by:**  
Cascade AI (AQUORIX Engineering Assistant)  
2025-07-13

---

## 9. Grok Technical Team – Key Questions for Windsurf Development Team

The following questions have been raised by the Grok Technical Team to guide further refinement of the onboarding flow and ensure all business, functional, technical, and compliance needs are met. User and technical team responses, recommendations, and remaining open questions are included below.

### Business Requirements
- **What are the key business objectives for the onboarding flow (e.g., user retention, compliance, data collection for analytics)?**
  - The primary objective is to get users efficiently into the system with a smooth flow. Users must be assigned to the correct roles and tiers for the appropriate experience and dashboard. Consumers do not have a dashboard. RBAC compliance and user segmentation are supported. No upsell or pricing complexity in V1.
- **Are there specific KPIs or success metrics for onboarding completion rates or time-to-dashboard?**
  - TBD. *Recommendation: Track % onboarding completion, average time-to-dashboard, and drop-off at each step.*
- **How should onboarding align with tier-specific pricing or features (e.g., upsell prompts during onboarding)?**
  - Not applicable for V1. The focus is on efficient entry and correct placement, not upsell. No complexity added here.

### Functional Specifications
- **What are the detailed steps and fields for the onboarding wizard (e.g., mandatory vs. optional, validation rules)?**
  - See Backend Infrastructure & Authorization Flow – Architecture Specification. All users enter the same flow; role/tier is determined during onboarding. *Steps: Identity → Role/Tier → Profile/Business → Preferences → Confirmation.*
- **Are there conditional flows based on user tier or role (e.g., different steps for admins vs. pro users)?**
  - All users enter through the same system. Flow branching is handled by role/tier assignment logic during onboarding.
- **What external integrations are required during onboarding (e.g., email verification, payment setup, third-party APIs)?**
  - Only email verification at the end of onboarding in V1. No payment or third-party APIs at this stage.
- **How should error states be handled in the UX (e.g., user-friendly messages, retry options, logging)?**
  - Errors and system state changes are tracked on the System Health page and logged to Consul for debugging. *Recommendation: Ensure user-facing error messages are actionable and non-technical; track error events for analytics.*

### Technical/Architectural
- **What is the expected handling of partial onboarding (e.g., save progress, resume from last step)?**
  - *Open: Not explicitly answered.*
  - Recommendation: Save progress after each step (Supabase row update or localStorage fallback). Allow users to resume from the last completed step.
- **How will onboarding state be synchronized between frontend and Supabase (e.g., real-time updates, conflict resolution)?**
  - *Open: Not explicitly answered.*
  - Recommendation: Use Supabase as the source of truth. On login, fetch onboarding state from Supabase and hydrate frontend state. Resolve conflicts by always preferring server state unless user is offline.
- **Are there plans for internationalization (i18n) or localization in onboarding (e.g., multi-language support)?**
  - *Open: Not explicitly answered.*
  - Recommendation: Not planned for V1, but design step components to allow for future translation.
- **What security measures are needed beyond RLS (e.g., CAPTCHA, rate limiting on sign-up)?**
  - *Open: Not explicitly answered.*
  - Recommendation: Add CAPTCHA or rate limiting to sign-up if bot risk increases. Use HTTPS everywhere; review Supabase API key exposure.

### QA & Testing
- **What edge cases should be prioritized in testing (e.g., network failures during onboarding, invalid inputs, browser compatibility)?**
  - Network failures will not be tested in V1; planned for V2. *Recommendation: Still test for invalid input, browser compatibility, and session expiry in V1.*
- **Are there automated testing requirements for the onboarding flow (e.g., unit tests for wizard steps, E2E for routes)?**
  - No automated tests in V1. *Recommendation: Add unit tests for critical onboarding logic as soon as possible.*
- **How will onboarding be tested across devices and tiers (e.g., mobile vs. desktop, admin vs. affiliate)?**
  - Manual testing on all major browsers and devices is planned.

### General
- **What dependencies or blockers exist from other features (e.g., theming finalization, Supabase schema updates)?**
  - Unknown at this time.
- **Are there any regulatory or compliance requirements for onboarding data (e.g., GDPR consent, data retention)?**
  - No compliance requirements in V1.
- **What is the timeline for implementing the onboarding wizard and integrating with route guards?**
  - ASAP.

---

**Outstanding Questions for Team & Current Answers:**
- Should onboarding progress be saved after each step for partial completion/resume? **YES**
- Is real-time sync between frontend and Supabase required, or is fetch-on-login sufficient? **TBD – Team input needed**
- Is internationalization (i18n) a goal for V1, or should we structure for future translation? **No localization or internationalization in V1**
- Do we need additional security (CAPTCHA, rate limiting) for onboarding/signup? **YES**
- Are there any blockers or dependencies not yet identified? **TBD – Team input needed**
