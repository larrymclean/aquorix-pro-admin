-- File: migrations/2025-09-13_create_onboarding_users.sql
-- Description: Create onboarding_users table for onboarding flow isolation from production users
-- Author: AQUORIX Engineering
-- Created: 2025-09-13
-- Status: Ready for onboarding integration

CREATE TABLE IF NOT EXISTS aquorix.onboarding_users (
    id SERIAL PRIMARY KEY,
    supabase_user_id UUID UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    onboarding_step INTEGER DEFAULT 1,
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_onboarding_users_supabase_user_id
    ON aquorix.onboarding_users (supabase_user_id);
