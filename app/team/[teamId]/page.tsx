import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CORE_TEAM } from '@/lib/mockData';
import {
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  ShieldCheck,
  ArrowLeft,
  Briefcase,
  Layers,
  Quote,
  User,
  Award,
} from 'lucide-react';

export const revalidate = 0;

export default async function TeamMemberPage({ params }: { params: { teamId: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  // 1. Try to find member in Supabase profiles by id
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.teamId)
    .maybeSingle();

  // 2. Try by builder_id if not found by id
  if (!profile) {
    const { data: byBuilderId } = await supabase
      .from('profiles')
      .select('*')
      .eq('builder_id', params.teamId)
      .maybeSingle();
    profile = byBuilderId;
  }

  // 3. Fallback to mock CORE_TEAM if not in DB
  let memberData: any = null;
  let domainName: string | null = null;

  if (profile) {
    // If domain exists, load domain
    if (profile.team_section_id) {
      const { data: section } = await supabase
        .from('team_sections')
        .select('name')
        .eq('id', profile.team_section_id)
        .maybeSingle();
      domainName = section?.name || null;
    }

    memberData = {
      id: profile.id,
      name: profile.full_name || profile.email?.split('@')[0] || 'Builder',
      email: profile.email,
      role: profile.headline || (profile.role === 'admin' ? 'Chapter Administrator' : 'Core Member'),
      domain: domainName,
      division: profile.division,
      branch: profile.branch,
      year: profile.year,
      bio: profile.bio || 'Active contributor to AWS Student Builder Group community projects and cloud workshops.',
      quote: profile.quote,
      avatar: profile.avatar_url,
      banner: profile.banner_url,
      builderId: profile.builder_id,
      github: profile.github_url,
      linkedin: profile.linkedin_url,
      portfolio: profile.portfolio_url,
      certs: profile.certifications || [],
      badges: profile.badges || [],
      isAdmin: profile.role === 'admin',
    };
  } else {
    const mock = CORE_TEAM.find((m) => m.id === params.teamId);
    if (mock) {
      memberData = {
        id: mock.id,
        name: mock.name,
        role: mock.role,
        domain: 'Core Leadership',
        division: mock.division,
        bio: mock.bio,
        avatar: mock.avatar,
        banner: null,
        builderId: mock.builderId,
        github: mock.github,
        linkedin: mock.linkedin,
        portfolio: mock.portfolio,
        certs: mock.certs || [],
        badges: mock.badges || [],
        isAdmin: false,
      };
    }
  }

  if (!memberData) {
    return notFound();
  }

  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Chapter Roster</span>
        </Link>
      </div>

      {/* Storage-backed Backdrop Banner & Profile Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0f141c] border border-white/[0.1] shadow-2xl">
        {/* Banner Area */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-gradient-to-r from-purple-950 via-[#0a0e17] to-slate-900">
          {memberData.banner ? (
            <img
              src={memberData.banner}
              alt={`${memberData.name} banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(#ff9900_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f141c] via-[#0f141c]/40 to-transparent" />
        </div>

        {/* Profile Info Overlay */}
        <div className="relative px-6 sm:px-10 pb-8 -mt-20 sm:-mt-24 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-[#080b10] border-4 border-[#0f141c] shadow-2xl shrink-0">
              {memberData.avatar ? (
                <img
                  src={memberData.avatar}
                  alt={memberData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                  <User className="w-14 h-14" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 pb-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                  {memberData.name}
                </h1>
                {memberData.domain && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40 shadow-sm">
                    <Layers className="w-3 h-3" />
                    <span>{memberData.domain}</span>
                  </span>
                )}
                {memberData.isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40">
                    ADMIN
                  </span>
                )}
              </div>

              <p className="text-[#ff9900] font-mono text-xs sm:text-sm font-semibold">
                {memberData.role}
              </p>

              {(memberData.division || memberData.branch || memberData.year) && (
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap">
                  {memberData.division && <span>{memberData.division}</span>}
                  {memberData.division && (memberData.branch || memberData.year) && <span>•</span>}
                  {memberData.branch && <span>{memberData.branch}</span>}
                  {memberData.year && <span>({memberData.year})</span>}
                </div>
              )}
            </div>
          </div>

          {/* Social Links on Header */}
          <div className="flex items-center gap-2.5 sm:self-end pb-2">
            {memberData.github && (
              <a
                href={memberData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {memberData.linkedin && (
              <a
                href={memberData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-[#0a66c2] border border-white/[0.08] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {memberData.portfolio && (
              <a
                href={memberData.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-[#00f0ff] border border-white/[0.08] transition-colors"
                title="Portfolio Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Quote */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              <User className="w-4 h-4 text-[#00f0ff]" />
              <span>About Builder</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line font-sans">
              {memberData.bio}
            </p>
          </div>

          {memberData.quote && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 to-[#0f141c] border border-purple-500/20 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#c084fc] font-bold">
                <Quote className="w-4 h-4 text-[#c084fc]" />
                <span>BUILDER MOTTO</span>
              </div>
              <blockquote className="text-base text-slate-200 font-serif italic pl-2 border-l-2 border-[#a855f7]/60">
                "{memberData.quote}"
              </blockquote>
            </div>
          )}

          {/* Certifications & Badges */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-lg space-y-6">
            <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ff9900]" />
              <span>Certifications & Credentials</span>
            </h2>

            {memberData.certs.length === 0 && memberData.badges.length === 0 ? (
              <p className="text-slate-500 text-xs font-mono">
                No external certifications linked to this builder profile yet.
              </p>
            ) : (
              <div className="space-y-4">
                {memberData.certs.map((cert: any, idx: number) => {
                  const certTitle = typeof cert === 'string' ? cert : cert.name || 'AWS Certification';
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#080b10] border border-white/[0.05]"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#ff9900] shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-200 font-medium">
                        {certTitle}
                      </span>
                    </div>
                  );
                })}

                {memberData.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {memberData.badges.map((badge: any, idx: number) => {
                      const badgeTitle = typeof badge === 'string' ? badge : badge.name || 'Badge';
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono"
                        >
                          {badgeTitle}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Meta & Domain details */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-lg space-y-5">
            <h3 className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
              // BUILDER VERIFICATION
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                  AWS Builder ID
                </div>
                <div className="text-xs text-white font-mono bg-[#080b10] px-3 py-2 rounded-lg border border-white/[0.05]">
                  {memberData.builderId || 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                  Assigned Domain
                </div>
                <div className="text-xs text-slate-200 font-mono bg-[#080b10] px-3 py-2 rounded-lg border border-white/[0.05] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>{memberData.domain || 'General Chapter Member'}</span>
                </div>
              </div>

              {memberData.division && (
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                    Division
                  </div>
                  <div className="text-xs text-slate-300">{memberData.division}</div>
                </div>
              )}

              {memberData.branch && (
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                    Academic Branch & Year
                  </div>
                  <div className="text-xs text-slate-300">
                    {memberData.branch} {memberData.year ? `· ${memberData.year}` : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
