# AQUORIX Dashboard Extension Strategy

**Version 1.0 — July 2025**  
**Prepared for:** AQUORIX Engineering & Design Teams

---

## 1. Lessons Learned: Problems & Issues from Last Dashboard Extension

### a. Supabase Authentication & User Profile Issues
- **User Role Fetching:**
  - Inconsistent retrieval of user roles from Supabase (`RequireAuth` sometimes failed to get correct role/profile).
  - Multiple sources (`user_metadata`, `user_profile` table, fallback to email) led to subtle bugs and inconsistent UX.
- **Async State Handling:**
  - Race conditions and unnecessary re-renders in auth guards, especially with null/stale user data.
- **Error Logging & Debugging:**
  - Initial lack of detailed error logging made root cause diagnosis difficult. Improved with verbose logs and user-facing errors.
- **Session Persistence:**
  - "Remember me" and session persistence were not always reliable across reloads or tabs.

### b. General Dashboard Extension Issues
- **Merge Conflicts:**
  - Complex conflicts during cherry-picks/merges, especially in shared components (`TopNav`, `SidebarNavigation`).
- **Theme Isolation:**
  - Early attempts did not fully isolate themes (CSS bleed, shared classes, hardcoded styles).
- **Component Coupling:**
  - Shared logic between dashboards was not modular enough, risking MVP stability.
- **Port Conflicts & Static Assets:**
  - Local dev blocked by port conflicts or missing static files (manifest, CSS).

---

## 2. Objective: Extension Across Two Distinct Dashboards

**Goal:**
Safely extend the AQUORIX MVP framework into two robust, distinctly themed dashboard portals:

- **Marina Portal (Pro Users, Tiers 1–4):**
  - "Marina Blue Grid" theme: clean, aquatic, professional, for instructors/dive centers/liveaboards.
- **Bamboo Safari Portal (Affiliate, Tier 5):**
  - "Bamboo Safari" theme: boutique, earthy, luxury, for affiliates.

**Requirements:**
- Each dashboard must have a distinct look, feel, and feature set, with isolated themes and layouts.
- Role-based routing/authentication must be bulletproof, with clear boundaries between admin, pro, and affiliate experiences.
- The MVP admin dashboard must remain stable and untouched by new feature churn.

---

## 3. Technical Landscape

### a. Current Stack
- **Frontend:** React 18+ (TypeScript), React Router DOM, CSS Modules
- **Auth/Data:** Supabase JS client (auth/user profile)
- **UI Components:** AQUORIX custom (`SidebarNavigation`, `TopNav`, `RequireAuth`)
- **Themes:** CSS variables, strict theme classes (`.aqx-pro-dashboard-theme`, `.aqx-affiliate-dashboard-theme`)
- **DevOps:** macOS local dev, npm workflow, Supabase env vars

### b. Lessons Learned / Best Practices
- **Atomic, Isolated Changes:** Small, self-contained commits; always checkpoint before risky changes.
- **Strict Theme Isolation:** Dedicated theme classes, modular CSS, avoid shared styles.
- **Robust Auth Guards:** Centralize/harden auth logic, clear error handling/logging.
- **Comprehensive Testing:** Manual QA on all role-based routes after major changes.

---

## 4. Updated Theme Documentation

### Marina Portal (Pro Users, Tiers 1–4)

**Marina Portal Pro User Design System**  
Version 1.0 — July 2025  
Prepared for: AQUORIX Pro Tier 1–4 Dashboard Engineering & Design Teams  
Audience: Professional designers and engineers implementing the "Marina Blue Grid" theme across the AQUORIX dashboard ecosystem

#### 🌊 Overview
Marina Portal is the newly adopted style for AQUORIX Pro Tier dashboards (Tiers 1–4). Designed for aquatic professionals including instructors, dive centers, and liveaboards, this theme builds on the clarity and confidence of oceanic palettes with calm professionalism and precise interface cues.

The goal is to provide a clean, modular, high-performance user experience adaptable for desktop and mobile environments, and built with enterprise-grade standards.

#### 🎨 Core Style Guide

```css
:root {
  --aqx-blue: #1b4d6f;
  --aqx-aqua: #00d4ff;
  --aqx-light-aqua: #74a8d4;
  --aqx-light-cobalt: #248dc1;
  --aqx-slate-gray: #4a5c6a;
  --aqx-pearl-white: #f5f6f5;
  --aqx-light-sky-blue: #d0edf6;

  --sidebar-bg: #248dc1;
  --topnav-bg: #f5f6f5;
  --topnav-border: #e0e0e0;
  --card-bg: #ffffff;
  --card-shadow: 0 2px 8px rgba(27, 77, 111, 0.06);
}
```

