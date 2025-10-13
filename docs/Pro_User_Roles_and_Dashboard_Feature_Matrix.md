# AQUORIX Pro User Roles & Dashboard Feature Mapping

---
**File:** Pro_User_Roles_and_Dashboard_Feature_Matrix.md  
**Path:** docs/Pro_User_Roles_and_Dashboard_Feature_Matrix.md  
**Description:** Canonical list of pro user roles by tier and mapping to dashboard features/permissions. Locked for RBAC, onboarding, and UI/UX implementation.  
**Author:** AQUORIX Engineering  
**Created:** 2025-07-11  
**Last Updated:** 2025-07-11  
**Status:** Approved, system standard  
**Dependencies:** AQUORIX Pro Admin Dashboard (MVP), onboarding, RBAC  
**Notes:** This document is the single source of truth for all user role and dashboard feature logic.  
**Change Log:**
- 2025-07-11 (AQUORIX Eng): Initial draft and approval by PM. Billing permissions clarified and locked.
- 2025-07-11 (AQUORIX Eng): Analytics/reporting permissions mapped and approved by PM.
- 2025-07-11 (AQUORIX Eng): Calendar/scheduling permissions mapped and approved by PM; staff can view all staff-assigned bookings, edit own only.
- 2025-07-11 (AQUORIX Eng): Client/guest management permissions mapped and approved by PM.
- 2025-07-11 (AQUORIX Eng): Booking management permissions mapped and approved by PM.
- 2025-07-11 (AQUORIX Eng): Settings/org management permissions mapped and approved by PM.
- 2025-07-11 (AQUORIX Eng): Staff/team management & invitations permissions mapped and approved by PM.
- 2025-07-11 (AQUORIX Eng): Impersonation/elevated access permissions mapped and approved by PM.

---

## Canonical Role List by Tier

| Tier | User Type                | Canonical Roles (user_profile.role)             |
|------|--------------------------|-------------------------------------------------|
| 0    | Internal Administrative  | admin, support, moderator, dev, exec            |
| 1    | Solo Pro (Free)          | pro_user                                        |
| 2    | Solo Pro (Paid)          | pro_user                                        |
| 3    | Dive Center (Basic)      | owner, manager, staff                           |
| 4    | Complex Operator         | owner, ops_manager, hospitality_manager, staff  |
| 5    | Affiliate/Agent          | concierge, agent                                |
| —    | Consumer/Non-Pro         | consumer                                        |

---

## Dashboard Feature Mapping Matrix

| Tier | Role                | Dashboard Type         | Core Features/Permissions                                                                                      |
|------|---------------------|-----------------------|----------------------------------------------------------------------------------------------------------------|
| 0    | admin               | Internal Admin        | Full system admin, impersonation, all dashboards, user management, audit logs, settings                        |
| 0    | support             | Support/Admin         | Support dashboard, user lookup, ticketing, limited impersonation, no system settings                           |
| 0    | moderator           | Moderator/Admin       | Moderation tools, user/content flag review, limited user lookup                                                |
| 0    | dev                 | DevOps/Admin          | System logs, feature flags, deploys, DB tools, no user support                                                 |
| 0    | exec                | Executive/Admin       | Business analytics, all dashboards read-only, user management                                                  |
| 1/2  | pro_user            | Solo Pro Dash         | Bookings, calendar, client mgmt, profile, payments, analytics, dive logs, limited settings                     |
| 3    | owner               | Dive Center Dash      | All org bookings, user mgmt (invite/assign roles), analytics, billing, settings, team calendar                 |
| 3    | manager             | Dive Center Dash      | Bookings, team calendar, staff mgmt (no billing), analytics, daily ops                                         |
| 3    | staff               | Dive Center Dash      | Assigned bookings, personal calendar, limited client info, no analytics/settings                               |
| 4    | owner               | Complex Ops Dash      | All org features (see Tier 3), plus fleet/hospitality mgmt, full settings                                      |
| 4    | ops_manager         | Complex Ops Dash      | Fleet mgmt, all bookings, staff mgmt, analytics, limited settings                                              |
| 4    | hospitality_manager | Complex Ops Dash      | Hotel/BnB bookings, guest mgmt, hospitality analytics, no fleet or ops settings                                |
| 4    | staff               | Complex Ops Dash      | Assigned bookings/tasks, personal calendar, guest check-in, no analytics/settings                              |
| 5    | concierge           | Affiliate Dash        | Hotel bookings, guest lookup, referral mgmt, affiliate analytics, limited settings                             |
| 5    | agent               | Affiliate Dash        | OTA bookings, guest lookup, referral mgmt, affiliate analytics, limited settings                               |
| —    | consumer            | N/A                   | No dashboard access; consumer-facing app/site only                                                             |

