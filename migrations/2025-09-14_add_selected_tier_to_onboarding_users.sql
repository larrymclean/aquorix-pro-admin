-- File: migrations/2025-09-14_add_selected_tier_to_onboarding_users.sql
-- Description: Add selected_tier column to onboarding_users for capturing user tier selection during onboarding.
-- Author: AQUORIX Engineering
-- Created: 2025-09-14
-- Status: Ready for onboarding tier tracking
-- Change Log:
--   2025-09-14 AQUORIX Eng: Add selected_tier column for onboarding flow.

ALTER TABLE aquorix.onboarding_users
ADD COLUMN IF NOT EXISTS selected_tier user_tier;
