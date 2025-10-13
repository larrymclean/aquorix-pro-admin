/*
 * File: calendar-fullcalendar-migration-spec.md
 * Path: docs/calendar-fullcalendar-migration-spec.md
 * Description: Migration plan and technical specification for replacing MVP calendar with FullCalendar (React) in AQUORIX Admin Dashboard.
 * Author: AQUORIX Strategic Product Office
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: Final
 * Dependencies: @fullcalendar/react, @fullcalendar/daygrid, @fullcalendar/timegrid, @fullcalendar/interaction
 * Notes: Use as implementation blueprint for Windsurf AI IDE and AQUORIX engineering. Aligns with accessibility and tier-permission standards.
 * Change Log:
 *   - 2025-07-08, AQUORIX SPO: Initial migration spec drafted from spike evaluation and decision.
 */

# Calendar System – FullCalendar Migration Specification

**Version:** 1.0  
**Date:** July 8, 2025  
**Audience:** Technical Designers, DevOps, Developers, Windsurf AI IDE Contributors  
**Owner:** AQUORIX Strategic Product Office

---

## 1. Purpose
Defines the migration plan and technical implementation details for replacing the in-house MVP calendar with FullCalendar (React) as the scheduling engine for the AQUORIX Dashboard. Implementation must align with AQUORIX accessibility, tier-permissions, and extensibility standards.

## 2. Migration Goals
- Replace existing MVP `CalendarGrid.tsx` with a scalable, robust FullCalendar-based solution
- Integrate real-time event rendering using Supabase or mock data
- Support month/week/day views, responsive layout, and accessibility
- Maintain and extend support for tier-aware event filtering and UI behaviors

## 3. Required FullCalendar Plugins
| Plugin                    | Purpose                               |
|--------------------------|---------------------------------------|
| @fullcalendar/react      | Core calendar wrapper for React        |
| @fullcalendar/daygrid    | Month view layout                      |
| @fullcalendar/timegrid   | Week/day view support                  |
| @fullcalendar/interaction| Drag-and-drop support                  |
| @fullcalendar/list (opt) | List view for Tier 5 Concierge UI      |

## 4. Installation (Windsurf Environment)
```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```
**Note:** Include CSS from CDN or import directly in React:
```js
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
```

## 5. Component Migration Plan
- Replace `Calendar.tsx` (container)
- Replace `CalendarGrid.tsx`
- Replace `EventModal.tsx`

## 6. Tier Integration Requirements
| Tier      | Requirements                                                                 |
|-----------|------------------------------------------------------------------------------|
| Tier 1–2  | Add, view, cancel dive/course events (single-user scope)                     |
| Tier 3    | Multi-user scheduling, drag/drop, filter by instructor or dive type          |
| Tier 4    | Multi-resource, timeline/timeGrid view for vessels, rooms, crew              |
| Tier 5    | Read-only view (with print/export), concierge filtering                      |

## 7. Access Control Hooks
- Use tier metadata in Supabase JWT to filter event data before render
- Enforce RLS in `/calendar/events` API
- In React, filter/transform events via role-specific logic

## 8. Accessibility Tasks
- Ensure all interactive elements are keyboard-accessible
- Use ARIA roles and labels for event and navigation controls
- Run WCAG audit and manual keyboard testing

## 9. Timeline & Milestones
| Task                                | Owner      | Date       |
|--------------------------------------|------------|------------|
| Install and configure FullCalendar   | Windsurf   | July 9     |
| Replace MVP CalendarGrid             | Windsurf   | July 10    |
| Hook up event data                   | Dev        | July 11    |
| Modal + interactivity + drag/drop    | UI/Dev     | July 12–13 |
| QA with Tier 1–3 scenarios           | QA         | July 14–15 |
| Final approval for merge             | Product    | July 16    |

## 10. Deliverables
- Replaced and fully functioning FullCalendar UI for dashboard
- Tier-specific views and data filtering logic
- Functional drag/drop and view-switching
- Documented `Calendar.tsx`, `calendarEventService.ts`, and `CalendarModal.tsx`

## 11. Risks & Mitigations
| Risk                  | Mitigation                              |
|-----------------------|-----------------------------------------|
| Bundle size impact    | Lazy-load plugins where possible         |
| Accessibility issues  | Run WCAG audit and manual testing        |
| Permission leakage    | Strict RLS enforcement on all event APIs |

---

## 12. Task Breakdown

### A. Prerequisite Tasks
- [ ] Finalize `/calendar/events` API contract (fields, types, CRUD, permissions)
- [ ] Define tier-to-permission mapping and explicit permissions table
- [ ] Test and enable Row Level Security (RLS) on Supabase for calendar events
- [ ] Prepare AQUORIX design tokens/theme variables for use in FullCalendar
- [ ] Seed fictional users for QA (multiple tiers/roles)
- [ ] Document fallback/offline mode (IndexedDB strategy)
- [ ] Decide on accessibility audit toolchain (recommend axe-core)

### B. Implementation Tasks
- [ ] Install FullCalendar plugins and CSS
- [ ] Replace `Calendar.tsx` (container)
- [ ] Replace `CalendarGrid.tsx` (main calendar logic)
- [ ] Replace `EventModal.tsx` (event editing)
- [ ] Integrate Supabase event data (with transformation utility for tier logic)
- [ ] Implement tier-aware filtering and role-based UI
- [ ] Apply AQUORIX theming and accessibility hooks
- [ ] Enable/QA drag-and-drop, modal event editing
- [ ] Implement print/export and mobile responsiveness
- [ ] Add inline documentation per AQUORIX standards

### C. QA & Deployment
- [ ] Validate all tier scenarios (QA with seeded users)
- [ ] Run accessibility audit and manual keyboard testing
- [ ] Prepare rollback plan (git snapshot/versioned branch)
- [ ] Obtain sign-off from AQUORIX Admin Staff/Management

---

## 13. Kickoff Checklist

**Before starting implementation, confirm the following:**

- [ ] API contract for `/calendar/events` is finalized and documented
- [ ] Tier-to-permission mapping is defined and available to devs
- [ ] RLS is tested and enforced on Supabase event tables
- [ ] AQUORIX design tokens are accessible to the project
- [ ] Fictional QA users are seeded in Supabase
- [ ] Accessibility tool (e.g., axe-core) is chosen and ready
- [ ] Fallback/offline mode strategy is documented
- [ ] Sign-off process and documentation standards are clear

---

**End of Document – Use this spec to guide all development efforts in Windsurf IDE for FullCalendar migration.**
