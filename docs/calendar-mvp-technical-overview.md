# AQUORIX Base Calendar MVP – Technical Overview

## 1. Purpose & Context

This MVP calendar prototype was developed as a foundational, extensible scheduling component for the AQUORIX platform. It is designed to align with AQUORIX’s core engineering principles: **simplicity, speed, zero new dependencies, accessibility, and atomic, testable code**. The goal is to provide a baseline for both rapid internal development and comparison against open-source calendar solutions.

---

## 2. Architecture & Implementation

### **Tech Stack**
- **Frontend:** React (TypeScript), CSS Modules (no new libraries)
- **State:** React hooks (local state only)
- **Data:** Local mock data, matching the AQUORIX data dictionary and business requirements
- **No external dependencies:** No FullCalendar.js, date-fns, or similar libraries

### **Component Structure**
- **`Calendar.tsx`** (Page-level container)
  - Handles month navigation, event modal state, and offline detection
  - Imports and orchestrates all subcomponents

- **`CalendarGrid.tsx`**
  - Renders a month view grid (7 columns, 5–6 rows)
  - Displays date numbers and event blocks per cell
  - Receives events as props and filters by date
  - Handles keyboard and click navigation for accessibility

- **`EventModal.tsx`**
  - Displays event details in a modal dialog
  - Stubbed for add/edit actions (extensible for full CRUD)
  - Accessible, with ARIA roles and keyboard support

- **`FilterBar.tsx`**
  - Renders a color-coded legend for event types and a stub UI for future filters

- **`mockData.ts`**
  - Contains mock events and TypeScript types, strictly matching the data dictionary
  - Easily swappable for a backend/API provider

- **CSS Modules**
  - Each component is styled via its own `.module.css` file for encapsulation and maintainability

---

## 3. Features

### **Included in MVP**
- **Month view calendar grid** (day/week toggles stubbed for future)
- **Event blocks**: Rendered per day, color-coded by event type (dive, course, block, internal, guest)
- **Event modal**: Click to view event details (read-only for MVP)
- **Add event modal**: Stubbed, ready for extension
- **Legend**: Color key for event types
- **Offline banner**: Detects browser offline state (`navigator.onLine`)
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Atomic, modular code**: Each feature in its own well-documented component
- **AQUORIX header blocks**: Every file and function is documented per internal standards

### **Not Included (but planned/ready for extension)**
- Week/day views, drag-and-drop, recurring events, full CRUD
- Real backend integration (Supabase, API provider)
- Mobile/responsive layout (desktop only for MVP)
- Filtering logic (UI stubbed)
- Service worker/IndexedDB for offline caching

---

## 4. Extensibility & Next Steps

- **Backend Integration**: Swap out the `mockData` provider for a Supabase or REST API data source. The component interfaces are already designed for this.
- **Feature Expansion**: Add week/day views, event CRUD, filtering, and advanced permissions as atomic, testable changes.
- **Accessibility & Internationalization**: The codebase is structured to make these enhancements straightforward.
- **Performance**: No unnecessary dependencies; only the minimal code required for the current view is loaded.
- **Testing**: The modular structure supports easy addition of unit and integration tests.

---

## 5. Strengths of This Approach

- **Simplicity & Clarity**: Readable, maintainable code with zero “magic” or hidden complexity.
- **No Dependency Lock-In**: No reliance on large third-party calendar libraries; full control over UX, accessibility, and performance.
- **Atomic Development**: Each feature can be added or refactored in isolation, minimizing risk.
- **AQUORIX Standards**: Strict adherence to internal documentation, accessibility, and coding guidelines.

---

## 6. Considerations for Open Source Alternatives

**Potential Pros of Open Source Libraries (e.g., FullCalendar.js, React Big Calendar):**
- Rich feature set out-of-the-box (drag-and-drop, recurring events, time zones, etc.)
- Large community and ongoing maintenance
- Faster path to advanced features

**Potential Cons:**
- Increased bundle size and potential performance costs
- Less control over UX, accessibility, and code quality
- More complex customization and integration with AQUORIX-specific requirements (roles, tiers, offline, etc.)
- Risk of dependency or breaking changes upstream

---

## 7. Summary

This MVP calendar prototype provides a robust, extensible baseline for AQUORIX’s scheduling needs, rigorously aligned with internal engineering values.  
It is intentionally minimal, with a focus on clarity, modularity, and readiness for both internal development and side-by-side evaluation against open-source solutions.

**Next Steps:**
- Evaluate this MVP in real usage scenarios
- Compare with one or more open-source solutions on: extensibility, performance, accessibility, and alignment with AQUORIX business needs
- Decide whether to continue building in-house, adopt an open-source library, or pursue a hybrid approach

---

If you need a side-by-side feature checklist or want to run a technical spike with an open-source calendar for comparison, I can assist with that as well.
