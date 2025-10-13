-- File: migrations/2025-09-11_add_onboarding_metadata_to_pro_profiles.sql
-- Description: Add onboarding_metadata column to aquorix.pro_profiles and backfill with default structure.
-- Author: AQUORIX Engineering
-- Created: 2025-09-11
-- Status: Migration for onboarding state tracking

ALTER TABLE aquorix.pro_profiles
ADD COLUMN IF NOT EXISTS onboarding_metadata JSONB DEFAULT '{
  "current_step": 0,
  "completed_steps": [],
  "started_at": null,
  "last_activity": null,
  "completion_percentage": 0
}';

-- Backfill for existing rows (in case column is added to a non-empty table)
UPDATE aquorix.pro_profiles
SET onboarding_metadata = '{
  "current_step": 0,
  "completed_steps": [],
  "started_at": null,
  "last_activity": null,
  "completion_percentage": 0
}'
WHERE onboarding_metadata IS NULL;
