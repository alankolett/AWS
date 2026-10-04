'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateSiteSetting } from '@/app/actions/cms';
import {
  Save,
  CheckCircle2,
  MessageSquare,
  Plus,
  Trash2,
  Mail,
  MapPin,
  Linkedin,
  ExternalLink,
  Globe,
  User,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { normalizeLinkedInEmbedUrl, normalizeGoogleMapsEmbedUrl, DEFAULT_SSPU_MAPS_EMBED } from '@/lib/utils';

interface SocialItem {
  platform: string;
  label: string;
  url: string;
}

export default function ContactCMSPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadRole, setLeadRole] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLinkedin, setLeadLinkedin] = useState('');
  const [featuredLinkedinPostUrl, setFeaturedLinkedinPostUrl] = useState('');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase.from('site_settings').select('*');
      if (settings) {
        const contact = settings.find((s) => s.key === 'contact_info')?.value;
        if (contact) {
          setEmail(contact.email || 'sbg@sspu.ac.in');
          setLocation(
            contact.location ||
              'Computer Lab 3, Symbiosis Skills and Professional University, Kiwale, Pune - 412101'
          );
          setSocials(
            Array.isArray(contact.socials) && contact.socials.length > 0
              ? contact.socials
              : [
                  { platform: 'linkedin', label: 'LinkedIn Community', url: 'https://www.linkedin.com/company/aws-sbg-sspu' },
                  { platform: 'instagram', label: 'Instagram Channel', url: 'https://instagram.com/aws_sbg_sspu' },
                  { platform: 'github', label: 'GitHub Organization', url: 'https://github.com/aws-sbg-sspu' },
                  { platform: 'x', label: 'X (Twitter)', url: 'https://x.com/aws_sbg_sspu' },
                ]
          );
          setLeadName(contact.lead_name || 'Chapter Leadership');
          setLeadRole(contact.lead_role || 'AWS SBG Chapter Lead');
          setLeadEmail(contact.lead_email || 'sbg@sspu.ac.in');
          setLeadLinkedin(contact.lead_linkedin || '');
          setFeaturedLinkedinPostUrl(contact.featured_linkedin_post_url || '');
          setGoogleMapsEmbedUrl(contact.google_maps_embed_url || '');
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleAddSocial = () => {
    setSocials([
      ...socials,
      {
        platform: 'linkedin',
        label: 'Community Link',
        url: 'https://',
      },
    ]);
  };

  const handleUpdateSocial = (index: number, field: keyof SocialItem, val: string) => {
    const list = [...socials];
    list[index] = { ...list[index], [field]: val };
    setSocials(list);
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const res = await updateSiteSetting('contact_info', {
      email,
      location,
      socials,
      lead_name: leadName,
      lead_role: leadRole,
      lead_email: leadEmail,
      lead_linkedin: leadLinkedin,
      featured_linkedin_post_url: featuredLinkedinPostUrl.trim(),
      google_maps_embed_url: googleMapsEmbedUrl.trim(),
    });

    if (res.error) {
      setMsg(`Error saving settings: ${res.error}`);
    } else {
      setMsg('Contact & Social settings saved and published globally!');
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3500);
  };

  // Preview embed src using universal normalizer
  const previewSrc = normalizeLinkedInEmbedUrl(featuredLinkedinPostUrl);
  const mapsPreviewSrc = normalizeGoogleMapsEmbedUrl(googleMapsEmbedUrl) || DEFAULT_SSPU_MAPS_EMBED;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#00f0ff] animate-pulse">Loading Contact CMS settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase font-semibold mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>CONTACT & SOCIALS CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Contact Channels, LinkedIn & Maps CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure chapter email, campus coordinates, social platform links, leadership contact, featured LinkedIn post, and Google Maps embed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#00f0ff] hover:bg-[#00c8d7] text-[#080b10] font-bold py-2.5 px-6 rounded-lg text-xs transition-colors shadow-lg disabled:opacity-50 font-mono"
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
        {/* SECTION 1: PRIMARY CONTACT COORDINATES */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>1. OFFICIAL CHAPTER COORDINATES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Official Correspondence Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sbg@sspu.ac.in"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#ff9900] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Lab & Campus Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Computer Lab 3, Symbiosis Skills University, Kiwale, Pune"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#ff9900] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DYNAMIC SOCIAL LINKS */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>2. SOCIAL & COMMUNITY CHANNELS</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Manage the public links to chapter social media, community servers, and GitHub groups.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddSocial}
              className="px-3.5 py-1.5 bg-[#00f0ff] hover:bg-[#00c8d7] text-[#080b10] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Link</span>
            </button>
          </div>

          <div className="space-y-4">
            {socials.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#080b10] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Platform</label>
                  <select
                    value={s.platform}
                    onChange={(e) => handleUpdateSocial(idx, 'platform', e.target.value)}
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="github">GitHub</option>
                    <option value="x">X / Twitter</option>
                    <option value="discord">Discord</option>
                    <option value="youtube">YouTube</option>
                    <option value="meetup">Meetup</option>
                    <option value="other">Other / Website</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Display Label</label>
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => handleUpdateSocial(idx, 'label', e.target.value)}
                    placeholder="e.g. LinkedIn Community"
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">URL</label>
                  <input
                    type="url"
                    value={s.url}
                    onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(idx)}
                    className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: CHAPTER LEADERSHIP DIRECT CONTACT */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#a855f7] font-bold uppercase tracking-wider">
            <User className="w-4 h-4 text-[#a855f7]" />
            <span>3. CHAPTER LEADERSHIP DIRECT CONTACT</span>
          </div>
          <p className="text-slate-400 text-xs">
            Display direct executive contact for university administration and partnership inquiries at the bottom of the contact page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Lead Name
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. Chapter Lead / Captain"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Lead Role Title
              </label>
              <input
                type="text"
                value={leadRole}
                onChange={(e) => setLeadRole(e.target.value)}
                placeholder="e.g. AWS Student Builder Group Chapter Lead"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Direct Contact Email
              </label>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="lead@sspu.ac.in"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Lead LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={leadLinkedin}
                onChange={(e) => setLeadLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#a855f7] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: FEATURED LINKEDIN POST EMBED */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0a66c2] font-bold uppercase tracking-wider">
            <Linkedin className="w-4 h-4 text-[#0a66c2]" />
            <span>4. FEATURED LINKEDIN POST (DYNAMIC EMBED)</span>
          </div>
          <p className="text-slate-400 text-xs">
            Paste either a LinkedIn Embed iframe code (e.g. from LinkedIn: <em>"Embed this post"</em>) or a direct embed URL. It will be showcased live on the Contact page.
          </p>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              LinkedIn Embed Code or Iframe URL
            </label>
            <textarea
              rows={3}
              value={featuredLinkedinPostUrl}
              onChange={(e) => setFeaturedLinkedinPostUrl(e.target.value)}
              placeholder='<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:..." height="600" width="504" frameborder="0" ...></iframe>'
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white font-mono focus:border-[#0a66c2] focus:outline-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Tip: In LinkedIn, click the "..." menu on any post &gt; "Embed this post" &gt; copy code and paste here (or paste any public post / activity link).
            </p>
          </div>

          {/* Live Preview */}
          {previewSrc && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-3">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Live Embed Preview:</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    Valid Embed URL
                  </span>
                  <a
                    href={previewSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-[#0a66c2] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Test Open in New Tab</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
              <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden border border-white/[0.1] bg-[#0f141c] max-h-[580px]">
                <iframe
                  src={previewSrc}
                  height="560"
                  width="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="LinkedIn Post Preview"
                  className="w-full bg-[#080b10]"
                  style={{ height: '560px', maxHeight: '580px', width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: COLLEGE CAMPUS GOOGLE MAPS (DYNAMIC EMBED) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#00f0ff]" />
              <span>5. COLLEGE CAMPUS GOOGLE MAPS (DYNAMIC EMBED)</span>
            </div>
            {googleMapsEmbedUrl.trim() ? (
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                Custom Embed Active
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                Default SSPU Campus Map
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs">
            Paste either a Google Maps Embed iframe code (from Google Maps &gt; Share &gt; <em>&quot;Embed a map&quot;</em>) or a direct embed URL. It will be dynamically rendered on the Contact page&apos;s College Campus Location card.
          </p>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              Google Maps Embed Code or Iframe URL
            </label>
            <textarea
              rows={3}
              value={googleMapsEmbedUrl}
              onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3 text-xs text-white font-mono focus:border-[#00f0ff] focus:outline-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Tip: In Google Maps, search your university campus &gt; click &quot;Share&quot; &gt; &quot;Embed a map&quot; &gt; &quot;Copy HTML&quot; and paste here. Leave empty to use the official SSPU Kiwale campus map.
            </p>
          </div>

          {/* Live Preview */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-3">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Live Map Embed Preview:</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Interactive Map
                </span>
                <a
                  href={mapsPreviewSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-[#00f0ff] hover:underline inline-flex items-center gap-1"
                >
                  <span>Test Open in New Tab</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden border border-white/[0.1] bg-[#0f141c]">
              <iframe
                src={mapsPreviewSrc}
                height="240"
                width="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps Campus Preview"
                className="w-full bg-[#080b10]"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#00f0ff] hover:bg-[#00c8d7] text-[#080b10] font-bold py-3 px-8 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50 font-mono"
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
