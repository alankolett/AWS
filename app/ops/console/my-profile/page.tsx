'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateProfile } from '@/app/actions/profiles';
import { ImageUpload } from '@/components/common/ImageUpload';
import {
  User,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Quote,
  Award,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  Tag,
} from 'lucide-react';
import Link from 'next/link';

const AWS_CERT_PRESETS = [
  'AWS Certified Cloud Practitioner',
  'AWS Certified Solutions Architect – Associate',
  'AWS Certified Developer – Associate',
  'AWS Certified SysOps Administrator – Associate',
  'AWS Certified Solutions Architect – Professional',
  'AWS Certified DevOps Engineer – Professional',
  'AWS Certified Security – Specialty',
  'AWS Certified Machine Learning – Specialty',
  'AWS Certified Data Engineer – Associate',
];

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Certifications & Badges input states
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('Amazon Web Services (AWS)');
  const [newCertId, setNewCertId] = useState('');
  const [newBadgeText, setNewBadgeText] = useState('');

  const supabase = createClient();

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load caller's profile
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Load domains from team_sections
    const { data: secs } = await supabase
      .from('team_sections')
      .select('*')
      .order('order_index', { ascending: true });

    setProfile({
      ...(p || {}),
      certifications: Array.isArray(p?.certifications) ? p.certifications : [],
      badges: Array.isArray(p?.badges) ? p.badges : [],
    });
    setDomains(secs || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAddCert = () => {
    if (!newCertTitle.trim()) return;
    const current = Array.isArray(profile.certifications) ? [...profile.certifications] : [];
    const newCert = {
      name: newCertTitle.trim(),
      issuer: newCertIssuer.trim() || 'Amazon Web Services (AWS)',
      credential_id: newCertId.trim() || undefined,
    };
    setProfile({ ...profile, certifications: [...current, newCert] });
    setNewCertTitle('');
    setNewCertId('');
  };

  const handleRemoveCert = (index: number) => {
    const current = [...(profile.certifications || [])];
    current.splice(index, 1);
    setProfile({ ...profile, certifications: current });
  };

  const handleAddBadge = () => {
    if (!newBadgeText.trim()) return;
    const current = Array.isArray(profile.badges) ? [...profile.badges] : [];
    const val = newBadgeText.trim();
    if (!current.includes(val)) {
      setProfile({ ...profile, badges: [...current, val] });
    }
    setNewBadgeText('');
  };

  const handleRemoveBadge = (index: number) => {
    const current = [...(profile.badges || [])];
    current.splice(index, 1);
    setProfile({ ...profile, badges: current });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setStatusMsg(null);

    const res = await updateProfile(profile.id, {
      full_name: profile.full_name,
      headline: profile.headline,
      division: profile.division,
      branch: profile.branch,
      year: profile.year,
      bio: profile.bio,
      quote: profile.quote,
      avatar_url: profile.avatar_url,
      banner_url: profile.banner_url,
      builder_id: profile.builder_id,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      portfolio_url: profile.portfolio_url,
      team_section_id: profile.team_section_id || null,
      certifications: profile.certifications || [],
      badges: profile.badges || [],
    });

    if (res.error) {
      setStatusMsg({ type: 'error', text: res.error });
    } else {
      setStatusMsg({ type: 'success', text: 'Your builder profile and credentials were successfully updated!' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#00f0ff] animate-pulse">Loading Profile Configuration...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        No active user session detected. Please sign in.
      </div>
    );
  }

  const assignedDomain = domains.find((d) => d.id === profile.team_section_id);

  return (
    <div className="space-y-10 w-full max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase font-semibold mb-1">
            <User className="w-4 h-4" />
            <span>MEMBER PROFILE CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Builder Profile
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Configure your public teammate profile, domain classification, headshot, and personal page banner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/team/${profile.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <span>Preview My Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-start gap-3 border shadow-md ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : 'bg-red-500/10 text-red-300 border-red-500/20'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: ASSETS & MEDIA */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.05]">
            <Sparkles className="w-4 h-4 text-[#ff9900]" />
            <h2 className="text-base font-bold text-white font-sans">
              Storage-Backed Media Assets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageUpload
                value={profile.avatar_url}
                onChange={(url) => setProfile({ ...profile, avatar_url: url })}
                bucket="avatars"
                label="Profile Photo (Avatar)"
                aspect="square"
                helperText="Upload a square profile photo stored in Supabase 'avatars' bucket"
              />
            </div>

            <div>
              <ImageUpload
                value={profile.banner_url}
                onChange={(url) => setProfile({ ...profile, banner_url: url })}
                bucket="cms-media"
                label="Personal Page Backdrop Banner"
                aspect="video"
                helperText="Displayed across the top of your personal builder page when members click your card"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: IDENTITY & DOMAIN CLASSIFICATION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.05]">
            <Briefcase className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-base font-bold text-white font-sans">
              Identity & Domain Classification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="e.g. Laksh Meghani"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Account Email (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={profile.email || ''}
                className="w-full bg-[#080b10]/60 border border-white/[0.05] rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Headline / Role Title
              </label>
              <input
                type="text"
                value={profile.headline || ''}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="e.g. Cloud Security Fellow, Architecture Lead"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            {/* Domain Dropdown */}
            <div>
              <label className="block text-xs font-mono text-[#00f0ff] mb-1.5 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Chapter Domain / Specialization *</span>
              </label>
              <select
                value={profile.team_section_id || ''}
                onChange={(e) => setProfile({ ...profile, team_section_id: e.target.value || null })}
                className="w-full bg-[#080b10] border border-[#00f0ff]/40 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="">[General Builder / No Domain Assigned]</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Classifies your profile under a domain (e.g. Developer Team, Cloud Security Team).
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Custom Division
              </label>
              <input
                type="text"
                value={profile.division || ''}
                onChange={(e) => setProfile({ ...profile, division: e.target.value })}
                placeholder="e.g. Cloud Operations, AI/ML Labs"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Verified AWS Builder ID
              </label>
              <input
                type="text"
                value={profile.builder_id || ''}
                onChange={(e) => setProfile({ ...profile, builder_id: e.target.value })}
                placeholder="e.g. BID-94827"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Academic Branch
              </label>
              <input
                type="text"
                value={profile.branch || ''}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Cohort / Graduation Year
              </label>
              <input
                type="text"
                value={profile.year || ''}
                onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                placeholder="e.g. Year 3, 2026"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BIO & QUOTE */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.05]">
            <Quote className="w-4 h-4 text-[#ff9900]" />
            <h2 className="text-base font-bold text-white font-sans">
              Biography & Builder Philosophy
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                About / Biography
              </label>
              <textarea
                rows={4}
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Describe your technical background, cloud projects, and contributions..."
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Personal Builder Motto / Quote
              </label>
              <input
                type="text"
                value={profile.quote || ''}
                onChange={(e) => setProfile({ ...profile, quote: e.target.value })}
                placeholder="e.g. 'Build resilient, scale responsibly.'"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: CERTIFICATIONS & CREDENTIALS */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ff9900]" />
              <h2 className="text-base font-bold text-white font-sans">
                Certifications & Badges
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Visible on your public builder card and personal portfolio page
            </span>
          </div>

          {/* Part A: AWS Certifications */}
          <div className="space-y-4">
            <label className="block text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff9900]" />
              <span>Official Cloud Certifications</span>
            </label>

            {/* Existing Certifications List */}
            {profile.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-2.5">
                {profile.certifications.map((cert: any, idx: number) => {
                  const title = typeof cert === 'string' ? cert : cert.name || 'Certification';
                  const issuer = typeof cert === 'object' && cert.issuer ? cert.issuer : null;
                  const credId = typeof cert === 'object' && cert.credential_id ? cert.credential_id : null;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#080b10] border border-white/[0.08] hover:border-white/[0.15] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#ff9900]/10 border border-[#ff9900]/20 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-[#ff9900]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-white truncate">
                            {title}
                          </div>
                          {(issuer || credId) && (
                            <div className="text-[11px] font-mono text-slate-400 truncate">
                              {issuer || 'AWS'} {credId ? `· ID: ${credId}` : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCert(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0 ml-3"
                        title="Remove Certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#080b10]/60 border border-dashed border-white/[0.08] text-center text-xs font-mono text-slate-500">
                No certifications added yet. Select from common AWS credentials below or enter a custom certification.
              </div>
            )}

            {/* Add New Certification Form */}
            <div className="p-4 rounded-xl bg-[#080b10] border border-white/[0.06] space-y-3">
              <div className="text-xs font-mono text-slate-400 font-medium">Add New Certification:</div>
              
              {/* Preset Selector */}
              <div>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewCertTitle(e.target.value);
                      setNewCertIssuer('Amazon Web Services (AWS)');
                    }
                  }}
                  className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#ff9900]"
                >
                  <option value="">-- Quick Select from AWS Certifications --</option>
                  {AWS_CERT_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={newCertTitle}
                    onChange={(e) => setNewCertTitle(e.target.value)}
                    placeholder="Certification Title (e.g. AWS Certified Developer)"
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newCertIssuer}
                    onChange={(e) => setNewCertIssuer(e.target.value)}
                    placeholder="Issuer (e.g. AWS)"
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newCertId}
                    onChange={(e) => setNewCertId(e.target.value)}
                    placeholder="Credential ID or URL (optional)"
                    className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddCert}
                  disabled={!newCertTitle.trim()}
                  className="px-4 py-2 bg-[#ff9900]/20 hover:bg-[#ff9900]/30 text-[#ff9900] border border-[#ff9900]/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>
            </div>
          </div>

          {/* Part B: Skill Badges & Technical Credentials */}
          <div className="space-y-3 pt-4 border-t border-white/[0.05]">
            <label className="block text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#a855f7]" />
              <span>Skill Badges & Technical Specializations</span>
            </label>

            {/* Badges Chips */}
            <div className="flex flex-wrap gap-2 min-h-[36px] p-3 rounded-xl bg-[#080b10] border border-white/[0.06]">
              {profile.badges && profile.badges.length > 0 ? (
                profile.badges.map((badge: any, idx: number) => {
                  const bName = typeof badge === 'string' ? badge : badge.name || 'Badge';
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/30 text-xs font-mono shadow-sm"
                    >
                      <span>{bName}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBadge(idx)}
                        className="text-purple-400 hover:text-red-400 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  No badges added yet. Type a badge name below or click a suggestion.
                </span>
              )}
            </div>

            {/* Quick Badge Suggestions & Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={newBadgeText}
                onChange={(e) => setNewBadgeText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBadge();
                  }
                }}
                placeholder="Enter badge name (e.g. AWS DeepRacer, Terraform, Serverless)..."
                className="flex-1 bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#a855f7]"
              />
              <button
                type="button"
                onClick={handleAddBadge}
                disabled={!newBadgeText.trim()}
                className="px-4 py-2 bg-[#a855f7]/20 hover:bg-[#a855f7]/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Badge</span>
              </button>
            </div>

            {/* Quick chip suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-500 mr-1">Suggestions:</span>
              {['AWS DeepRacer', 'Cloud Practitioner', 'Serverless Architecture', 'Terraform', 'Kubernetes', 'Bedrock & GenAI'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(profile.badges) ? [...profile.badges] : [];
                    if (!current.includes(sug)) {
                      setProfile({ ...profile, badges: [...current, sug] });
                    }
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.05] transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: SOCIAL LINKS */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.05]">
            <Globe className="w-4 h-4 text-[#a855f7]" />
            <h2 className="text-base font-bold text-white font-sans">
              Professional & Developer Links
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </label>
              <input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio Website</span>
              </label>
              <input
                type="url"
                value={profile.portfolio_url || ''}
                onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                placeholder="https://yourportfolio.dev"
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE BAR */}
        <div className="sticky bottom-4 z-40 p-4 rounded-2xl bg-[#0f141c]/95 backdrop-blur-md border border-white/[0.15] shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            {assignedDomain ? (
              <span className="text-emerald-400">Classified under: {assignedDomain.name}</span>
            ) : (
              <span>No domain assigned yet</span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 font-mono"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
