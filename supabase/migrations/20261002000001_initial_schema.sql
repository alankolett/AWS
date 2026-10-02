-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create Enums
CREATE TYPE user_role AS ENUM ('admin', 'member', 'student');

-- Create Profiles Table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    builder_id TEXT UNIQUE,
    full_name TEXT,
    headline TEXT,
    branch TEXT,
    year TEXT,
    bio TEXT,
    quote TEXT,
    banner_url TEXT,
    avatar_url TEXT,
    certifications JSONB DEFAULT '[]'::jsonb,
    badges JSONB DEFAULT '[]'::jsonb,
    skills TEXT[] DEFAULT '{}'::text[],
    projects JSONB DEFAULT '[]'::jsonb,
    linkedin_url TEXT,
    github_url TEXT,
    is_lead BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admins can insert profiles
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
);

-- Admins can delete all profiles
CREATE POLICY "Admins can delete all profiles" ON profiles FOR DELETE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
);

-- Function to handle new user registration from auth.users to profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert root admin user (if not exists)
DO $$
DECLARE
    root_uid UUID := gen_random_uuid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'meghani.laksh@gmail.com') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at, confirmation_token, email_change, 
            email_change_token_new, recovery_token
        ) VALUES (
            root_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'meghani.laksh@gmail.com', crypt('rootadmin', gen_salt('bf')),
            NOW(), '{"provider":"email","providers":["email"]}', '{}',
            NOW(), NOW(), '', '', '', ''
        );
        
        -- update the profile role to admin since trigger already creates it
        UPDATE public.profiles SET role = 'admin', full_name = 'Laksh Meghani', headline = 'Root Administrator' WHERE id = root_uid;
    END IF;
END $$;
