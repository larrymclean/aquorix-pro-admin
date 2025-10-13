/*
 * File: calendar-spike-comparison.md
 * Path: docs/calendar-spike-comparison.md
 * Description: Comparison matrix and evaluation summary for React Big Calendar vs. FullCalendar spikes in AQUORIX Admin Dashboard.
 * Author: AQUORIX Engineering
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: Draft
 * Dependencies: N/A (documentation)
 * Notes: For technical evaluation only. See related spike setup docs and MVP technical overview.
 * Change Log:
 *   - 2025-07-08, AQUORIX Engineering: Initial spike comparison matrix and summary.
 */

# AQUORIX Calendar Spike Comparison

This document compares the two technical spike prototypes implemented in the AQUORIX Admin Dashboard:
- **React Big Calendar (RBC)**
- **FullCalendar (React)**

Both were evaluated using the same mock event data, styling guidelines, and dashboard integration points.

---

## Comparison Matrix (Readable Format)

---

### 1. Feature Coverage
- **React Big Calendar (RBC):**
  - Month/Week/Day views
  - Event popup, color coding, selection, basic navigation
  - Recurring events, drag-and-drop, and resource management require extra work or plugins
- **FullCalendar (React):**
  - Month/Week/Day views
  - Event popup, color coding, selection
  - Richer built-in support for recurring events, resource/timegrid, and advanced features

---

### 2. Theming & Styling
- **RBC:**
  - Supports CSS-in-JS or CSS overrides
  - Less flexible for deep custom UI
  - Toolbar/buttons are hard to fully restyle
  - Good fit for AQUORIX color palette
- **FullCalendar:**
  - Highly customizable via CSS and config
  - More granular control, supports theme packs and extensive class hooks

---

### 3. Accessibility
- **RBC:**
  - Basic ARIA roles
  - Some keyboard support, but not fully WCAG-compliant out of the box
- **FullCalendar:**
  - Better ARIA, keyboard navigation, and screen reader support
  - More mature accessibility features

---

### 4. Integration Effort
- **RBC:**
  - Simple React API, easy event data mapping
  - Requires localizer setup
  - Some TypeScript type gaps
- **FullCalendar:**
  - Slightly steeper learning curve, but better documentation
  - Requires plugin setup and CSS via CDN
  - TypeScript support is more robust

---

### 5. Bundle Size Impact
- **RBC:** ~80–120 KB min+gzipped (core + date-fns)
- **FullCalendar:** ~220–300 KB min+gzipped (core + daygrid/timegrid plugins)

---

### 6. Known Issues/Quirks in Spike
- **RBC:**
  - Navigation controls did not function in spike (v1.x limitation or integration bug)
  - Limited accessibility
- **FullCalendar:**
  - CSS must be loaded via CDN for React build
  - Works out of the box; all controls functional

---

## Summary & Recommendation

- **React Big Calendar (RBC):**
  - Pros: Lightweight, simple React API, easy to get started, fits AQUORIX color scheme.
  - Cons: Navigation controls non-functional in spike (likely v1.x limitation), less flexible for deep theming, accessibility is basic.

- **FullCalendar (React):**
  - Pros: Full-featured, robust accessibility, all navigation and view controls work, highly customizable.
  - Cons: Larger bundle, requires CDN CSS workaround, more complex API.

**Recommendation:**
- For a production-grade calendar with full feature coverage, accessibility, and reliable navigation, **FullCalendar (React)** is the preferred choice for AQUORIX Admin Dashboard.
- If bundle size and minimal dependencies are critical, and navigation can be fixed, **RBC** remains a viable option for a lightweight MVP.

---

For details, see:
- `docs/calendar-spike-rbc-setup.md`
- `docs/calendar-spike-fullcalendar-setup.md`
- `docs/calendar-mvp-technical-overview.md`

---

*End of document.*
