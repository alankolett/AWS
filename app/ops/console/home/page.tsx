'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateSiteSettingsBatch } from '@/app/actions/cms';
import { uploadMediaAction, deleteStorageFileAction } from '@/app/actions/upload';
import { ImageUpload } from '@/components/common/ImageUpload';
import {
  Save,
  CheckCircle2,
  Layout,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Upload,
  Loader2,
  X,
} from 'lucide-react';
import { FeaturedPerson } from '@/components/features/FeaturedPeople';

export default function HomeCMSPage() {
  const [loading, setLoading] = useState(true);

  // Section 1: Hero
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [showHeroVideo, setShowHeroVideo] = useState(true);
  const [heroLogoUrl, setHeroLogoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState('');
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Section 2: Team Photo
  const [teamPhotoUrl, setTeamPhotoUrl] = useState('');
  const [teamPhotoCaption, setTeamPhotoCaption] = useState('');

  // Section 3: Upcoming / Pinned Events
  const [showPinnedEvents, setShowPinnedEvents] = useState(true);
  const [pinnedEventIds, setPinnedEventIds] = useState<string[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);

  // Section 4: Featured People Section (Dignitaries / Honored Personalities)
  const [showFeaturedPeople, setShowFeaturedPeople] = useState(true);
  const [featuredPeopleTag, setFeaturedPeopleTag] = useState('// CHAPTER HONORED GUESTS & DIGNITARIES');
  const [featuredPeopleTitle, setFeaturedPeopleTitle] = useState('Featured Builders & Dignitaries');
  const [featuredPeopleSubtitle, setFeaturedPeopleSubtitle] = useState('Distinguished industry architects, university patrons, and keynote speakers shaping the AWS student ecosystem.');
  const [featuredPeople, setFeaturedPeople] = useState<FeaturedPerson[]>([]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 1. Fetch site settings
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        // Hero
        const hero = settings.find((s) => s.key === 'hero_section')?.value;
        if (hero) {
          setHeroTitle(hero.title || '');
          setHeroSubtitle(hero.subtitle || '');
          setHeroVideoUrl(hero.video_url || '');
          setShowHeroVideo(hero.show_video !== false);
          setHeroLogoUrl(hero.logo_url || '');
        }

        // Pinned Events
        const pinnedEvt = settings.find((s) => s.key === 'pinned_event_id')?.value;
        const pinnedEvts = settings.find((s) => s.key === 'pinned_event_ids')?.value;
        const showEvts = settings.find((s) => s.key === 'show_pinned_events')?.value;
        setShowPinnedEvents(showEvts !== false);

        if (Array.isArray(pinnedEvts)) {
          setPinnedEventIds(pinnedEvts);
        } else if (pinnedEvt && typeof pinnedEvt === 'string' && pinnedEvt.trim()) {
          setPinnedEventIds([pinnedEvt.trim()]);
        }

        // Team photo
        const tp = settings.find((s) => s.key === 'team_photo')?.value;
        if (tp) {
          setTeamPhotoUrl(tp.url || '');
          setTeamPhotoCaption(tp.caption || '');
        } else {
          setTeamPhotoUrl('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600');
          setTeamPhotoCaption('AWS Student Builder Group @ SSPU · Student Engineers & Chapter Collective');
        }

        // Featured People
        const fpSetting = settings.find((s) => s.key === 'featured_people_section')?.value;
        if (fpSetting) {
          setShowFeaturedPeople(fpSetting.show_section !== false);
          setFeaturedPeopleTag(fpSetting.tag || '// CHAPTER HONORED GUESTS & DIGNITARIES');
          setFeaturedPeopleTitle(fpSetting.title || 'Featured Builders & Dignitaries');
          setFeaturedPeopleSubtitle(fpSetting.subtitle || '');
          setFeaturedPeople(Array.isArray(fpSetting.people) ? fpSetting.people : []);
        }
      }

      // 2. Fetch events
      const { data: evts } = await supabase
        .from('events')
        .select('id, title, event_date')
        .order('event_date', { ascending: false });
      setEventsList(evts || []);

      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleToggleEventPin = (eventId: string) => {
    if (pinnedEventIds.includes(eventId)) {
      setPinnedEventIds(pinnedEventIds.filter((id) => id !== eventId));
    } else {
      setPinnedEventIds([...pinnedEventIds, eventId]);
    }
  };

  const handleAddFeaturedPerson = () => {
    const newPerson: FeaturedPerson = {
      id: `dignitary-${Date.now()}`,
      name: '',
      designation: '',
      organization: '',
      quote: '',
      bio: '',
      photoUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      githubUrl: '',
      portfolioUrl: '',
    };
    setFeaturedPeople([...featuredPeople, newPerson]);
  };

  const handleUpdateFeaturedPerson = (index: number, updated: Partial<FeaturedPerson>) => {
    const list = [...featuredPeople];
    list[index] = { ...list[index], ...updated };
    setFeaturedPeople(list);
  };

  const handleRemoveFeaturedPerson = (index: number) => {
    const person = featuredPeople[index];
    if (person?.photoUrl) {
      deleteStorageFileAction(person.photoUrl, 'team-photos').catch((err) =>
        console.warn('Failed to delete dignitary photo:', err)
      );
    }
    setFeaturedPeople(featuredPeople.filter((_, i) => i !== index));
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError('');
    setUploadingVideo(true);

    const oldVideo = heroVideoUrl;
    const formData = new FormData();
    formData.append('file', file);
    if (oldVideo) {
      formData.append('oldFileUrl', oldVideo);
    }

    const res = await uploadMediaAction(formData, 'cms-media');
    if (res.error) {
      setVideoError(res.error);
    } else if (res.publicUrl) {
      setHeroVideoUrl(res.publicUrl);
      setShowHeroVideo(true);
      if (oldVideo && oldVideo !== res.publicUrl) {
        deleteStorageFileAction(oldVideo, 'cms-media').catch((err) =>
          console.warn('Failed to purge replaced video:', err)
        );
      }
    }
    setUploadingVideo(false);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const res = await updateSiteSettingsBatch([
      {
        key: 'hero_section',
        value: {
          title: heroTitle,
          subtitle: heroSubtitle,
          video_url: heroVideoUrl.trim(),
          show_video: showHeroVideo,
          logo_url: heroLogoUrl,
        },
      },
      {
        key: 'pinned_event_ids',
        value: pinnedEventIds,
      },
      {
        key: 'pinned_event_id',
        value: pinnedEventIds[0] || '',
      },
      {
        key: 'show_pinned_events',
        value: showPinnedEvents,
      },
      {
        key: 'team_photo',
        value: {
          url: teamPhotoUrl,
          caption: teamPhotoCaption,
        },
      },
      {
        key: 'featured_people_section',
        value: {
          show_section: showFeaturedPeople,
          tag: featuredPeopleTag,
          title: featuredPeopleTitle,
          subtitle: featuredPeopleSubtitle,
          people: featuredPeople,
        },
      },
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
            Configure the hero header, full-screen background video, multiple pinned events, chapter squad photo, and featured dignitaries.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-2.5 px-6 rounded-lg text-xs transition-colors shadow-lg disabled:opacity-50 self-start sm:self-auto font-mono"
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
        {/* SECTION 1: HERO & VIDEO CONFIGURATION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#a855f7]" />
              <span>HERO BANNER & VIDEO CONFIGURATION</span>
            </div>

            {/* Video Toggle */}
            <button
              type="button"
              onClick={() => setShowHeroVideo(!showHeroVideo)}
              className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
            >
              <span>Background Video:</span>
              {showHeroVideo ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ToggleRight className="w-5 h-5 text-emerald-400" /> ON
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500">
                  <ToggleLeft className="w-5 h-5 text-slate-500" /> OFF
                </span>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Hero Main Heading (Multi-line supported)
            </label>
            <textarea
              rows={2}
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
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
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-sm text-white focus:border-[#a855f7] focus:outline-none leading-relaxed"
              placeholder="The official AWS Student Builder Group at Symbiosis Skills and Professional University..."
            />
          </div>

          {/* Video Configuration (Upload or Direct URL) */}
          <div className="space-y-4 pt-2 border-t border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-mono text-slate-300 font-medium flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Hero Background Video (Upload to Supabase Storage or enter URL)</span>
              </label>
              <span className="text-[10px] font-mono text-cyan-400">1-Year Cache Optimized</span>
            </div>

            {/* Video Preview Player if URL is set */}
            {heroVideoUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.15] bg-[#080b10] max-w-lg aspect-video shadow-xl">
                <video
                  src={heroVideoUrl}
                  controls
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (heroVideoUrl) {
                      deleteStorageFileAction(heroVideoUrl, 'cms-media').catch((err) =>
                        console.warn('Failed to purge removed video:', err)
                      );
                    }
                    setHeroVideoUrl('');
                    setShowHeroVideo(false);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white backdrop-blur transition-colors"
                  title="Remove Video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Button + File Input */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleVideoFileChange}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploadingVideo}
                onClick={() => videoInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.15] text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploadingVideo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
                    <span>Uploading & Caching in Supabase...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#00f0ff]" />
                    <span>Upload Video File (MP4 / WebM)</span>
                  </>
                )}
              </button>

              <span className="text-xs font-mono text-slate-500">or enter direct URL below</span>
            </div>

            {videoError && (
              <p className="text-xs font-mono text-red-400">{videoError}</p>
            )}

            <input
              type="url"
              value={heroVideoUrl}
              onChange={(e) => setHeroVideoUrl(e.target.value)}
              placeholder="e.g. https://your-cdn.com/reinvent-hero.mp4 (or uploaded Supabase storage URL)"
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#00f0ff] focus:outline-none font-mono"
            />
            <p className="text-[10px] text-slate-500">
              Mimics AWS re:Invent keynote full-screen video with translucent floating glass card. Uploaded video is permanently stored in Supabase with immutable caching headers for optimal speed.
            </p>
          </div>

          {/* Rounded Hero Emblem / Chapter Logo Upload */}
          <div className="space-y-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#ff9900]" />
              <span>Hero Rounded Logo / Chapter Emblem (Circular Badge)</span>
            </div>
            <p className="text-slate-400 text-xs">
              Upload a custom logo or emblem photo displayed inside the rounded circular badge on the home page hero section. Stored in Supabase object storage. Defaults to the official AWS logo if empty.
            </p>

            <ImageUpload
              value={heroLogoUrl}
              onChange={(url) => setHeroLogoUrl(url)}
              bucket="cms-media"
              label="Upload Rounded Logo / Chapter Emblem Photo"
              aspect="square"
              helperText="Upload a square 1:1 image (PNG, JPG, SVG, WebP). It will be showcased in the circular emblem badge."
            />
          </div>
        </div>

        {/* SECTION 2: FULL-SIZE CHAPTER SQUAD PHOTO */}
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
            onChange={(url) => setTeamPhotoUrl(url)}
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
              onChange={(e) => setTeamPhotoCaption(e.target.value)}
              placeholder="e.g. AWS Student Builder Group @ SSPU · Student Engineers & Chapter Collective"
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2.5 text-xs text-white focus:border-[#ff9900] focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 3: PINNED EVENTS (SUPPORT MULTIPLE PINNED EVENTS) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>PINNED EVENTS SECTION ({pinnedEventIds.length} PINNED)</span>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setShowPinnedEvents(!showPinnedEvents)}
              className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
            >
              <span>Display Section:</span>
              {showPinnedEvents ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ToggleRight className="w-5 h-5 text-emerald-400" /> ON
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500">
                  <ToggleLeft className="w-5 h-5 text-slate-500" /> OFF
                </span>
              )}
            </button>
          </div>

          <p className="text-slate-400 text-xs">
            Select one or more events to pin prominently on the Home Page. Multiple selected events will render in a balanced responsive grid.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {eventsList.map((evt) => {
              const isChecked = pinnedEventIds.includes(evt.id);
              return (
                <label
                  key={evt.id}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-white shadow-sm'
                      : 'bg-[#080b10] border-white/[0.08] text-slate-400 hover:border-white/[0.18]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleEventPin(evt.id)}
                    className="mt-1 accent-[#00f0ff]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{evt.title}</div>
                    <div className="text-[11px] font-mono text-slate-400">{evt.event_date}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {pinnedEventIds.length > 0 && (
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
              <span>{pinnedEventIds.length} event(s) selected for home spotlight</span>
              <button
                type="button"
                onClick={() => setPinnedEventIds([])}
                className="text-red-400 hover:underline"
              >
                Clear all pinned
              </button>
            </div>
          )}
        </div>

        {/* SECTION 4: FEATURED PEOPLE SECTION (DIGNITARIES & GUESTS) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>FEATURED PEOPLE / DIGNITARIES SECTION</span>
            </div>

            {/* Section Toggle */}
            <button
              type="button"
              onClick={() => setShowFeaturedPeople(!showFeaturedPeople)}
              className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
            >
              <span>Display Section:</span>
              {showFeaturedPeople ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ToggleRight className="w-5 h-5 text-emerald-400" /> ON
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500">
                  <ToggleLeft className="w-5 h-5 text-slate-500" /> OFF
                </span>
              )}
            </button>
          </div>

          <p className="text-slate-400 text-xs">
            Add distinguished patrons, dignitaries, and keynote guests to showcase on the home page with alternating left/right photo layouts. These profiles are independent of user member accounts.
          </p>

          {/* Section Headers Config */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#080b10] border border-white/[0.06]">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Section Tag
              </label>
              <input
                type="text"
                value={featuredPeopleTag}
                onChange={(e) => setFeaturedPeopleTag(e.target.value)}
                className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Section Title
              </label>
              <input
                type="text"
                value={featuredPeopleTitle}
                onChange={(e) => setFeaturedPeopleTitle(e.target.value)}
                className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Section Subtitle
              </label>
              <input
                type="text"
                value={featuredPeopleSubtitle}
                onChange={(e) => setFeaturedPeopleSubtitle(e.target.value)}
                className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* List of Personalities */}
          <div className="space-y-6">
            {featuredPeople.map((person, idx) => (
              <div
                key={person.id || idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#080b10] border border-white/[0.1] space-y-5 relative group"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff9900]">
                    <span>Dignitary #{idx + 1}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-normal">
                      Card Placement: {idx % 2 === 0 ? 'Photo Left, Text Right' : 'Text Left, Photo Right'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFeaturedPerson(idx)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove Person"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Photo Upload Column */}
                  <div className="md:col-span-4">
                    <ImageUpload
                      value={person.photoUrl || ''}
                      onChange={(url) => handleUpdateFeaturedPerson(idx, { photoUrl: url })}
                      bucket="team-photos"
                      label="Portrait Photograph"
                      aspect="square"
                      helperText="Square 1:1 or 4:5 ratio headshot"
                    />
                  </div>

                  {/* Information Column */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={person.name}
                          onChange={(e) => handleUpdateFeaturedPerson(idx, { name: e.target.value })}
                          placeholder="e.g. Dr. John Doe"
                          className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                          Designation / Role Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={person.designation}
                          onChange={(e) => handleUpdateFeaturedPerson(idx, { designation: e.target.value })}
                          placeholder="e.g. Chief Cloud Architect / Dean"
                          className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                        Organization / University Affiliation
                      </label>
                      <input
                        type="text"
                        value={person.organization || ''}
                        onChange={(e) => handleUpdateFeaturedPerson(idx, { organization: e.target.value })}
                        placeholder="e.g. Amazon Web Services / SSPU"
                        className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                        Highlight Quote (Shown prominently)
                      </label>
                      <input
                        type="text"
                        value={person.quote || ''}
                        onChange={(e) => handleUpdateFeaturedPerson(idx, { quote: e.target.value })}
                        placeholder="e.g. Architecting for cloud resilience begins in the student classroom."
                        className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                        Biography / Perspective
                      </label>
                      <textarea
                        rows={3}
                        value={person.bio || ''}
                        onChange={(e) => handleUpdateFeaturedPerson(idx, { bio: e.target.value })}
                        placeholder="Key background, contributions to cloud computing, or association with the chapter..."
                        className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg p-2.5 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                      />
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={person.linkedinUrl || ''}
                          onChange={(e) => handleUpdateFeaturedPerson(idx, { linkedinUrl: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#ff9900] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Website / Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={person.portfolioUrl || ''}
                          onChange={(e) => handleUpdateFeaturedPerson(idx, { portfolioUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#ff9900] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddFeaturedPerson}
              className="w-full py-3.5 rounded-xl border border-dashed border-white/[0.2] hover:border-[#ff9900] bg-white/[0.02] hover:bg-[#ff9900]/10 text-xs font-mono text-slate-300 hover:text-[#ff9900] flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Dignitary / Featured Person</span>
            </button>
          </div>
        </div>

        {/* Sticky / Prominent Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-3 px-8 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50 font-mono"
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
