'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  videoUrl?: string;
  showVideo?: boolean;
  logoUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  videoUrl,
  showVideo = true,
  logoUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const hasActiveVideo = Boolean(videoUrl && videoUrl.trim() && showVideo);

  return (
    <section id="about" className="relative w-full overflow-hidden border-b border-white/[0.08]">
      {/* ========================================================================= */}
      {/* 1. Top Video Stage Viewport (Full-Width Cinematic Backdrop - Clear View)  */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[540px] sm:h-[640px] lg:h-[720px] overflow-hidden bg-[#080b10]">
        {hasActiveVideo ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover scale-105"
              src={videoUrl}
            />
            {/* Soft atmospheric gradient: center is completely crystal clear and vibrant */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#080b10]/50 via-transparent to-[#080b10]" />
          </div>
        ) : (
          /* Subtle ambient gradient aura when purely using blueprint grid */
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff9900]/5 to-[#080b10] pointer-events-none" />
        )}

        {/* Top-Left Breadcrumbs inside the video stage */}
        <div className="absolute top-8 left-4 sm:left-8 lg:left-12 z-10 flex items-center gap-2 text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
          <span className="text-[#ff9900] font-bold">AWS</span>
          <span className="text-slate-500">/</span>
          <span>Student Builder Group</span>
          <span className="text-slate-500">/</span>
          <span className="text-white font-medium">SSPU</span>
        </div>

        {/* Floating Video Pause/Play Control in Bottom Right Corner (AWS re:Invent Style) */}
        {hasActiveVideo && (
          <div className="absolute bottom-28 right-6 sm:right-10 z-20">
            <button
              type="button"
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-[#080b10]/85 hover:bg-[#080b10] backdrop-blur-md border border-white/[0.2] text-white flex items-center justify-center transition-all hover:scale-110 shadow-2xl"
              title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
              aria-label="Toggle Hero Video Playback"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. Overlapping Row: Positioned Lower so Video Above is Fully Visible      */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-18 lg:-mt-22 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          {/* Left Column: Translucent Glass Card (Positioned lower, high contrast) */}
          <div className="lg:col-span-7">
            <div className="w-full rounded-3xl bg-[#080b10]/92 backdrop-blur-2xl border border-white/[0.16] border-t-2 border-t-[#ff9900] p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(255,153,0,0.12)] space-y-6 hover:border-white/[0.25] transition-all duration-300">
              {/* High-Priority Hub Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff9900]/15 border border-[#ff9900]/40 text-[#ff9900] text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(255,153,0,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9900] animate-pulse" />
                  <span>OFFICIAL CHAPTER PORTAL</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  CRITICAL CHAPTER RESOURCES & EVENTS
                </div>
              </div>

              {/* Eyebrow with Official AWS Logo */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0f141c] border border-white/[0.12] text-xs font-mono text-slate-300">
                  <AwsLogo className="w-5 h-auto" variant="dual" />
                  <span className="text-slate-500">·</span>
                  <span className="text-white font-medium">Student Builder Group</span>
                </div>
                <div className="font-mono text-xs font-semibold tracking-wide">
                  <span className="text-[#a855f7]">if</span>{' '}
                  <span className="text-white">building: start_here()</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] font-sans whitespace-pre-wrap">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans whitespace-pre-wrap">
                {subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#events"
                  className="h-11 px-7 rounded-full bg-white hover:bg-slate-100 text-[#080b10] font-bold text-xs sm:text-sm font-sans transition-all inline-flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Pinned Events</span>
                  <ArrowRight className="w-4 h-4 text-[#080b10]" />
                </a>

                <Link
                  href="/team"
                  className="h-11 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.15] font-semibold text-xs sm:text-sm font-sans transition-all inline-flex items-center gap-2"
                >
                  <span>Meet Chapter Collective</span>
                </Link>
              </div>

              {/* Bottom Ribbon */}
              <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-slate-300">⚡ Free Hands-on Community</span>
                <span className="text-[#ff9900]">ap-south-1 (Pune)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Rounded Chapter Emblem Logo (Custom Upload via Admin or Default) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-[420px] flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl bg-[#080b10]/92 backdrop-blur-2xl border border-white/[0.16] border-t-2 border-t-[#ff9900] shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(255,153,0,0.12)] space-y-6 text-center group hover:border-white/[0.25] transition-all duration-300">
              {/* Ambient radial glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff9900]/15 via-[#a855f7]/10 to-[#00f0ff]/15 rounded-3xl blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity" />

              {/* Circular Rounded Logo Badge - Bigger Size */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 bg-gradient-to-tr from-[#ff9900] via-[#a855f7] to-[#00f0ff] shadow-[0_0_40px_rgba(255,153,0,0.35)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#080b10] border-2 border-white/[0.2] overflow-hidden flex items-center justify-center p-2.5 relative group-hover:scale-105 transition-transform duration-300">
                  {logoUrl && logoUrl.trim() ? (
                    <img
                      src={logoUrl}
                      alt="AWS Chapter Rounded Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3">
                      <AwsLogo className="w-24 sm:w-28 h-auto" variant="dual" />
                    </div>
                  )}
                </div>
              </div>

              {/* Chapter Information with Full College Name */}
              <div className="relative space-y-2 w-full px-2">
                <div className="text-xs sm:text-sm font-mono font-bold text-white tracking-widest uppercase">
                  AWS STUDENT BUILDER GROUP
                </div>
                <div className="text-xs sm:text-sm font-mono text-[#ff9900] font-semibold tracking-wide whitespace-normal leading-relaxed">
                  Symbiosis Skills and Professional University
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Kiwale Campus, Pune · ap-south-1
                </div>
              </div>

              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Official Academic Chapter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
