/*
 * File: 2025-09-13_promote_onboarding_user.sql
 * Path: migrations/2025-09-13_promote_onboarding_user.sql
 * Description: Example SQL for promoting an onboarding user to a full user and pro_profile in AQUORIX.
 * Author: AQUORIX Engineering
 * Created: 2025-09-13
 * Status: Reference for backend implementation
 * Change Log:
 *   2025-09-13 AQUORIX Eng: Initial scaffold for onboarding promotion logic.
 */

-- Example: Insert into users and pro_profiles from onboarding_users
INSERT INTO aquorix.users (supabase_user_id, email, username, is_active, role, tier, created_at)
SELECT supabase_user_id, email, email, true, 'user', 1, NOW()
FROM aquorix.onboarding_users
WHERE supabase_user_id = $1;

INSERT INTO aquorix.pro_profiles (user_id, tier_level, onboarding_completed_at, onboarding_metadata, created_at, updated_at)
SELECT u.user_id, 1, NOW(), '{"current_step": 0, "completed_steps": [], "completion_percentage": 100}', NOW(), NOW()
FROM aquorix.users u
WHERE u.supabase_user_id = $1;

UPDATE aquorix.onboarding_users
SET has_completed_onboarding = TRUE
WHERE supabase_user_id = $1;
