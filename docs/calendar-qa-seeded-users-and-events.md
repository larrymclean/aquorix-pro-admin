/*
 * File: calendar-qa-seeded-users-and-events.md
 * Path: docs/calendar-qa-seeded-users-and-events.md
 * Description: Complete reference for seeded users and sample event data for QA testing across all AQUORIX calendar tiers (1–5) for FullCalendar rollout.
 * Author: AQUORIX Strategic Product Office
 * Created: 2025-07-08
 * Last Updated: 2025-07-08
 * Status: Final
 * Dependencies: Supabase, FullCalendar, AQUORIX tier system
 * Notes: Use to validate QA scenarios and seed baseline data for FullCalendar migration.
 * Change Log:
 *   - 2025-07-08, AQUORIX SPO: Initial version for QA and engineering kickoff.
 */

# AQUORIX Calendar QA: Seeded Users & Scenario Coverage

**Version:** 1.0  
**Date:** July 8, 2025  
**Prepared By:** AQUORIX Strategic Product Office  
**Audience:** QA, DevOps, Windsurf, and Engineering Teams

---

## Purpose
This document lists all required seeded users and sample event data for QA testing across all AQUORIX tiers (1–5). Where possible, existing fictional users and operators are reused. Any missing personas are created as needed.

---

## ✅ Tier 1–2: Solo Pro & Entrepreneur
| Tier | Name                | Role                    | Email                | Notes                                   |
|------|---------------------|-------------------------|----------------------|-----------------------------------------|
| 1    | Riley Carson  | Instructor              | riley@aquorix.pro    | Existing persona – Instructor in Indonesia (Siladen Resort) |
| 2    | Maya Navarro        | Photo Pro Entrepreneur  | maya@aquorix.pro     | Existing persona – Belize-based underwater photographer |

**Seeded Events**
- Riley: SSI Open Water class (July 9), personal shore dive (July 10)
- Maya: Photography tour (July 11), land tour promo session (July 12)

**QA Checklist**
- Riley can view only her events
- Maya can add/edit/delete her events
- Neither can access the other’s calendar
- Event created appears instantly on calendar

---

## ✅ Tier 3: Dive Center Operator
| Tier | Name           | Role                | Email                | Notes                                |
|------|----------------|---------------------|----------------------|--------------------------------------|
| 3    | Fatima Yusuf   | Dive Center Manager | fatima@zanzibarblue.pro | Existing – Zanzibar Blue Dive Center |
| 3    | Juma Khalfan   | Dive Ops Manager    | juma@zanzibarblue.pro  | Existing – Resource scheduler for boat dives |

**Seeded Events**
- Boat dive (Coral Queen) with Riley & 4 clients (July 11)
- SSI Advanced Adventurer with instructor Maya (July 12–13)
- Gear rental block and trailer dispatch event (July 12)

**QA Checklist**
- View all dive center events
- Drag/drop updates reflected instantly
- Filter by instructor works correctly
- Event modals allow edit/cancel functionality

---

## ✅ Tier 4: Complex Operator Admin
| Tier | Name                | Role             | Email                 | Notes                                  |
|------|---------------------|------------------|-----------------------|----------------------------------------|
| 4    | Layla Al-Mutairi    | Ops Director     | layla@redseareef.pro  | Existing – Red Sea Reef Expeditions (multi-vessel operator) |
| 4    | Captain Omar Jibril | Fleet Scheduler  | omar@redseareef.pro   | New persona – Resource controller for vessel operations |

**Seeded Events**
- 3-day liveaboard charter (July 14–17) on Blue Fin with full crew
- Shore dive tour with equipment resupply (July 15)
- Room turnover and B&B event block (July 13)

**QA Checklist**
- Timeline view shows vessels and crew
- Events assigned with correct resource IDs
- Multi-day events span properly across calendar
- Admins have full CRUD access

---

## ✅ Tier 5: Concierge User
| Tier | Name           | Role              | Email                    | Notes                                    |
|------|----------------|-------------------|--------------------------|------------------------------------------|
| 5    | Kareem Taha    | Hotel Concierge   | kareem@obhurresort.dev   | New persona – Partner lodge concierge in North Obhur, Jeddah |
| 5    | Selina Mehta   | Travel Desk Agent | selina@globalblue.dev    | New persona – Partner agency referring Tier 1–4 bookings |

**Seeded Access**
- Full calendar view filtered by partner dive centers (Zanzibar Blue, Red Sea Reef)
- Concierge QR tracking for Riley and Maya’s referral links
- Filter-by-guest enabled for Obhur bookings

**QA Checklist**
- Calendar is read-only
- Filters by guest, date, and resource work
- User can print and export calendar
- No editing options are available in UI

---

## Summary Table: Event Coverage
| Event Type      | Dates         | Resources                                 |
|-----------------|--------------|-------------------------------------------|
| Dive Tour       | July 10–17   | Coral Queen, Blue Fin, Trailer A          |
| Course          | July 9–13    | Riley, Maya, classroom B                  |
| Guest Booking   | July 14–16   | Rooms 1–3, B&B partner                    |
| Internal Ops    | July 13–15   | Gear logistics, fleet scheduling          |
| Concierge Views | July 10–17   | Referral flags, export test               |

---

## QA Data Import Notes
- Seed users into Supabase with tier and role claims
- Insert calendar events via Supabase SQL seed or admin panel
- Use appropriate resource_ids for boats, instructors, rooms
- Include `extendedProps.tier` and tags for filtering logic

---

## SQL for Seeding Users (example)
May need to be refactored for Supabase schema.
```sql
INSERT INTO users (name, email, tier, role) VALUES ('Riley Anika Carson', 'riley@aquorix.dev', 1, 'Instructor');
INSERT INTO users (name, email, tier, role) VALUES ('Maya Navarro', 'maya@aquorix.dev', 2, 'Photo Pro Entrepreneur');
INSERT INTO users (name, email, tier, role) VALUES ('Fatima Yusuf', 'fatima@zanzibarblue.dev', 3, 'Dive Center Manager');
INSERT INTO users (name, email, tier, role) VALUES ('Juma Khalfan', 'juma@zanzibarblue.dev', 3, 'Dive Ops Manager');
INSERT INTO users (name, email, tier, role) VALUES ('Layla Al-Mutairi', 'layla@redseareef.dev', 4, 'Ops Director');
INSERT INTO users (name, email, tier, role) VALUES ('Captain Omar Jibril', 'omar@redseareef.dev', 4, 'Fleet Scheduler');
INSERT INTO users (name, email, tier, role) VALUES ('Kareem Taha', 'kareem@obhurresort.dev', 5, 'Hotel Concierge');
INSERT INTO users (name, email, tier, role) VALUES ('Selina Mehta', 'selina@globalblue.dev', 5, 'Travel Desk Agent');
```

---

*End of document – Use to validate QA scenarios and seed baseline data for FullCalendar rollout.*
