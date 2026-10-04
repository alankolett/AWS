'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateSiteSetting } from '@/app/actions/cms';
import {
  Save,
  CheckCircle2,
  Award,
  Plus,
  Trash2,
  Calendar,
  User,
  Quote,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

export default function FounderConfigPage() {
  const [loading, setLoading] = useState(true);

  // 1. Chapter Lead / Founder State
  const [pinnedFounderId, setPinnedFounderId] = useState('');
  const [founderQuote, setFounderQuote] = useState('');
  const [founderRoleOverride, setFounderRoleOverride] = useState('');
  const [founderBioOverride, setFounderBioOverride] = useState('');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  // 2. Chapter Co-Lead State
  const [pinnedCoLeadId, setPinnedCoLeadId] = useState('');
  const [coLeadRoleOverride, setCoLeadRoleOverride] = useState('');
  const [coLeadQuote, setCoLeadQuote] = useState('');
  const [coLeadBioOverride, setCoLeadBioOverride] = useState('');

  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 1. Fetch site settings
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        // Chapter Lead
        const pinnedFndr = settings.find((s) => s.key === 'pinned_founder_id')?.value;
        if (pinnedFndr) setPinnedFounderId(pinnedFndr);

        const fndr = settings.find((s) => s.key === 'founder_section')?.value;
        if (fndr) {
          setFounderQuote(fndr.quote || "Cloud architectures shape the future. Let's build it.");
          setFounderRoleOverride(fndr.role || '');
          setFounderBioOverride(fndr.bio || '');
          if (fndr.timeline && Array.isArray(fndr.timeline)) {
            setTimeline(fndr.timeline);
          } else {
            setTimeline([
              {
                date: 'Jan 2026',
                title: 'Chapter Inception',
                description: 'SSPU students recognized as an official AWS Student Builder Group chapter.',
              },
              {
                date: 'Mar 2026',
                title: 'Cloud Infrastructure Sprint',
                description: 'Launched hands-on workshop cohorts at Computer Lab 3 with AWS credits.',
              },
              {
                date: 'Oct 2026',
                title: 're:Invent Community Watch',
                description: 'Annual watch party and certification accelerator pathways for undergrads.',
              },
            ]);
          }
        }

        // Chapter Co-Lead
        const pinnedCo = settings.find((s) => s.key === 'pinned_co_lead_id')?.value;
        if (pinnedCo) setPinnedCoLeadId(pinnedCo);

        const coLead = settings.find((s) => s.key === 'co_lead_section')?.value;
        if (coLead) {
          setCoLeadRoleOverride(coLead.role || '');
          setCoLeadQuote(coLead.quote || '');
          setCoLeadBioOverride(coLead.bio || '');
        }
      }

      // 2. Fetch profiles
      const { data: profs } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
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
        description: 'Describe the chapter achievement or origin event.',
      },
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
      timeline: timeline,
    });

    await updateSiteSetting('pinned_co_lead_id', pinnedCoLeadId);
    await updateSiteSetting('co_lead_section', {
      quote: coLeadQuote,
      role: coLeadRoleOverride,
      bio: coLeadBioOverride,
    });

    setMsg('Leadership profiles & chapter origin timeline updated successfully!');
    setSaving(false);
    setTimeout(() => setMsg(''), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#a855f7] animate-pulse">Loading Leadership CMS settings...</div>
      </div>
    );
  }

  const selectedFounder = profilesList.find((p) => p.id === pinnedFounderId);
  const selectedCoLead = profilesList.find((p) => p.id === pinnedCoLeadId);

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] uppercase font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>CHAPTER LEADERSHIP CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Chapter Lead & Co-Lead Settings
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure the public Chapter Lead story, origin narrative timeline, and the Chapter Co-Lead profile mapping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/founder"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <span>View Public Page</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#a855f7] hover:bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save Changes'}</span>
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
        {/* SECTION 1: CHAPTER LEAD PROFILE MAPPING */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] font-bold uppercase tracking-wider">
            <User className="w-4 h-4 text-[#a855f7]" />
            <span>1. CHAPTER LEAD / FOUNDER MAPPING</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              Select Chapter Lead Builder Profile *
            </label>
            <select
              value={pinnedFounderId}
              onChange={(e) => setPinnedFounderId(e.target.value)}
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#a855f7] focus:outline-none font-mono"
            >
              <option value="">[Select Builder to Map as Chapter Lead]</option>
              {profilesList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name || p.email} ({p.role}) — {p.headline || 'Member'}
                </option>
              ))}
            </select>
          </div>

          {selectedFounder && (
            <div className="p-4 rounded-xl bg-[#080b10] border border-[#a855f7]/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/[0.05] border border-white/[0.1] shrink-0">
                <img
                  src={selectedFounder.avatar_url || '/stickman.svg'}
                  alt={selectedFounder.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{selectedFounder.full_name}</div>
                <div className="text-xs font-mono text-[#a855f7]">{selectedFounder.headline || 'Chapter Lead'}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  Builder ID: {selectedFounder.builder_id || 'Not set'} · {selectedFounder.email}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Chapter Lead Role Title Override
              </label>
              <input
                type="text"
                value={founderRoleOverride}
                onChange={(e) => setFounderRoleOverride(e.target.value)}
                placeholder="e.g. Founder & Chapter Captain"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Highlight Quote Override
              </label>
              <input
                type="text"
                value={founderQuote}
                onChange={(e) => setFounderQuote(e.target.value)}
                placeholder="e.g. Cloud architectures shape the future. Let's build it."
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Lead Biography Override (Leave empty to use profile bio)
            </label>
            <textarea
              rows={3}
              value={founderBioOverride}
              onChange={(e) => setFounderBioOverride(e.target.value)}
              placeholder="Custom narrative for the Chapter Lead displayed on the public page..."
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#a855f7] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: CHAPTER CO-LEAD PROFILE MAPPING (Requirement 5) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-[#00f0ff]" />
            <span>2. CHAPTER CO-LEAD MAPPING</span>
          </div>
          <p className="text-slate-400 text-xs">
            Map a core member as the Chapter Co-Lead. Their profile card and technical credentials will render directly below the Chapter Lead on the public Leadership page.
          </p>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              Select Chapter Co-Lead Builder Profile
            </label>
            <select
              value={pinnedCoLeadId}
              onChange={(e) => setPinnedCoLeadId(e.target.value)}
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#00f0ff] focus:outline-none font-mono"
            >
              <option value="">[None / Don't Display Co-Lead Section]</option>
              {profilesList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name || p.email} ({p.role}) — {p.headline || 'Member'}
                </option>
              ))}
            </select>
          </div>

          {selectedCoLead && (
            <div className="p-4 rounded-xl bg-[#080b10] border border-[#00f0ff]/30 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/[0.05] border border-white/[0.1] shrink-0">
                <img
                  src={selectedCoLead.avatar_url || '/stickman.svg'}
                  alt={selectedCoLead.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{selectedCoLead.full_name}</div>
                <div className="text-xs font-mono text-[#00f0ff]">{selectedCoLead.headline || 'Chapter Co-Lead'}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  Builder ID: {selectedCoLead.builder_id || 'Not set'} · {selectedCoLead.email}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Co-Lead Role Title Override
              </label>
              <input
                type="text"
                value={coLeadRoleOverride}
                onChange={(e) => setCoLeadRoleOverride(e.target.value)}
                placeholder="e.g. Chapter Co-Lead & Technical Architect"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                Co-Lead Quote Override
              </label>
              <input
                type="text"
                value={coLeadQuote}
                onChange={(e) => setCoLeadQuote(e.target.value)}
                placeholder="e.g. Empowering every student engineer with cloud mastery."
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Co-Lead Biography Override (Leave empty to use profile bio)
            </label>
            <textarea
              rows={3}
              value={coLeadBioOverride}
              onChange={(e) => setCoLeadBioOverride(e.target.value)}
              placeholder="Custom perspective for the Co-Lead displayed on the public page..."
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#00f0ff] focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 3: CHAPTER ORIGIN TIMELINE MILESTONES */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>3. CHAPTER ORIGIN TIMELINE MILESTONES</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Add, edit, or remove the narrative journey milestones shown in the Chapter Lead story.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="px-3.5 py-1.5 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto font-mono"
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
                      onChange={(e) => handleUpdateMilestone(idx, 'date', e.target.value)}
                      placeholder="e.g. Jan 2026"
                      className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Milestone Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateMilestone(idx, 'title', e.target.value)}
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
                    onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)}
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
            className="flex items-center gap-2 bg-[#a855f7] hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50 font-mono"
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
