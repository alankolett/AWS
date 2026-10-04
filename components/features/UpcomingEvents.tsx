import React from 'react';
import { EventCard } from '@/components/features/EventCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { EventSession } from '@/lib/types';
import { Calendar, History, Sparkles } from 'lucide-react';
import { isEventPast } from '@/lib/utils';

interface UpcomingEventsProps {
  pinnedEventId?: string;
  pinnedEventIds?: string[];
}

export const UpcomingEvents = async ({ pinnedEventId, pinnedEventIds }: UpcomingEventsProps) => {
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

  const targetIds = pinnedEventIds && pinnedEventIds.length > 0
    ? pinnedEventIds
    : (pinnedEventId && pinnedEventId.trim().length > 0 ? [pinnedEventId.trim()] : []);

  const isPinnedSpotlight = targetIds.length > 0;

  let query = supabase.from('events').select('*').order('event_date', { ascending: false });

  if (isPinnedSpotlight) {
    query = query.in('id', targetIds);
  }

  const { data: dbEvents } = await query;

  if ((!dbEvents || dbEvents.length === 0) && isPinnedSpotlight) {
    return null; // On home page, if pinned events not found, don't show section
  }

  const allEvents: EventSession[] = (dbEvents || []).map(e => ({
    id: e.id,
    title: e.title,
    type: e.type,
    eventDate: e.event_date,
    date: e.event_date,
    time: e.time_range,
    location: e.location,
    speakerName: e.speaker_name,
    speakerRole: e.speaker_role,
    tags: (e.tags || []).filter((t: string) => t !== 'HIDE_BANNER'),
    description: e.description,
    isPast: Boolean(e.is_past || isEventPast(e.event_date, e.is_past)),
    meetupLink: e.meetup_link,
    thumbnailUrl: e.thumbnail_url,
    thumbnail_url: e.thumbnail_url,
    prerequisites: e.prerequisites,
    post_event_photo_url: e.post_event_photo_url,
    post_event_text: e.post_event_text,
    bannerTemplates: e.banner_templates
  }));

  // If in Pinned Spotlight mode (e.g. on Home page), render directly
  if (isPinnedSpotlight) {
    return (
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
                // EVENTS SYSTEM
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                Featured Event Spotlight
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {allEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Full Events Page Mode: Partition into Upcoming vs Past Events
  const upcomingEvents = allEvents.filter(e => !e.isPast);
  const pastEvents = allEvents.filter(e => e.isPast);

  // Sort upcoming chronologically (soonest first)
  upcomingEvents.sort((a, b) => (a.eventDate || '').localeCompare(b.eventDate || ''));
  // Sort past reverse chronologically (most recently concluded first)
  pastEvents.sort((a, b) => (b.eventDate || '').localeCompare(a.eventDate || ''));

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: UPCOMING SESSIONS */}
      <section id="upcoming-events" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] tracking-wider uppercase mb-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>// LIVE CHAPTER SESSIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
                Upcoming Sessions & Workshops
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
                Join our live architectural sprints, cloud security labs, and certification watch parties.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              <span className="text-[#00f0ff] font-bold">{upcomingEvents.length}</span> upcoming {upcomingEvents.length === 1 ? 'session' : 'sessions'} scheduled
            </div>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="p-12 sm:p-16 text-center rounded-3xl bg-[#0f141c]/80 border border-white/[0.08] space-y-4 max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center mx-auto text-[#00f0ff]">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-sans">No upcoming live sessions currently scheduled</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed">
                  We are actively planning our next cloud workshop and build sprint. Check back soon or explore our previous sessions and recordings below!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: PAST / CONCLUDED SESSIONS (SECTION BELOW) */}
      <section id="past-events" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16 bg-[#080b10]/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
                <History className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>// SESSIONS ARCHIVE & RECAPS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
                Past Sessions & Concluded Meetups
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
                Browse through presentation slides, session recordings, code repositories, and attendee galleries from our concluded events.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              <span className="text-[#a855f7] font-bold">{pastEvents.length}</span> concluded {pastEvents.length === 1 ? 'event' : 'events'} archived
            </div>
          </div>

          {pastEvents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0f141c]/50 border border-white/[0.05] space-y-3">
              <History className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-slate-300 font-bold text-sm">No past sessions in the archive yet</p>
              <p className="text-slate-500 text-xs">Concluded events and recap materials will automatically appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
