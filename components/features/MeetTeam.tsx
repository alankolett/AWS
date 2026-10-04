'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Github,
  Linkedin,
  Globe,
  User,
  ArrowUpRight,
  Terminal,
  ExternalLink,
  Crown,
  Sparkles,
  Quote,
} from 'lucide-react';
import { getAwsBuilderProfileUrl } from '@/lib/utils';

interface MeetTeamProps {
  sections: any[];
  profiles: any[];
  settings?: any[];
}

export const MeetTeam: React.FC<MeetTeamProps> = ({ sections, profiles, settings = [] }) => {
  // 1. Resolve custom ordering from site_settings (team_order)
  const teamOrder: string[] = settings.find((s) => s.key === 'team_order')?.value?.order || [];
  const orderMap = new Map(teamOrder.map((id, index) => [id, index]));

  // Helper to sort a list of profiles:
  // - First by is_lead (leads first)
  // - Then by custom teamOrder
  // - Finally by created_at fallback
  const sortProfiles = (profs: any[]) => {
    return [...profs].sort((a, b) => {
      const aLead = Boolean(a.is_lead);
      const bLead = Boolean(b.is_lead);
      if (aLead !== bLead) return aLead ? -1 : 1;

      const aOrder = orderMap.has(a.id) ? orderMap.get(a.id)! : 99999;
      const bOrder = orderMap.has(b.id) ? orderMap.get(b.id)! : 99999;
      if (aOrder !== bOrder) return aOrder - bOrder;

      return 0;
    });
  };

  const allSortedProfiles = sortProfiles(profiles);

  // 2. Identify Top Executive Leads (Requirement 1 & Wireframe: Chapter Lead, Co-Chapter Lead, Campus Lead)
  const pinnedFounderId = settings.find((s) => s.key === 'pinned_founder_id')?.value;
  const pinnedCoLeadId = settings.find((s) => s.key === 'pinned_co_lead_id')?.value;

  const isCoChapterLead = (p: any) => {
    const div = (p.division || '').toLowerCase().trim();
    const h = (p.headline || '').toLowerCase().trim();
    const sec = (sections.find(s => s.id === p.team_section_id)?.name || '').toLowerCase().trim();
    if (p.id === pinnedCoLeadId) return true;
    return (
      div.includes('co-chapter') ||
      div.includes('co chapter') ||
      div.includes('cochapter') ||
      div.includes('chapter co-lead') ||
      div.includes('co-lead') ||
      div.includes('co lead') ||
      h.includes('co-chapter') ||
      h.includes('co chapter') ||
      h.includes('cochapter') ||
      h.includes('chapter co-lead') ||
      h.includes('co-lead') ||
      h.includes('co lead') ||
      sec.includes('co-chapter') ||
      sec.includes('co chapter') ||
      sec.includes('co-lead')
    );
  };

  const isChapterLead = (p: any) => {
    if (isCoChapterLead(p)) return false;
    const div = (p.division || '').toLowerCase().trim();
    const h = (p.headline || '').toLowerCase().trim();
    const sec = (sections.find(s => s.id === p.team_section_id)?.name || '').toLowerCase().trim();
    if (p.id === pinnedFounderId) return true;
    return (
      (div.includes('chapter') && div.includes('lead')) ||
      (h.includes('chapter') && h.includes('lead')) ||
      (sec.includes('chapter') && sec.includes('lead'))
    );
  };

  const isCampusLead = (p: any) => {
    const div = (p.division || '').toLowerCase().trim();
    const h = (p.headline || '').toLowerCase().trim();
    const sec = (sections.find(s => s.id === p.team_section_id)?.name || '').toLowerCase().trim();
    return div.includes('campus lead') || h.includes('campus lead') || sec.includes('campus lead');
  };

  const chapterLead = allSortedProfiles.find(isChapterLead);
  const coChapterLead = allSortedProfiles.find(p => p.id !== chapterLead?.id && isCoChapterLead(p));
  const campusLead = allSortedProfiles.find(p => p.id !== chapterLead?.id && p.id !== coChapterLead?.id && isCampusLead(p));

  const executiveLeadIds = new Set([chapterLead?.id, coChapterLead?.id, campusLead?.id].filter(Boolean));

  // 3. Departmental Sections (Excluding executive leads and any section named Co-Chapter Lead / Chapter Lead)
  const isExecutiveSection = (name: string) => {
    const n = (name || '').toLowerCase().trim();
    return (
      n.includes('chapter lead') ||
      n.includes('co-chapter') ||
      n.includes('campus lead') ||
      n.includes('chapter co-lead')
    );
  };
  const departmentSections = sections.filter(s => !isExecutiveSection(s.name));

  const remainingProfiles = allSortedProfiles.filter(p => !executiveLeadIds.has(p.id));
  const assignedSectionIds = new Set(departmentSections.map(s => s.id));
  const unassignedMembers = remainingProfiles.filter(p => !p.team_section_id || !assignedSectionIds.has(p.team_section_id));

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <div>
          <div className="text-xs font-mono text-[#ff9900] tracking-wider uppercase mb-2 font-semibold flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#ff9900]" />
            <span>AWS STUDENT BUILDER GROUP · CHAPTER COLLECTIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-sans tracking-tight">
            Meet the Team
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-sans leading-relaxed">
            The student leaders, cloud architects, and builders empowering the next generation of engineers at Symbiosis Skills and Professional University.
          </p>
        </div>

        {/* ============================================================== */}
        {/* REQUIREMENT 1 & WIREFRAME TOP ROW:                            */}
        {/* Chapter Lead | Co-Chapter Lead | Campus Lead (In the same row) */}
        {/* ============================================================== */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] uppercase font-bold tracking-wider pb-2 border-b border-white/[0.08]">
            <Sparkles className="w-4 h-4 text-[#a855f7]" />
            <span>EXECUTIVE CHAPTER LEADERSHIP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Column 1: Chapter Lead */}
            <div className="flex flex-col space-y-3">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center justify-center md:justify-start gap-2">
                  <Crown className="w-4 h-4 text-[#ff9900]" />
                  <span>Chapter Lead</span>
                </h2>
                <p className="text-[11px] font-mono text-[#ff9900] mt-0.5">Founding &amp; Executive Direction</p>
              </div>
              {chapterLead ? (
                <FeaturedLeadCard member={chapterLead} badgeLabel="CHAPTER LEAD" />
              ) : (
                <PlaceholderLeadCard title="Chapter Lead" description="Executive leader directing chapter workshops and cloud builder initiatives." />
              )}
            </div>

            {/* Column 2: Co-Chapter Lead */}
            <div className="flex flex-col space-y-3">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff9900]" />
                  <span>Co-Chapter Lead</span>
                </h2>
                <p className="text-[11px] font-mono text-[#ff9900] mt-0.5">Technical &amp; Architecture Operations</p>
              </div>
              {coChapterLead ? (
                <FeaturedLeadCard member={coChapterLead} badgeLabel="CO-CHAPTER LEAD" />
              ) : (
                <PlaceholderLeadCard title="Co-Chapter Lead" description="Co-director overseeing curriculum, community hackathons, and labs." />
              )}
            </div>

            {/* Column 3: Campus Lead */}
            <div className="flex flex-col space-y-3">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center justify-center md:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff9900]" />
                  <span>Campus Lead</span>
                </h2>
                <p className="text-[11px] font-mono text-[#ff9900] mt-0.5">University Partnerships &amp; Relations</p>
              </div>
              {campusLead ? (
                <FeaturedLeadCard member={campusLead} badgeLabel="CAMPUS LEAD" />
              ) : (
                <PlaceholderLeadCard title="Campus Lead" description="University faculty and department liaison coordinating university resources." />
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REQUIREMENT 4 & WIREFRAME: DEPARTMENTAL TEAMS                   */}
        {/* Technical Team, Cloud Security Team, etc.                      */}
        {/* Left Side: Lead Card | Right Side: Small Card Team Members     */}
        {/* ============================================================== */}
        {departmentSections.length > 0 && (
          <div className="space-y-20 pt-8">
            {departmentSections.map(section => {
              const sectionMembers = remainingProfiles.filter(p => p.team_section_id === section.id);
              if (sectionMembers.length === 0) return null;

              // Lead of this domain (first lead or first with is_lead true)
              const domainLead = sectionMembers.find(m => m.is_lead);
              const otherMembers = domainLead
                ? sectionMembers.filter(m => m.id !== domainLead.id)
                : sectionMembers;

              return (
                <div key={section.id} className="space-y-6 pt-8 border-t border-white/[0.08]">
                  {/* Division Title (matches "Technical Team" from wireframe) */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                      {section.name}
                    </h2>
                    <span className="text-xs font-mono text-slate-400">
                      {sectionMembers.length} {sectionMembers.length === 1 ? 'Builder' : 'Builders'}
                    </span>
                  </div>

                  {/* Wireframe Layout: Lead on Left, Small cards grid on Right */}
                  {domainLead ? (
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                      {/* Left Column: Domain Lead Card */}
                      <div className="w-full lg:w-80 shrink-0 flex flex-col space-y-2">
                        <div className="text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider flex items-center gap-1.5 px-1">
                          <Crown className="w-3.5 h-3.5 text-[#ff9900]" />
                          <span>Lead</span>
                        </div>
                        <FeaturedLeadCard member={domainLead} badgeLabel="DOMAIN LEAD" />
                      </div>

                      {/* Right Column: Small Member Cards Grid */}
                      <div className="flex-1 w-full flex flex-col">
                        <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider px-1 mb-2">
                          Team Members
                        </div>
                        {otherMembers.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-fr">
                            {otherMembers.map(member => (
                              <CompactMemberCard key={member.id} member={member} />
                            ))}
                          </div>
                        ) : (
                          <div className="h-full min-h-[220px] flex items-center justify-center p-8 rounded-2xl bg-[#0f141c]/40 border border-white/[0.06] text-slate-500 text-xs font-mono text-center">
                            Domain Lead designated. Additional team members will appear here as they are provisioned.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* If no domain lead is set yet, render all members cleanly in small cards */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {otherMembers.map(member => (
                        <CompactMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* UNASSIGNED / GENERAL BUILDERS (If any)                         */}
        {/* ============================================================== */}
        {unassignedMembers.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                Builders &amp; Contributors
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {unassignedMembers.length} {unassignedMembers.length === 1 ? 'Member' : 'Members'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {unassignedMembers.map(member => (
                <CompactMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// =====================================================================
// FEATURED LEAD CARD ("Card Style" in wireframe)
// Features: Square photo with ORANGE border, Lead badge, full details
// =====================================================================
function FeaturedLeadCard({ member, badgeLabel = 'LEAD' }: { member: any; badgeLabel?: string }) {
  return (
    <div className="group p-6 rounded-2xl bg-[#0f141c] border border-white/[0.1] hover:border-[#ff9900]/50 transition-all duration-300 flex flex-col justify-between shadow-xl relative h-full">
      <div>
        {/* Square Avatar with Orange Border (Requirement 2) */}
        <div className="relative mb-5 text-center">
          <Link
            href={`/team/${member.id}`}
            className="inline-block relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#080b10] border-2 border-[#ff9900] shadow-[0_0_16px_rgba(255,153,0,0.35)] group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.full_name || 'Lead'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <User className="w-12 h-12 text-[#ff9900]" />
              </div>
            )}
          </Link>

          {/* Lead Badge */}
          <div className="mt-3 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff9900]/15 border border-[#ff9900]/40 text-[#ff9900] text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
              <Crown className="w-3.5 h-3.5 text-[#ff9900]" />
              <span>{badgeLabel}</span>
            </span>
          </div>
        </div>

        {/* Member Name */}
        <div className="text-center space-y-1">
          <Link
            href={`/team/${member.id}`}
            className="inline-flex items-center justify-center gap-1 group/name cursor-pointer"
          >
            <h3 className="text-xl font-bold text-white font-sans group-hover/name:text-[#ff9900] transition-colors line-clamp-1">
              {member.full_name || member.email?.split('@')[0] || 'Chapter Builder'}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover/name:text-[#ff9900] transition-colors shrink-0" />
          </Link>

          {/* Role / Headline */}
          <div className="text-xs font-mono text-[#ff9900] font-semibold line-clamp-1">
            {member.headline || 'Solutions Architect & Lead'}
          </div>

          {/* Division / Academic info */}
          <div className="text-[11px] font-mono text-slate-400">
            {member.division && <span className="text-[#a855f7] font-semibold">{member.division}</span>}
            {member.division && (member.branch || member.year) && <span> · </span>}
            {member.branch && <span>{member.branch}</span>}
            {member.year && <span> ({member.year})</span>}
          </div>
        </div>

        {/* Verified AWS Builder ID */}
        {member.builder_id && (
          <div className="mt-3 text-center">
            <a
              href={getAwsBuilderProfileUrl(member.builder_id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ff9900]/10 hover:bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30 text-[10px] font-mono transition-colors"
              title="Open Public AWS Builder Profile"
            >
              <Terminal className="w-3 h-3 text-[#ff9900]" />
              <span className="truncate max-w-[140px]">{member.builder_id}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>
        )}

        {/* Builder Motto or Bio */}
        {member.quote ? (
          <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9900]/10 via-[#ff9900]/[0.03] to-transparent border-l-2 border-l-[#ff9900] text-center">
            <p className="text-xs italic text-slate-300 font-sans line-clamp-2 leading-relaxed">
              &ldquo;{member.quote.replace(/^[“"']+|[”"']+$/g, '').trim()}&rdquo;
            </p>
          </div>
        ) : (
          <Link
            href={`/team/${member.id}`}
            className="block text-xs text-slate-400 hover:text-slate-300 leading-relaxed font-sans line-clamp-3 text-center mt-4 transition-colors"
          >
            {member.bio || 'Leading AWS cloud community events, architectural workshops, and builder sprints at SSPU.'}
          </Link>
        )}
      </div>

      {/* Certifications and Links Footer */}
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/[0.08]">
        {/* Certifications */}
        <div className="flex -space-x-1.5">
          {(member.certifications || []).slice(0, 3).map((cert: any, i: number) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-[#080b10] border border-[#ff9900]/40 flex items-center justify-center relative z-10 shadow-sm"
              title={cert.name || cert}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff9900]" />
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-1.5">
          {member.github_url && (
            <a
              href={member.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {member.portfolio_url && (
            <a
              href={member.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title="Personal Portfolio"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// COMPACT MEMBER CARD ("small card team member" in wireframe)
// Features: Larger square photo with AWS GREEN border, motto, details
// =====================================================================
function CompactMemberCard({ member }: { member: any }) {
  const isLead = Boolean(member.is_lead);

  // Extract clean builder motto (strip duplicated quotes)
  const rawQuote = member.quote?.trim() || '';
  const cleanQuote = rawQuote
    ? rawQuote.replace(/^[“"']+|[”"']+$/g, '').trim()
    : (member.bio?.trim() ? member.bio.trim().split('\n')[0] : 'Learn. Build. Collaborate. Grow.');

  return (
    <div
      className={`group p-5 sm:p-6 rounded-2xl bg-[#0f141c] border ${
        isLead
          ? 'border-[#ff9900]/30 hover:border-[#ff9900]/70 hover:shadow-[0_0_24px_rgba(255,153,0,0.18)]'
          : 'border-white/[0.08] hover:border-[#10b981]/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
      } transition-all duration-300 flex flex-col justify-between gap-4 shadow-lg relative overflow-hidden h-full`}
    >
      {/* Top Section: Avatar + Member Credentials */}
      <div className="flex items-start gap-4">
        {/* Enlarged Avatar with GREEN border (ORANGE if lead) */}
        <Link
          href={`/team/${member.id}`}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-[#080b10] border-2 ${
            isLead
              ? 'border-[#ff9900] shadow-[0_0_14px_rgba(255,153,0,0.35)]'
              : 'border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.25)]'
          } group-hover:scale-105 transition-transform duration-300 cursor-pointer`}
        >
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.full_name || 'Builder'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <User className={`w-9 h-9 sm:w-10 sm:h-10 ${isLead ? 'text-[#ff9900]' : 'text-[#10b981]'}`} />
            </div>
          )}
        </Link>

        {/* Member Details */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/team/${member.id}`}
              className="flex items-center gap-1 group/name cursor-pointer min-w-0"
            >
              <h3 className="text-base sm:text-lg font-bold text-white font-sans truncate group-hover/name:text-[#10b981] transition-colors">
                {member.full_name || member.email?.split('@')[0] || 'Builder'}
              </h3>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/name:text-[#10b981] transition-colors shrink-0" />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-1 shrink-0">
              {member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="text-xs sm:text-[13px] font-mono text-slate-200 font-medium truncate">
            {member.headline || (member.role === 'admin' ? 'Administrator' : 'Builder Member')}
          </div>

          <div className="text-[11px] font-mono text-slate-400 truncate">
            {member.division && <span className="text-[#a855f7]">{member.division} · </span>}
            {member.branch || 'Student Builder'} {member.year ? `(${member.year})` : ''}
          </div>

          {member.builder_id && (
            <div className="pt-0.5">
              <a
                href={getAwsBuilderProfileUrl(member.builder_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25 text-[10px] font-mono hover:bg-[#10b981]/20 transition-colors"
                title="Verified AWS Builder ID"
              >
                <Terminal className="w-2.5 h-2.5 text-[#10b981]" />
                <span className="truncate max-w-[130px] font-semibold">{member.builder_id}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Builder Motto Section - Proper Motto Style */}
      {cleanQuote && (
        <div
          className={`mt-1 pt-3 border-t border-white/[0.06] rounded-xl px-3.5 py-2.5 bg-gradient-to-r ${
            isLead
              ? 'from-[#ff9900]/10 via-[#ff9900]/[0.03] to-transparent border-l-2 border-l-[#ff9900]'
              : 'from-[#10b981]/10 via-[#10b981]/[0.03] to-transparent border-l-2 border-l-[#10b981]'
          }`}
        >
          <div className="flex items-start gap-2">
            <Quote
              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                isLead ? 'text-[#ff9900]' : 'text-[#10b981]'
              } opacity-90`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-[13px] font-sans italic text-slate-300 line-clamp-2 leading-relaxed font-normal">
                &ldquo;{cleanQuote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder card when a leadership role is not yet assigned
function PlaceholderLeadCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#0f141c]/50 border border-dashed border-white/[0.1] flex flex-col justify-center items-center text-center space-y-3 h-full min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-[#080b10] border border-white/[0.1] flex items-center justify-center text-slate-600">
        <Crown className="w-8 h-8 text-slate-600" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-300 font-sans">{title}</h3>
        <p className="text-[11px] font-mono text-slate-500 mt-1 max-w-xs">{description}</p>
      </div>
      <span className="inline-block px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-400">
        Designated in Ops Console
      </span>
    </div>
  );
}
