import React from 'react';
import { MeetTeam } from '@/components/features/MeetTeam';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function TeamPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  // Fetch sections, all profiles, and settings
  const [{ data: sections }, { data: profiles }, { data: settings }] = await Promise.all([
    supabase.from('team_sections').select('*').order('order_index', { ascending: true }),
    supabase.from('profiles').select('*'),
    supabase.from('site_settings').select('*')
  ]);

  return (
    <div className="flex flex-col w-full">
      <MeetTeam sections={sections || []} profiles={profiles || []} settings={settings || []} />
    </div>
  );
}
