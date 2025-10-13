/*
 * File: calendar-qa-tier-scenarios.md
 * Path: docs/calendar-qa-tier-scenarios.md
 * Description: QA requirements and seeded user/event scenarios for all AQUORIX calendar tiers as part of FullCalendar migration.
 * Author: AQUORIX Strategic Product Office
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: Draft
 * Dependencies: Supabase, FullCalendar, AQUORIX tier system
 * Notes: Use this as a reference for QA user/data seeding and scenario validation.
 * Change Log:
 *   - 2025-07-08, AQUORIX SPO: Initial draft for QA and seeded user scenarios.
 */

# Requirements for All Tier Scenarios (QA with Seeded Users)

This document defines the QA requirements and representative scenarios for each AQUORIX tier. Use these as guidance for user seeding, event data prep, and QA validation during the FullCalendar migration.

---

## Tier 1–2: Basic User
- **User Persona:** Dive/Course participant or instructor
- **Capabilities:**
  - View own events (dives, courses)
  - Add/cancel own events
  - Cannot edit or view other users’ events
- **QA Scenarios:**
  - User logs in, sees only their events on calendar
  - User creates a new event; event appears in calendar
  - User cancels an event; event is removed
  - Cannot drag/drop or edit events not owned

---

## Tier 3: Scheduler/Manager
- **User Persona:** Dive shop manager, lead instructor
- **Capabilities:**
  - View all events for their shop/team
  - Drag/drop to reschedule events
  - Filter events by instructor or dive type
  - Add/cancel/edit any event in their scope
- **QA Scenarios:**
  - User sees all shop/team events
  - User drags event to new time/resource; update persists
  - User filters by instructor; calendar updates accordingly
  - User edits event details via modal

---

## Tier 4: Admin/Resource Coordinator
- **User Persona:** Fleet manager, operations admin
- **Capabilities:**
  - Multi-resource scheduling (boats, rooms, crew)
  - Access to timeline/timeGrid views
  - Assign resources to events
  - Full CRUD on all events/resources
- **QA Scenarios:**
  - User switches to timeline/resource view
  - User assigns boat/room/crew to event
  - User creates multi-day/overnight events
  - User sees and manages all events/resources

---

## Tier 5: Concierge/Read-Only
- **User Persona:** Concierge, reporting user
- **Capabilities:**
  - Read-only access to all events
  - Print/export calendar
  - Apply advanced filters (e.g., by guest, by vessel)
- **QA Scenarios:**
  - User cannot create/edit/delete events
  - User prints or exports calendar successfully
  - User applies filters; calendar updates

---

## Seeded User/Data Prep Guidance
- At least one user per tier (with unique email and tier claim)
- At least one event for each user/tier, with a mix of:
  - Single-day and multi-day events
  - Different resources (boats, rooms, instructors)
  - Various event types (dive, course, block, internal, guest)

---

*End of document – Use as QA reference for FullCalendar migration.*