---

### Impersonation & Elevated Access Permissions (Locked)

| Tier | Role                | Impersonation/Elevated Access                                  |
|------|---------------------|---------------------------------------------------------------|
| 0    | admin               | Full impersonation: any user, any org/tier                    |
| 0    | exec                | View-as-any-user (read-only, no destructive actions)          |
| 0    | support             | Limited impersonation: view-as for support context only       |
| 0    | moderator, dev      | None                                                          |
| 1/2  | pro_user            | None                                                          |
| 3    | owner               | None                                                          |
| 3    | manager             | None                                                          |
| 3    | staff               | None                                                          |
| 4    | owner               | None                                                          |
| 4    | ops_manager         | None                                                          |
| 4    | hospitality_manager | None                                                          |
| 4    | staff               | None                                                          |
| 5    | concierge, agent    | None                                                          |
| —    | consumer            | None                                                          |

---

### Staff/Team Management & Invitations Permissions (Locked)

| Tier | Role                | Staff/Team Management Access                                  |
|------|---------------------|--------------------------------------------------------------|
| 0    | admin, exec         | Full staff/team management (all orgs/units)                  |
| 0    | support, moderator  | View/search for support context                              |
| 1/2  | pro_user            | None                                                         |
| 3    | owner               | Full staff/team management (invite, assign roles, remove)    |
| 3    | manager             | Invite staff, assign roles (limited to team scope)           |
| 3    | staff               | None                                                         |
| 4    | owner               | Full staff/team management (all sub-units)                   |
| 4    | ops_manager         | Invite/manage ops staff (assign roles, remove)               |
| 4    | hospitality_manager | Invite/manage hospitality staff (assign roles, remove)        |
| 4    | staff               | None                                                         |
| 5    | concierge, agent    | None                                                         |
| —    | consumer            | None                                                         |

---

### Settings & Organization Management Permissions (Locked)

| Tier | Role                | Settings/Org Management Access                                  |
|------|---------------------|----------------------------------------------------------------|
| 0    | admin, exec         | Full system/org settings, platform-wide management              |
| 0    | support, moderator  | View only (for support context)                                |
| 1/2  | pro_user            | Manage own profile/settings, business info                     |
| 3    | owner               | Full org settings (billing, team, branding, integrations)      |
| 3    | manager             | Manage team settings, staff invites, limited org settings      |
| 3    | staff               | Manage own profile/settings only                               |
| 4    | owner               | Full org/fleet/hospitality settings (all sub-units)            |
| 4    | ops_manager         | Manage ops/fleet settings, staff invites                       |
| 4    | hospitality_manager | Manage hospitality settings, staff invites                     |
| 4    | staff               | Manage own profile/settings only                               |
| 5    | concierge, agent    | Manage own profile/settings only                               |
| —    | consumer            | None                                                           |

---

### Booking Management Permissions (Locked)

| Tier | Role                | Booking Management Access                                    |
|------|---------------------|-------------------------------------------------------------|
| 0    | admin, exec         | Full access to all bookings (view/create/edit/delete)        |
| 0    | support, moderator  | View/search all bookings for support/ticketing              |
| 1/2  | pro_user            | Full control of own bookings (add/edit/cancel)              |
| 3    | owner               | Full org booking management (all staff/clients)             |
| 3    | manager             | Manage all org bookings (add/edit/cancel)                   |
| 3    | staff               | View all org bookings; edit/cancel only those assigned to them|
| 4    | owner               | Full org/fleet/hospitality booking management               |
| 4    | ops_manager         | Manage all ops/fleet bookings (add/edit/cancel)             |
| 4    | hospitality_manager | Manage all hospitality bookings (add/edit/cancel)           |
| 4    | staff               | View all org bookings; edit/cancel only those assigned to them|
| 5    | concierge, agent    | Manage their own bookings (add/edit/cancel)                 |
| —    | consumer            | None                                                        |

