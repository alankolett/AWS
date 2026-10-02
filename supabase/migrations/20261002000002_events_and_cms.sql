CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    time_range TEXT NOT NULL,
    location TEXT NOT NULL,
    speaker_name TEXT NOT NULL,
    speaker_role TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    total_seats INTEGER NOT NULL,
    seats_remaining INTEGER NOT NULL,
    description TEXT,
    banner_templates JSONB DEFAULT '[]'::jsonb,
    is_past BOOLEAN DEFAULT false,
    post_event_notes TEXT,
    slides_url TEXT,
    recording_url TEXT,
    github_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    prn TEXT NOT NULL,
    student_name TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, prn)
);

CREATE TABLE cms_content (
    section_key TEXT PRIMARY KEY,
    content_payload JSONB NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Admins have full access to events" ON events
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'::public.user_role));

CREATE POLICY "Public can view rsvps" ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "Public can create rsvps" ON event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins have full access to rsvps" ON event_rsvps
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'::public.user_role));

CREATE POLICY "Public can read cms" ON cms_content FOR SELECT USING (true);
CREATE POLICY "Admins have full access to cms" ON cms_content
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'::public.user_role));
