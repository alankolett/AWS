'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { updateProfile, deleteMember } from '@/app/actions/profiles';
import { createDomain, updateDomain, deleteDomain } from '@/app/actions/domains';
import { resetUserPasswordToPasskey } from '@/app/actions/admin';
import { updateSiteSetting } from '@/app/actions/cms';
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
  Tag,
  KeyRound,
  RotateCcw,
  Lock,
  Award,
  ShieldCheck,
  Crown,
  Sparkles,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  Filter,
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

export default function TeamManagementPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profilesList, setProfilesList] = useState<any[]>([]);
  const [domainsList, setDomainsList] = useState<any[]>([]);

  // Drag & Drop Positioning Playground state (Requirement 3)
  const [teamOrder, setTeamOrder] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [playgroundFilter, setPlaygroundFilter] = useState<string>('ALL');
  const [playgroundMsg, setPlaygroundMsg] = useState<string>('');

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
    const [{ data: profs }, { data: sects }, { data: settings }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('team_sections').select('*').order('order_index', { ascending: true }),
      supabase.from('site_settings').select('*'),
    ]);

    const savedOrder: string[] = settings?.find((s) => s.key === 'team_order')?.value?.order || [];
    setTeamOrder(savedOrder);

    if (profs) {
      if (savedOrder.length > 0) {
        const orderMap = new Map(savedOrder.map((id, idx) => [id, idx]));
        profs.sort((a, b) => (orderMap.get(a.id) ?? 9999) - (orderMap.get(b.id) ?? 9999));
      }
      setProfilesList(profs);
    }

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

  // Helper to test if a division is top executive
  const isExecutiveDivision = (div?: string) => {
    const d = (div || '').toLowerCase().trim();
    return d.includes('chapter lead') || d.includes('campus lead') || d.includes('co-lead') || d.includes('co-chapter') || d.includes('co chapter');
  };

  // Drag & Drop Playground Handlers
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) {
      setDragOverId(id);
    }
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const currentOrder = teamOrder.length > 0 ? [...teamOrder] : profilesList.map((p) => p.id);
    if (!currentOrder.includes(draggedId)) currentOrder.push(draggedId);
    if (!currentOrder.includes(targetId)) currentOrder.push(targetId);

    const fromIndex = currentOrder.indexOf(draggedId);
    const toIndex = currentOrder.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      currentOrder.splice(fromIndex, 1);
      currentOrder.splice(toIndex, 0, draggedId);
    }

    setTeamOrder(currentOrder);
    setDraggedId(null);
    setDragOverId(null);

    // Optimistic sort
    const orderMap = new Map(currentOrder.map((id, idx) => [id, idx]));
    setProfilesList((prev) => [...prev].sort((a, b) => (orderMap.get(a.id) ?? 9999) - (orderMap.get(b.id) ?? 9999)));

    setPlaygroundMsg('Saving new tile order...');
    const res = await updateSiteSetting('team_order', { order: currentOrder });
    if (res.error) {
      setPlaygroundMsg(`Error saving order: ${res.error}`);
    } else {
      setPlaygroundMsg('Tile position updated & synced live to /team page!');
      setTimeout(() => setPlaygroundMsg(''), 3000);
    }
  };

  const handleMoveStep = async (id: string, direction: 'up' | 'down') => {
    const currentOrder = teamOrder.length > 0 ? [...teamOrder] : profilesList.map((p) => p.id);
    const index = currentOrder.indexOf(id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    setTeamOrder(currentOrder);
    const orderMap = new Map(currentOrder.map((mId, idx) => [mId, idx]));
    setProfilesList((prev) => [...prev].sort((a, b) => (orderMap.get(a.id) ?? 9999) - (orderMap.get(b.id) ?? 9999)));

    setPlaygroundMsg('Position moved!');
    const res = await updateSiteSetting('team_order', { order: currentOrder });
    if (!res.error) {
      setTimeout(() => setPlaygroundMsg(''), 2500);
    }
  };

  // Requirement 2 & 3: Auto-Sort Leads to the first position
  const handleAutoSortLeadsFirst = async () => {
    const sorted = [...profilesList].sort((a, b) => {
      // 1. Executive divisions first
      const isExecA = isExecutiveDivision(a.division);
      const isExecB = isExecutiveDivision(b.division);
      if (isExecA !== isExecB) return isExecA ? -1 : 1;

      // 2. Leads first (is_lead === true)
      const aLead = Boolean(a.is_lead);
      const bLead = Boolean(b.is_lead);
      if (aLead !== bLead) return aLead ? -1 : 1;

      // 3. Fallback to name/email
      return (a.full_name || a.email).localeCompare(b.full_name || b.email);
    });

    const newOrder = sorted.map((p) => p.id);
    setTeamOrder(newOrder);
    setProfilesList(sorted);

    setPlaygroundMsg('All Leads moved to the first position!');
    const res = await updateSiteSetting('team_order', { order: newOrder });
    if (!res.error) {
      setPlaygroundMsg('All Leads sorted first & published live!');
      setTimeout(() => setPlaygroundMsg(''), 3500);
    }
  };

  // Quick 1-Click Lead toggle on table
  const handleToggleLead = async (member: any) => {
    if (!isAdmin) return;
    const nextVal = !member.is_lead;

    // Optimistic UI update
    setProfilesList((prev) =>
      prev.map((p) => (p.id === member.id ? { ...p, is_lead: nextVal } : p))
    );

    const res = await updateProfile(member.id, { is_lead: nextVal });
    if (res.error) {
      alert(`Error updating lead status: ${res.error}`);
      await loadData();
    } else {
      setPlaygroundMsg(
        `${member.full_name || member.email} is now ${nextVal ? 'designated as LEAD (Orange Border)' : 'regular member (Green Border)'}!`
      );
      setTimeout(() => setPlaygroundMsg(''), 3500);
    }
  };

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

  // Reset Passkey state
  const [resetPasskeyVal, setResetPasskeyVal] = useState('000000');
  const [resetMsg, setResetMsg] = useState('');
  const [resettingPasskey, setResettingPasskey] = useState(false);
  const [showResetBox, setShowResetBox] = useState(false);

  // Cert & Badge states for edit modal
  const [modalCertTitle, setModalCertTitle] = useState('');
  const [modalCertIssuer, setModalCertIssuer] = useState('Amazon Web Services (AWS)');
  const [modalCertId, setModalCertId] = useState('');
  const [modalBadgeText, setModalBadgeText] = useState('');

  const openEditModal = (member: any) => {
    setEditingProfile({
      ...member,
      is_lead: Boolean(member.is_lead),
      certifications: Array.isArray(member.certifications) ? member.certifications : [],
      badges: Array.isArray(member.badges) ? member.badges : [],
    });
    setProfileMsg('');
    setShowResetBox(false);
    setResetMsg('');
    setResetPasskeyVal(Math.floor(100000 + Math.random() * 900000).toString());
    setModalCertTitle('');
    setModalCertIssuer('Amazon Web Services (AWS)');
    setModalCertId('');
    setModalBadgeText('');
    setIsModalOpen(true);
  };

  const handleModalAddCert = () => {
    if (!modalCertTitle.trim() || !editingProfile) return;
    const current = Array.isArray(editingProfile.certifications) ? [...editingProfile.certifications] : [];
    const newCert = {
      name: modalCertTitle.trim(),
      issuer: modalCertIssuer.trim() || 'Amazon Web Services (AWS)',
      credential_id: modalCertId.trim() || undefined,
    };
    setEditingProfile({ ...editingProfile, certifications: [...current, newCert] });
    setModalCertTitle('');
    setModalCertId('');
  };

  const handleModalRemoveCert = (index: number) => {
    if (!editingProfile) return;
    const current = [...(editingProfile.certifications || [])];
    current.splice(index, 1);
    setEditingProfile({ ...editingProfile, certifications: current });
  };

  const handleModalAddBadge = () => {
    if (!modalBadgeText.trim() || !editingProfile) return;
    const current = Array.isArray(editingProfile.badges) ? [...editingProfile.badges] : [];
    const val = modalBadgeText.trim();
    if (!current.includes(val)) {
      setEditingProfile({ ...editingProfile, badges: [...current, val] });
    }
    setModalBadgeText('');
  };

  const handleModalRemoveBadge = (index: number) => {
    if (!editingProfile) return;
    const current = [...(editingProfile.badges || [])];
    current.splice(index, 1);
    setEditingProfile({ ...editingProfile, badges: current });
  };

  const handleResetMemberPasskey = async () => {
    if (!editingProfile?.id) return;
    if (resetPasskeyVal.trim().length !== 6) {
      setResetMsg('Passkey must be exactly 6 characters.');
      return;
    }
    setResettingPasskey(true);
    setResetMsg('');
    const res = await resetUserPasswordToPasskey(editingProfile.id, resetPasskeyVal.trim());
    if (res.error) {
      setResetMsg(`Error: ${res.error}`);
    } else {
      setResetMsg(`Password cleared! Temporary passkey "${resetPasskeyVal.trim()}" activated.`);
      loadData();
    }
    setResettingPasskey(false);
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

      {/* SECTION 2: MEMBER POSITIONING PLAYGROUND (Requirement 3) */}
      <div className="p-6 rounded-2xl bg-[#0f141c] border border-white/[0.1] shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
              <GripVertical className="w-4 h-4 text-[#00f0ff]" />
              <span>TEAM MEMBER POSITIONING PLAYGROUND</span>
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Drag &amp; Drop Teammate Tiles to Rearrange Positions
            </h3>
            <p className="text-slate-400 text-xs max-w-2xl font-sans">
              Drag name tiles or use arrow controls to reorder builders. All changes sync live to the public <code className="text-[#00f0ff] font-mono">/team</code> page.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleAutoSortLeadsFirst}
              title="Automatically move all Leads and Executive roles to the front"
              className="px-4 py-2 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-mono font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Auto-Sort: Leads First</span>
            </button>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => setPlaygroundFilter('ALL')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              playgroundFilter === 'ALL'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-bold'
                : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:text-white'
            }`}
          >
            All Members ({profilesList.length})
          </button>
          <button
            type="button"
            onClick={() => setPlaygroundFilter('LEADS')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              playgroundFilter === 'LEADS'
                ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40 font-bold'
                : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:text-white'
            }`}
          >
            <Crown className="w-3 h-3 text-[#ff9900]" />
            <span>Leads ({profilesList.filter(p => p.is_lead || isExecutiveDivision(p.division)).length})</span>
          </button>
          {domainsList.map(domain => {
            const count = profilesList.filter(p => p.team_section_id === domain.id).length;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setPlaygroundFilter(domain.id)}
                className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                  playgroundFilter === domain.id
                    ? 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40 font-bold'
                    : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:text-white'
                }`}
              >
                {domain.name} ({count})
              </button>
            );
          })}
        </div>

        {playgroundMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{playgroundMsg}</span>
          </div>
        )}

        {/* Small Name-Based Drag-and-Drop Tiles Canvas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-4 rounded-xl bg-[#080b10] border border-white/[0.06] min-h-[140px]">
          {profilesList
            .filter(p => {
              if (playgroundFilter === 'ALL') return true;
              if (playgroundFilter === 'LEADS') return Boolean(p.is_lead || isExecutiveDivision(p.division));
              return p.team_section_id === playgroundFilter;
            })
            .map((member, index, arr) => {
              const isLead = Boolean(member.is_lead || isExecutiveDivision(member.division));
              const isDragging = draggedId === member.id;
              const isDragOver = dragOverId === member.id;

              return (
                <div
                  key={member.id}
                  draggable={true}
                  onDragStart={() => handleDragStart(member.id)}
                  onDragOver={(e) => handleDragOver(e, member.id)}
                  onDrop={() => handleDrop(member.id)}
                  className={`p-2.5 px-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 select-none cursor-grab active:cursor-grabbing ${
                    isDragging
                      ? 'opacity-40 scale-95 border-dashed border-[#ff9900] bg-[#ff9900]/5'
                      : isDragOver
                      ? 'border-[#ff9900] bg-[#ff9900]/15 scale-[1.02] shadow-lg'
                      : isLead
                      ? 'bg-[#0f141c] border-[#ff9900]/40 hover:border-[#ff9900] shadow-sm'
                      : 'bg-[#0f141c] border-white/[0.08] hover:border-[#10b981]/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-500 shrink-0 hover:text-white" />
                    
                    {/* Miniature Avatar with Orange / Green Border */}
                    <div
                      className={`w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-[#080b10] border ${
                        isLead ? 'border-[#ff9900]' : 'border-[#10b981]'
                      }`}
                    >
                      <img
                        src={member.avatar_url || '/stickman.svg'}
                        alt={member.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name and Tag */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate max-w-[120px] font-sans">
                        {member.full_name || member.email?.split('@')[0]}
                      </div>
                      <div className="flex items-center gap-1">
                        {isLead ? (
                          <span className="text-[9px] font-mono text-[#ff9900] font-bold flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" />
                            <span>LEAD</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-[#10b981]">MEMBER</span>
                        )}
                        {member.division && (
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[80px]">
                            · {member.division}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Step Buttons (Up/Down) */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStep(member.id, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/[0.08] disabled:opacity-20"
                      title="Move position up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveStep(member.id, 'down');
                      }}
                      disabled={index === arr.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/[0.08] disabled:opacity-20"
                      title="Move position down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* SECTION 3: MEMBERS DIRECTORY & QUICK CONTROLS */}
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
            const isLead = Boolean(member.is_lead || isExecutiveDivision(member.division));

            return (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Square Avatar with Orange Border for Leads / Green for Members */}
                  <div
                    className={`w-14 h-14 rounded-xl overflow-hidden bg-[#080b10] border-2 ${
                      isLead
                        ? 'border-[#ff9900] shadow-[0_0_10px_rgba(255,153,0,0.3)]'
                        : 'border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                    } shrink-0`}
                  >
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
                      
                      {/* Privilege Role */}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        member.role === 'admin' ? 'bg-[#ff9900]/20 text-[#ff9900]' : 'bg-[#00f0ff]/20 text-[#00f0ff]'
                      }`}>
                        {member.role}
                      </span>

                      {/* Requirement 2: Quick 1-Click Lead Toggle */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleToggleLead(member)}
                          title={`Click to toggle lead status for ${member.full_name || member.email}`}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase transition-all flex items-center gap-1 border ${
                            member.is_lead
                              ? 'bg-[#ff9900]/20 text-[#ff9900] border-[#ff9900]/40 shadow-[0_0_8px_rgba(255,153,0,0.25)] hover:bg-[#ff9900]/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          {member.is_lead ? (
                            <>
                              <Crown className="w-2.5 h-2.5 text-[#ff9900]" />
                              <span>LEAD (ORANGE)</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>MEMBER (GREEN)</span>
                            </>
                          )}
                        </button>
                      )}

                      {domain && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                          {domain.name}
                        </span>
                      )}

                      {member.division && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                          {member.division}
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

                {/* Requirement 2: isLead Toggle Switch */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-[#080b10] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-mono text-[#ff9900] font-bold flex items-center gap-1.5 uppercase">
                      <Crown className="w-4 h-4 text-[#ff9900]" />
                      <span>Lead Designation (isLead)</span>
                    </label>
                    <p className="text-slate-400 text-xs mt-0.5 font-sans">
                      Designates this builder as a Lead. Leads receive an orange border around their photo and take the first position in their section. All other members receive a green border.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProfile({ ...editingProfile, is_lead: !editingProfile.is_lead })}
                    className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      editingProfile.is_lead
                        ? 'bg-[#ff9900] text-[#080b10] shadow-[0_0_12px_rgba(255,153,0,0.4)]'
                        : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.12]'
                    }`}
                  >
                    {editingProfile.is_lead ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{editingProfile.is_lead ? 'LEAD: ACTIVE (Orange)' : 'REGULAR MEMBER (Green)'}</span>
                  </button>
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

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">
                    Division (Custom)
                  </label>
                  <input
                    type="text"
                    value={editingProfile.division || ''}
                    onChange={e => setEditingProfile({ ...editingProfile, division: e.target.value })}
                    placeholder="e.g. Chapter Lead, Co-Chapter Lead, Campus Lead, Technical Team"
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                  />

                  {/* Requirement 1: Division Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-mono text-slate-500">Presets:</span>
                    {[
                      'Chapter Lead',
                      'Co-Chapter Lead',
                      'Campus Lead',
                      'Technical Team',
                      'Cloud Security Team',
                      'Operations',
                      'DevRel & Community',
                      'AI & Machine Learning'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEditingProfile({ ...editingProfile, division: preset })}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          editingProfile.division === preset
                            ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#a855f7] font-bold'
                            : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
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

              {/* CERTIFICATIONS & CREDENTIALS SECTION */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#ff9900]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Certifications & Badges
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Displayed on builder profile & directory card
                  </span>
                </div>

                {/* List Existing Certifications */}
                {editingProfile.certifications && editingProfile.certifications.length > 0 ? (
                  <div className="space-y-2">
                    {editingProfile.certifications.map((cert: any, idx: number) => {
                      const title = typeof cert === 'string' ? cert : cert.name || 'Certification';
                      const issuer = typeof cert === 'object' && cert.issuer ? cert.issuer : null;
                      const credId = typeof cert === 'object' && cert.credential_id ? cert.credential_id : null;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f141c] border border-white/[0.06]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ShieldCheck className="w-4 h-4 text-[#ff9900] shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">{title}</div>
                              {(issuer || credId) && (
                                <div className="text-[10px] font-mono text-slate-400 truncate">
                                  {issuer || 'AWS'} {credId ? `· ID: ${credId}` : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleModalRemoveCert(idx)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors shrink-0 ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-slate-500 py-1">
                    No certifications added to this member yet.
                  </div>
                )}

                {/* Add New Cert Form */}
                <div className="p-3 rounded-lg bg-[#0f141c] border border-white/[0.05] space-y-2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setModalCertTitle(e.target.value);
                        setModalCertIssuer('Amazon Web Services (AWS)');
                      }
                    }}
                    className="w-full bg-[#080b10] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none"
                  >
                    <option value="">-- Quick Select AWS Certification --</option>
                    {AWS_CERT_PRESETS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={modalCertTitle}
                        onChange={e => setModalCertTitle(e.target.value)}
                        placeholder="Certification Name"
                        className="w-full bg-[#080b10] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={modalCertIssuer}
                        onChange={e => setModalCertIssuer(e.target.value)}
                        placeholder="Issuer (AWS)"
                        className="w-full bg-[#080b10] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={modalCertId}
                        onChange={e => setModalCertId(e.target.value)}
                        placeholder="Credential ID"
                        className="w-full bg-[#080b10] border border-white/[0.1] rounded px-2.5 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleModalAddCert}
                      disabled={!modalCertTitle.trim()}
                      className="px-3 py-1 bg-[#ff9900]/20 hover:bg-[#ff9900]/30 text-[#ff9900] border border-[#ff9900]/40 rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Cert</span>
                    </button>
                  </div>
                </div>

                {/* Skill Badges */}
                <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                  <span className="block text-[11px] font-mono text-slate-300 font-semibold">
                    Skill Badges
                  </span>

                  <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                    {editingProfile.badges && editingProfile.badges.length > 0 ? (
                      editingProfile.badges.map((badge: any, idx: number) => {
                        const bName = typeof badge === 'string' ? badge : badge.name || 'Badge';
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 text-xs font-mono"
                          >
                            <span>{bName}</span>
                            <button
                              type="button"
                              onClick={() => handleModalRemoveBadge(idx)}
                              className="text-purple-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">No skill badges linked yet.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={modalBadgeText}
                      onChange={e => setModalBadgeText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleModalAddBadge();
                        }
                      }}
                      placeholder="Add badge (e.g. AWS DeepRacer, Terraform)..."
                      className="flex-1 bg-[#0f141c] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleModalAddBadge}
                      disabled={!modalBadgeText.trim()}
                      className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ADMIN ACTION: RESET PASSWORD & SET PASSKEY (Requirement 2) */}
              <div className="p-4 rounded-xl bg-[#080b10] border border-[#ff9900]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#ff9900]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Admin Security Action: Reset Password & Passkey
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetBox(!showResetBox)}
                    className="text-xs font-mono text-[#ff9900] hover:underline"
                  >
                    {showResetBox ? 'Hide Reset Options' : 'Configure New Passkey'}
                  </button>
                </div>

                {showResetBox && (
                  <div className="space-y-3 pt-2 border-t border-white/[0.05]">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Wipes the user's permanent password in Supabase Auth and assigns this temporary 6-digit passkey. On next login, the user will be forced to authenticate using this passkey and immediately set a new permanent password.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="relative flex-1 w-full">
                        <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          maxLength={6}
                          value={resetPasskeyVal}
                          onChange={e => setResetPasskeyVal(e.target.value)}
                          placeholder="6-digit passkey"
                          className="w-full bg-[#0f141c] border border-white/[0.1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white font-mono tracking-widest"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setResetPasskeyVal(Math.floor(100000 + Math.random() * 900000).toString())}
                        className="px-3 py-1.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-mono text-slate-300 w-full sm:w-auto"
                      >
                        Random
                      </button>
                      <button
                        type="button"
                        disabled={resettingPasskey}
                        onClick={handleResetMemberPasskey}
                        className="px-4 py-1.5 rounded-lg bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs font-mono transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 w-full sm:w-auto"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{resettingPasskey ? 'Resetting...' : 'Reset Passkey'}</span>
                      </button>
                    </div>

                    {resetMsg && (
                      <p className={`text-xs font-mono ${resetMsg.includes('Error') ? 'text-red-400' : 'text-emerald-400 font-bold'}`}>
                        {resetMsg}
                      </p>
                    )}
                  </div>
                )}
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
