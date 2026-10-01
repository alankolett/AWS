'use client';

import React from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { OPPORTUNITIES } from '@/lib/mockData';

export const OpportunitiesHub: React.FC = () => {
  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
          INDUSTRY CAREER PIPELINE
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight mb-2">
          Cloud Internships & Grants
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-sans">
          Curated opportunities, verified internships in Pune tech parks, and AWS promotional credit grants
          for undergraduate builders at Symbiosis Skills University.
        </p>
      </div>

      <div className="space-y-4">
        {OPPORTUNITIES.map((opp) => (
          <div
            key={opp.id}
            className="p-6 rounded-xl bg-aws-card border border-aws-border hover:border-cyan-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-950/80 border border-blue-500/30 text-blue-300">
                  {opp.type}
                </span>
                {opp.isVerified && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Opportunity</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white font-sans">
                {opp.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
                <span className="text-slate-200 font-semibold">{opp.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {opp.location}
                </span>
                {opp.stipend && (
                  <>
                    <span>•</span>
                    <span className="text-aws-smile font-semibold">{opp.stipend}</span>
                  </>
                )}
                <span>•</span>
                <span className="text-slate-400">Deadline: {opp.deadline}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {opp.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={opp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start md:self-center px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-bold font-mono text-xs tracking-tight flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
