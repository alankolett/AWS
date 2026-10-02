CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
    DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON site_settings FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
);

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
('hero_section', '{"title": "Architect the Cloud.\\nBuild at SSPU.", "subtitle": "The official AWS Student Builder Group at Symbiosis Skills and Professional University. Preparing student engineers through hands-on architectural sprints, cloud security labs, and official AWS certification pathways."}'::jsonb),
('pinned_event_id', '""'::jsonb),
('pinned_founder_id', '""'::jsonb),
('meetup_link', '"https://meetup.com/"'::jsonb)
ON CONFLICT (key) DO NOTHING;
