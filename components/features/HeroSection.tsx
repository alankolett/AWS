'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AwsLogo } from '@/components/common/AwsLogo';
import { BuilderBackground } from '@/components/canvas/BuilderBackground';

export const HeroSection: React.FC = () => {
  const { setJoinModalOpen } = useAppStore();

  return (
    <section id="about" className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] overflow-hidden">
      {/* Official AWS Builder Center Retro Pixel-Art Canvas & Blueprint Grid */}
      <BuilderBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Eyebrow with Official AWS Logo */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0f141c] border border-white/[0.1] text-xs font-mono text-slate-300">
            <AwsLogo className="w-5 h-auto" variant="dual" />
            <span className="text-slate-500">·</span>
            <span className="text-white font-medium">Student Builder Group</span>
          </div>
          <div className="font-mono text-xs sm:text-sm font-semibold tracking-wide">
            <span className="text-[#a855f7]">if</span>{' '}
            <span className="text-white">building: start_here()</span>
          </div>
        </div>

        {/* Giant Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6 font-sans">
          Architect the Cloud.
          <br />
          Build at SSPU.
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed font-sans mb-10">
          The official AWS Student Builder Group at Symbiosis Skills and Professional University.
          Preparing student engineers through hands-on architectural sprints, cloud security labs,
          and official AWS certification pathways.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Primary: Solid White */}
          <button
            onClick={() => setJoinModalOpen(true)}
            className="h-11 px-6 rounded-md bg-white hover:bg-slate-100 text-[#080b10] font-semibold text-sm font-sans tracking-normal transition-colors"
          >
            Join Chapter Cohort
          </button>

          {/* Secondary: Outline */}
          <a
            href="#events"
            className="h-11 px-6 rounded-md bg-transparent hover:bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.12] hover:border-white/[0.25] font-semibold text-sm font-sans transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Upcoming Sessions</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Real Context Ribbon (Zero fabricated numbers) */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center flex-wrap gap-x-3 gap-y-2 text-xs font-mono text-slate-400">
          <span className="text-slate-300">Base: Computer Lab 3</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            Chapter Lead: <a href="#founder" className="text-[#a855f7] hover:underline">Disha Pure</a>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Free Hands-on Community</span>
        </div>
      </div>
    </section>
  );
};
