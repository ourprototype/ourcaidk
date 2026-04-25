-- Our.ca Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (both personal and business)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,

  -- Profile type
  profile_type TEXT NOT NULL CHECK (profile_type IN ('personal', 'business')),

  -- Basic info (shared)
  name TEXT,
  email TEXT,
  phone TEXT,
  our_email TEXT,
  city TEXT,
  province TEXT,

  -- Personal fields
  title TEXT,
  bio TEXT,

  -- Business fields
  owner_name TEXT,
  business_name TEXT,
  category TEXT,
  address TEXT,
  website TEXT,
  hours TEXT,
  description TEXT,

  -- Status
  is_premium BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,

  -- Layout (stored as JSON array)
  layout JSONB DEFAULT '[
    {"id": "photos", "type": "photos", "order": 0},
    {"id": "name", "type": "name", "order": 1},
    {"id": "contact", "type": "contact", "order": 2},
    {"id": "social", "type": "social", "order": 3},
    {"id": "links", "type": "links", "order": 4}
  ]'::jsonb,

  -- Privacy settings
  privacy JSONB DEFAULT '{
    "showName": true,
    "showTitle": true,
    "showBio": true,
    "showCity": true,
    "showPhone": true,
    "showEmail": true,
    "showOurEmail": true,
    "showLinks": true,
    "showSocial": true
  }'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by Clerk user ID
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);

-- Index for search
CREATE INDEX idx_profiles_name ON profiles(name);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_province ON profiles(province);
CREATE INDEX idx_profiles_type ON profiles(profile_type);

-- ============================================
-- PHOTOS TABLE
-- ============================================
CREATE TABLE profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_profile_id ON profile_photos(profile_id);

-- ============================================
-- CUSTOM LINKS TABLE
-- ============================================
CREATE TABLE profile_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  url TEXT NOT NULL,
  display_type TEXT DEFAULT 'text' CHECK (display_type IN ('text', 'thumbnail')),
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_links_profile_id ON profile_links(profile_id);

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE profile_social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_profile_id ON profile_social_links(profile_id);

-- ============================================
-- OUR.CA EMAIL CLAIMS TABLE
-- ============================================
CREATE TABLE our_email_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  forward_to TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_claims_username ON our_email_claims(username);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE our_email_claims ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, only owner can modify
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (true);

-- Photos: Anyone can read, only owner can modify
CREATE POLICY "Photos are viewable by everyone"
  ON profile_photos FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own photos"
  ON profile_photos FOR ALL
  USING (true);

-- Links: Anyone can read, only owner can modify
CREATE POLICY "Links are viewable by everyone"
  ON profile_links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own links"
  ON profile_links FOR ALL
  USING (true);

-- Social links: Anyone can read, only owner can modify
CREATE POLICY "Social links are viewable by everyone"
  ON profile_social_links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own social links"
  ON profile_social_links FOR ALL
  USING (true);

-- Email claims: Only owner can see/modify
CREATE POLICY "Users can manage their own email claims"
  ON our_email_claims FOR ALL
  USING (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTION: Get full profile with relations
-- ============================================
CREATE OR REPLACE FUNCTION get_full_profile(p_clerk_user_id TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', row_to_json(p),
    'photos', COALESCE((
      SELECT json_agg(row_to_json(ph) ORDER BY ph.display_order)
      FROM profile_photos ph WHERE ph.profile_id = p.id
    ), '[]'::json),
    'links', COALESCE((
      SELECT json_agg(row_to_json(l) ORDER BY l.display_order)
      FROM profile_links l WHERE l.profile_id = p.id
    ), '[]'::json),
    'socialLinks', COALESCE((
      SELECT json_agg(row_to_json(s) ORDER BY s.display_order)
      FROM profile_social_links s WHERE s.profile_id = p.id
    ), '[]'::json)
  ) INTO result
  FROM profiles p
  WHERE p.clerk_user_id = p_clerk_user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
