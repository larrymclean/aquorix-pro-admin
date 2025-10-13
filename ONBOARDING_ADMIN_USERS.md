# AQUORIX Pro Admin Dashboard: Admin User Onboarding Guide

---

**File:** ONBOARDING_ADMIN_USERS.md  
**Path:** /aquorix-pro-admin/ONBOARDING_ADMIN_USERS.md  
**Description:** Step-by-step, living onboarding guide for enabling admin users in the AQUORIX Pro Admin Dashboard.  
**Author:** AQUORIX Engineering  
**Created:** 2025-07-07  
**Last Updated:** 2025-07-07  
**Status:** Living document, MVP-complete  
**Dependencies:** Supabase, AQUORIX Pro Admin codebase  
**Notes:** Update this doc with any future changes to onboarding, RBAC, or schema.  
**Change Log:**  
- 2025-07-07, AQUORIX Engineering: Initial creation (login/RLS/policy/user_profile flow)

---

## Purpose
Document the steps required to enable new admin users in AQUORIX Pro Admin Dashboard, ensuring repeatability and clarity for all team members.

---

## 1. Create or Invite the User
- Go to the **Supabase Dashboard** → **Authentication** → **Users**.
- Create a new user or invite via email.
- The user will appear in the list with a unique **User ID (UID)**.

---

## 2. Add User Profile Row
- Go to **Table Editor** → `user_profile`.
- Add a new row with:
  - `user_id`: (Paste the UID from Auth Users)
  - `role`: `admin`
  - (Add any other required fields per schema)

---

## 3. Verify Row Level Security (RLS) Policy
- Ensure RLS is enabled on `user_profile`.
- Confirm there is a policy allowing authenticated users to `SELECT` their own profile:
  ```sql
  CREATE POLICY "Allow users to read their own profile"
  ON public.user_profile
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
  ```

---

## 4. Test the Admin Login
- Log in as the new user via `/login`.
- Confirm successful routing to `/admin` dashboard.
- If a blank page or error occurs, verify:
  - The user has a `user_profile` row with the correct `user_id` and `role`.
  - Supabase credentials are correct in `.env`.

---

## 5. Troubleshooting Checklist
- **406 or blank page:** Usually means missing or misconfigured `user_profile` row or RLS policy.
- **No dashboard access:** Confirm the `role` is set to `admin` and matches the logic in `RequireAuth.tsx`.

---

## 6. Change Log
- 2025-07-07: Document created (login/RLS/policy/user_profile flow) — AQUORIX Engineering

---

### Notes
- Update this document whenever the onboarding flow, DB schema, or RBAC logic changes.
- For advanced RBAC, update both the policy and the `RequireAuth` logic.
