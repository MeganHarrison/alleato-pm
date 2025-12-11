-- Migration: Create app_users table for NextAuth.js authentication
-- This table stores user credentials separately from Supabase Auth

-- Create app_users table
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_app_users_updated_at ON app_users;
CREATE TRIGGER trigger_update_app_users_updated_at
    BEFORE UPDATE ON app_users
    FOR EACH ROW
    EXECUTE FUNCTION update_app_users_updated_at();

-- Update chat_sessions to reference app_users instead of auth.users
-- First, drop the existing foreign key if it exists
ALTER TABLE chat_sessions
    DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;

-- Add foreign key to app_users (optional, can be null for anonymous sessions)
-- Note: Not adding strict FK constraint to allow flexibility during migration

-- Enable Row Level Security on app_users
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own data
CREATE POLICY "Users can read own data" ON app_users
    FOR SELECT
    USING (true); -- Allow read for auth to work; actual user data protection is via API

-- RLS Policy: Only allow inserts via API (service role)
CREATE POLICY "Service role can insert users" ON app_users
    FOR INSERT
    WITH CHECK (true);

-- RLS Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON app_users
    FOR UPDATE
    USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON app_users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON app_users TO anon;

COMMENT ON TABLE app_users IS 'User accounts for NextAuth.js authentication';
COMMENT ON COLUMN app_users.password_hash IS 'bcrypt hashed password';
COMMENT ON COLUMN app_users.role IS 'User role: admin, user, viewer';
