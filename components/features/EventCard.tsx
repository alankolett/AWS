'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, ArrowRight, Video, CheckCircle2 } from 'lucide-react';
import { EventSession } from '@/lib/types';
import { cleanEventDescription, isOnlineEvent, isEventPast } from '@/lib/utils';

interface EventCardProps {
  event: EventSession;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const thumbnail = event.thumbnailUrl || event.thumbnail_url;
  const meetupUrl = event.meetupLink || event.meetup_link;
  const isPast = isEventPast(event.eventDate || event.date, event.isPast);
  const isOnline = isOnlineEvent(event.location);
  const descriptionText = cleanEventDescription(event.description);

  return (
    <div className={`flex flex-col rounded-2xl bg-[#0f141c] border ${isPast ? 'border-white/[0.06] hover:border-purple-500/30' : 'border-white/[0.08] hover:border-white/[0.18]'} transition-all duration-300 overflow-hidden group shadow-lg`}>
      {/* Thumbnail Photo Card Style */}
      {thumbnail ? (
        <Link href={`/event/${event.id}`} className="block relative aspect-video w-full overflow-hidden bg-[#080b10]">
          <img
            src={thumbnail}
            alt={event.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isPast ? 'grayscale-[0.2] contrast-[1.02]' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f141c] via-transparent to-transparent opacity-90" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080b10]/85 backdrop-blur border border-white/[0.12] text-[10px] font-mono font-medium text-slate-200">
            {isPast ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-slate-300">CONCLUDED · {event.type}</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{event.type}</span>
              </>
            )}
          </div>
          {isOnline && (
            <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00f0ff]/15 backdrop-blur border border-[#00f0ff]/30 text-[10px] font-mono text-[#00f0ff]">
              <Video className="w-3 h-3" />
              <span>Online</span>
            </div>
          )}
        </Link>
      ) : (
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-medium text-slate-300">
            {isPast ? `CONCLUDED · ${event.type}` : event.type}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-[#080b10] px-2 py-1 rounded border border-white/[0.05]">
            <Calendar className="w-3 h-3 text-[#ff9900]" />
            <span>{event.eventDate || event.date}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {thumbnail && (
          <div className="flex items-center gap-2 self-start mb-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-[#080b10] px-2.5 py-1 rounded border border-white/[0.05]">
              <Calendar className="w-3 h-3 text-[#ff9900]" />
              <span>{event.eventDate || event.date}</span>
            </div>
            {isPast && (
              <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                Concluded
              </span>
            )}
          </div>
        )}

        <Link href={`/event/${event.id}`} className="group-hover:text-[#a855f7] transition-colors">
          <h3 className="text-xl font-bold text-white font-sans tracking-tight mb-2">
            {event.title}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-400 leading-relaxed font-sans line-clamp-2 mb-6">
          {descriptionText}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-6 border-t border-white/[0.08]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-slate-500">SPEAKER:</span>
              <span className="text-[#a855f7] font-semibold">{event.speakerName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              {isOnline ? (
                <>
                  <Video className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span className="text-slate-300">{event.location}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.location}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/event/${event.id}`}
              className={`px-3.5 py-2 ${isPast ? 'bg-[#a855f7]/15 hover:bg-[#a855f7]/25 text-[#a855f7] border border-[#a855f7]/30' : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08]'} text-xs font-medium rounded transition-colors inline-flex items-center gap-1.5 shadow-sm font-mono`}
            >
              <span>{isPast ? 'Recap & Details' : 'Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {!isPast ? (
              meetupUrl ? (
                <a
                  href={meetupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3.5 py-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs rounded transition-colors text-center inline-flex justify-center items-center gap-1.5 shadow-sm font-mono"
                >
                  <span>RSVP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] text-slate-500 font-bold text-xs rounded text-center cursor-not-allowed font-mono">
                  RSVP Closed
                </div>
              )
            ) : meetupUrl ? (
              <a
                href={meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs rounded border border-white/[0.08] transition-colors inline-flex items-center gap-1 font-mono"
                title="View original event on Meetup"
              >
                <span>Meetup</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
