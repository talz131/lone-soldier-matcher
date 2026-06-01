-- Lone Soldier Host Family Matcher — Database Schema
-- Run this in your Supabase SQL editor

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE soldiers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,

  -- Step 1: Personal Info
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  date_of_birth   DATE,
  country_of_origin TEXT,

  -- Step 2: Situation
  base_location   TEXT,
  unit            TEXT,
  service_type    TEXT,
  languages       JSONB DEFAULT '[]',
  hebrew_level    TEXT,

  -- Step 3: Preferences
  religious_observance TEXT,
  family_vibe     JSONB DEFAULT '[]',
  pets_ok         BOOLEAN DEFAULT TRUE,
  has_dietary_restrictions BOOLEAN DEFAULT FALSE,
  dietary_details TEXT,

  -- Step 4: Verification
  military_id_url TEXT,

  -- Admin
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','declined','matched')),
  admin_notes     TEXT
);

CREATE TABLE host_families (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,

  -- Step 1: Contact
  contact_name    TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  city            TEXT,
  neighborhood    TEXT,

  -- Step 2: Household
  family_size     INTEGER,
  has_children    BOOLEAN DEFAULT FALSE,
  children_ages   TEXT,
  living_situation TEXT,
  available_space TEXT,

  -- Step 3: Offerings
  can_offer_room       BOOLEAN DEFAULT FALSE,
  can_offer_meals      BOOLEAN DEFAULT FALSE,
  meal_frequency       TEXT,
  can_offer_activities BOOLEAN DEFAULT FALSE,
  activities_description TEXT,
  can_offer_laundry    BOOLEAN DEFAULT FALSE,
  can_offer_shabbat    BOOLEAN DEFAULT FALSE,
  religious_observance TEXT,
  pets                 TEXT,
  additional_notes     TEXT,

  -- Step 4: Reference
  reference_name         TEXT,
  reference_phone        TEXT,
  reference_relationship TEXT,

  -- Admin
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','declined','matched')),
  admin_notes   TEXT
);

CREATE TABLE matches (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  soldier_id  UUID REFERENCES soldiers(id) ON DELETE CASCADE,
  family_id   UUID REFERENCES host_families(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  notes       TEXT
);

CREATE TABLE flags (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  entity_type  TEXT NOT NULL CHECK (entity_type IN ('soldier','family')),
  entity_id    UUID NOT NULL,
  flag_type    TEXT CHECK (flag_type IN ('concern','follow_up','note','red_flag')),
  description  TEXT NOT NULL,
  resolved     BOOLEAN DEFAULT FALSE,
  resolved_at  TIMESTAMPTZ
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE soldiers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags        ENABLE ROW LEVEL SECURITY;

-- Public can register (INSERT only)
CREATE POLICY "Public can register as soldier"
  ON soldiers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can register as family"
  ON host_families FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access to soldiers"
  ON soldiers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to families"
  ON host_families FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to matches"
  ON matches FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to flags"
  ON flags FOR ALL USING (auth.role() = 'authenticated');

-- ─── Storage ──────────────────────────────────────────────────────────────────
-- Run this after creating the tables:

-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('military-ids', 'military-ids', false);

-- CREATE POLICY "Anyone can upload military ID"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'military-ids');

-- CREATE POLICY "Admin can view military IDs"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'military-ids' AND auth.role() = 'authenticated');

-- ─── Notes ────────────────────────────────────────────────────────────────────
-- To create an admin user:
--   1. Go to Supabase dashboard → Authentication → Users
--   2. Click "Add user" and create a user with email + password
--   3. Use those credentials to log in at /admin/login