##### 📉 Layout Structure
- **Top Navigation (TopNav):** Pearl White (#f5f6f5), 1px solid #e0e0e0 border, height 64px, fixed top
- **Sidebar Navigation:** Light Cobalt (#248dc1), full screen height (100vh), Light Aqua (#74a8d4) active indicator, white text/icons
- **Main Content Area:** Light Sky Blue (#d0edf6), max width 1200px, auto margin, 24–32px padding
- **Cards:** White background, border-radius 16px, shadow from --card-shadow

##### 📊 Typography & Icons
- **Font Family:** system-ui, 'Inter', 'Segoe UI', sans-serif
- **Font Weights:** 400 (base), 600 (medium emphasis)
- **Font Sizes:** 16px base; headings up to 24px
- **Icons:** Monochrome or accented outlines, minimal, geometric

##### ⏺ Buttons & Interactions
```css
.aqx-btn-primary {
  background-color: var(--aqx-light-cobalt);
  color: white;
  border-radius: 6px;
  padding: 0 24px;
  min-height: 40px;
  font-weight: 600;
  transition: background 0.2s;
}
.aqx-btn-primary:hover {
  background-color: var(--aqx-light-aqua);
}
.aqx-btn-secondary {
  border: 1px solid var(--aqx-blue);
  background: transparent;
  color: var(--aqx-blue);
}
.aqx-btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

##### 🏠 Interaction Design
- Focus Rings: 2px solid var(--aqx-light-cobalt) for keyboard accessibility
- Active Sidebar State: Light Aqua (#74a8d4) bar or icon color
- Hover Cards: Slight shadow elevation (0 4px 12px rgba(27, 77, 111, 0.08))

##### 🔧 Implementation Notes
- Theme class: `.aqx-pro-dashboard-theme`
- Fully responsive, supports flexbox and grid systems
- Navigation collapses below 768px (hamburger menu support)
- All layout and component variables use CSS custom properties for white-label overrides

##### ✅ Summary
- Marina Portal is now the official theme for Tiers 1–4 AQUORIX Pro dashboards
- Fresh aquatic visual identity
- Responsive and accessible layout
- Modular CSS system ready for enterprise integration
- Next: Begin rollout to Tier 1–4 dashboards and apply to all future components (e.g., calendars, schedulers, media galleries)
- Prepared for AQUORIX Engineering & Design by the Strategic UI Team — July 2025

### Bamboo Safari Portal (Affiliate, Tier 5)
*Documentation for Bamboo Safari theme should be inserted here as provided by user/design team.*

---

## 5. Proposed Solution for Next Phase

### a. Dashboard Scaffolding
- Create two new layouts:
  - `MarinaPortalLayout` (Pro, Tiers 1–4, .aqx-pro-dashboard-theme)
  - `BambooSafariLayout` (Affiliate, Tier 5, .aqx-affiliate-dashboard-theme)
- Apply strict theme classes to root containers
- Modularize shared logic with clear separation

### b. Authentication & Routing
- Centralize `RequireAuth` logic to fetch/cached user role
- Explicitly test edge cases (missing profile/null roles/session expiry)
- Role-based route guards to prevent cross-access

### c. MVP Protection
- All new work on feature branches; checkpoint MVP before major changes
- Manual QA after every merge, especially auth and theme boundaries

---

## 6. Summary Table

| Area                  | Issue Last Time                | Solution This Time                          |
|-----------------------|-------------------------------|---------------------------------------------|
| Auth/Role Fetching    | Inconsistent, buggy           | Centralized, cached, robust error handling  |
| Theme Isolation       | CSS bleed, hardcoded styles   | Strict theme classes, modular CSS           |
| Component Coupling    | Shared logic, fragile         | Modular, isolated layout/components         |
| Merge Conflicts       | Frequent, risky               | Atomic commits, feature branches, QA        |
| Static Assets         | Missing files, port conflicts | Pre-check assets, unique dev ports          |

---

## 7. Next Steps Before Coding

1. Test authentication and role fetching thoroughly
2. Scaffold new layouts and themes in isolation
3. Plan incremental, atomic rollouts with frequent checkpoints
4. Document all new patterns for engineering/design review

---

## 8. Technical Team Review Questions

To ensure a robust and future-proof extension, the following questions are recommended for technical team review and discussion:

### Architecture & Theming
- Are there any edge cases where CSS or JS from one dashboard (Marina Portal or Bamboo Safari) could leak into the other?
- Do you foresee any challenges in enforcing strict theme boundaries, especially with shared components?
- Are shared components (navigation, profile, notifications) sufficiently decoupled for divergent layouts and features?
- Is additional refactoring needed to ensure safe extension and white-labeling?

### Authentication & Authorization
- Are there remaining risks or edge cases in our role-fetching/auth guard logic that could lead to unauthorized access or user lockout?
- Is our error logging and reporting sufficient for rapid debugging in production?
- Does our current routing structure make it easy to add, remove, or modify role-based access as requirements evolve?

### DevOps & QA
- Are our branching, checkpointing, and QA practices robust enough to guarantee MVP stability as we extend?
- Should we automate any additional regression or integration tests before merging major changes?
- Are there any static assets, build steps, or deployment configurations that could cause issues as we introduce more themes and layouts?

### Implementation & Rollout
- Do you agree with the proposed incremental, atomic rollout strategy?
- Are there milestones or checkpoints you’d like to see added?
- Is the current documentation (theme tokens, layout rules, process notes) sufficient for onboarding new engineers and designers?
- What additional diagrams, code samples, or onboarding materials would help?

### Open Risks & Feedback
- Are there any technical debts, legacy issues, or known risks not captured in this document?
- What’s your biggest concern as we move to extend the MVP framework?
- Is there anything in the proposed solution that you would change, simplify, or expand?

---

## 9. Super Grok Review: Insights & Recommendations

**Summary of Feedback (July 2025):**
- **Theme Isolation:** Use CSS Modules or CSS-in-JS for strict scoping. Implement a theme config/registry (e.g., JSON) to manage overrides and dynamic switching per tier.
- **Component Modularity:** Refactor shared components (SidebarNavigation, TopNav) to accept tier/theme props. Consider higher-order components for theme injection. Avoid hardcoding.
- **Authentication:** Add fallback logic to refresh user data on auth failure or session expiry. Expand error logging with stack traces and user context (tier, role). Prioritize fixing race conditions in RequireAuth before extension.
- **Routing:** Move to a route config file (e.g., routes.ts) for tier-based paths. Test with invalid/missing roles.
- **DevOps & QA:** Automate unit/integration tests for auth guards and theme rendering (Jest/React Testing Library). Add a prebuild script to check static assets and ports. Use atomic commits, pre-merge reviews, and post-merge smoke tests.
- **Implementation:** Begin with a single scaffold for MarinaPortalLayout (Tier 1), validate, then replicate for other tiers. Add checkpoints after each layout scaffold.
- **Documentation:** Add a quick-start guide for new engineers, plus diagrams of layout/theme flow and sample RequireAuth code.
- **Risks:** Audit for legacy auth logic and outdated packages. Biggest concern is auth stability—address before feature expansion.

**Actionable Next Steps:**
1. Implement a theme config/registry for dynamic theming.
2. Refactor shared components for prop-driven theme switching.
3. Harden RequireAuth with auth fallback and enhanced error logging.
4. Move routing to a config file and test edge cases.
5. Automate tests for auth and theme rendering.
6. Add a prebuild check script for assets/ports.
7. Scaffold MarinaPortalLayout for Tier 1 first, checkpoint, then expand.
8. Enhance documentation with a quick-start, diagrams, and code samples.

---

## 10. ChatGPT Strategic Systems Engineering — Technical Evaluation & Action List

**Validation:**
- The current strategy is sound, modular, and scalable. Theme boundaries and layout separation are excellent.
- Protecting the Tier 0 Admin MVP is the correct approach.

**Action List:**
- [ ] Harden `RequireAuth` with a unified `getUserRole()` and fallback/session watchdog.
- [ ] Scaffold `MarinaPortalLayout` (Tier 1) first.
- [ ] Create `theme.config.ts` registry and `<ThemeProvider>`.
- [ ] Refactor shared components to accept a `theme` prop and use BEM classes.
- [ ] Store theme styles in `/styles/themes/[theme]/`.
- [ ] Add `build:precheck` script.
- [ ] Expand Jest/E2E tests for auth, theme, and routing.
- [ ] Document layout, theming, and add onboarding quick-start and diagrams.
- [ ] QA: Add login matrix and pre-merge checklist.
- [ ] Scaffold `BambooSafariLayout` after Tier 1 validation.

**Final Note:**
If you stabilize `RequireAuth` and keep theme boundaries strict, you are set up for long-term success.

---

*Prepared for AQUORIX Engineering & Design by the Strategic UI Team — July 2025*
