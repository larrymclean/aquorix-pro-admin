# AQUORIX Pro Admin Onboarding & Authorization – Project Plan & Punchlist (Living, Incremental)

**File:** Onboarding_Project_Plan_and_Punchlist.md  
**Path:** /docs/Onboarding_Project_Plan_and_Punchlist.md  
**Description:** Living, incremental project plan and punchlist for robust onboarding and authorization with Supabase. Tracks workflow, lessons learned, and tactical tasks. Past project work is reference only—no code reuse without explicit review.  
**Author:** Cascade AI (with Larry & AQUORIX Team)  
**Created:** 2025-07-13  
**Last Updated:** 2025-07-13  
**Status:** In Progress  
**Dependencies:** All onboarding/auth design docs, Supabase, AQUORIX theme system  
**Notes:** Update after every major milestone, checkpoint, or design/learning change.  

---

## 1. Working Principles & Lessons Learned
- **Atomic, Testable Chunks:** Each change is small, reviewable, and checkpointed before risky logic is introduced.
- **Checkpoint Early & Often:** Always commit before auth/session/critical UI changes (protect what we have).
- **Continuous QA:** Test every path: invite, accept, expired token, onboarding incomplete, onboarding complete, etc.
- **Documentation:** Update docs and punchlist after each milestone or learning.
- **Past work is reference only:** No code reuse from previous projects unless explicitly reviewed and approved.
- **Security First:** RLS, safe redirect URLs, and session handling are non-negotiable.

---

## 2. Updated Project Plan (Incremental, Session-Aware)

### Goal
Deliver a robust, session-aware onboarding and authorization flow for AQUORIX Pro Admin, with custom password, onboarding, and theme logic. All changes are atomic and reviewable.

### Milestones (in order)
1. **Base Styles & Theme Tokens**
   - Ensure tokens and CSS are ready for onboarding and auth flows.
2. **Custom /set-password Implementation**
   - Scaffold `/set-password` route and UI.
   - Integrate with Supabase token verification and password setting.
   - QA: Accept invite → set password → session is ready.
3. **Session Hydration & Redirect Logic**
   - Ensure session is established after invite acceptance and password set.
   - Implement robust redirect and session recovery (manual refresh if needed).
4. **Onboarding Wizard Integration**
   - Redirect to onboarding if `has_onboarded = false`.
   - Save onboarding progress to user_profile after each step.
5. **RLS & Security Checks**
   - Confirm RLS on user_profile and all sensitive tables.
   - QA: User cannot read/write other users’ data.
6. **Edge Cases & UX Polish**
   - Handle expired/invalid tokens, multiple invites, and onboarding resume.
   - Add error banners, feedback, and graceful fallbacks.
7. **Docs & Handoff**
   - Update docs, punchlist, and QA checklist after each milestone.
   - Prepare for handoff to QA/design/engineering.

---

## 3. Punchlist (Active, Session-Aware)

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Confirm base theme tokens/styles for onboarding/auth | Cascade | ✅ Done | |
| 2 | Scaffold /set-password route & UI | Cascade | ⏳ Next | Accept invite → set password |
| 3 | Integrate Supabase token verification in /set-password | Cascade | ⏳ Next | QA session hydration |
| 4 | Implement robust session recovery/redirect logic | Cascade | ⏳ Next | Manual refresh if needed |
| 5 | Redirect to onboarding if has_onboarded = false | Cascade | ⏳ Next | |
| 6 | Save onboarding progress to user_profile | Cascade | ⏳ Next | |
| 7 | Confirm RLS on user_profile and sensitive tables | Cascade | ⏳ Next | QA security |
| 8 | Handle expired/invalid invite tokens | Cascade | ⏳ Next | UX polish |
| 9 | Add error banners and graceful fallbacks | Cascade | ⏳ Next | |
|10 | Update docs & punchlist after each milestone | Cascade | 🔄 Ongoing | Living doc |

---

## 4. Checkpoints & Updates
- **2025-07-13:** Initial plan and punchlist created.
- **2025-07-13:** Refactored plan for robust, session-aware onboarding and custom password flow.

---

## 5. Open Questions / To Discuss
- How should onboarding resume if session is lost mid-flow?
- How to handle admin “pre-provisioned” users securely?
- Additional feedback from QA/Design as flows are tested?
- What is the preferred user experience if a user tries to log in before completing onboarding (e.g., friendly message, forced redirect, or both)?
- Should onboarding progress be saved as a draft (allowing users to resume mid-flow if interrupted), or must it be completed in a single session?
- Are there any third-party integrations (e.g., analytics, CRM, audit logging) that need to hook into onboarding milestones or user creation?
- What is the policy for re-sending invitations or handling users who never accept their invite (expiration, reminders, admin intervention)?
- Should we support passwordless or SSO onboarding for specific user types in the future, and if so, how should this impact current scaffolding?
- Who is responsible for managing and updating the list of allowed redirect URLs in Supabase (dev vs. prod), and what is the review process for changes?

---

**This document is living. Cascade AI will update after each milestone, feedback cycle, or major change.**
