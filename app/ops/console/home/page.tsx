'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateSiteSetting, updateSiteSettingsBatch } from '@/app/actions/cms';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Save, CheckCircle2, Layout, Sparkles, Calendar, User, Image as ImageIcon } from 'lucide-react';

export default function HomeCMSPage() {
  const [loading, setLoading] = useState(true);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [pinnedEventId, setPinnedEventId] = useState('');
  const [pinnedFounderId, setPinnedFounderId] = useState('');
  
  // Team Photo state
  const [teamPhotoUrl, setTeamPhotoUrl] = useState('');
  const [teamPhotoCaption, setTeamPhotoCaption] = useState('');

  const [eventsList, setEventsList] = useState<any[]>([]);
  const [profilesList, setProfilesList] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 1. Fetch site settings
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        const hero = settings.find(s => s.key === 'hero_section')?.value;
        if (hero) {
          setHeroTitle(hero.title || '');
          setHeroSubtitle(hero.subtitle || '');
        }
        const pinnedEvt = settings.find(s => s.key === 'pinned_event_id')?.value;
        setPinnedEventId(pinnedEvt || '');

        const pinnedFndr = settings.find(s => s.key === 'pinned_founder_id')?.value;
        setPinnedFounderId(pinnedFndr || '');

        const tp = settings.find(s => s.key === 'team_photo')?.value;
        if (tp) {
          setTeamPhotoUrl(tp.url || '');
          setTeamPhotoCaption(tp.caption || '');
        } else {
          setTeamPhotoUrl('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600');
          setTeamPhotoCaption('AWS Student Builder Group @ SSPU · Student Engineers & Chapter Collective');
        }
      }

      // 2. Fetch events
      const { data: evts } = await supabase.from('events').select('id, title, event_date').order('event_date', { ascending: false });
      setEventsList(evts || []);

      // 3. Fetch profiles
      const { data: profs } = await supabase.from('profiles').select('id, full_name, email, role, headline, avatar_url').order('created_at', { ascending: false });
      setProfilesList(profs || []);

      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const res = await updateSiteSettingsBatch([
      { key: 'hero_section', value: { title: heroTitle, subtitle: heroSubtitle } },
      { key: 'pinned_event_id', value: pinnedEventId || '' },
      { key: 'pinned_founder_id', value: pinnedFounderId || '' },
      { key: 'team_photo', value: { url: teamPhotoUrl, caption: teamPhotoCaption } },
    ]);

    if (res.error) {
      setMsg(`Error saving settings: ${res.error}`);
    } else {
      setMsg('Home Page CMS settings saved and published globally!');
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#ff9900] animate-pulse">Loading Home CMS settings...</div>
      </div>
    );
  }

  const pinnedFounderProfile = profilesList.find(p => p.id === pinnedFounderId);

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] uppercase font-semibold mb-1">
            <Layout className="w-4 h-4" />
            <span>HOME PAGE CMS CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Home Page Content & Layout
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure the hero header, full-size chapter squad photo, featured event spotlight, and pinned founder story.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-2.5 px-6 rounded-lg text-xs transition-colors shadow-lg disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing Changes...' : 'Save Changes'}</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Hero Text */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#a855f7]" />
            <span>HERO BANNER HEADINGS</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Hero Main Heading (Multi-line supported)
            </label>
            <textarea
              rows={2}
              value={heroTitle}
              onChange={e => setHeroTitle(e.target.value)}
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-sm text-white focus:border-[#a855f7] focus:outline-none"
              placeholder="Architect the Cloud.&#10;Build at SSPU."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={e => setHeroSubtitle(e.target.value)}
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-sm text-white focus:border-[#a855f7] focus:outline-none leading-relaxed"
              placeholder="The official AWS Student Builder Group at Symbiosis Skills and Professional University..."
            />
          </div>
        </div>

        {/* Section 2: Full-Size Team Photo (Requirement 5) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
            <ImageIcon className="w-4 h-4" />
            <span>FULL-SIZE CHAPTER SQUAD PHOTO</span>
          </div>
          <p className="text-slate-400 text-xs">
            Upload an official squad or cohort photograph displayed in full-width cinematic style on the home page.
          </p>

          <ImageUpload
            value={teamPhotoUrl}
            onChange={url => setTeamPhotoUrl(url)}
            bucket="team-photos"
            label="Upload Team Photograph"
            aspect="banner"
            helperText="Upload wide high-resolution photo (16:9 or 21:9) stored directly in Supabase Storage"
          />

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Photo Caption / Banner Text
            </label>
            <input
              type="text"
              value={teamPhotoCaption}
              onChange={e => setTeamPhotoCaption(e.target.value)}
              placeholder="e.g. AWS Student Builder Group @ SSPU · Student Engineers & Chapter Collective"
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2.5 text-xs text-white focus:border-[#ff9900] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Featured Event Spotlight */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>PINNED EVENT SPOTLIGHT</span>
          </div>
          <p className="text-slate-400 text-xs">
            Select an event to spotlight prominently on the home page. Leave unselected to hide the section.
          </p>

          <select
            value={pinnedEventId}
            onChange={e => setPinnedEventId(e.target.value)}
            className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-[#00f0ff] focus:outline-none font-mono"
          >
            <option value="">[None / Hide Featured Event on Home]</option>
            {eventsList.map(evt => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.event_date}) — ID: {evt.id}
              </option>
            ))}
          </select>
        </div>

        {/* Section 4: Pinned Founder Profile (Requirement 2) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>PINNED FOUNDER PROFILE FOR HOME PAGE</span>
          </div>
          <p className="text-slate-400 text-xs">
            Pin a builder as the Chapter Founder. Their full details (photo, verified builder ID, bio, headline) will drive the Founder feature on the home page.
          </p>

          <select
            value={pinnedFounderId}
            onChange={e => setPinnedFounderId(e.target.value)}
            className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
          >
            <option value="">[None / Don't Show Founder Story on Home]</option>
            {profilesList.map(p => (
              <option key={p.id} value={p.id}>
                {p.full_name || p.email} ({p.role}) — {p.headline || 'Member'}
              </option>
            ))}
          </select>

          {pinnedFounderProfile && (
            <div className="p-4 rounded-xl bg-[#080b10] border border-emerald-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.05] border border-white/[0.1] shrink-0">
                <img
                  src={pinnedFounderProfile.avatar_url || '/stickman.svg'}
                  alt={pinnedFounderProfile.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{pinnedFounderProfile.full_name}</div>
                <div className="text-xs font-mono text-emerald-400">{pinnedFounderProfile.headline || 'Founder & Lead'}</div>
                <div className="text-[10px] font-mono text-slate-500">ID: {pinnedFounderProfile.builder_id || 'Not set'} · {pinnedFounderProfile.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky / Prominent Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-3 px-8 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50"
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
