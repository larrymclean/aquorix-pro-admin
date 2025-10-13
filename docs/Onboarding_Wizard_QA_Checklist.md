# AQUORIX Pro Admin Onboarding Wizard: QA Checklist

**Objective:**
Ensure robust authentication, role-based access, and onboarding wizard functionality for all user types, with persistent session and correct redirects.

---

## Pre-Flight: Setup
- [ ] .env is correct and Supabase project is configured for dev URL.
- [ ] App is running at expected local URL (e.g., `http://localhost:3005`).
- [ ] Browser cache/storage cleared before QA (optional for clean state).

---

## 1. Authentication & Session Persistence
- [ ] User can navigate to `/login` and see login form.
- [ ] After login, user is redirected to correct onboarding/dashboard route.
- [ ] After login, user info and role are visible in debug logs (if enabled).
- [ ] Refresh page; user remains authenticated (not redirected to `/login`).
- [ ] Application tab → IndexedDB: session data present (optional, advanced QA).

---

## 2. Onboarding Wizard Access Control
- [ ] Log in as onboarding-required user; redirected to `/onboarding` after login.
- [ ] User cannot access `/onboarding` if onboarding is already completed (redirected to dashboard or correct route).
- [ ] Unauthenticated or unauthorized user is redirected from `/onboarding` to `/login` or `/not-authorized`.

---

## 3. Role-Based Routing and Dashboard Access
- [ ] Log in as each supported role (admin, pro_user, consumer, etc.).
- [ ] Each role lands on correct default page (dashboard, onboarding, etc.).
- [ ] Insufficient privilege users are redirected to `/not-authorized` on protected routes.
- [ ] Admins/managers access all admin/protected routes.

---

## 4. Onboarding Wizard Functionality
- [ ] All onboarding steps render and function as expected.
- [ ] User can complete onboarding and is redirected appropriately.
- [ ] Edge: Refresh/navigate away mid-onboarding, then return—progress is handled gracefully.

---

## 5. Logout and Session Expiry
- [ ] User can log out and is redirected to `/login`.
- [ ] After logout, user cannot access protected routes (redirected to `/login`).
- [ ] Session expiry (if testable): user is redirected to `/login` on next navigation or refresh.

---

## 6. Error Handling and UX
- [ ] Auth failure shows clear error message.
- [ ] Onboarding failure (API/network error) shows clear error and user is not stuck.
- [ ] Loading spinners/UX appear during async auth/onboarding.
- [ ] All redirects and error states are clear and professional.

---

# QA Results Reporting Template

## Summary
- **QA Engineer:**
- **Date:**
- **Browser/OS:**
- **App Version/Commit:**
- **Overall Status:** (PASS/FAIL/INCOMPLETE)

## Blockers/Issues
- (List any blocking issues, bugs, or critical failures here)

## Checklist Results
| Step | Description | Result (PASS/FAIL) | Notes |
|------|-------------|--------------------|-------|
| 1.1  | User can navigate to /login |        |       |
| 1.2  | After login, redirected correctly |   |       |
| ...  | ... | ... | ... |

## Detailed Bug Reports
- **Bug #1:**
  - **Description:**
  - **Steps to Reproduce:**
  - **Expected:**
  - **Actual:**
  - **Console/Network Logs:**
  - **Screenshots (if any):**

- **Bug #2:**
  - ...

## Additional Notes
- (Any extra context, suggestions, or observations)
