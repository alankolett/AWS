'use client';

import React from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { HeroSection } from '@/components/features/HeroSection';
import { SpotlightCarousel } from '@/components/features/SpotlightCarousel';
import { UpcomingEvents } from '@/components/features/UpcomingEvents';
import { FounderStory } from '@/components/features/FounderStory';
import { MeetTeam } from '@/components/features/MeetTeam';
import { InteractiveToolsSuite } from '@/components/features/InteractiveToolsSuite';
import { LearningHub } from '@/components/features/LearningHub';
import { AskSBGDrawer } from '@/components/features/AskSBGDrawer';
import { JoinModal } from '@/components/features/JoinModal';
import { AwsLogo } from '@/components/common/AwsLogo';
import { AwsChatWidget } from '@/components/chat/AwsChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080b10] text-[#f1f5f9] flex flex-col selection:bg-[#ff9900]/30 selection:text-white">
      {/* 1. Sticky Glassmorphic Top Navigation Bar */}
      <TopHeader />

      {/* 2. Flowing Single-Page Document (Natural Window Scrolling) */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Initiatives & Sprints Marquee */}
        <SpotlightCarousel />

        {/* Full Events System: Chronological Sessions, RSVP Modal, Past Archives & Lab 3 Kiosk */}
        <UpcomingEvents />

        {/* Founder Dossier */}
        <FounderStory />

        {/* Core Leadership Team */}
        <MeetTeam />

        {/* Interactive Community Builder Suite */}
        <InteractiveToolsSuite />

        {/* Learning Hub & Tracks */}
        <LearningHub />
      </main>

      {/* 3. Global Clean Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#080b10] text-slate-400 text-xs font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-6 px-1.5 rounded bg-[#0f141c] border border-white/[0.12] flex items-center justify-center">
              <AwsLogo className="w-5 h-auto" variant="dual" />
            </div>
            <span className="font-semibold text-white">
              AWS Student Builder Group
            </span>
            <span>·</span>
            <span>Symbiosis Skills and Professional University</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <span>Kiwale Campus, Pune (ap-south-1)</span>
            <span>·</span>
            <a
              href="https://builder.aws.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              builder.aws.com
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Overlays */}
      <AskSBGDrawer />
      <JoinModal />
      <AwsChatWidget />
    </div>
  );
}
