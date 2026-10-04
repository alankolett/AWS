'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { createEvent, updateEvent, deleteEvent } from '@/app/actions/events';
import { deleteStorageFileAction } from '@/app/actions/upload';
import { ImageUpload } from '@/components/common/ImageUpload';
import { cleanEventDescription, isOnlineEvent, isEventPast } from '@/lib/utils';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Save,
  CheckCircle2,
  Layers,
  FileText,
  Clock,
  MapPin,
  User,
  ExternalLink,
  X,
  Sparkles,
  Video,
  Globe,
  History,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Link from 'next/link';

export default function EventsManagerPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [locationMode, setLocationMode] = useState<'offline' | 'online'>('offline');
  const [showBannerStudio, setShowBannerStudio] = useState(true);
  const [togglingEventBannerId, setTogglingEventBannerId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  const loadEvents = async () => {
    const { data: evts } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (evts && evts.length > 0) {
      // Auto-sanitize any corrupted draft strings from earlier mock/input
      for (const e of evts) {
        if (e.description && /^Hands-on architectural spri(nt)?\s*This online session/i.test(e.description)) {
          const cleaned = e.description.replace(/^Hands-on architectural spri(nt)?\s*/i, '');
          e.description = cleaned;
          updateEvent(e.id, { description: cleaned }).catch(() => {});
        }
      }
    }
    setEventsList(evts || []);
  };

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      }

      await loadEvents();
      setLoading(false);
    }
    init();
  }, [supabase]);

  const isAdmin = user?.role === 'admin';

  const openNewEvent = () => {
    setLocationMode('offline');
    setShowBannerStudio(true);
    setEditingEvent({
      id: '',
      title: '',
      type: 'WORKSHOP',
      event_date: new Date().toISOString().split('T')[0],
      time_range: '14:00 - 16:00 IST',
      location: 'Computer Lab 3, Academic Block',
      speaker_name: '',
      speaker_role: 'Solutions Architect',
      total_seats: 60,
      seats_remaining: 60,
      is_past: false,
      thumbnail_url: '',
      prerequisites: '<b>Prerequisites:</b>\n<ul>\n  <li>AWS Builder ID or Free Tier Account</li>\n  <li>Personal laptop with browser</li>\n</ul>',
      description: '<p>Hands-on architectural sprint exploring cloud services and real-world deployment patterns.</p>',
      meetup_link: '',
      tags: ['AWS', 'CLOUD'],
      banner_templates: [
        {
          id: 'theme-1',
          name: 'Cyber Neon Pulse',
          accentColor: '#a855f7',
          defaultHeadline: "I'm Attending!",
          badgeText: 'AWS SBG · BUILDER INITIATIVE',
          imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'theme-2',
          name: 'AWS re:Invent Dark Edition',
          accentColor: '#ff9900',
          defaultHeadline: 'Architecting at SSPU',
          badgeText: 're:Invent COMMUNITY WATCH PARTY',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'theme-3',
          name: 'Terminal Minimalist',
          accentColor: '#00f0ff',
          defaultHeadline: 'Building the Cloud',
          badgeText: 'VERIFIED ATTENDEE PASS',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'
        }
      ],
      post_event_photo_url: '',
      post_event_text: '',
      slides_url: '',
      recording_url: '',
      github_url: ''
    });
    setMsg('');
    setIsModalOpen(true);
  };

  const openEditEvent = (evt: any) => {
    const isOnline = isOnlineEvent(evt.location, evt.total_seats);
    setLocationMode(isOnline ? 'online' : 'offline');
    setShowBannerStudio(!evt.tags?.includes('HIDE_BANNER'));
    setEditingEvent({
      ...evt,
      is_past: Boolean(evt.is_past || isEventPast(evt.event_date, evt.is_past)),
      description: cleanEventDescription(evt.description),
      banner_templates: Array.isArray(evt.banner_templates) ? evt.banner_templates : []
    });
    setMsg('');
    setIsModalOpen(true);
  };

  const handleAddBannerStyle = () => {
    const currentStyles = editingEvent.banner_templates || [];
    const newIdx = currentStyles.length + 1;
    setEditingEvent({
      ...editingEvent,
      banner_templates: [
        ...currentStyles,
        {
          id: `theme-${newIdx}`,
          name: `Custom Theme ${newIdx}`,
          accentColor: '#ff9900',
          defaultHeadline: "I'm Attending!",
          badgeText: 'AWS STUDENT BUILDER GROUP',
          imageUrl: ''
        }
      ]
    });
  };

  const handleRemoveBannerStyle = (idx: number) => {
    const targetTheme = editingEvent.banner_templates[idx];
    if (targetTheme?.imageUrl) {
      deleteStorageFileAction(targetTheme.imageUrl, 'event-banners').catch((err) =>
        console.warn('Failed to delete banner template image:', err)
      );
    }
    const updated = editingEvent.banner_templates.filter((_: any, i: number) => i !== idx);
    setEditingEvent({ ...editingEvent, banner_templates: updated });
  };

  const handleToggleBannerForEvent = async (evt: any) => {
    if (!isAdmin) return;
    const isCurrentlyHidden = Boolean(evt.tags?.includes('HIDE_BANNER'));
    const willShow = isCurrentlyHidden; // If hidden, next state is visible
    setTogglingEventBannerId(evt.id);

    let updatedTags: string[] = Array.isArray(evt.tags) ? [...evt.tags] : ['AWS', 'CLOUD'];
    if (willShow) {
      updatedTags = updatedTags.filter((t) => t !== 'HIDE_BANNER');
    } else {
      if (!updatedTags.includes('HIDE_BANNER')) {
        updatedTags.push('HIDE_BANNER');
      }
    }

    // Optimistic UI update
    setEventsList((prev) =>
      prev.map((e) => (e.id === evt.id ? { ...e, tags: updatedTags } : e))
    );

    const res = await updateEvent(evt.id, { tags: updatedTags });
    setTogglingEventBannerId(null);
    if (res.error) {
      setMsg(`Error toggling banner studio: ${res.error}`);
      await loadEvents();
    } else {
      setMsg(
        `Banner Studio is now ${willShow ? 'ENABLED (Visible)' : 'DISABLED (Hidden)'} for "${evt.title}".`
      );
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Only administrators can create or edit events.');
      return;
    }
    setSaving(true);
    setMsg('');

    const isOnline = locationMode === 'online';
    let updatedTags: string[] = Array.isArray(editingEvent.tags) ? [...editingEvent.tags] : ['AWS', 'CLOUD'];
    if (showBannerStudio) {
      updatedTags = updatedTags.filter((t) => t !== 'HIDE_BANNER');
    } else {
      if (!updatedTags.includes('HIDE_BANNER')) {
        updatedTags.push('HIDE_BANNER');
      }
    }

    const payload = {
      ...editingEvent,
      location: editingEvent.location?.trim() || (isOnline ? 'Google Meet' : 'Computer Lab 3, Academic Block'),
      total_seats: isOnline ? 0 : (parseInt(editingEvent.total_seats) || 60),
      seats_remaining: isOnline ? 0 : (parseInt(editingEvent.seats_remaining) ?? 60),
      is_past: Boolean(editingEvent.is_past),
      description: cleanEventDescription(editingEvent.description),
      tags: updatedTags,
    };

    let res;
    if (payload.created_at) {
      const { id, created_at, ...updateData } = payload;
      res = await updateEvent(id, updateData);
    } else {
      res = await createEvent(payload);
    }

    if (res.error) {
      setMsg(`Error: ${res.error}`);
    } else {
      setMsg('Event saved and published!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadEvents();
      }, 1000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;

    const res = await deleteEvent(id);
    if (res.error) {
      alert(`Delete failed: ${res.error}`);
    } else {
      loadEvents();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#ff9900] animate-pulse">Loading Events Manager...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] uppercase font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>CHAPTER SESSIONS & MEETUP EVENTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Events Manager
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure workshop sessions, manage per-event attendee banner studio display, manage online/offline formats, and publish post-event recaps.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openNewEvent}
            className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-2.5 px-6 rounded-lg text-xs transition-colors shadow-lg self-start sm:self-auto font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        )}
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Events List */}
      {eventsList.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-3">
          <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-white font-bold text-base">No events scheduled yet</p>
          <p className="text-slate-400 text-xs">Click "Create New Event" above to publish your first chapter session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {eventsList.map((evt) => {
            const isEvtPast = Boolean(evt.is_past || isEventPast(evt.event_date, evt.is_past));
            const isEvtOnline = isOnlineEvent(evt.location, evt.total_seats);

            return (
              <div
                key={evt.id}
                className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md"
              >
                <div className="flex items-start gap-4">
                  {evt.thumbnail_url ? (
                    <div className="w-32 aspect-video rounded-xl overflow-hidden bg-[#080b10] border border-white/[0.1] shrink-0">
                      <img src={evt.thumbnail_url} alt={evt.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-32 aspect-video rounded-xl bg-[#080b10] border border-white/[0.1] flex items-center justify-center text-slate-500 shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 font-semibold">
                        {evt.type}
                      </span>
                      {isEvtPast ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold flex items-center gap-1">
                          <History className="w-2.5 h-2.5" />
                          <span>CONCLUDED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          UPCOMING
                        </span>
                      )}
                      {isEvtOnline ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 font-bold flex items-center gap-1">
                          <Video className="w-2.5 h-2.5" />
                          <span>ONLINE</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                          OFFLINE
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400">
                        📅 {evt.event_date} · {evt.time_range}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-sans">{evt.title}</h3>

                    <div className="text-xs text-slate-400 font-sans flex items-center gap-3 flex-wrap">
                      <span>Speaker: <strong className="text-slate-200">{evt.speaker_name}</strong></span>
                      <span>•</span>
                      {isEvtOnline ? (
                        <span className="text-[#00f0ff] font-mono text-[11px] flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>{evt.location || 'Google Meet'} (Open Capacity)</span>
                        </span>
                      ) : (
                        <span>Seats: {evt.seats_remaining} / {evt.total_seats} remaining</span>
                      )}
                      {evt.meetup_link && (
                        <>
                          <span>•</span>
                          <a href={evt.meetup_link} target="_blank" rel="noopener noreferrer" className="text-[#ff9900] hover:underline flex items-center gap-1 font-mono text-[11px]">
                            <span>Meetup Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                  {isAdmin && (
                    <button
                      type="button"
                      disabled={togglingEventBannerId === evt.id}
                      onClick={() => handleToggleBannerForEvent(evt)}
                      title={`Click to ${evt.tags?.includes('HIDE_BANNER') ? 'enable' : 'disable'} attendee banner studio for this event`}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all border ${
                        !evt.tags?.includes('HIDE_BANNER')
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                          : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.08]'
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${!evt.tags?.includes('HIDE_BANNER') ? 'text-[#a855f7]' : 'text-slate-500'}`} />
                      <span>
                        {togglingEventBannerId === evt.id
                          ? 'Saving...'
                          : !evt.tags?.includes('HIDE_BANNER')
                          ? 'Banner: ON'
                          : 'Banner: OFF'}
                      </span>
                    </button>
                  )}

                  <Link
                    href={`/event/${evt.id}`}
                    target="_blank"
                    className="px-3 py-2 rounded-lg border border-white/[0.1] text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public View</span>
                  </Link>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEditEvent(evt)}
                        className="px-3.5 py-2 rounded-lg bg-[#ff9900]/10 text-[#ff9900] hover:bg-[#ff9900]/20 border border-[#ff9900]/30 text-xs font-mono transition-colors flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL LENGTH MODAL: CREATE / EDIT EVENT */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 sm:p-10 rounded-2xl bg-[#0f141c] border border-white/[0.15] shadow-2xl space-y-8 my-auto">
            {/* Modal Top */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {editingEvent.created_at ? 'Edit Chapter Event' : 'Create New Chapter Event'}
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Configure event logistics, upload thumbnail, customize N poster backdrop themes, and prepare post-event recaps.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-8">
              {/* Section 1: Thumbnail Photo Upload (Requirement 1) */}
              <div className="p-6 rounded-2xl bg-[#080b10] border border-white/[0.08] space-y-4">
                <div className="text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
                  // EVENT THUMBNAIL & HERO BANNER
                </div>
                <ImageUpload
                  value={editingEvent.thumbnail_url}
                  onChange={url => setEditingEvent({ ...editingEvent, thumbnail_url: url })}
                  bucket="event-banners"
                  label="Upload Event Thumbnail (16:9 Aspect Ratio Recommended)"
                  aspect="video"
                  helperText="Recommended: 16:9 ratio (1920×1080 or 1280×720). Matches event cards and public event hero banner."
                />
              </div>

              {/* Section 2: Core Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#ff9900] focus:outline-none"
                    placeholder="e.g. AWS re:Invent Recap & Serverless Microservices Workshop"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Event Type</label>
                  <select
                    value={editingEvent.type}
                    onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                  >
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="SEMINAR">SEMINAR</option>
                    <option value="KEYNOTE">KEYNOTE</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="SPRINT">SPRINT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Session Status</label>
                  <select
                    value={editingEvent.is_past ? 'past' : 'upcoming'}
                    onChange={e => setEditingEvent({ ...editingEvent, is_past: e.target.value === 'past' })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none font-mono"
                  >
                    <option value="upcoming">🟢 UPCOMING LIVE SESSION</option>
                    <option value="past">🟣 CONCLUDED / PAST SESSION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Event Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.event_date}
                    onChange={e => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Event Time</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.time_range}
                    onChange={e => setEditingEvent({ ...editingEvent, time_range: e.target.value })}
                    placeholder="14:00 - 17:00 IST"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Speaker Name</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.speaker_name}
                    onChange={e => setEditingEvent({ ...editingEvent, speaker_name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Speaker Role</label>
                  <input
                    type="text"
                    value={editingEvent.speaker_role || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, speaker_role: e.target.value })}
                    placeholder="Solutions Architect / Lead"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Event Format / Location Mode Switch */}
                <div className="sm:col-span-2 space-y-2 pt-2 border-t border-white/[0.05]">
                  <label className="block text-xs font-mono text-slate-300 font-semibold">
                    Event Format &amp; Location Mode *
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-[#080b10] border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationMode('offline');
                        setEditingEvent({
                          ...editingEvent,
                          location: editingEvent.location && !/google meet|zoom|virtual|online/i.test(editingEvent.location)
                            ? editingEvent.location
                            : 'Computer Lab 3, Academic Block',
                          total_seats: editingEvent.total_seats || 60,
                          seats_remaining: editingEvent.seats_remaining || 60,
                        });
                      }}
                      className={`py-2 px-4 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                        locationMode === 'offline'
                          ? 'bg-[#ff9900] text-[#080b10] shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Offline (In-Person Campus)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLocationMode('online');
                        setEditingEvent({
                          ...editingEvent,
                          location: editingEvent.location && /google meet|zoom|virtual|online/i.test(editingEvent.location)
                            ? editingEvent.location
                            : 'Google Meet',
                          total_seats: 0,
                          seats_remaining: 0,
                        });
                      }}
                      className={`py-2 px-4 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                        locationMode === 'online'
                          ? 'bg-[#00f0ff] text-[#080b10] shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Online (Virtual Session)</span>
                    </button>
                  </div>
                </div>

                {/* Location Input */}
                <div className={locationMode === 'online' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    {locationMode === 'online' ? 'Virtual Platform / Meeting Link *' : 'Campus Venue / Room *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.location}
                    onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder={locationMode === 'online' ? 'Google Meet / Zoom / YouTube Live' : 'Computer Lab 3, Academic Block'}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                {/* Seating Capacity: ONLY SHOWN FOR OFFLINE EVENTS */}
                {locationMode === 'offline' ? (
                  <>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Total Seats</label>
                      <input
                        type="number"
                        min={1}
                        value={editingEvent.total_seats || 60}
                        onChange={e => setEditingEvent({ ...editingEvent, total_seats: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Seats Remaining</label>
                      <input
                        type="number"
                        min={0}
                        value={editingEvent.seats_remaining ?? 60}
                        onChange={e => setEditingEvent({ ...editingEvent, seats_remaining: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 flex items-center gap-2.5 text-xs text-[#00f0ff] font-mono">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Virtual session: Open online attendance (seating limit is hidden and disabled).</span>
                  </div>
                )}

                {/* RSVP Meetup Link */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#ff9900] mb-1 font-bold">
                    RSVP Redirect Link (Meetup Event URL)
                  </label>
                  <input
                    type="url"
                    value={editingEvent.meetup_link || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, meetup_link: e.target.value })}
                    placeholder="https://www.meetup.com/aws-student-builders/events/123456789"
                    className="w-full bg-[#080b10] border border-[#ff9900]/40 rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Section 3: Event Pre-requisites (HTML Support) */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-slate-300 font-bold">
                    Event Pre-requisites (HTML tags supported)
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Insert tag:</span>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, prerequisites: (editingEvent.prerequisites || '') + '<b>Bold text</b>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;b&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, prerequisites: (editingEvent.prerequisites || '') + '<u>Underline</u>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;u&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, prerequisites: (editingEvent.prerequisites || '') + '<li>Item</li>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;li&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, prerequisites: (editingEvent.prerequisites || '') + '<code>Code</code>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;code&gt;
                    </button>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={editingEvent.prerequisites || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, prerequisites: e.target.value })}
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white font-mono"
                  placeholder="<ul><li>AWS Account</li><li>Laptop</li></ul>"
                />
              </div>

              {/* Section 4: Event Information (HTML Support) */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-slate-300 font-bold">
                    Event Information / Description (HTML tags supported)
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Insert tag:</span>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, description: (editingEvent.description || '') + '<p>Paragraph</p>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;p&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, description: (editingEvent.description || '') + '<b>Bold</b>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;b&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, description: (editingEvent.description || '') + '<u>Underline</u>' })}
                      className="px-1.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200"
                    >
                      &lt;u&gt;
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={editingEvent.description || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white font-mono"
                  placeholder="<p>Full breakdown of the event session agenda and labs.</p>"
                />
              </div>

              {/* Section 5: Attendee Banner Studio & Poster Styles (Per-Event) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                {/* Per-event Banner Studio Display Toggle */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#0f141c] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#a855f7]" />
                      <span>ATTENDEE BANNER GENERATOR STUDIO (THIS EVENT)</span>
                    </div>
                    <p className="text-white text-sm font-bold font-sans">
                      Per-Event &quot;I&apos;m Attending&quot; Badge &amp; Poster Studio
                    </p>
                    <p className="text-slate-400 text-xs font-sans">
                      Control whether the public attendee banner studio is visible on this event&apos;s page (<code className="text-[#00f0ff] font-mono">/event/{editingEvent.id || 'id'}</code>).
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                        showBannerStudio
                          ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                          : 'text-slate-400 bg-white/[0.04] border-white/[0.08]'
                      }`}
                    >
                      {showBannerStudio ? 'STUDIO DISPLAYED' : 'STUDIO HIDDEN'}
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowBannerStudio(!showBannerStudio)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                        showBannerStudio
                          ? 'bg-[#a855f7] hover:bg-purple-600 text-white'
                          : 'bg-white/[0.08] hover:bg-white/[0.12] text-slate-300'
                      }`}
                    >
                      {showBannerStudio ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{showBannerStudio ? 'Hide Studio' : 'Show Studio'}</span>
                    </button>
                  </div>
                </div>

                {!showBannerStudio && (
                  <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Banner Studio is disabled for this specific event. The badge generator will NOT appear on the public event page.</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#a855f7]" />
                      <span>EVENT POSTER STYLES / THEMES (N AVAILABLE)</span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Configure as many themes as you want. Attendees can choose between these styles when downloading their &quot;I&apos;m Attending&quot; poster.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBannerStyle}
                    className="px-3.5 py-1.5 rounded-lg bg-[#a855f7] hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Banner Style</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(editingEvent.banner_templates || []).map((theme: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-3 relative group">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                        <span className="text-xs font-mono font-bold text-[#a855f7]">Style {idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme.accentColor || '#a855f7'}
                            onChange={e => {
                              const newThemes = [...editingEvent.banner_templates];
                              newThemes[idx].accentColor = e.target.value;
                              setEditingEvent({ ...editingEvent, banner_templates: newThemes });
                            }}
                            className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                            title="Pick Accent Color"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBannerStyle(idx)}
                            className="p-1 rounded text-red-400 hover:text-red-300"
                            title="Remove Style"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Style Name</label>
                        <input
                          type="text"
                          value={theme.name || ''}
                          onChange={e => {
                            const newThemes = [...editingEvent.banner_templates];
                            newThemes[idx].name = e.target.value;
                            setEditingEvent({ ...editingEvent, banner_templates: newThemes });
                          }}
                          placeholder="e.g. Cyber Neon"
                          className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      {/* 16:9 Background Photo Upload (Event Template for Banner Generator) */}
                      <ImageUpload
                        value={theme.imageUrl}
                        onChange={url => {
                          const newThemes = [...editingEvent.banner_templates];
                          newThemes[idx].imageUrl = url;
                          setEditingEvent({ ...editingEvent, banner_templates: newThemes });
                        }}
                        bucket="event-banners"
                        label="Upload 16:9 Background Photo (Event Template)"
                        aspect="video"
                        helperText="16:9 ratio background artwork for this poster style. Normal attendees will see this background on their banner."
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Default Headline</label>
                          <input
                            type="text"
                            value={theme.defaultHeadline || ''}
                            onChange={e => {
                              const newThemes = [...editingEvent.banner_templates];
                              newThemes[idx].defaultHeadline = e.target.value;
                              setEditingEvent({ ...editingEvent, banner_templates: newThemes });
                            }}
                            placeholder="I'm Attending!"
                            className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-2.5 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Badge Text</label>
                          <input
                            type="text"
                            value={theme.badgeText || ''}
                            onChange={e => {
                              const newThemes = [...editingEvent.banner_templates];
                              newThemes[idx].badgeText = e.target.value;
                              setEditingEvent({ ...editingEvent, banner_templates: newThemes });
                            }}
                            placeholder="AWS SBG · CHAPTER EVENT"
                            className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-2.5 py-1 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Post-Event Segment */}
              <div className="p-6 rounded-2xl bg-[#080b10] border border-white/[0.08] space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#ff9900] font-mono uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>POST-EVENT RECAP (SHOWN ON EVENT DATE + 1)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Automatically replaces the poster studio on the public event page once the event date + 1 has passed.
                  </p>
                </div>

                <ImageUpload
                  value={editingEvent.post_event_photo_url}
                  onChange={url => setEditingEvent({ ...editingEvent, post_event_photo_url: url })}
                  bucket="event-banners"
                  label="Upload Post-Event Highlight Photo (16:9 Recommended)"
                  aspect="video"
                  helperText="Recommended: 16:9 ratio (1920×1080 or 1280×720) workshop or audience highlight photo"
                />

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Post-Event Summary / Notes (HTML tags supported)
                  </label>
                  <textarea
                    rows={3}
                    value={editingEvent.post_event_text || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, post_event_text: e.target.value })}
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg p-3 text-xs text-white font-mono"
                    placeholder="<p>Recap of key architectural solutions covered during the sprint.</p>"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Slides URL</label>
                    <input
                      type="url"
                      value={editingEvent.slides_url || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, slides_url: e.target.value })}
                      placeholder="https://speakerdeck.com/..."
                      className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Recording URL</label>
                    <input
                      type="url"
                      value={editingEvent.recording_url || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, recording_url: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Lab GitHub Repo URL</label>
                    <input
                      type="url"
                      value={editingEvent.github_url || ''}
                      onChange={e => setEditingEvent({ ...editingEvent, github_url: e.target.value })}
                      placeholder="https://github.com/aws-sbg-sspu/..."
                      className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-white/[0.1] text-xs font-mono text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  {msg && <span className="text-xs font-mono text-emerald-400">{msg}</span>}
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs rounded-xl transition-colors shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Publishing Event...' : 'Save & Publish Event'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
