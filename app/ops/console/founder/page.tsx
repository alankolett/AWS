'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateSiteSetting } from '@/app/actions/cms';
import { Save, CheckCircle2, Award, Plus, Trash2, Calendar, User, Quote, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

export default function FounderConfigPage() {
  const [loading, setLoading] = useState(true);
  const [pinnedFounderId, setPinnedFounderId] = useState('');
  const [founderQuote, setFounderQuote] = useState('');
  const [founderRoleOverride, setFounderRoleOverride] = useState('');
  const [founderBioOverride, setFounderBioOverride] = useState('');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 1. Fetch site settings
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        const pinnedFndr = settings.find(s => s.key === 'pinned_founder_id')?.value;
        if (pinnedFndr) setPinnedFounderId(pinnedFndr);

        const fndr = settings.find(s => s.key === 'founder_section')?.value;
        if (fndr) {
          setFounderQuote(fndr.quote || "Cloud architectures shape the future. Let's build it.");
          setFounderRoleOverride(fndr.role || '');
          setFounderBioOverride(fndr.bio || '');
          if (fndr.timeline && Array.isArray(fndr.timeline)) {
            setTimeline(fndr.timeline);
          } else {
            setTimeline([
              { date: 'Jan 2026', title: 'Chapter Inception', description: 'SSPU students recognized as an official AWS Student Builder Group chapter.' },
              { date: 'Mar 2026', title: 'Cloud Infrastructure Sprint', description: 'Launched hands-on workshop cohorts at Computer Lab 3 with AWS credits.' },
              { date: 'Oct 2026', title: 're:Invent Community Watch', description: 'Annual watch party and certification accelerator pathways for undergrads.' }
            ]);
          }
        }
      }

      // 2. Fetch profiles
      const { data: profs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setProfilesList(profs || []);

      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleAddMilestone = () => {
    setTimeline([
      ...timeline,
      {
        date: 'New Date',
        title: 'Milestone Title',
        description: 'Describe the chapter achievement or origin event.'
      }
    ]);
  };

  const handleUpdateMilestone = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };

  const handleRemoveMilestone = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    await updateSiteSetting('pinned_founder_id', pinnedFounderId);
    await updateSiteSetting('founder_section', {
      quote: founderQuote,
      role: founderRoleOverride,
      bio: founderBioOverride,
      timeline: timeline
    });

    setMsg('Founder profile & origin timeline updated successfully!');
    setSaving(false);
    setTimeout(() => setMsg(''), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#a855f7] animate-pulse">Loading Founder Configuration...</div>
      </div>
    );
  }

  const pinnedFounderProfile = profilesList.find(p => p.id === pinnedFounderId);

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] uppercase font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>FOUNDER & ORIGIN STORY CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Founder Profile & Chapter Timeline
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure the verified Founder identity and manage the editorial chapter origin timeline displayed on /founder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/founder"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <span>View Public /founder</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#a855f7] hover:bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Pinned Profile Selection */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] font-bold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>SELECT CHAPTER FOUNDER FROM DATABASE</span>
          </div>
          <p className="text-slate-400 text-xs">
            Binding a profile links their photo, bio, GitHub, LinkedIn, portfolio, and Verified Builder ID directly to the Founder section.
          </p>

          <select
            value={pinnedFounderId}
            onChange={e => setPinnedFounderId(e.target.value)}
            className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#a855f7] focus:outline-none font-mono"
          >
            <option value="">[None / Default Story Only]</option>
            {profilesList.map(p => (
              <option key={p.id} value={p.id}>
                {p.full_name || p.email} ({p.role}) — {p.headline || 'Member'}
              </option>
            ))}
          </select>

          {pinnedFounderProfile && (
            <div className="p-5 rounded-xl bg-[#080b10] border border-[#a855f7]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/[0.05] border border-white/[0.1] shrink-0">
                  <img
                    src={pinnedFounderProfile.avatar_url || '/stickman.svg'}
                    alt={pinnedFounderProfile.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-white">{pinnedFounderProfile.full_name}</div>
                  <div className="text-xs font-mono text-[#a855f7]">{pinnedFounderProfile.headline || 'Founder & Lead'}</div>
                  <div className="text-[11px] font-mono text-slate-400">ID: {pinnedFounderProfile.builder_id || 'Not assigned'} · {pinnedFounderProfile.email}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20 self-start sm:self-auto">
                ● Live Binding Active
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Founder Role / Title Override
              </label>
              <input
                type="text"
                value={founderRoleOverride}
                onChange={e => setFounderRoleOverride(e.target.value)}
                placeholder="e.g. Founder & Community Lead"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Keynote Quote
              </label>
              <input
                type="text"
                value={founderQuote}
                onChange={e => setFounderQuote(e.target.value)}
                placeholder="e.g. Cloud architectures shape the future. Let's build it."
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              About Founder / Biography Narrative (Leave blank to inherit pinned profile's bio)
            </label>
            <textarea
              rows={4}
              value={founderBioOverride}
              onChange={e => setFounderBioOverride(e.target.value)}
              placeholder="Detailed narrative about the chapter founder, mission, and background..."
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#a855f7] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Chapter Origin Timeline Editor (Requirement 2) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>CHAPTER ORIGIN TIMELINE MILESTONES</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Add, edit, or remove the narrative journey milestones shown on the public Founder page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="px-3.5 py-1.5 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#a855f7]">
                    Milestone {String(idx + 1).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                    title="Remove Milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Date / Month</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={e => handleUpdateMilestone(idx, 'date', e.target.value)}
                      placeholder="e.g. Jan 2026"
                      className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Milestone Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => handleUpdateMilestone(idx, 'title', e.target.value)}
                      placeholder="e.g. Official Chapter Grant"
                      className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Description / Narrative</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={e => handleUpdateMilestone(idx, 'description', e.target.value)}
                    placeholder="Details about what happened during this phase..."
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#a855f7] hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save Changes'}</span>
          </button>
          {msg && (
            <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {msg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
