'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, Github, Linkedin, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { CORE_TEAM } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export const BuilderProfiles: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  const filteredBuilders = CORE_TEAM.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.name.toLowerCase().includes(term) ||
      b.role.toLowerCase().includes(term) ||
      b.division.toLowerCase().includes(term) ||
      b.certs.some((c) => c.toLowerCase().includes(term));

    const matchesYear = selectedYear === 'All' || b.year.includes(selectedYear);
    return matchesSearch && matchesYear;
  });

  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            CHAPTER COMMUNITY DIRECTORY
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight">
            Student Builder Directory
          </h1>
          <p className="text-sm text-slate-400 font-sans mt-1">
            Connect with certified student architects, cloud specialists, and open-source contributors at SSPU.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('builder-pass')}
          className="self-start px-3.5 py-2 rounded-lg bg-aws-card border border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Claim Your Pass</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search builders by name, skill, or AWS certification..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-aws-card border border-aws-border text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Year 2', 'Year 3'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors border ${
                selectedYear === yr
                  ? 'bg-slate-800 border-cyan-400 text-cyan-300 font-semibold'
                  : 'bg-aws-card border-aws-border text-slate-400 hover:text-white'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuilders.map((builder) => (
          <div
            key={builder.id}
            className="p-5 rounded-xl bg-aws-card border border-aws-border hover:border-cyan-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3.5">
                <img
                  src={builder.avatar}
                  alt={builder.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{builder.name}</h3>
                  <div className="text-xs font-mono text-cyan-400">{builder.role}</div>
                  <div className="text-[10px] font-mono text-slate-400">{builder.year}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4 line-clamp-3">
                {builder.bio}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {builder.certs.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-aws-smile"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="pt-3 border-t border-aws-border flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-slate-500">{builder.division.split(' ')[0]}</span>
              <div className="flex items-center gap-2 text-slate-400">
                {builder.github && (
                  <a href={builder.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {builder.linkedin && (
                  <a href={builder.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
