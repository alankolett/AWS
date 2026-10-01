'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Sparkles, MessageSquare, ExternalLink, QrCode } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AwsLogo } from '@/components/common/AwsLogo';

export const JoinModal: React.FC = () => {
  const { isJoinModalOpen, setJoinModalOpen, updateUserProfile } = useAppStore();

  const [name, setName] = useState('');
  const [prn, setPrn] = useState('');
  const [branch, setBranch] = useState('B.Tech CSIT · Class of 2026');
  const [builderId, setBuilderId] = useState('');
  const [role, setRole] = useState<'General Member' | 'Volunteer' | 'Speaker'>('General Member');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isJoinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prn.trim()) return;

    const assignedBuilderId = builderId.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '-')}-sspu`;

    updateUserProfile({
      name: name.trim(),
      prn: prn.trim(),
      branchYear: branch,
      role: role === 'General Member' ? 'Student Builder' : role,
      tier: 'MEMBER',
      builderId: assignedBuilderId,
    });

    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    setJoinModalOpen(false);
    // Smooth scroll down to interactive tools section
    const toolsEl = document.getElementById('tools');
    if (toolsEl) {
      toolsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0f141c] border border-white/[0.12] rounded-2xl p-6 sm:p-7 shadow-2xl relative">
        <button
          type="button"
          onClick={() => setJoinModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1">
                  // FEATURE #13 • CHAPTER REGISTRATION
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
                  Join AWS SBG @ SSPU
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Access official AWS sandbox accounts, re:Invent watch parties, and hands-on lab sessions in Computer Lab 3.
                </p>
              </div>
              <div className="h-9 px-2 rounded-lg bg-[#080b10] border border-white/[0.1] flex items-center justify-center shrink-0 mt-1">
                <AwsLogo className="w-7 h-auto" variant="dual" />
              </div>
            </div>

            {/* Application Role Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Select Application Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['General Member', 'Volunteer', 'Speaker'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-mono text-center border transition-all ${
                      role === r
                        ? 'bg-white text-[#080b10] font-bold border-white'
                        : 'bg-[#080b10] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!builderId || builderId.endsWith('-sspu')) {
                    setBuilderId(`${e.target.value.toLowerCase().replace(/\s+/g, '-')}-sspu`);
                  }
                }}
                placeholder="e.g. Samarth Jadhav"
                required
                className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
              />
            </div>

            {/* SSPU PRN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-medium">SSPU PRN</label>
                <input
                  type="text"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  placeholder="e.g. 20240104033"
                  required
                  className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
                />
              </div>

              {/* Builder ID */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-medium">Builder ID</label>
                <input
                  type="text"
                  value={builderId}
                  onChange={(e) => setBuilderId(e.target.value)}
                  placeholder="e.g. samarth-sspu"
                  required
                  className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Academic Branch */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-medium">Academic Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-xs text-white font-mono focus:border-[#a855f7] focus:outline-none"
              >
                <option value="B.Tech CSIT · Class of 2026" className="bg-[#080b10] text-white">B.Tech CSIT · Class of 2026</option>
                <option value="B.Tech Cybersecurity · Class of 2026" className="bg-[#080b10] text-white">B.Tech Cybersecurity · Class of 2026</option>
                <option value="B.Tech AI & Data Science · Class of 2027" className="bg-[#080b10] text-white">B.Tech AI & Data Science · Class of 2027</option>
                <option value="B.Tech Software Engineering · Class of 2025" className="bg-[#080b10] text-white">B.Tech Software Engineering · Class of 2025</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs tracking-tight flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Confirm & Generate Digital Builder Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-sans">
                Welcome to AWS SBG @ SSPU!
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Your membership for <strong className="text-white">{role}</strong> has been registered.
                Your Builder ID is <span className="text-[#a855f7] font-mono font-semibold">{builderId}</span>.
              </p>
            </div>

            {/* Community Group Links */}
            <div className="p-4 rounded-xl bg-[#080b10] border border-white/[0.08] text-left space-y-3">
              <div className="text-[11px] font-mono text-[#ff9900] font-semibold uppercase">
                Official Community Group Invites:
              </div>

              <div className="flex flex-col gap-2 text-xs font-mono">
                <a
                  href="https://chat.whatsapp.com/sspu-aws-builders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0f141c] hover:bg-[#161c28] border border-white/[0.08] text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Join WhatsApp Community (Announcements)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href="https://discord.gg/aws-builders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0f141c] hover:bg-[#161c28] border border-white/[0.08] text-slate-200 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span>Join Chapter Discord (Labs & Coding)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Action */}
            <button
              type="button"
              onClick={handleFinish}
              className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs tracking-tight transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Inspect Your Digital Builder Pass →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
