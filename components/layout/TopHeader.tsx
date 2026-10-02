'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't render the public website TopHeader on the config console
  if (pathname?.startsWith('/ops/console')) {
    return null;
  }

  const navLinks = [
    { label: 'About', href: '/home' },
    { label: 'Events', href: '/events' },
    { label: 'Founder', href: '/founder' },
    { label: 'Team', href: '/team' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#080b10]/90 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Clean Brand Logo & Location Pill */}
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div className="h-8 px-2 rounded-md bg-[#0f141c] border border-white/[0.12] flex items-center justify-center">
              <AwsLogo className="w-8 h-auto" variant="dual" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#ff9900] transition-colors font-sans">
                SBG @ SSPU
              </span>
              <span className="text-[10px] text-slate-400 font-sans hidden sm:block">
                Symbiosis Skills Univ.
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400">
            Kiwale Campus, Pune
          </span>
        </div>

        {/* Center: Clean Text Navigation with Subtle Hover Underlines */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-sm font-sans transition-colors py-1 ${
                  isActive ? 'text-white font-semibold after:w-full' : 'text-slate-300 hover:text-white'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ff9900] hover:after:w-full after:transition-all after:duration-200`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Chapter Badge & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>ap-south-1</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080b10] border-b border-white/[0.08] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SSPU Kiwale Campus</span>
            <span>ap-south-1</span>
          </div>
        </div>
      )}
    </header>
  );
};
