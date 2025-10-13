-- File: migrations/2025-09-08_create_pro_profiles.sql
-- Description: Create the pro_profiles table for comprehensive onboarding and user management.
-- Author: AQUORIX Engineering
-- Created: 2025-09-08
-- Status: Initial migration for next-gen onboarding

CREATE TABLE IF NOT EXISTS aquorix.pro_profiles (
    user_id BIGINT UNIQUE REFERENCES aquorix.users(user_id) ON DELETE CASCADE,

    -- System Info
    tier_level INTEGER NOT NULL CHECK (tier_level BETWEEN 1 AND 5),
    dashboard_theme VARCHAR(50) DEFAULT 'default',
    business_name VARCHAR(255),
    logo_url TEXT,

    -- Pro Details (JSON for flexibility)
    phone VARCHAR(20) CHECK (phone ~ '^\+?[0-9\s\-\(\)\.]{7,20}$'),
    certifications JSONB,
    leadership_level VARCHAR(100),

    -- Business Details (conditional by tier)
    shop_details JSONB,
    affiliate_details JSONB,

    -- Metadata
    onboarding_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (user_id)
);

-- JSONB structure documentation:
-- certifications example:
--   {"agencies": [{"name": "PADI", "number": "123456", "level": "Instructor"}], "specialties": ["Advanced", "Rescue"]}
-- shop_details example:
--   {"locations": 3, "accommodations": true, "type": "resort", "capacity": 50}
-- affiliate_details example:
--   {"classification": "hotel", "ota_partner": true}

-- Username default logic: Application-level handling is recommended.
-- If you want DB-level enforcement, uncomment the following:
-- CREATE OR REPLACE FUNCTION set_default_username()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   IF NEW.username IS NULL THEN
--     NEW.username = NEW.email;
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER trigger_set_default_username
--   BEFORE INSERT OR UPDATE ON aquorix.pro_profiles
--   FOR EACH ROW
--   EXECUTE FUNCTION set_default_username();

-- Automatically update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pro_profiles_updated_at
  BEFORE UPDATE ON aquorix.pro_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- TODO: Add JSONB validation/check constraints for required fields per tier_level as onboarding logic evolves.
