'use client';

import React, { useState } from 'react';
import { ShieldCheck, Github, Linkedin, ExternalLink, Users, Search, ArrowRight } from 'lucide-react';
import { CORE_TEAM } from '@/lib/mockData';

export const MeetTeam: React.FC = () => {
  const [showFullDirectory, setShowFullDirectory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // The 4 core leadership members required by the mandate
  const coreFour = CORE_TEAM.slice(0, 4);

  const filteredTeam = CORE_TEAM.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term) ||
      member.division.toLowerCase().includes(term) ||
      (member.builderId && member.builderId.toLowerCase().includes(term))
    );
  });

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1">
              // CHAPTER ARCHITECTURE & STEERING COMMITTEE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Core Leadership Team
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Undergraduate student architects directing workshops, cloud security honeypots, and AWS re:Invent sessions in Computer Lab 3.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFullDirectory(!showFullDirectory)}
            className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#0f141c] border border-white/[0.08]"
          >
            <Users className="w-3.5 h-3.5 text-[#ff9900]" />
            <span>{showFullDirectory ? 'Show Core 4 Only' : 'Explore All Builders'}</span>
          </button>
        </div>

        {/* Minimalist Team Grid: Disha Pure + Cloud Arch + Cybersecurity + DevOps Leads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(showFullDirectory ? filteredTeam : coreFour).map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Identity */}
                <div className="relative mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/[0.1] shadow-sm"
                  />
                  {member.isLead && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f141c]" title="Active Lead" />
                  )}
                </div>

                {/* Member Name */}
                <h3 className="text-base font-bold text-white font-sans tracking-tight">
                  {member.name}
                </h3>

                {/* Role */}
                <div className="text-xs font-mono text-[#ff9900] font-medium mt-0.5">
                  {member.role}
                </div>

                {/* Branch */}
                <div className="text-[11px] font-sans text-slate-400 mt-1">
                  {member.division}
                </div>

                {/* Builder ID (Monospace Tag, No oversized badges) */}
                <div className="mt-2.5 inline-block">
                  <span className="text-[10px] font-mono text-[#a855f7] bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded">
                    id: {member.builderId || `${member.id}-sspu`}
                  </span>
                </div>

                {/* Brief Context */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed mt-3 line-clamp-3">
                  {member.bio}
                </p>
              </div>

              {/* Social Channels (Clean Icons, No Clutter) */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Lab 3 · Kiwale
                </span>
                <div className="flex items-center gap-2.5">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
