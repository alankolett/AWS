'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Download, Github, Terminal, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { UPCOMING_EVENTS, PAST_EVENTS } from '@/lib/mockData';
import { EventSession } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { EventRSVPModal } from '@/components/features/EventRSVPModal';
import { LabKioskTerminal } from '@/components/features/LabKioskTerminal';
import { AwsLogo } from '@/components/common/AwsLogo';

export const UpcomingEvents: React.FC = () => {
  const { registeredEventIds, toggleEventRegistration } = useAppStore();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<EventSession | null>(null);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [lastAdmissionCode, setLastAdmissionCode] = useState<string | null>(null);

  const handleOpenRsvp = (event: EventSession) => {
    setSelectedEventForRsvp(event);
    setIsRsvpModalOpen(true);
  };

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header & Mode Switch */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
              // EVENTS SYSTEM · FEATURES #5, #6 & #17
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Sessions, Workshops & Lab Archives
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-1 max-w-xl">
              Official AWS Student Builder Group calendar for Symbiosis Skills & Professional University.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {/* Tab Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-[#0f141c] border border-white/[0.08]">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-[#080b10] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming Sessions ({UPCOMING_EVENTS.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-white text-[#080b10] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past Archives ({PAST_EVENTS.length})
              </button>
            </div>

            {/* Launch Lab 3 Attendance Terminal Button */}
            <button
              onClick={() => setIsKioskOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>Lab 3 Kiosk</span>
            </button>
          </div>
        </div>

        {/* 1. UPCOMING EVENTS (High-Legibility Chronological List) */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {UPCOMING_EVENTS.map((event) => {
              const isRegistered = registeredEventIds.includes(event.id);

              return (
                <div
                  key={event.id}
                  className="p-6 sm:p-7 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left: Schedule, Venue & Title */}
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#a855f7] font-semibold">
                      <div className="h-5 px-1.5 rounded bg-black/40 border border-white/[0.1] inline-flex items-center">
                        <AwsLogo className="w-4 h-auto" variant="dual" />
                      </div>
                      <span>{event.date}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-sans">{event.time}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 font-mono">[{event.type}]</span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-sans tracking-tight">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                      {event.description}
                    </p>

                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs font-sans text-slate-400">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-[#ff9900] shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <span className="hidden sm:inline text-slate-600">•</span>
                      <div>
                        Speaker: <span className="text-white font-medium">{event.speaker}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Seats & Action Button */}
                  <div className="flex flex-col sm:items-end justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
                    <div className="text-xs font-mono text-slate-400">
                      <span className="text-[#ff9900] font-semibold">{event.seatsRemaining}</span> / {event.totalSeats} seats remaining
                    </div>

                    <button
                      onClick={() => handleOpenRsvp(event)}
                      className={`h-10 px-5 rounded-md font-sans text-xs font-semibold tracking-normal transition-colors flex items-center justify-center gap-2 ${
                        isRegistered
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-white hover:bg-slate-100 text-[#080b10]'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Seat Reserved</span>
                        </>
                      ) : (
                        <>
                          <span>RSVP Lab Seat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. PAST EVENTS ARCHIVE (Clean Minimalist Table/List) */}
        {activeTab === 'past' && (
          <div className="rounded-2xl bg-[#0f141c] border border-white/[0.08] overflow-hidden">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>WORKSHOP ARCHIVE & RESOURCES</span>
              <span>VERIFIED REPOSITORIES</span>
            </div>

            <div className="divide-y divide-white/[0.08]">
              {PAST_EVENTS.map((past) => (
                <div
                  key={past.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="text-slate-300">{past.date}</span>
                      <span>•</span>
                      <span>{past.location}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                      {past.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {past.description}
                    </p>

                    <div className="text-xs font-mono text-slate-500 pt-0.5">
                      Session Lead: <span className="text-slate-300">{past.speaker}</span> · {past.attendedCount} Attendees
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {past.slidesUrl && (
                      <a
                        href={past.slidesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-4 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] text-xs font-mono flex items-center gap-2 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#ff9900]" />
                        <span>Download Slide Deck (.PDF)</span>
                      </a>
                    )}

                    {past.githubUrl && (
                      <a
                        href={past.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-4 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] text-xs font-mono flex items-center gap-2 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Open GitHub Repo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVP Modal */}
      <EventRSVPModal
        event={selectedEventForRsvp}
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
        onSuccess={(code) => setLastAdmissionCode(code)}
      />

      {/* Lab 3 Attendance Kiosk Terminal */}
      <LabKioskTerminal
        isOpen={isKioskOpen}
        onClose={() => setIsKioskOpen(false)}
      />
    </section>
  );
};
