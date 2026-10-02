-- Helper function to check if auth.uid() is an admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
$$;

-- Add event detail columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS prerequisites TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS post_event_photo_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS post_event_text TEXT;

-- Add profile columns for full member customization
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS division TEXT;

-- Update RLS for events
DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins have full access to events" ON events;
    DROP POLICY IF EXISTS "Admins can manage events" ON events;
    DROP POLICY IF EXISTS "Admins can insert events" ON events;
    DROP POLICY IF EXISTS "Admins can update events" ON events;
    DROP POLICY IF EXISTS "Admins can delete events" ON events;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
    public.is_admin()
) WITH CHECK (
    public.is_admin()
);

-- Update RLS for profiles
DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
    DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
    public.is_admin()
) WITH CHECK (
    public.is_admin()
);

-- Seed pinned_founder_id setting if not exists
INSERT INTO site_settings (key, value)
VALUES ('pinned_founder_id', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;
