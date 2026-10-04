'use client';

import React from 'react';
import { Quote, Linkedin, Twitter, Github, Globe, ExternalLink, Award } from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';

export interface FeaturedPerson {
  id: string;
  name: string;
  designation: string;
  organization?: string;
  bio?: string;
  quote?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  tags?: string[];
}

export interface LogosProps {
  awsLogoUrl?: string;
  sspuLogoUrl?: string;
}

interface FeaturedPeopleProps {
  id?: string;
  sectionTag?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  people: FeaturedPerson[];
  logos?: LogosProps;
}

export const FeaturedPeople: React.FC<FeaturedPeopleProps> = ({
  id = 'featured-people',
  sectionTag = '// CHAPTER HONORED GUESTS & DIGNITARIES',
  sectionTitle = 'Featured Builders & Mentors',
  sectionSubtitle = 'Distinguished industry architects, university patrons, and keynote speakers shaping the AWS student ecosystem.',
  people = [],
  logos,
}) => {
  if (!people || people.length === 0) {
    return null;
  }

  return (
    <section id={id} className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
              {sectionTag}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-sans tracking-tight">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans leading-relaxed">
                {sectionSubtitle}
              </p>
            )}
          </div>

          {/* Bottom Right of Header: 2 rounded logos AWS × SSPU */}
          {logos ? (
            <div className="flex items-center gap-3 self-start sm:self-end pt-1 sm:pt-0">
              {/* AWS Logo (Rounded) */}
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#080b10] border-2 border-white/[0.15] hover:border-[#ff9900] p-2.5 flex items-center justify-center shadow-xl transition-all overflow-hidden group/aws"
                title="Amazon Web Services"
              >
                {logos.awsLogoUrl ? (
                  <img
                    src={logos.awsLogoUrl}
                    alt="AWS Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <AwsLogo className="w-8 h-auto" variant="dual" />
                )}
              </div>

              {/* Cross / Alliance connector */}
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono font-bold text-[#ff9900]">
                ×
              </div>

              {/* SSPU Logo (Rounded) */}
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#080b10] border-2 border-white/[0.15] hover:border-[#a855f7] p-2 flex items-center justify-center shadow-xl transition-all overflow-hidden group/sspu"
                title="Symbiosis Skills & Professional University"
              >
                {logos.sspuLogoUrl ? (
                  <img
                    src={logos.sspuLogoUrl}
                    alt="SSPU Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#a855f7]/30 to-[#00f0ff]/20 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-mono font-black text-white tracking-tighter">SSPU</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              {people.length} Honored {people.length === 1 ? 'Personality' : 'Personalities'}
            </div>
          )}
        </div>

        {/* Unified Cards List (Consistent photo-left, text-right alignment for Chapter Lead and Co-Lead) */}
        <div className="space-y-12">
          {people.map((person, index) => {
            const photo = person.photoUrl || '/stickman.svg';

            return (
              <div
                key={person.id || index}
                className="rounded-3xl bg-[#0f141c]/90 backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.22] transition-all duration-300 p-6 sm:p-10 shadow-2xl relative overflow-hidden group"
              >
                {/* Subtle ambient corner glow */}
                <div
                  className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#ff9900]/5 blur-3xl pointer-events-none group-hover:bg-[#a855f7]/10 transition-colors"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Photo Column: Always on left for consistent visual anchor */}
                  <div className="lg:col-span-4 flex justify-center sm:justify-start">
                    <div className="relative w-full max-w-[280px] aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden border-2 border-white/[0.15] bg-[#080b10] shadow-2xl group-hover:border-[#ff9900]/50 transition-colors">
                      <img
                        src={photo}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-60" />
                      {person.organization && (
                        <div className="absolute bottom-3 left-3 right-3 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-[#080b10]/90 backdrop-blur border border-white/[0.12] text-[11px] font-mono text-slate-300 truncate max-w-full">
                            {person.organization}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content & Details Column: Always on right, aligning perfectly across all cards */}
                  <div className="lg:col-span-8 space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff9900]/10 border border-[#ff9900]/30 text-xs font-mono text-[#ff9900] mb-2 font-semibold">
                        <Award className="w-3.5 h-3.5 text-[#ff9900]" />
                        <span>{person.designation || 'Featured Leader'}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                        {person.name}
                      </h3>

                      {person.organization && (
                        <div className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
                          {person.organization}
                        </div>
                      )}
                    </div>

                    {/* Quote Highlight */}
                    {person.quote && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#080b10]/80 border border-white/[0.08] relative">
                        <Quote className="w-6 h-6 text-[#a855f7] opacity-60 mb-2" />
                        <p className="text-slate-200 text-sm sm:text-base italic leading-relaxed font-sans">
                          "{person.quote}"
                        </p>
                      </div>
                    )}

                    {/* Bio Text */}
                    {person.bio && (
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                        {person.bio}
                      </p>
                    )}

                    {/* Social Channels */}
                    <div className="flex items-center gap-3 pt-2 border-t border-white/[0.08] flex-wrap">
                      {person.linkedinUrl && (
                        <a
                          href={person.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-[#0a66c2] border border-white/[0.08] text-xs font-mono transition-colors"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {person.twitterUrl && (
                        <a
                          href={person.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-[#1da1f2] border border-white/[0.08] text-xs font-mono transition-colors"
                        >
                          <Twitter className="w-3.5 h-3.5" />
                          <span>X / Twitter</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {person.githubUrl && (
                        <a
                          href={person.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}

                      {person.portfolioUrl && (
                        <a
                          href={person.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-[#00f0ff] border border-white/[0.08] text-xs font-mono transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Website</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
