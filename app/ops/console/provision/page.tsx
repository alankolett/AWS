'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { createAdminOrMemberUser, resetUserPasswordToPasskey } from '@/app/actions/admin';
import { deleteMember } from '@/app/actions/profiles';
import {
  Shield,
  KeyRound,
  UserPlus,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Copy,
  Trash2,
  RefreshCw,
  Search,
  RotateCcw,
  X,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function ProvisionPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // Form State for new provision
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [passkey, setPasskey] = useState('000000');
  const [assignedHeadline, setAssignedHeadline] = useState('');
  const [assignedDomainId, setAssignedDomainId] = useState('');
  const [assignedDivision, setAssignedDivision] = useState('');
  const [assignedFullName, setAssignedFullName] = useState('');
  const [domains, setDomains] = useState<any[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reset Password Modal State
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [resetPasskeyInput, setResetPasskeyInput] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; text: string; passkey?: string } | null>(null);

  const supabase = createClient();

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (currentProfile?.role === 'admin') {
      setIsAdmin(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setProfiles(data || []);

      const { data: sects } = await supabase
        .from('team_sections')
        .select('*')
        .order('order_index', { ascending: true });
      setDomains(sects || []);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGeneratePasskey = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setPasskey(random);
  };

  const handleGenerateResetPasskey = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setResetPasskeyInput(random);
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !passkey) return;

    setSubmitting(true);
    setStatusMsg(null);

    const res = await createAdminOrMemberUser(
      email.trim().toLowerCase(),
      passkey.trim(),
      role,
      {
        headline: assignedHeadline.trim() || undefined,
        team_section_id: assignedDomainId || undefined,
        division: assignedDivision.trim() || undefined,
        full_name: assignedFullName.trim() || undefined,
      }
    );

    if (res.error) {
      setStatusMsg({ type: 'error', text: res.error });
    } else {
      setStatusMsg({
        type: 'success',
        text: `Successfully provisioned ${role.toUpperCase()} account for ${email} with passkey "${passkey}" and locked chapter assignment.`,
      });
      setEmail('');
      setPasskey('000000');
      setAssignedHeadline('');
      setAssignedDomainId('');
      setAssignedDivision('');
      setAssignedFullName('');
      loadData();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently revoke credentials for "${name || id}"?`)) return;
    const res = await deleteMember(id);
    if (res.error) {
      alert(`Delete failed: ${res.error}`);
    } else {
      loadData();
    }
  };

  const handleOpenResetModal = (targetUser: any) => {
    setResetModalUser(targetUser);
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setResetPasskeyInput(random);
    setResetStatus(null);
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !resetPasskeyInput) return;

    if (resetPasskeyInput.trim().length !== 6) {
      setResetStatus({ type: 'error', text: 'Passkey must be exactly 6 characters.' });
      return;
    }

    setResetting(true);
    setResetStatus(null);

    const res = await resetUserPasswordToPasskey(resetModalUser.id, resetPasskeyInput.trim());

    if (res.error) {
      setResetStatus({ type: 'error', text: res.error });
    } else {
      setResetStatus({
        type: 'success',
        text: `Password entry deleted and new passkey activated for ${resetModalUser.email}.`,
        passkey: resetPasskeyInput.trim(),
      });
      loadData();
    }
    setResetting(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="font-mono text-xs text-[#00f0ff] animate-pulse">Loading IAM & Provisioning...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#0f141c] border border-white/[0.08] space-y-4 max-w-xl mx-auto">
        <Shield className="w-12 h-12 text-[#ff9900] mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-slate-400 text-xs">
          Only administrators have access to provision new builder accounts and reset user passkeys.
        </p>
        <Link
          href="/ops/console/my-profile"
          className="inline-block px-4 py-2 bg-[#00f0ff] text-[#080b10] rounded-lg text-xs font-bold font-mono"
        >
          Go to My Profile
        </Link>
      </div>
    );
  }

  const filteredProfiles = profiles.filter(
    (p) =>
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9900] uppercase font-semibold mb-1">
            <KeyRound className="w-4 h-4" />
            <span>IAM & CREDENTIAL PROVISIONING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Provision Builder & Admin Accounts
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Grant secure passkey-based access, manage chapter permissions, and reset user passwords with instant passkeys.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* PROVISION FORM */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#00f0ff]" />
          <h2 className="text-lg font-bold text-white font-sans">Provision New Account</h2>
        </div>

        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-mono flex items-start gap-3 border ${
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

        <form onSubmit={handleProvision} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                User Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@sspu.ac.in"
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">This will be their primary login identity.</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Privilege Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#ff9900]"
              >
                <option value="member">member (Edit self profile only)</option>
                <option value="admin">admin (Full CMS & console control)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Admins have write access across all site sections.</p>
            </div>

            {/* Passkey */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-300 font-semibold">
                  Initial Passkey *
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePasskey}
                  className="text-[10px] font-mono text-[#00f0ff] hover:underline"
                >
                  Generate Random
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="6-digit passkey"
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Share this with the user. They will enter this on first login and set a permanent password.
              </p>
            </div>
          </div>

          {/* Row 2: Hardbound Role & Domain Assignment (Locked to Email) */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold">
              <Lock className="w-3.5 h-3.5 text-[#ff9900]" />
              <span>HARDBOUND ROLE & DOMAIN (LOCKED TO MEMBER EMAIL)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={assignedFullName}
                  onChange={(e) => setAssignedFullName(e.target.value)}
                  placeholder="e.g. Laksh Meghani"
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Assigned Role / Headline */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-300 font-semibold">
                    Assigned Headline / Role
                  </label>
                  <span className="text-[9px] font-mono text-[#ff9900]">Hardbound</span>
                </div>
                <input
                  type="text"
                  value={assignedHeadline}
                  onChange={(e) => setAssignedHeadline(e.target.value)}
                  placeholder="e.g. Cloud Architect, Core Builder"
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Assigned Domain Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-300 font-semibold">
                    Chapter Domain / Team
                  </label>
                  <span className="text-[9px] font-mono text-[#ff9900]">Hardbound</span>
                </div>
                <select
                  value={assignedDomainId}
                  onChange={(e) => setAssignedDomainId(e.target.value)}
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="">[General Builder / No Domain]</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                  Custom Division (Optional)
                </label>
                <input
                  type="text"
                  value={assignedDivision}
                  onChange={(e) => setAssignedDivision(e.target.value)}
                  placeholder="e.g. Operations, Labs"
                  className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Note: Non-admin members cannot change their assigned headline or domain section in their profile editor.
            </p>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-white/[0.08]">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 font-mono shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Provisioning Account...' : 'Provision Access'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* DIRECTORY OF PROVISIONED ACCOUNTS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ff9900]" />
            <h2 className="text-lg font-bold text-white font-sans">
              Provisioned Accounts Directory ({profiles.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff9900]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-[#0f141c] border border-white/[0.08]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Account / Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                    No matching accounts found.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#080b10] border border-white/[0.1] shrink-0">
                          <img
                            src={p.avatar_url || '/stickman.svg'}
                            alt={p.full_name || p.email}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white font-sans">{p.full_name || 'No Name Set'}</div>
                          <div className="text-[11px] font-mono text-slate-400">{p.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          p.role === 'admin'
                            ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30'
                            : 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30'
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {p.needs_password_change ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          <KeyRound className="w-3 h-3" />
                          <span>Passkey Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Password Set</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* RESET PASSWORD / SET PASSKEY BUTTON (Requirement 2) */}
                        <button
                          type="button"
                          onClick={() => handleOpenResetModal(p)}
                          className="px-2 py-1 rounded bg-[#ff9900]/10 hover:bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30 font-mono text-[11px] transition-colors flex items-center gap-1"
                          title="Reset Password & Set New Passkey"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Passkey</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(p.email, p.id)}
                          className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                          title="Copy Email"
                        >
                          {copiedId === p.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.full_name || p.email)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                          title="Revoke Credentials"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESET PASSWORD & SET PASSKEY MODAL */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#0f141c] border border-[#ff9900]/30 shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#ff9900]" />
                <h3 className="text-lg font-bold text-white font-sans">
                  Reset Password & Activate Passkey
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResetModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-1 font-mono">
                <div className="text-slate-400">TARGET ACCOUNT:</div>
                <div className="text-white font-bold text-sm">{resetModalUser.email}</div>
                {resetModalUser.full_name && (
                  <div className="text-slate-300 text-xs">{resetModalUser.full_name}</div>
                )}
              </div>

              <p className="text-slate-400 leading-relaxed">
                Resetting will delete the user's current permanent password in Supabase Auth and assign this temporary 6-digit passkey. The user will be required to authenticate with this passkey upon their next login and establish a new permanent password.
              </p>
            </div>

            {resetStatus && (
              <div
                className={`p-4 rounded-xl text-xs font-mono space-y-2 border ${
                  resetStatus.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                    : 'bg-red-500/10 text-red-300 border-red-500/25'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {resetStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{resetStatus.text}</span>
                </div>
                {resetStatus.passkey && (
                  <div className="flex items-center justify-between p-2.5 rounded bg-[#080b10] border border-emerald-500/30 text-white font-mono text-sm mt-1">
                    <span>Passkey: <b>{resetStatus.passkey}</b></span>
                    <button
                      type="button"
                      onClick={() => handleCopy(resetStatus.passkey!, 'reset-key')}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === 'reset-key' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleConfirmReset} className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-300 font-semibold">
                    New 6-Digit Passkey
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateResetPasskey}
                    className="text-[10px] font-mono text-[#00f0ff] hover:underline"
                  >
                    Generate Random
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetPasskeyInput}
                    onChange={(e) => setResetPasskeyInput(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full bg-[#080b10] border border-white/[0.15] rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono text-white tracking-widest focus:outline-none focus:border-[#ff9900]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-lg border border-white/[0.1] text-xs font-mono text-slate-300 hover:bg-white/[0.05]"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={resetting}
                  className="px-5 py-2.5 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{resetting ? 'Resetting Password...' : 'Reset Password & Activate Passkey'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
