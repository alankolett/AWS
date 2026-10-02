'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Github, Linkedin, Globe, User, ArrowUpRight } from 'lucide-react';

interface MeetTeamProps {
  sections: any[];
  profiles: any[];
}

export const MeetTeam: React.FC<MeetTeamProps> = ({ sections, profiles }) => {
  const assignedSectionIds = new Set(sections.map(s => s.id));
  const unassignedMembers = profiles.filter(p => !p.team_section_id || !assignedSectionIds.has(p.team_section_id));

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-16">
        <div>
          <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-2 font-semibold">
            // ENGINEERING & OPERATIONS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-sans tracking-tight">
            The Chapter Collective
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-sans leading-relaxed">
            Meet the builders architecting the future of cloud computing at SSPU.
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="text-slate-400 text-sm text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            No builder profiles published yet.
          </div>
        ) : (
          <div className="space-y-16">
            {sections.map(section => {
              const sectionMembers = profiles.filter(p => p.team_section_id === section.id);
              if (sectionMembers.length === 0) return null;

              return (
                <div key={section.id} className="space-y-8">
                  <h3 className="text-2xl font-bold text-white border-b border-white/[0.08] pb-4">
                    {section.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionMembers.map(member => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Unassigned or General Builders */}
            {unassignedMembers.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white border-b border-white/[0.08] pb-4">
                  Builders & Contributors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unassignedMembers.map(member => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

function MemberCard({ member }: { member: any }) {
  return (
    <div className="group p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-[#ff9900]/40 transition-all duration-300 flex flex-col justify-between shadow-lg relative">
      <Link href={`/team/${member.id}`} className="block">
        <div className="flex items-start gap-4 mb-5">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#080b10] border border-white/[0.1] flex items-center justify-center group-hover:border-[#ff9900]/50 transition-colors">
            {member.avatar_url ? (
              <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-lg font-bold text-white font-sans leading-tight group-hover:text-[#ff9900] transition-colors truncate">
                {member.full_name || member.email?.split('@')[0] || 'Builder'}
              </h4>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#ff9900] transition-colors shrink-0" />
            </div>
            <div className="text-xs font-mono text-[#ff9900] mt-1">{member.headline || (member.role === 'admin' ? 'Administrator' : 'Member')}</div>
            {member.division && <div className="text-[10px] font-mono text-[#a855f7] mt-0.5">{member.division}</div>}
            {member.branch && <div className="text-[10px] font-mono text-slate-500 mt-0.5">{member.branch} {member.year ? `· ${member.year}` : ''}</div>}
          </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed font-sans line-clamp-3 mb-5 min-h-[60px]">
          {member.bio || 'Active AWS Student Builder Group community contributor.'}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <div className="flex -space-x-2">
          {(member.certifications || []).slice(0, 3).map((cert: any, i: number) => (
            <div key={i} className="w-6 h-6 rounded-full bg-[#080b10] border border-white/[0.1] flex items-center justify-center relative z-10" title={cert.name || cert}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff9900]" />
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {member.github_url && (
            <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" title="GitHub">
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" title="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.portfolio_url && (
            <a href={member.portfolio_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" title="Portfolio">
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
