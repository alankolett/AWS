'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { AwsLogo } from '@/components/common/AwsLogo';
import {
  Layout,
  User,
  Calendar,
  Users,
  Shield,
  ExternalLink,
  LogOut,
  Sparkles,
  Award,
  MessageSquare
} from 'lucide-react';

export default function OpsConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/ops/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUser(profile);
      setLoading(false);
    }
    checkAuth();
  }, [router, supabase]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordUpdating(true);
    setPasswordError('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
      setPasswordUpdating(false);
      return;
    }

    await supabase.from('profiles').update({ needs_password_change: false }).eq('id', user.id);
    setUser({ ...user, needs_password_change: false });
    setPasswordUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
        <div className="font-mono text-[#ff9900] text-sm animate-pulse flex items-center gap-2">
          <span>Authenticating Console Credentials...</span>
        </div>
      </div>
    );
  }

  if (user?.needs_password_change) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh] px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0f141c] border border-[#ff9900]/30 shadow-[0_0_20px_rgba(255,153,0,0.12)]">
          <h1 className="text-xl font-bold text-[#ff9900] mb-2 font-sans">Set Permanent Password</h1>
          <p className="text-slate-400 text-xs mb-6">
            You signed in using a temporary passkey. Please set your permanent account password to continue.
          </p>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#080b10] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff9900]"
              placeholder="New Password (min 6 characters)"
              minLength={6}
            />
            <button
              type="submit"
              disabled={passwordUpdating}
              className="w-full bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-2.5 rounded-lg text-xs transition-colors disabled:opacity-50"
            >
              {passwordUpdating ? 'Updating...' : 'Set Permanent Password'}
            </button>
            {passwordError && <p className="text-red-400 text-xs mt-2 font-mono">{passwordError}</p>}
          </form>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  const navItems = isAdmin
    ? [
        { label: 'Home CMS', href: '/ops/console/home', icon: Layout },
        { label: 'Founder Story', href: '/ops/console/founder', icon: Award },
        { label: 'Events Manager', href: '/ops/console/events', icon: Calendar },
        { label: 'Team & Domains', href: '/ops/console/team', icon: Users },
        { label: 'Contact Info', href: '/ops/console/contact', icon: MessageSquare },
        { label: 'My Profile', href: '/ops/console/my-profile', icon: User },
        { label: 'Provisioning', href: '/ops/console/provision', icon: Shield },
      ]
    : [
        { label: 'My Profile', href: '/ops/console/my-profile', icon: User },
        { label: 'Events (View)', href: '/ops/console/events', icon: Calendar },
      ];

  return (
    <div className="min-h-screen bg-[#080b10] text-[#f1f5f9] flex flex-col w-full selection:bg-[#ff9900]/30 selection:text-white">
      {/* Top Left-to-Right Admin Header Bar */}
      <header className="sticky top-0 z-50 w-full h-16 bg-[#0f141c]/95 backdrop-blur-md border-b border-white/[0.1] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/ops/console" className="flex items-center gap-2.5 group">
            <div className="h-8 px-2 rounded-md bg-[#080b10] border border-white/[0.15] flex items-center justify-center">
              <AwsLogo className="w-8 h-auto" variant="dual" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#ff9900] transition-colors font-sans">
                SBG Ops Console
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                SSPU Chapter Engine
              </span>
            </div>
          </Link>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              isAdmin
                ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30'
                : 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30'
            }`}
          >
            {isAdmin ? 'ADMIN' : 'MEMBER'}
          </span>
        </div>

        {/* Center Horizontal Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-white/[0.12] text-white font-bold border border-white/[0.15] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff9900]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/home"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
            title="Open Public Website"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/ops/auth');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center overflow-x-auto gap-2 px-4 py-2.5 bg-[#0f141c] border-b border-white/[0.08]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono shrink-0 ${
                isActive ? 'bg-white/[0.15] text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Full-Width Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
