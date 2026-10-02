'use client';

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/infrastructure/supabase/client';
import { AwsLogo } from '@/components/common/AwsLogo';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'email' | 'password' | 'passkey' | 'set_password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState(['', '', '', '', '', '']); // 6 digits
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const supabase = createClient();
  const passkeyRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Query the profile to see if they need a password change
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('needs_password_change')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('Profile fetch error:', fetchError);
    }

    if (fetchError || !profile) {
      setError('No builder profile found for this email.');
      setLoading(false);
      return;
    }

    if (profile.needs_password_change) {
      setMode('passkey');
    } else {
      setMode('password');
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Invalid password.');
      setLoading(false);
    } else {
      router.push('/ops/console');
    }
  };

  const handlePasskeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedPasskey = passkey.join('');
    if (joinedPasskey.length !== 6) {
      setError('Please enter the 6-digit passkey.');
      return;
    }

    setLoading(true);
    setError('');

    // Attempt to log in with the passkey (which is temporarily their password)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: joinedPasskey,
    });

    if (signInError) {
      setError('Invalid passkey.');
      setLoading(false);
    } else {
      // Successfully logged in with passkey, now ask them to set a permanent password
      setMode('set_password');
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    // Update their password in Auth
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Get current user session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Mark needs_password_change as false
      await supabase.from('profiles').update({ needs_password_change: false }).eq('id', user.id);
    }

    router.push('/ops/console');
  };

  const handlePasskeyChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPasskey = [...passkey];
    newPasskey[index] = value;
    setPasskey(newPasskey);

    // Auto-focus next
    if (value && index < 5 && passkeyRefs.current[index + 1]) {
      passkeyRefs.current[index + 1]?.focus();
    }
  };

  const handlePasskeyKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !passkey[index] && index > 0) {
      passkeyRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0f141c] border border-white/[0.08] shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-8">
          <AwsLogo className="w-12 h-auto" variant="dual" />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {mode === 'email' && 'Builder Identity'}
          {mode === 'password' && 'Enter Password'}
          {mode === 'passkey' && 'Enter Passkey'}
          {mode === 'set_password' && 'Set Permanent Password'}
        </h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          {mode === 'email' && 'Enter your registered email to continue.'}
          {mode === 'password' && `Welcome back, ${email}`}
          {mode === 'passkey' && 'Enter your 6-digit temporary passkey.'}
          {mode === 'set_password' && 'Secure your account with a permanent password.'}
        </p>

        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080b10] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff9900]"
                placeholder="builder@example.com"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white hover:bg-slate-200 text-[#080b10] font-bold py-2.5 rounded transition-colors disabled:opacity-50">
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {mode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080b10] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff9900]"
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setMode('email')} className="flex-1 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-white font-bold py-2.5 rounded transition-colors">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-[#ff9900] hover:bg-[#e68a00] text-[#080b10] font-bold py-2.5 rounded transition-colors disabled:opacity-50">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        {mode === 'passkey' && (
          <form onSubmit={handlePasskeySubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {passkey.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { passkeyRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePasskeyChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePasskeyKeyDown(idx, e)}
                  className="w-12 h-14 text-center bg-[#080b10] border border-white/[0.1] rounded text-xl font-mono text-[#a855f7] focus:outline-none focus:border-[#a855f7]"
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setMode('email')} className="flex-1 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-white font-bold py-2.5 rounded transition-colors">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-[#a855f7] hover:bg-purple-600 text-white font-bold py-2.5 rounded transition-colors disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify Passkey'}
              </button>
            </div>
          </form>
        )}

        {mode === 'set_password' && (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">New Permanent Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#080b10] border border-white/[0.1] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff9900]"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#080b10] font-bold py-2.5 rounded transition-colors disabled:opacity-50">
              {loading ? 'Updating...' : 'Secure Account'}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-6 p-3 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
