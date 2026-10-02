'use client';

import React from 'react';
import { ShieldCheck, Github, Linkedin, Globe, Quote, Terminal } from 'lucide-react';
import { FOUNDER_STORY } from '@/lib/mockData';

interface FounderStoryProps {
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
  bio?: string;
  builderId?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  headline?: string;
  timeline?: { date: string; title: string; description: string }[];
}

export const FounderStory: React.FC<FounderStoryProps> = ({
  name,
  role,
  quote,
  avatarUrl,
  bio,
  builderId,
  githubUrl,
  linkedinUrl,
  portfolioUrl,
  headline,
  timeline
}) => {
  const displayTimeline = timeline && timeline.length > 0 ? timeline : FOUNDER_STORY.timeline;
  const displayAvatar = avatarUrl || '/stickman.svg';

  return (
    <section id="founder" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header with Verified Builder ID */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#a855f7] tracking-wider uppercase font-semibold">
                // CHAPTER FOUNDER & LEAD
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Terminal className="w-3 h-3 text-[#ff9900]" />
                <span>BUILDER_ID: {builderId || 'sspu-lead'}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Founder & Community Lead
            </h2>
            <p className="text-sm font-mono text-[#ff9900] mt-1">
              {name} · {role}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active Chapter Steward</span>
          </div>
        </div>

        {/* 2-Column Keynote Narrative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Portrait Card, Signature & Channels (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
            <div className="relative group overflow-hidden rounded-xl border border-white/[0.1] bg-[#080b10] flex items-center justify-center p-6">
              <img
                src={displayAvatar}
                alt={name}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="text-base font-bold text-white font-sans">{name}</div>
                <div className="text-xs font-mono text-slate-400">{headline || 'Symbiosis Skills & Professional University'}</div>
              </div>
            </div>

            {bio && (
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {bio}
              </p>
            )}

            {/* Certifications Verified */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
                Accreditations
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff9900] shrink-0" />
                  <span className="truncate">AWS Certified Solutions Architect</span>
                </div>
              </div>
            </div>

            {/* Founder Digital Signature Strip */}
            <div className="pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] font-mono text-slate-500 mb-1">FOUNDER SIGNATURE</div>
              <div className="font-serif italic text-lg text-slate-300 tracking-wide">
                {name}
              </div>
              <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                Key Fingerprint: 0x{builderId ? builderId.slice(0, 10).toUpperCase() : 'AWSBUILDER'}
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-white/[0.08]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-white/[0.08]"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-white/[0.08]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Mission Statement, The "Why", & Narrative Timeline (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Mission Statement (Large Serif Quote) */}
            <div className="relative pl-6 sm:pl-8 py-2">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#a855f7] rounded-full"></div>
              <Quote className="absolute -top-3 -left-3 w-8 h-8 text-[#a855f7]/20 rotate-180" />
              <p className="text-xl sm:text-2xl font-serif text-slate-200 leading-relaxed italic relative z-10">
                "{quote}"
              </p>
            </div>

            {/* Narrative Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-6">
                Chapter Origin Timeline
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#a855f7] before:via-white/[0.1] before:to-transparent">
                {displayTimeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#080b10] bg-[#a855f7] text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-mono text-[10px] sm:text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] group-hover:border-[#a855f7]/30 transition-colors shadow-sm relative">
                      {/* Arrow pointer */}
                      <div className="absolute top-5 -left-1.5 md:group-even:-left-1.5 md:group-odd:-right-1.5 md:group-odd:left-auto w-3 h-3 bg-[#080b10] border-t border-l border-white/[0.05] group-hover:border-[#a855f7]/30 rotate-[-45deg] md:group-odd:rotate-[135deg] transition-colors -z-10"></div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-base font-sans">
                          {item.title}
                        </h4>
                        <span className="font-mono text-xs text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
