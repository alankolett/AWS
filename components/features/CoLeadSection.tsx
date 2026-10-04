'use client';

import React from 'react';
import { ShieldCheck, Github, Linkedin, Globe, Quote, Terminal, User, ExternalLink, Award } from 'lucide-react';
import { getAwsBuilderProfileUrl } from '@/lib/utils';

interface CoLeadSectionProps {
  name: string;
  role: string;
  quote?: string;
  avatarUrl?: string;
  bio?: string;
  builderId?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  headline?: string;
  division?: string;
  branch?: string;
  year?: string;
  certifications?: any[];
  badges?: any[];
}

export const CoLeadSection: React.FC<CoLeadSectionProps> = ({
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
  division,
  branch,
  year,
  certifications = [],
  badges = [],
}) => {
  const displayAvatar = avatarUrl || '/stickman.svg';

  return (
    <section id="co-lead" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16 bg-[#080b10]/40">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#00f0ff] tracking-wider uppercase font-semibold">
                // CO-CHAPTER LEADERSHIP
              </span>
              <span className="text-slate-600">•</span>
              <a
                href={getAwsBuilderProfileUrl(builderId || 'sspu-co-lead')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#00f0ff]/40 text-[11px] font-mono text-slate-300 hover:text-white transition-colors group/cbid"
                title="Open Public AWS Builder Profile"
              >
                <Terminal className="w-3 h-3 text-[#00f0ff]" />
                <span>BUILDER_ID: {builderId || 'sspu-co-lead'}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/cbid:opacity-100" />
              </a>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Co-Chapter Lead & Technical Architect
            </h2>
            <p className="text-sm font-mono text-[#00f0ff] mt-1">
              {name} · {role}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Active Co-Chapter Lead</span>
          </div>
        </div>

        {/* Co-Lead Card */}
        <div className="rounded-3xl bg-[#0f141c]/90 backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.2] transition-all duration-300 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Photo */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-4">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/[0.15] bg-[#080b10] shadow-2xl group">
                <img
                  src={displayAvatar}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-60" />
              </div>

              {(division || branch || year) && (
                <div className="text-xs font-mono text-slate-400 space-y-0.5 text-center sm:text-left">
                  {division && <div className="text-[#00f0ff] font-semibold">{division}</div>}
                  {branch && <div>{branch} {year ? `· ${year}` : ''}</div>}
                </div>
              )}

              {/* Social Channels */}
              <div className="flex items-center gap-2 pt-2">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-[#0a66c2] border border-white/[0.08] transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-[#00f0ff] border border-white/[0.08] transition-colors"
                    title="Portfolio Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Details & Perspective */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                  {name}
                </h3>
                <div className="text-xs font-mono text-[#00f0ff] mt-1 font-semibold">
                  {headline || role}
                </div>
              </div>

              {quote && (
                <div className="p-5 rounded-2xl bg-[#080b10]/80 border border-white/[0.08] relative">
                  <Quote className="w-6 h-6 text-[#00f0ff] opacity-60 mb-2" />
                  <p className="text-slate-200 text-sm sm:text-base italic leading-relaxed font-sans">
                    "{quote}"
                  </p>
                </div>
              )}

              {bio && (
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                  {bio}
                </p>
              )}

              {/* Certifications and Badges */}
              {(certifications.length > 0 || badges.length > 0) && (
                <div className="pt-4 border-t border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Verified AWS Certifications & Specializations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert: any, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-cyan-200"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
                        <span>{cert.name || cert}</span>
                      </span>
                    ))}
                    {badges.map((badge: any, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>{badge.name || badge}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
