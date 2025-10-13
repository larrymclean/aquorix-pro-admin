# FullCalendar Migration Tracker

**Version:** 1.0  
**Last Updated:** 2025-07-11  
**Maintainers:** AQUORIX Engineering & Design

---

## Purpose
A step-by-step migration and QA tracker for integrating FullCalendar with AQUORIX Dashboard. Use this to assign owners, set deadlines, and check off milestones. Update as progress is made or requirements change.

---

## 🟦 API & Data Contract
- [ ] **Define TypeScript event interface** (align FullCalendar + Supabase schema)
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Document `/calendar/events` API contract** (fields, CRUD, permissions)
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Create permissions matrix** for tier/role event visibility/editing
    - _Owner:_ [Assign]
    - _Due:_ [Set date]

---

## 🔒 Authentication & Role Logic
- [ ] **Centralize role logic** (`getUserRole` utility)
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Update RequireAuth** (fallback/session watchdog, error logging)
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Seed test users/roles** in Supabase for QA
    - _Owner:_ [Assign]
    - _Due:_ [Set date]

---

## 📅 Calendar Integration & Theming
- [ ] **Import AQUORIX theme tokens/variables** for FullCalendar
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Customize toolbar and modals** per AQUORIX style guide
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Implement modal-based event editing** (Phase 1)
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Add print/export and mobile responsiveness**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]

---

## 🧪 Testing & QA
- [ ] **Test RLS on Supabase** for all event actions
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Seed and test with all tier/role scenarios**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Add/expand Jest/RTL tests** for event CRUD, tier filtering, offline
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Integrate axe-core for accessibility audits**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]

---

## 🚀 Deployment & Rollback
- [ ] **Prepare hard cutover plan** (feature flag, versioned branches)
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Document rollback steps**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]

---

## 📚 Documentation & Handover
- [ ] **Add AQUORIX-compliant header/comments to all new files**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Prepare quick-start guide and migration checklist**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]
- [ ] **Diagram layout/theme flow and sample RequireAuth code**
    - _Owner:_ [Assign]
    - _Due:_ [Set date]

---

**Instructions:**
- Assign owners and deadlines for each task.
- Check off items as completed.
- Update with new tasks, blockers, or lessons learned.

---

*Prepared for AQUORIX Engineering & Design by the Strategic UI Team — July 2025*
