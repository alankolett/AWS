import React from 'react';
import dynamic from 'next/dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, User, ExternalLink, FileText, Video, Github, Layers, CheckCircle2, Globe } from 'lucide-react';
import Link from 'next/link';
import { cleanEventDescription, isOnlineEvent } from '@/lib/utils';

const BannerGenerator = dynamic(
  () => import('@/components/features/BannerGenerator'),
  { ssr: false }
);

export const revalidate = 0;

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
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

  // 1. Fetch event from Supabase
  const { data: dbEvent } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.eventId)
    .single();

  let event: any = dbEvent;

  // 2. Fallback to mock data if not in DB
  if (!event) {
    const allMock = [...UPCOMING_EVENTS, ...PAST_EVENTS];
    event = allMock.find((e) => e.id === params.eventId);
  }

  if (!event) {
    return notFound();
  }

  // Per-event banner studio visibility check (controlled per-event via Admin Console)
  const isBannerStudioEnabled = !event.tags?.includes('HIDE_BANNER') && event.show_banner_generator !== false;

  // Normalize fields between DB and mockData
  const title = event.title;
  const eventDate = event.event_date || event.date || 'TBD';
  const eventTime = event.time_range || event.time || 'TBD';
  const location = event.location || 'SSPU Kiwale Campus';
  const speakerName = event.speaker_name || event.speaker || 'AWS Builder';
  const speakerRole = event.speaker_role || event.speakerRole || 'Solutions Architect';
  const seatsRemaining = event.seats_remaining ?? event.seatsRemaining ?? 60;
  const totalSeats = event.total_seats ?? event.totalSeats ?? 60;
  const isOnline = isOnlineEvent(location, totalSeats);
  const thumbnailUrl = event.thumbnail_url || event.thumbnailUrl;
  const prerequisites = event.prerequisites;
  const description = cleanEventDescription(event.description);
  const meetupLink = event.meetup_link || event.meetupLink;
  const bannerTemplates = event.banner_templates || event.bannerTemplates;
  const postEventPhotoUrl = event.post_event_photo_url;
  const postEventText = event.post_event_text || event.post_event_notes;
  const slidesUrl = event.slides_url || event.slidesUrl;
  const recordingUrl = event.recording_url || event.recordingUrl;
  const githubUrl = event.github_url || event.githubUrl;

  // Check if date + 1 has passed
  const eventDateObj = new Date(eventDate);
  const postEventThreshold = new Date(eventDateObj);
  postEventThreshold.setDate(postEventThreshold.getDate() + 1);
  postEventThreshold.setHours(0, 0, 0, 0);

  const now = new Date();
  const isDatePlusOne = !isNaN(postEventThreshold.getTime()) && now >= postEventThreshold;
  const showPostEvent = Boolean(event.is_past || isDatePlusOne);

  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/home" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/events" className="hover:text-white transition-colors">Events</Link>
        <span>/</span>
        <span className="text-[#a855f7] truncate max-w-xs">{title}</span>
      </div>

      {/* Hero Thumbnail 16:9 Banner Style Image */}
      {thumbnailUrl && (
        <div className="relative w-full aspect-video max-h-[500px] rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#080b10]">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-80" />
          <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-[#080b10]/80 backdrop-blur border border-white/[0.15] text-xs font-mono text-slate-200">
            {event.type || 'WORKSHOP'}
          </div>
        </div>
      )}

      {/* Event Header & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-white/[0.08]">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#a855f7] tracking-wider uppercase font-semibold">
              // CHAPTER EVENT
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">
              {showPostEvent ? 'CONCLUDED SESSION' : 'UPCOMING SESSION'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-sans tracking-tight">
            {title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-sm font-sans text-slate-300">
              <Calendar className="w-4 h-4 text-[#ff9900] shrink-0" />
              <span>{eventDate} · {eventTime}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-sans text-slate-300">
              {isOnline ? (
                <>
                  <Video className="w-4 h-4 text-[#00f0ff] shrink-0" />
                  <span className="text-[#00f0ff] font-medium">{location} (Online)</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-[#00f0ff] shrink-0" />
                  <span>{location}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2.5 text-sm font-sans text-slate-300">
              <User className="w-4 h-4 text-[#a855f7] shrink-0" />
              <span>{speakerName} ({speakerRole})</span>
            </div>
            {!isOnline ? (
              <div className="flex items-center gap-2.5 text-sm font-sans text-slate-400 font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Seats: {seatsRemaining} / {totalSeats} remaining</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-sm font-sans text-cyan-400 font-mono text-xs">
                <Globe className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>Format: Virtual Session · Open Capacity</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
          {meetupLink ? (
            <a
              href={meetupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>RSVP on Meetup</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="px-6 py-3.5 bg-white/[0.04] border border-white/[0.08] text-slate-500 font-bold text-sm rounded-xl text-center">
              RSVP Link Not Configured
            </div>
          )}
        </div>
      </div>

      {/* Event Overview & Pre-requisites Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Information */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-4">
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ff9900]" />
              <span>Event Information</span>
            </h2>
            {description ? (
              <div
                className="text-slate-300 leading-relaxed text-sm font-sans space-y-3 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-slate-400 text-sm">No description provided for this session.</p>
            )}
          </div>
        </div>

        {/* Side Column: Pre-requisites */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#a855f7]" />
              <span>Pre-requisites</span>
            </h3>
            {prerequisites ? (
              <div
                className="text-slate-300 text-xs font-sans leading-relaxed space-y-2 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: prerequisites }}
              />
            ) : (
              <p className="text-slate-500 text-xs font-mono">No prior requirements specified. Open to all students.</p>
            )}
          </div>
        </div>
      </div>

      {/* Post-Event Recap & Materials (if session concluded) */}
      {showPostEvent && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-[#ff9900]/30 shadow-[0_0_20px_rgba(255,153,0,0.08)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] uppercase font-bold tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>POST-EVENT RECAP & MATERIALS</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Session Concluded
          </h2>

          {/* Post-Event Photo */}
          {postEventPhotoUrl && (
            <div className="relative aspect-video max-w-3xl rounded-xl overflow-hidden border border-white/[0.1] bg-[#080b10]">
              <img
                src={postEventPhotoUrl}
                alt="Post-Event Highlight"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post-Event Text (HTML Support) */}
          {postEventText && (
            <div
              className="text-slate-300 text-sm font-sans leading-relaxed space-y-3 prose prose-invert max-w-none pt-2"
              dangerouslySetInnerHTML={{ __html: postEventText }}
            />
          )}

          {/* Post-Event Links */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/[0.08]">
            {slidesUrl && (
              <a
                href={slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#ff9900]" />
                <span>View Slides</span>
              </a>
            )}
            {recordingUrl && (
              <a
                href={recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
              >
                <Video className="w-4 h-4 text-[#a855f7]" />
                <span>Watch Recording</span>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-sm text-white flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4 text-[#00f0ff]" />
                <span>Lab Repository</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Official Attendee Banner Studio (Configured per-event in Admin Console) */}
      {isBannerStudioEnabled && bannerTemplates && bannerTemplates.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/[0.08]">
          <BannerGenerator
            eventTitle={title}
            eventDate={eventDate}
            eventTime={eventTime}
            location={location}
            themeTemplates={bannerTemplates}
          />
        </div>
      )}
    </div>
  );
}
