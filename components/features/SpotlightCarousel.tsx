'use client';

import React from 'react';
import { ArrowRight, Calendar, MapPin, Terminal, Shield, Cpu, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AwsLogo } from '@/components/common/AwsLogo';

interface InitiativeItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  actionText: string;
  actionHref?: string;
  isActionRsvp?: boolean;
  dateOrLocation: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SpotlightCarousel: React.FC = () => {
  const { registeredEventIds, toggleEventRegistration, setJoinModalOpen } = useAppStore();

  const initiatives: InitiativeItem[] = [
    {
      id: 'init-1',
      title: 're:Invent Watch Party & Bedrock Hack Jam',
      tag: 'KEYNOTE & LAB • LAB 3',
      description:
        'Live streaming keynote announcements followed by a 2-hour hands-on Claude 3.5 Sonnet serverless sprint on Amazon Bedrock.',
      actionText: 'Reserve Seat →',
      isActionRsvp: true,
      dateOrLocation: 'Oct 18, 2026 · Lab 3',
      icon: Cpu,
    },
    {
      id: 'init-2',
      title: 'Solutions Architect Associate (SAA-C03) Study Cohort',
      tag: 'CERTIFICATION SPRINT',
      description:
        'Weekly peer reviews covering VPC peering, IAM zero-trust boundaries, Aurora clustering, and architectural case studies.',
      actionText: 'View Syllabus →',
      actionHref: '#learning',
      dateOrLocation: 'Wednesdays · 4:30 PM',
      icon: BookOpen,
    },
    {
      id: 'init-3',
      title: 'Cloud Security & AI Honeypot Defense Lab',
      tag: 'CYBERSECURITY SIG',
      description:
        'Hands-on analysis of EC2 honeypot logs, AWS WAF rules, and automated threat classification with Python.',
      actionText: 'Access Lab Repo →',
      actionHref: 'https://github.com',
      dateOrLocation: 'Bi-weekly · Lab 3',
      icon: Shield,
    },
  ];

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1">
              // SPOTLIGHT SPRINT MARQUEE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Featured Initiatives & Sprints
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl font-sans">
              Active engineering cohorts, keynotes, and technical working groups meeting at Computer Lab 3.
            </p>
          </div>

          <a
            href="#tools"
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Create attendee pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Spacious Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initiatives.map((item) => {
            const isRegistered = registeredEventIds.includes(item.id);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.18] transition-all hover:bg-[#131a24]"
              >
                <div>
                  {/* Tag & Time */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 px-1 rounded bg-black/40 border border-white/[0.1] inline-flex items-center">
                        <AwsLogo className="w-3.5 h-auto" variant="dual" />
                      </div>
                      <span className="text-[11px] font-mono tracking-wider font-semibold text-[#a855f7]">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.dateOrLocation}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white font-sans leading-snug group-hover:text-white transition-colors mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  {item.isActionRsvp ? (
                    <button
                      onClick={() => toggleEventRegistration(item.id)}
                      className={`text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                        isRegistered
                          ? 'text-emerald-400'
                          : 'text-[#ff9900] hover:text-[#ffb84d]'
                      }`}
                    >
                      <span>{isRegistered ? '✓ Seat Reserved' : item.actionText}</span>
                    </button>
                  ) : item.actionHref?.startsWith('http') ? (
                    <a
                      href={item.actionHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>{item.actionText}</span>
                    </a>
                  ) : (
                    <a
                      href={item.actionHref || '#'}
                      className="text-xs font-mono font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>{item.actionText}</span>
                    </a>
                  )}

                  <Icon className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
