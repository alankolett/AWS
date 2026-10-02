'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateProfile, deleteMember } from '@/app/actions/profiles';
import { createDomain, updateDomain, deleteDomain } from '@/app/actions/domains';
import { ImageUpload } from '@/components/common/ImageUpload';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Layers,
  X,
  User,
  Shield,
  Briefcase,
  ExternalLink,
  Tag
} from 'lucide-react';
import Link from 'next/link';

export default function TeamManagementPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [domainsList, setDomainsList] = useState<any[]>([]);

  // Domain creation state
  const [newDomainName, setNewDomainName] = useState('');
  const [creatingDomain, setCreatingDomain] = useState(false);
  const [domainMsg, setDomainMsg] = useState('');

  // Editing profile modal state
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const supabase = createClient();

  const loadData = async () => {
    const { data: profs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfilesList(profs || []);

    const { data: sects } = await supabase.from('team_sections').select('*').order('order_index', { ascending: true });
    setDomainsList(sects || []);
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
      await loadData();
      setLoading(false);
    }
    init();
  }, [supabase]);

  const isAdmin = user?.role === 'admin';

  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;
    setCreatingDomain(true);
    setDomainMsg('');

    const res = await createDomain(newDomainName.trim());
    if (res.error) {
      setDomainMsg(`Error: ${res.error}`);
    } else {
      setNewDomainName('');
      setDomainMsg('New domain added successfully!');
      setTimeout(() => setDomainMsg(''), 3000);
      loadData();
    }
    setCreatingDomain(false);
  };

  const handleDeleteDomain = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete domain "${name}"? Members assigned to this domain will become unassigned.`)) return;
    const res = await deleteDomain(id);
    if (res.error) {
      alert(`Delete domain failed: ${res.error}`);
    } else {
      loadData();
    }
  };

  const openEditModal = (member: any) => {
    setEditingProfile({ ...member });
    setProfileMsg('');
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg('');

    const res = await updateProfile(editingProfile.id, editingProfile);
    if (res.error) {
      setProfileMsg(`Error: ${res.error}`);
    } else {
      setProfileMsg('Member profile updated successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        loadData();
      }, 1000);
    }
    setSaving(false);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently remove member "${name || id}"?`)) return;
    const res = await deleteMember(id);
    if (res.error) {
      alert(`Remove failed: ${res.error}`);
    } else {
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#00f0ff] animate-pulse">Loading Team & Domains...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-4">
        <Shield className="w-10 h-10 text-[#ff9900] mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-slate-400 text-xs">Only administrators can manage chapter domains and modify other members' profiles.</p>
        <Link href="/ops/console/my-profile" className="inline-block px-4 py-2 bg-[#00f0ff] text-[#080b10] rounded-lg text-xs font-bold">
          Go to My Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase font-semibold mb-1">
            <Users className="w-4 h-4" />
            <span>CHAPTER ROSTER & DOMAIN TAXONOMY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Team Members & Domains
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Define organizational domains (Developer Team, Cloud Security, etc.) and configure full teammate profiles with storage-backed avatars and banners.
          </p>
        </div>

        <Link
          href="/team"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors self-start sm:self-auto"
        >
          <span>View Public Team Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* SECTION 1: DOMAINS MANAGER (Requirement 3) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>CHAPTER DOMAINS & SPECIALIZATION GROUPS</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Add or edit domains to classify members (e.g. Developer Team, Cloud Security, Architecture). Members can select these on their profiles.
          </p>
        </div>

        {/* Existing Domains Chips */}
        <div className="flex flex-wrap gap-2.5">
          {domainsList.map(domain => (
            <div
              key={domain.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080b10] border border-white/[0.1] text-xs font-mono text-white shadow-sm"
            >
              <Briefcase className="w-3 h-3 text-[#ff9900]" />
              <span>{domain.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteDomain(domain.id, domain.name)}
                className="text-slate-500 hover:text-red-400 transition-colors p-0.5"
                title="Delete Domain"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Domain Form */}
        <form onSubmit={handleCreateDomain} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2 border-t border-white/[0.05]">
          <input
            type="text"
            required
            value={newDomainName}
            onChange={e => setNewDomainName(e.target.value)}
            placeholder="e.g. Cloud Security Team, DevOps Core"
            className="flex-1 bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:border-[#ff9900] focus:outline-none"
          />
          <button
            type="submit"
            disabled={creatingDomain}
            className="px-4 py-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Domain</span>
          </button>
        </form>
        {domainMsg && <p className="text-xs font-mono text-emerald-400">{domainMsg}</p>}
      </div>

      {/* SECTION 2: MEMBERS DIRECTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00f0ff]" />
            <span>Active Builders & Profiles ({profilesList.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {profilesList.map(member => {
            const domain = domainsList.find(d => d.id === member.team_section_id);

            return (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#080b10] border border-white/[0.1] shrink-0">
                    <img
                      src={member.avatar_url || '/stickman.svg'}
                      alt={member.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white font-sans">
                        {member.full_name || 'Unnamed Builder'}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        member.role === 'admin' ? 'bg-[#ff9900]/20 text-[#ff9900]' : 'bg-[#00f0ff]/20 text-[#00f0ff]'
                      }`}>
                        {member.role}
                      </span>
                      {domain && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                          {domain.name}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-mono">{member.email}</div>
                    <div className="text-xs text-slate-300">
                      {member.headline || 'Member'} {member.branch ? `· ${member.branch}` : ''} {member.year ? `(${member.year})` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => openEditModal(member)}
                    className="px-4 py-2 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  {member.id !== user?.id && (
                    <button
                      onClick={() => handleDeleteUser(member.id, member.full_name || member.email)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                      title="Remove Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL LENGTH MODAL: EDIT MEMBER PROFILE */}
      {isModalOpen && editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-10 rounded-2xl bg-[#0f141c] border border-white/[0.15] shadow-2xl space-y-8 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Edit Member Database Entry
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Update photo, banner, domain, credentials, and links for {editingProfile.email}.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Image Uploads: Avatar & Banner Photo (Requirement 1 & 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#080b10] border border-white/[0.08]">
                <div>
                  <ImageUpload
                    value={editingProfile.avatar_url}
                    onChange={url => setEditingProfile({ ...editingProfile, avatar_url: url })}
                    bucket="avatars"
                    label="Profile Photo (Avatar)"
                    aspect="square"
                    helperText="Upload square headshot stored in avatars bucket"
                  />
                </div>

                <div>
                  <ImageUpload
                    value={editingProfile.banner_url}
                    onChange={url => setEditingProfile({ ...editingProfile, banner_url: url })}
                    bucket="cms-media"
                    label="Personal Page Banner Photo"
                    aspect="video"
                    helperText="Upload backdrop banner stored in Supabase storage"
                  />
                </div>
              </div>

              {/* Core Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingProfile.full_name || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, full_name: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Privilege Role</label>
                  <select
                    value={editingProfile.role}
                    onChange={e => setEditingProfile({ ...editingProfile, role: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                    <option value="student">student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Headline / Role Title</label>
                  <input
                    type="text"
                    value={editingProfile.headline || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, headline: e.target.value })}
                    placeholder="e.g. Cloud Security Fellow"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* Domain Classification (Requirement 3) */}
                <div>
                  <label className="block text-xs font-mono text-[#00f0ff] mb-1 font-bold">
                    Assigned Domain / Team Section
                  </label>
                  <select
                    value={editingProfile.team_section_id || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, team_section_id: e.target.value || null })}
                    className="w-full bg-[#080b10] border border-[#00f0ff]/40 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="">[None / Unassigned]</option>
                    {domainsList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Division (Custom)</label>
                  <input
                    type="text"
                    value={editingProfile.division || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, division: e.target.value })}
                    placeholder="e.g. Operations, Security, AI/ML"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Branch</label>
                  <input
                    type="text"
                    value={editingProfile.branch || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, branch: e.target.value })}
                    placeholder="e.g. B.Tech CSIT"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProfile.year || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, year: e.target.value })}
                    placeholder="e.g. Year 3"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Verified Builder ID</label>
                  <input
                    type="text"
                    value={editingProfile.builder_id || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, builder_id: e.target.value })}
                    placeholder="e.g. sspu-builder-101"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">Bio</label>
                  <textarea
                    rows={2}
                    value={editingProfile.bio || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">Personal Quote</label>
                  <input
                    type="text"
                    value={editingProfile.quote || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, quote: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={editingProfile.github_url || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, github_url: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={editingProfile.linkedin_url || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, linkedin_url: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    value={editingProfile.portfolio_url || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, portfolio_url: e.target.value })}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
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
                  {profileMsg && <span className="text-xs font-mono text-emerald-400">{profileMsg}</span>}
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-[#00f0ff] hover:bg-[#00d0e0] text-[#080b10] font-bold text-xs rounded-xl transition-colors shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Updating Member...' : 'Update Member Database Entry'}
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
