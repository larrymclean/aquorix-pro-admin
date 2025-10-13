# AQUORIX Dashboard Extension Project Punchlist

**Version 1.0 — July 2025**
**Maintainers:** AQUORIX Engineering & Design

---

## Purpose
A living, step-by-step checklist for the AQUORIX dashboard extension project. Use this punchlist to track progress, assign owners, and ensure nothing critical is missed as we build out the Marina Portal (Tiers 1–4) and Bamboo Safari Portal (Tier 5).

---

## 🟦 Core Architecture & Theming
- [ ] Create `theme.config.ts` (ThemeRegistry) with all theme tokens, classes, and layout refs
- [ ] Implement `<ThemeProvider>` for dynamic theme/context injection
- [ ] Refactor shared components (TopNav, Sidebar, Footer) to accept `theme` prop
- [ ] Store theme styles in `/styles/themes/marina/` and `/styles/themes/bamboo/`
- [ ] Enforce `.aqx-pro-dashboard-theme` and `.aqx-affiliate-dashboard-theme` at layout root

## 🔒 Authentication & Authorization
- [ ] Centralize user role logic in `getUserRole()`
- [ ] Add fallback/session watchdog in `RequireAuth`
- [ ] Expand error logging with tier/layout/route context
- [ ] Move routing to `routes.config.ts` with tier mapping
- [ ] Test invalid/missing role scenarios

## 🧪 DevOps, QA & Testing
- [ ] Add `build:precheck` script (ports, assets)
- [ ] Expand Jest/React Testing Library tests for:
    - [ ] Theme rendering
    - [ ] Role guards
    - [ ] Route access
- [ ] Add pre-merge QA checklist (tier login, layout, calendar, events)
- [ ] Create QA login matrix for all tiers

## 🏗️ Implementation & Rollout
- [ ] Scaffold `MarinaPortalLayout` for Tier 1 (checkpoint)
- [ ] Validate Tier 1 — QA, review, and merge
- [ ] Scaffold `MarinaPortalLayout` for Tiers 2–4
- [ ] Scaffold `BambooSafariLayout` for Tier 5
- [ ] Validate and merge each tier incrementally

## 📚 Documentation & Onboarding
- [ ] Create `/docs/theme-dev-quickstart.md` (scaffold, theme, test instructions)
- [ ] Add diagrams: routing, layout, theme flow
- [ ] Provide sample `theme.config.ts` and auth fallback code
- [ ] Maintain this punchlist as a living document

---

**Instructions:**
- Check off each item as it is completed.
- Assign owners and deadlines as needed.
- Update with new tasks or lessons learned during the build.

---

*Prepared for AQUORIX Engineering & Design by the Strategic UI Team — July 2025*
