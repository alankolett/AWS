import React from 'react';
import { HeroSection } from '@/components/features/HeroSection';
import { UpcomingEvents } from '@/components/features/UpcomingEvents';
import { FeaturedPeople, FeaturedPerson } from '@/components/features/FeaturedPeople';
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
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: settings } = await supabase.from('site_settings').select('*');

  // Hero section state
  let heroTitle = 'Architect the Cloud. Build at SSPU.\nShape the Future of Cloud Computing.';
  let heroSubtitle =
    'The official AWS Student Builder Group at Symbiosis Skills and Professional University.';
  let heroVideoUrl = '';
  let showHeroVideo = true;
  let heroLogoUrl = '';

  // Pinned Events state
  let showPinnedEvents = true;
  let pinnedEventIds: string[] = [];

  // Featured People state
  let showFeaturedPeople = true;
  let featuredPeopleTag = '// CHAPTER HONORED GUESTS & DIGNITARIES';
  let featuredPeopleTitle = 'Featured Builders & Dignitaries';
  let featuredPeopleSubtitle =
    'Distinguished industry architects, university patrons, and keynote speakers shaping the AWS student ecosystem.';
  let featuredPeople: FeaturedPerson[] = [];

  let teamPhotoUrl =
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600';
  let teamPhotoCaption =
    'AWS Student Builder Group @ SSPU · Student Engineers & Chapter Collective';

  if (settings) {
    const heroSetting = settings.find((s) => s.key === 'hero_section')?.value;
    if (heroSetting) {
      heroTitle = heroSetting.title || heroTitle;
      heroSubtitle = heroSetting.subtitle || heroSubtitle;
      heroVideoUrl = heroSetting.video_url || '';
      showHeroVideo = heroSetting.show_video !== false;
      heroLogoUrl = heroSetting.logo_url || '';
    }

    const showEvts = settings.find((s) => s.key === 'show_pinned_events')?.value;
    showPinnedEvents = showEvts !== false;

    const pinnedEvtsSetting = settings.find((s) => s.key === 'pinned_event_ids')?.value;
    const pinnedSingleSetting = settings.find((s) => s.key === 'pinned_event_id')?.value;
    if (Array.isArray(pinnedEvtsSetting) && pinnedEvtsSetting.length > 0) {
      pinnedEventIds = pinnedEvtsSetting;
    } else if (pinnedSingleSetting && typeof pinnedSingleSetting === 'string' && pinnedSingleSetting.trim()) {
      pinnedEventIds = [pinnedSingleSetting.trim()];
    }

    const fpSetting = settings.find((s) => s.key === 'featured_people_section')?.value;
    if (fpSetting) {
      showFeaturedPeople = fpSetting.show_section !== false;
      featuredPeopleTag = fpSetting.tag || featuredPeopleTag;
      featuredPeopleTitle = fpSetting.title || featuredPeopleTitle;
      featuredPeopleSubtitle = fpSetting.subtitle || featuredPeopleSubtitle;
      featuredPeople = Array.isArray(fpSetting.people) ? fpSetting.people : [];
    }

    const teamPhotoSetting = settings.find((s) => s.key === 'team_photo')?.value;
    if (teamPhotoSetting) {
      if (teamPhotoSetting.url) teamPhotoUrl = teamPhotoSetting.url;
      if (teamPhotoSetting.caption) teamPhotoCaption = teamPhotoSetting.caption;
    }
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      <div className="relative z-10 flex flex-col w-full">
        {/* Hero Section with AWS re:Invent Video Layer & Translucent Glass Card */}
        <HeroSection
          title={heroTitle}
          subtitle={heroSubtitle}
          videoUrl={heroVideoUrl}
          showVideo={showHeroVideo}
          logoUrl={heroLogoUrl}
        />

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

        {/* Pinned Events Spotlight (Supports Multiple Pinned Events with Toggle) */}
        {showPinnedEvents && pinnedEventIds.length > 0 ? (
          <UpcomingEvents pinnedEventIds={pinnedEventIds} />
        ) : null}

        {/* Featured Dignitaries & Mentors Section (Alternating Left/Right Cards) */}
        {showFeaturedPeople && featuredPeople.length > 0 ? (
          <FeaturedPeople
            people={featuredPeople}
            sectionTag={featuredPeopleTag}
            sectionTitle={featuredPeopleTitle}
            sectionSubtitle={featuredPeopleSubtitle}
          />
        ) : null}
      </div>
    </div>
  );
}
