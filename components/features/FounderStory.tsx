'use client';

import React from 'react';
import { ShieldCheck, Github, Linkedin, Globe, Quote, ExternalLink, Terminal } from 'lucide-react';
import { FOUNDER_DATA } from '@/lib/mockData';

export const FounderStory: React.FC = () => {
  return (
    <section id="founder" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header with Verified Builder ID */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#a855f7] tracking-wider uppercase font-semibold">
                // EDITORIAL FEATURE #3
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Terminal className="w-3 h-3 text-[#ff9900]" />
                <span>BUILDER_ID: disha-pure-sspu</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Founder & Community Lead
            </h2>
            <p className="text-sm font-mono text-[#ff9900] mt-1">
              Disha Pure · Symbiosis Skills and Professional University (B.Tech CSIT Cybersecurity '26)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active Chapter Steward</span>
          </div>
        </div>

        {/* 2-Column Clean Keynote Narrative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Portrait Card, Signature & Channels (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
            <div className="relative group overflow-hidden rounded-xl border border-white/[0.1]">
              <img
                src={FOUNDER_DATA.avatar}
                alt={FOUNDER_DATA.name}
                className="w-full aspect-square object-cover object-top hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="text-sm font-bold text-white font-sans">{FOUNDER_DATA.name}</div>
                <div className="text-xs font-mono text-slate-400">SSPU Kiwale Campus · AWS Captain</div>
              </div>
            </div>

            {/* Certifications Verified */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
                Accreditations
              </div>
              <div className="space-y-1.5">
                {FOUNDER_DATA.certs.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 text-xs font-mono text-slate-300"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff9900] shrink-0" />
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Digital Signature Strip */}
            <div className="pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] font-mono text-slate-500 mb-1">FOUNDER SIGNATURE</div>
              <div className="font-serif italic text-lg text-slate-300 tracking-wide">
                Disha Pure
              </div>
              <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                Key Fingerprint: 0x9B44...SSPU26
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex items-center gap-2.5">
              {FOUNDER_DATA.github && (
                <a
                  href={FOUNDER_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-white/[0.08]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {FOUNDER_DATA.linkedin && (
                <a
                  href={FOUNDER_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-white/[0.08]"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Keynote Narrative Milestones (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* The Direct Quote */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0f141c] border border-white/[0.08] relative">
              <Quote className="w-8 h-8 text-[#ff9900]/30 absolute top-6 right-6 pointer-events-none" />
              <blockquote className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed italic border-l-2 border-[#ff9900] pl-4 py-1">
                "Do not wait for graduation to deploy real cloud infrastructure. Build, break, architect, and ship code today."
              </blockquote>
              <div className="mt-3 text-xs font-mono text-slate-400 pl-4">
                — Disha Pure, Address to SSPU First & Second Year Undergrads
              </div>
            </div>

            {/* 3 Chronological Milestones */}
            <div className="space-y-6">
              {/* Milestone 1 */}
              <div className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a855f7] font-semibold">01 · THE PURPOSE</span>
                  <span className="text-slate-500">Inception</span>
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  Bridging Undergraduate Academia with Hyperscale Delivery
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  Recognizing the divide between theoretical computer science coursework and the demands of modern cloud
                  infrastructure, Disha spearheaded the creation of the AWS Student Builder Group at SSPU, launching
                  the flagship "AWS Student Builder 101" workshop series to cultivate production engineering experience directly
                  on campus.
                </p>
              </div>

              {/* Milestone 2 */}
              <div className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a855f7] font-semibold">02 · THE UNIVERSITY CHARTER</span>
                  <span className="text-slate-500">Campus Foundation</span>
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  Securing Dedicated Lab Access in Computer Lab 3
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  Working closely with faculty coordinators at Symbiosis Skills and Professional University, she chartered
                  the chapter with designated lab hours in Computer Lab 3 (Kiwale Campus), providing students with workstations,
                  high-speed connectivity, and an uninterrupted engineering sprint space.
                </p>
              </div>

              {/* Milestone 3 */}
              <div className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a855f7] font-semibold">03 · THE MISSION</span>
                  <span className="text-slate-500">Continuous Delivery</span>
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  Zero-Trust Architecture & Verifiable Deployments for Every Member
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  Combining her cybersecurity domain expertise with AWS cloud principles, the chapter’s defining pledge is that every active student builder must deploy and publish at least one
                  verifiable serverless or secure workload on AWS, supported by weekly peer architecture reviews
                  and certification study cohorts for SAA-C03 and CLF-C02.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
