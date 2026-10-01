'use client';

import React from 'react';
import { BellRing, AlertCircle, Info, Calendar, Sparkles } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/lib/mockData';

export const Announcements: React.FC = () => {
  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'UPDATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
          OFFICIAL DISPATCHES
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight mb-2">
          Chapter Announcements & Advisories
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-sans">
          Stay updated with official bulletins, exam voucher distribution cycles, lab timings, and guest speaker announcements.
        </p>
      </div>

      <div className="space-y-4">
        {ANNOUNCEMENTS.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-xl bg-aws-card border border-aws-border space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getBadgeColor(item.priority)}`}>
                  {item.priority}
                </span>
                <span className="text-xs font-mono text-purple-300 font-semibold">
                  [{item.category}]
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">{item.date}</span>
            </div>

            <h3 className="text-lg font-bold text-white font-sans">
              {item.title}
            </h3>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {item.content}
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-500">
              Dispatched by: <span className="text-slate-300">{item.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