---

### Client/Guest Management Permissions (Locked)

| Tier | Role                | Client/Guest Management Access                                  |
|------|---------------------|----------------------------------------------------------------|
| 0    | admin, exec         | Full access to all client/guest profiles and orgs              |
| 0    | support, moderator  | View/search all client/guest profiles for support/ticketing    |
| 1/2  | pro_user            | Manage their own client list (add/edit/view/delete)            |
| 3    | owner               | Full org client/guest management (all staff/clients)           |
| 3    | manager             | Manage all org clients/guests (add/edit/view/delete)           |
| 3    | staff               | View all org clients/guests; edit only those assigned to them  |
| 4    | owner               | Full org/fleet/hospitality client/guest management             |
| 4    | ops_manager         | Manage all ops clients/guests (fleet, dive ops, etc.)          |
| 4    | hospitality_manager | Manage all hospitality guests (add/edit/view/delete)           |
| 4    | staff               | View all org clients/guests; edit only those assigned to them  |
| 5    | concierge, agent    | Manage their own guest/booking list (add/edit/view/delete)     |
| —    | consumer            | None                                                           |

---

### Calendar/Scheduling Permissions (Locked)

| Tier | Role                | Calendar/Scheduling Access                                                |
|------|---------------------|--------------------------------------------------------------------------|
| 0    | admin, exec         | View/manage all org/team calendars                                       |
| 0    | support, moderator  | View only (for support/ticketing context)                                |
| 1/2  | pro_user            | Full personal calendar, booking management                               |
| 3    | owner               | Org/team calendar (all bookings, all staff)                              |
| 3    | manager             | Team calendar (all staff, assigned bookings)                             |
| 3    | staff               | View all staff-assigned bookings; edit own assigned bookings/tasks only   |
| 4    | owner               | Org/fleet/hospitality calendars (all sub-units)                          |
| 4    | ops_manager         | Fleet calendar (boats, vehicles), all ops staff                          |
| 4    | hospitality_manager | Hospitality calendar (rooms, guest check-in/out)                         |
| 4    | staff               | View all staff-assigned bookings; edit own assigned bookings/tasks only   |
| 5    | concierge, agent    | Affiliate calendar (own bookings, guest arrivals/departures)             |
| —    | consumer            | None                                                                     |

---

### Analytics/Reporting Permissions (Locked)

| Tier | Role                | Analytics/Reporting Access                                |
|------|---------------------|----------------------------------------------------------|
| 0    | admin, exec         | Full analytics (all orgs, all tiers, business ops)       |
| 0    | support, moderator  | Limited (support/usage dashboards)                       |
| 1/2  | pro_user            | Own bookings, revenue, client stats                      |
| 3    | owner               | Org-wide analytics (bookings, revenue, clients, staff)   |
| 3    | manager             | Team analytics (bookings, ops, staff performance)        |
| 3    | staff               | None                                                     |
| 4    | owner               | Org/fleet/hospitality analytics, all sub-units           |
| 4    | ops_manager         | Fleet/ops analytics, staff performance                   |
| 4    | hospitality_manager | Hospitality analytics (room nights, guest stats)         |
| 4    | staff               | None                                                     |
| 5    | concierge, agent    | Affiliate analytics (referrals, bookings, guest stats)   |
| —    | consumer            | None                                                     |

---

### Billing Permissions (Locked)

| Tier | Role                | Billing Access                                                      |
|------|---------------------|---------------------------------------------------------------------|
| 3    | owner               | Full org billing: subscription, payment methods, all invoices       |
| 3    | manager             | View-only client/guest payments/invoices, no org subscription mgmt  |
| 3    | staff               | None                                                                |
| 4    | owner               | Full org billing: subscription, payment methods, all invoices       |
| 4    | ops_manager         | View all org/client payments, generate invoices, no subscription mgmt|
| 4    | hospitality_manager | Hospitality transactions/invoices only, no org-level billing         |
| 4    | staff               | None                                                                |

---

**All other feature access is strictly as mapped above. No billing or commission info is ever exposed to staff.**

---

**This document is the single source of truth for AQUORIX RBAC, onboarding, and dashboard logic.**
