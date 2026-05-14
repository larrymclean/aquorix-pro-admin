# AQUORIX Poseidon Authority Files Doctrine

Version: 0.1.0
Date: 2026-05-14
Status: ACTIVE - P10 Live Product Discipline
Owner: Larry McLean
Doctrine: Poseidon's Code

## Purpose

This document defines the files that require full-context verification before modification.

These files are product authority files. They control routing, operational truth, user-facing UI, schedule behavior, booking behavior, date authority, and live deployment behavior.

No change may be made to these files from memory, partial assumptions, or unverified snippets.

## Core Rule

Before modifying an authority file, the assistant must know the current file truth.

Allowed evidence:

1. Full file pasted by Larry
2. Current relevant section including imports, surrounding code, and export structure
3. Fresh terminal output proving exact current code block

If file truth is incomplete, stop and request the file or section.

## No-Guess Rule

Do not say:
- "insert below"
- "replace this"
- "search for"
unless the exact current code has been verified.

## Mandatory Verification

After modifying an authority file:

1. Run a targeted grep/sed verification
2. Run build or syntax check
3. Confirm expected output
4. Do not proceed to next feature until stable

## Frontend Authority Files

### Routing Authority
- src/App.tsx
- src/config/navigation.ts

### Dashboard Shell Authority
- src/features/dashboard/ProDashboardShell.tsx
- src/components/SidebarNavigation.tsx
- src/components/SidebarNavigation.css
- src/components/TopNav.tsx

### Operational Dashboard Authority
- src/features/dashboard/pages/OverviewPage.tsx
- src/features/dashboard/pages/SchedulePage.tsx
- src/features/dashboard/pages/CalendarPage.tsx
- src/features/dashboard/pages/BookingsPage.tsx
- src/features/dashboard/pages/BookingDetailPage.tsx

### Ops Board Authority
- src/features/ops-board/OpsBoardApp.tsx
- src/features/ops-board/styles/opsBoard.css

### Widget Authority
- widget-embed/src/App.tsx
- widget-embed/src/lib/scheduleProvider.ts
- widget-embed/src/lib/itineraryTypes.ts

### API Client Authority
- src/api/dashboardSchedule.ts
- src/hooks/useDashboardSchedule.ts
- src/types/dashboardSchedule.ts

### Design/System Authority
- src/styles/dashboard.css
- src/styles/themes.css

## Backend Authority Files

### Server Wiring Authority
- server.js

### Schedule Authority
- src/routes/dashboardSchedule.js
- src/routes/dashboardSchedulePatterns.js
- src/services/unifiedSessionsService.js

### Booking/Payment Authority
- src/routes/bookingsRequest.js
- src/routes/bookingsPurchase.js
- src/routes/bookingsPaymentLink.js
- src/routes/dashboardBookingApprove.js
- src/routes/dashboardBookingReject.js
- src/routes/dashboardBookingRefund.js
- src/routes/paymentsWebhook.js

### Middleware/Auth Authority
- src/middleware/requireAuthUser.js
- src/middleware/requireDashboardScope.js

### Database Authority
- migrations/
- sql/
- schema-related files

## Live Product Discipline

These files are treated as intellectual property control surfaces.

Breaking them is not merely a technical error. It damages product continuity, deployment confidence, and operational trust.

## Change Protocol

Before edit:

1. Identify file
2. Confirm it is/is not authority file
3. If authority file, inspect current truth
4. State intended minimal change
5. Make only that change

After edit:

1. Verify exact changed block
2. Build/check
3. Report result
4. Commit only when stable

## Prohibited Behavior

- No inferred imports
- No guessed route structure
- No silent UI copy changes
- No unapproved telemetry in operator-facing UI
- No hardcoded client-specific values unless explicitly approved for seed/demo data
- No backend truth computed in UI
- No operational date logic from UTC/browser shortcuts

## Canonical Principle

If the UI needs to guess, the backend contract is incomplete.

If the assistant needs to guess, the file context is incomplete.

