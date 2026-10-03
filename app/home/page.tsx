import React from 'react';
import { HeroSection } from '@/components/features/HeroSection';
import { UpcomingEvents } from '@/components/features/UpcomingEvents';
import { FounderStory } from '@/components/features/FounderStory';
import { BuilderBackground } from '@/components/canvas/BuilderBackground';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 0; // Don't cache rigidly so admin changes show up quickly

export default async function HomePage() {
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

  const { data: settings } = await supabase.from('site_settings').select('*');
  
  let heroTitle = "Architect the Cloud.\nBuild at SSPU.";
  let heroSubtitle = "The official AWS Student Builder Group at Symbiosis Skills and Professional University. Preparing student engineers through hands-on architectural sprints, cloud security labs, and official AWS certification pathways.";
  let pinnedEventId = "";
  let pinnedFounderId = "";

  let founderName = "Founder Name";
  let founderRole = "Founder / Captain";
  let founderQuote = "Cloud architectures shape the future. Let's build it.";
  let avatarUrl = "";
  let bio = "";
  let builderId = "";
  let githubUrl = "";
  let linkedinUrl = "";
  let portfolioUrl = "";
  let headline = "";
  let founderTimeline: any[] | undefined = undefined;
  let division = "";
  let branch = "";
  let year = "";
  let certifications: any[] = [];
  let badges: any[] = [];

  let teamPhotoUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600";
  let teamPhotoCaption = "AWS Student Builder Group @ SSPU · Student Engineers & Chapter Collective";

  if (settings) {
    const heroSetting = settings.find(s => s.key === 'hero_section');
    if (heroSetting && heroSetting.value) {
      heroTitle = heroSetting.value.title || heroTitle;
      heroSubtitle = heroSetting.value.subtitle || heroSubtitle;
    }
    const pinnedSetting = settings.find(s => s.key === 'pinned_event_id');
    if (pinnedSetting && pinnedSetting.value) {
      pinnedEventId = pinnedSetting.value;
    }

    const pinnedFounderSetting = settings.find(s => s.key === 'pinned_founder_id');
    if (pinnedFounderSetting && pinnedFounderSetting.value) {
      pinnedFounderId = pinnedFounderSetting.value;
    }

    const founderSetting = settings.find(s => s.key === 'founder_section')?.value;
    if (founderSetting) {
      if (founderSetting.name) founderName = founderSetting.name;
      if (founderSetting.role) founderRole = founderSetting.role;
      if (founderSetting.quote) founderQuote = founderSetting.quote;
      if (founderSetting.bio && typeof founderSetting.bio === 'string' && founderSetting.bio.trim()) {
        bio = founderSetting.bio.trim();
      }
      if (founderSetting.timeline) founderTimeline = founderSetting.timeline;
    }

    const teamPhotoSetting = settings.find(s => s.key === 'team_photo')?.value;
    if (teamPhotoSetting) {
      if (teamPhotoSetting.url) teamPhotoUrl = teamPhotoSetting.url;
      if (teamPhotoSetting.caption) teamPhotoCaption = teamPhotoSetting.caption;
    }
  }

  // If a profile is pinned as the Founder, load their data from profiles table
  if (pinnedFounderId && typeof pinnedFounderId === 'string' && pinnedFounderId.trim()) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', pinnedFounderId)
      .single();

    if (profile) {
      founderName = profile.full_name || founderName;
      founderRole = profile.headline || (profile.role === 'admin' ? 'Founder & Lead' : 'Core Member');
      avatarUrl = profile.avatar_url || '';
      if (!bio && profile.bio) bio = profile.bio;
      builderId = profile.builder_id || '';
      githubUrl = profile.github_url || '';
      linkedinUrl = profile.linkedin_url || '';
      portfolioUrl = profile.portfolio_url || '';
      headline = profile.headline || '';
      division = profile.division || '';
      branch = profile.branch || '';
      year = profile.year || '';
      certifications = profile.certifications || [];
      badges = profile.badges || [];
      if (profile.quote && founderQuote === "Cloud architectures shape the future. Let's build it.") {
        founderQuote = profile.quote;
      }
    }
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-hidden">
      {/* Full-Page Official Blueprint Grid & 8-Bit Pixel Star Canvas */}
      <BuilderBackground />

      <div className="relative z-10 flex flex-col w-full">
        <HeroSection title={heroTitle} subtitle={heroSubtitle} />

        {/* Full Size Team Photo Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="text-xs font-mono text-[#ff9900] tracking-wider uppercase mb-1 font-semibold">
                  // CHAPTER SQUAD
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                  Our Chapter Collective
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Symbiosis Skills & Professional University
              </div>
            </div>

            <div className="relative w-full aspect-[21/9] sm:aspect-[24/10] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#080b10] shadow-2xl group">
              <img
                src={teamPhotoUrl}
                alt="AWS Student Builder Group Team"
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="font-medium text-white">{teamPhotoCaption}</span>
                <span className="text-[#ff9900] hidden sm:block">AWS STUDENT BUILDER GROUP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured / Pinned event spotlight (Only displayed when an event is explicitly pinned) */}
        {pinnedEventId && typeof pinnedEventId === 'string' && pinnedEventId.trim().length > 0 ? (
          <UpcomingEvents pinnedEventId={pinnedEventId.trim()} />
        ) : null}

        {/* Pinned Founder Profile & Story (Only displayed when a founder is explicitly pinned) */}
        {pinnedFounderId && typeof pinnedFounderId === 'string' && pinnedFounderId.trim().length > 0 ? (
          <FounderStory
            name={founderName}
            role={founderRole}
            quote={founderQuote}
            avatarUrl={avatarUrl}
            bio={bio}
            builderId={builderId}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            portfolioUrl={portfolioUrl}
            headline={headline}
            division={division}
            branch={branch}
            year={year}
            certifications={certifications}
            badges={badges}
            timeline={founderTimeline}
          />
        ) : null}
      </div>
    </div>
  );
}
