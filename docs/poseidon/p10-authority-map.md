# AQUORIX P10 Authority Map

Version: 0.1.0
Date: 2026-05-14
Status: ACTIVE - VIKING Full Cycle Validation
Owner: Larry McLean
Doctrine: Poseidon's Code

## Purpose

This document maps the active P10/VIKING surfaces, their authority files, and required verification commands.

## P10 Goal

Prove one complete operator loop:

Template / Session -> Dashboard -> Calendar -> Public Widget -> Booking -> Payment / Checkout -> Capacity -> Ops Board -> Internal Admin / Inspection

## Current Authority Surfaces

1. Pro Dashboard Overview
- src/features/dashboard/pages/OverviewPage.tsx
- src/styles/dashboard.css
- src/hooks/useDashboardSchedule.ts
- src/types/dashboardSchedule.ts

2. Schedule Page
- src/features/dashboard/pages/SchedulePage.tsx
- src/api/dashboardSchedule.ts
- src/hooks/useDashboardSchedule.ts
- src/types/dashboardSchedule.ts

3. Calendar V-Now
- src/features/dashboard/pages/CalendarPage.tsx
- src/App.tsx
- src/config/navigation.ts
- src/hooks/useDashboardSchedule.ts

4. Ops Board
- src/features/ops-board/OpsBoardApp.tsx
- src/features/ops-board/styles/opsBoard.css

5. Public Widget
- widget-embed/src/App.tsx
- widget-embed/src/lib/scheduleProvider.ts
- widget-embed/src/lib/itineraryTypes.ts

6. Bookings / Checkout
- src/features/dashboard/pages/BookingsPage.tsx
- src/features/dashboard/pages/BookingDetailPage.tsx
- backend booking/payment route files

7. Routing / Navigation
- src/App.tsx
- src/config/navigation.ts
- src/features/dashboard/ProDashboardShell.tsx
- src/components/SidebarNavigation.tsx

8. Operator-Local Date Authority
- OverviewPage.tsx
- SchedulePage.tsx
- OpsBoardApp.tsx
- useDashboardSchedule.ts
- backend schedule routes/services

## Mandatory Rules

- No guessed imports.
- No guessed route structure.
- No unapproved UI copy changes.
- No developer telemetry in operator-facing UI.
- No hardcoded operational counts.
- No backend truth computed in UI.
- No operational today logic from UTC/browser shortcuts.
- Build after every route/import/shared-component change.

## Known Current Warnings

Frontend build currently has two warnings:
- BookingDetailPage.tsx: labelDiveDatetime unused
- OpsBoardApp.tsx: lastRefreshedAt unused

These are cleanup tasks, not blockers.

## Immediate Execution Order

1. Restore/confirm build stability.
2. Lock Poseidon docs.
3. Complete Calendar V-Now.
4. Clean known warnings.
5. Standardize shared SessionCard.
6. Validate Blue Current vertical loop.
7. Validate widget/booking/checkout/capacity.
8. Validate Ops Board reflects same truth.
9. Add minimal Internal Admin inspection.
10. Prepare Nesima data/demo package.

## Master Rule

If the assistant needs to guess, file context is incomplete.

If the UI needs to guess, the backend contract is incomplete.
