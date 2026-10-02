import React from 'react';
import { EventCard } from '@/components/features/EventCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { EventSession } from '@/lib/types';
import { Calendar } from 'lucide-react';

interface UpcomingEventsProps {
  pinnedEventId?: string;
}

export const UpcomingEvents = async ({ pinnedEventId }: UpcomingEventsProps) => {
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

  let query = supabase.from('events').select('*').order('event_date', { ascending: false });

  if (pinnedEventId) {
    query = query.eq('id', pinnedEventId);
  }

  const { data: dbEvents } = await query;

  if ((!dbEvents || dbEvents.length === 0) && pinnedEventId) {
    return null; // On home page, if pinned event not found or no events, don't show section
  }

  const events: EventSession[] = (dbEvents || []).map(e => ({
    id: e.id,
    title: e.title,
    type: e.type,
    eventDate: e.event_date,
    date: e.event_date,
    time: e.time_range,
    location: e.location,
    speakerName: e.speaker_name,
    speakerRole: e.speaker_role,
    tags: e.tags || [],
    description: e.description,
    isPast: e.is_past,
    meetupLink: e.meetup_link,
    thumbnailUrl: e.thumbnail_url,
    thumbnail_url: e.thumbnail_url,
    prerequisites: e.prerequisites,
    post_event_photo_url: e.post_event_photo_url,
    post_event_text: e.post_event_text,
    bannerTemplates: e.banner_templates
  }));

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
              // EVENTS SYSTEM
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              {pinnedEventId ? 'Featured Event Spotlight' : 'Upcoming & Recent Sessions'}
            </h2>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-3">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-white font-bold">No sessions published yet</p>
            <p className="text-slate-400 text-sm">Check back soon for upcoming AWS workshops and build sprints!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
