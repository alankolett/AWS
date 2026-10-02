CREATE TABLE IF NOT EXISTS team_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_section_id UUID REFERENCES team_sections(id) ON DELETE SET NULL;

ALTER TABLE team_sections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view team sections" ON team_sections;
    DROP POLICY IF EXISTS "Admins can manage team sections" ON team_sections;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can view team sections" ON team_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage team sections" ON team_sections FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
);

-- Seed some default empty sections for the CMS
INSERT INTO team_sections (name, order_index)
SELECT 'Core Leadership', 1 WHERE NOT EXISTS (SELECT 1 FROM team_sections WHERE name = 'Core Leadership');
INSERT INTO team_sections (name, order_index)
SELECT 'Developer Team', 2 WHERE NOT EXISTS (SELECT 1 FROM team_sections WHERE name = 'Developer Team');
INSERT INTO team_sections (name, order_index)
SELECT 'Cloud Architects', 3 WHERE NOT EXISTS (SELECT 1 FROM team_sections WHERE name = 'Cloud Architects');
