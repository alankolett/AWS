'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
}

async function verifyAdmin() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authorized: false, error: 'Unauthorized: Please log in.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { authorized: false, error: 'Forbidden: Only administrators can manage events.' };
  }

  return { authorized: true, user };
}

export async function createEvent(data: {
  id?: string;
  title: string;
  type: string;
  event_date: string;
  time_range: string;
  location: string;
  speaker_name: string;
  speaker_role?: string;
  total_seats?: number;
  seats_remaining?: number;
  thumbnail_url?: string;
  prerequisites?: string;
  description?: string;
  meetup_link?: string;
  banner_templates?: any[];
  post_event_photo_url?: string;
  post_event_text?: string;
  slides_url?: string;
  recording_url?: string;
  github_url?: string;
  tags?: string[];
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = getSupabase();
  const slug = data.id?.trim() || `evt-${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'session'}-${Date.now().toString(36)}`;

  const totalSeats = data.total_seats || 60;
  const seatsRemaining = data.seats_remaining !== undefined ? data.seats_remaining : totalSeats;

  // Default 3 banner templates if none provided
  const bannerTemplates = data.banner_templates && data.banner_templates.length === 3
    ? data.banner_templates
    : [
        {
          id: 'theme-cyber',
          name: 'Cyber Neon Pulse',
          imageUrl: data.thumbnail_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
          accentColor: '#a855f7',
          defaultHeadline: "I'm Attending!",
          badgeText: 'AWS SBG · BUILDER INITIATIVE'
        },
        {
          id: 'theme-reinvent',
          name: 'AWS re:Invent Dark Edition',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
          accentColor: '#ff9900',
          defaultHeadline: "Architecting at SSPU",
          badgeText: 're:Invent COMMUNITY WATCH PARTY'
        },
        {
          id: 'theme-mono',
          name: 'Terminal Minimalist',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
          accentColor: '#00f0ff',
          defaultHeadline: "Building the Cloud",
          badgeText: 'VERIFIED ATTENDEE PASS'
        }
      ];

  const payload = {
    id: slug,
    title: data.title,
    type: data.type || 'WORKSHOP',
    event_date: data.event_date,
    time_range: data.time_range,
    location: data.location,
    speaker_name: data.speaker_name,
    speaker_role: data.speaker_role || 'Speaker / Cloud Architect',
    total_seats: totalSeats,
    seats_remaining: seatsRemaining,
    thumbnail_url: data.thumbnail_url || '',
    prerequisites: data.prerequisites || '',
    description: data.description || '',
    meetup_link: data.meetup_link || '',
    banner_templates: bannerTemplates,
    post_event_photo_url: data.post_event_photo_url || '',
    post_event_text: data.post_event_text || '',
    slides_url: data.slides_url || '',
    recording_url: data.recording_url || '',
    github_url: data.github_url || '',
    tags: data.tags || ['AWS', 'CLOUD'],
    updated_at: new Date().toISOString()
  };

  const { data: created, error } = await supabase
    .from('events')
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/events');
  revalidatePath(`/event/${slug}`);

  return { success: true, event: created };
}

export async function updateEvent(id: string, data: Partial<{
  title: string;
  type: string;
  event_date: string;
  time_range: string;
  location: string;
  speaker_name: string;
  speaker_role: string;
  total_seats: number;
  seats_remaining: number;
  thumbnail_url: string;
  prerequisites: string;
  description: string;
  meetup_link: string;
  banner_templates: any[];
  post_event_photo_url: string;
  post_event_text: string;
  slides_url: string;
  recording_url: string;
  github_url: string;
  tags: string[];
}>) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = getSupabase();
  const { data: updated, error } = await supabase
    .from('events')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/events');
  revalidatePath(`/event/${id}`);

  return { success: true, event: updated };
}

export async function deleteEvent(id: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = getSupabase();
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/home');
  revalidatePath('/events');

  return { success: true };
}
