import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  Mail,
  MapPin,
  ExternalLink,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Globe,
  MessageSquare,
  Sparkles,
  Send,
  User,
  ShieldCheck,
} from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';
import {
  normalizeLinkedInEmbedUrl,
  getLinkedInPostDirectUrl,
  normalizeGoogleMapsEmbedUrl,
  getGoogleMapsDirectUrl,
  DEFAULT_SSPU_MAPS_EMBED,
} from '@/lib/utils';

export const revalidate = 0;

interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

export default async function ContactPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: settings } = await supabase.from('site_settings').select('*');
  const contactData = settings?.find((s) => s.key === 'contact_info')?.value;

  const email = contactData?.email || 'sbg@sspu.ac.in';
  const location = contactData?.location || 'Computer Lab 3, Symbiosis Skills and Professional University, Kiwale, Pune - 412101';
  const socials: SocialLink[] = Array.isArray(contactData?.socials) && contactData.socials.length > 0
    ? contactData.socials
    : [
        { platform: 'linkedin', label: 'LinkedIn Community', url: 'https://www.linkedin.com/company/aws-sbg-sspu' },
        { platform: 'instagram', label: 'Instagram Channel', url: 'https://instagram.com/aws_sbg_sspu' },
        { platform: 'github', label: 'GitHub Organization', url: 'https://github.com/aws-sbg-sspu' },
        { platform: 'x', label: 'X (Twitter)', url: 'https://x.com/aws_sbg_sspu' },
      ];

  const leadName = contactData?.lead_name || 'Chapter Leadership';
  const leadRole = contactData?.lead_role || 'AWS SBG Chapter Lead';
  const leadEmail = contactData?.lead_email || email;
  const leadLinkedin = contactData?.lead_linkedin || '';

  // Normalize LinkedIn embed URL (purely from admin configuration)
  const rawEmbedInput = contactData?.featured_linkedin_post_url;
  const linkedinEmbedUrl = normalizeLinkedInEmbedUrl(rawEmbedInput);
  const openInLinkedinUrl = getLinkedInPostDirectUrl(rawEmbedInput);

  // Google Maps embed URL (admin configured, fallback to official SSPU Kiwale campus embed)
  const rawMapsInput = contactData?.google_maps_embed_url;
  const mapsEmbedUrl = normalizeGoogleMapsEmbedUrl(rawMapsInput) || DEFAULT_SSPU_MAPS_EMBED;
  const openInMapsUrl = getGoogleMapsDirectUrl(rawMapsInput, location);


  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-[#0a66c2]" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-[#e4405f]" />;
      case 'x':
      case 'twitter':
        return <Twitter className="w-4 h-4 text-[#1da1f2]" />;
      case 'github':
        return <Github className="w-4 h-4 text-white" />;
      default:
        return <Globe className="w-4 h-4 text-[#00f0ff]" />;
    }
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Page Header */}
        <div className="pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] tracking-wider uppercase mb-1 font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>// CONNECT & COLLABORATE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-sans tracking-tight">
            Contact & Community Channels
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-sans leading-relaxed">
            Reach out to the chapter executive committee, connect across our active social channels, or inquire about AWS student workshops and sponsorship.
          </p>
        </div>

        {/* 2-Column Grid on Desktop / Ordered Stream on Mobile (LinkedIn post right after affiliate links) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Container (6 cols on desktop, contents on mobile) */}
          <div className="contents lg:block lg:col-span-6 lg:space-y-6">
            {/* Primary Contact Card (Order 1 on mobile: contains official office, email, and social/affiliate links) */}
            <div className="order-1 p-6 sm:p-8 rounded-3xl bg-[#0f141c]/90 backdrop-blur-xl border border-white/[0.1] shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 px-2.5 rounded-lg bg-[#080b10] border border-white/[0.12] flex items-center justify-center">
                  <AwsLogo className="w-6 h-auto" variant="dual" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-sans">
                    Official Chapter Office
                  </h2>
                  <div className="text-xs font-mono text-slate-400">
                    AWS Student Builder Group @ SSPU · ap-south-1
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {/* Official Email */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-[#080b10] border border-white/[0.08] hover:border-[#ff9900]/50 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-[#ff9900]/10 text-[#ff9900] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono text-slate-400">Official Correspondence Email</div>
                    <div className="text-sm font-mono font-bold text-white group-hover:text-[#ff9900] transition-colors truncate">
                      {email}
                    </div>
                  </div>
                  <Send className="w-4 h-4 text-slate-500 group-hover:text-[#ff9900] transition-colors shrink-0 mt-1" />
                </a>
              </div>

              {/* Social Channels List (Affiliate Links) */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
                  Active Social & Community Channels
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socials.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#080b10] border border-white/[0.08] hover:border-white/[0.25] text-xs font-mono text-slate-300 hover:text-white transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {getPlatformIcon(s.platform)}
                        <span className="truncate">{s.label}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* College Campus Location Card with Interactive Google Maps Embed (Order 3 on mobile) */}
            <div className="order-3 p-6 sm:p-7 rounded-3xl bg-[#0f141c]/90 backdrop-blur-xl border border-white/[0.1] shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#00f0ff] uppercase tracking-wider font-semibold">
                      // COLLEGE CAMPUS LOCATION
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                      Symbiosis Skills & Professional University
                    </h3>
                  </div>
                </div>
                <a
                  href={openInMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-slate-300 hover:text-white transition-colors shrink-0 font-medium"
                  title="Open in Google Maps"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#00f0ff]" />
                </a>
              </div>

              <div className="text-xs text-slate-300 font-mono leading-relaxed">
                {location || 'Kiwale, Adjoining Pune-Mumbai Expressway, Pune · 412101, Maharashtra, India'}
              </div>

              {/* Map Iframe Container */}
              <div className="w-full rounded-2xl overflow-hidden border border-white/[0.12] bg-[#080b10] shadow-inner relative group">
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="College Campus Location Map"
                  className="w-full h-[200px] sm:h-[220px] filter contrast-[1.05] grayscale-[0.15] hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>

            {/* Chapter Leadership Direct Contact Card (Order 4 on mobile) */}
            <div className="order-4 p-6 rounded-2xl bg-[#0f141c]/80 backdrop-blur border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#a855f7] shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono text-[#a855f7] font-semibold">{leadRole}</div>
                  <div className="text-sm font-bold text-white">{leadName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{leadEmail}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${leadEmail}`}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                >
                  Direct Email
                </a>
                {leadLinkedin && (
                  <a
                    href={leadLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 text-[#0a66c2] border border-[#0a66c2]/30 transition-colors"
                    title="Chapter Lead LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column / Order 2 on Mobile: Dynamic Featured LinkedIn Post Spotlight (placed immediately after affiliate links) */}
          <div className="order-2 lg:order-none lg:col-span-6 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0f141c]/90 backdrop-blur-xl border border-white/[0.1] shadow-2xl space-y-5">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#0a66c2] font-bold uppercase tracking-wider">
                  <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                  <span>FEATURED COMMUNITY UPDATE</span>
                </div>
                <a
                  href={openInLinkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/30 text-xs font-mono text-[#0a66c2] hover:text-white transition-colors shrink-0 font-medium"
                  title="Open on LinkedIn"
                >
                  <span>Open in LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {linkedinEmbedUrl ? (
                <div className="w-full rounded-2xl overflow-hidden border border-white/[0.1] bg-[#080b10] shadow-inner max-h-[580px] flex justify-center">
                  <iframe
                    src={linkedinEmbedUrl}
                    height="560"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Featured LinkedIn Post"
                    className="w-full bg-[#080b10]"
                    style={{ height: '560px', maxHeight: '580px', width: '100%' }}
                  />
                </div>
              ) : (
                <div className="p-10 text-center rounded-2xl bg-[#080b10] border border-white/[0.08] space-y-4">
                  <Sparkles className="w-8 h-8 text-[#ff9900] mx-auto opacity-70" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white font-sans">
                      Follow AWS Student Builder Group
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Stay updated on upcoming hands-on architectural sprints, cloud security labs, and certification watch parties.
                    </p>
                  </div>
                  <a
                    href="https://www.linkedin.com/company/aws-sbg-sspu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#084e96] text-white text-xs font-mono font-bold transition-all shadow-md"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>Follow on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
