'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, RefreshCw, Sparkles, Layers } from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';

export interface BannerTheme {
  id: string;
  name: string;
  imageUrl?: string;
  accentColor?: string;
  defaultHeadline?: string;
  badgeText?: string;
}

interface BannerGeneratorProps {
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  themeTemplates?: BannerTheme[];
}

const DEFAULT_THEMES: BannerTheme[] = [
  {
    id: 'theme-cyber',
    name: 'Cyber Neon Pulse',
    accentColor: '#a855f7',
    defaultHeadline: "I'm Attending!",
    badgeText: 'AWS SBG · BUILDER INITIATIVE',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'theme-reinvent',
    name: 'AWS re:Invent Dark Edition',
    accentColor: '#ff9900',
    defaultHeadline: 'Architecting at SSPU',
    badgeText: 're:Invent COMMUNITY WATCH PARTY',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'theme-mono',
    name: 'Terminal Minimalist',
    accentColor: '#00f0ff',
    defaultHeadline: 'Building the Cloud',
    badgeText: 'VERIFIED ATTENDEE PASS',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'
  }
];

const PRESET_AVATARS = [
  { name: 'Student Builder 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
  { name: 'Student Builder 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { name: 'Student Builder 3', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' },
];

const BRANCH_OPTIONS = [
  'B.Tech CSIT · Class of 2026',
  'B.Tech CSIT (Cybersecurity) · Class of 2026',
  'B.Tech AI & Data Science · Class of 2027',
  'B.Tech Software Engineering · Class of 2025',
  'M.Tech Cloud Computing · Class of 2026',
];

export default function BannerGenerator({
  eventTitle = 'AWS Architecture & Serverless Workshop',
  eventDate = 'Upcoming Session',
  eventTime = '14:00 - 16:00 IST',
  location = 'Computer Lab 3, SSPU Kiwale Campus',
  themeTemplates
}: BannerGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const themes = (themeTemplates && themeTemplates.length > 0) ? themeTemplates : DEFAULT_THEMES;
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  const [name, setName] = useState('Student Builder');
  const [branchYear, setBranchYear] = useState('B.Tech CSIT · Class of 2026');
  const [photoDataUrl, setPhotoDataUrl] = useState(PRESET_AVATARS[0].url);
  const [isExporting, setIsExporting] = useState(false);
  const [customBranch, setCustomBranch] = useState(false);

  const currentTheme = themes[selectedThemeIndex] || themes[0];
  const accentColor = currentTheme.accentColor || '#a855f7';
  const headline = currentTheme.defaultHeadline || "I'm Attending!";
  const badgeText = currentTheme.badgeText || 'AWS SBG · BUILDER INITIATIVE';

  const drawBanner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const drawContent = (bgImg?: HTMLImageElement, userImg?: HTMLImageElement) => {
      // 1. Draw Background
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, width, height);
        // Dark contrast overlay
        ctx.fillStyle = 'rgba(8, 11, 16, 0.88)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#080b10';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Blueprint Grid: subtle, minimal 48px grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Dynamic Ambient Glow based on Theme Accent Color
      const glow = ctx.createRadialGradient(920, 160, 20, 920, 160, 520);
      glow.addColorStop(0, `${accentColor}33`);
      glow.addColorStop(1, 'rgba(8, 11, 16, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Accent border at the top
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, width, 6);

      // 4. Header Bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('AWS STUDENT BUILDER GROUP', 80, 85);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText('Symbiosis Skills & Professional University (SSPU)', 80, 115);

      // Top-Right Badge
      ctx.save();
      ctx.fillStyle = `${accentColor}22`;
      ctx.strokeStyle = `${accentColor}66`;
      ctx.lineWidth = 1.5;
      const badgeW = 340;
      const badgeH = 40;
      const badgeX = width - badgeW - 80;
      const badgeY = 68;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8) : ctx.rect(badgeX, badgeY, badgeW, badgeH);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + 25);
      ctx.restore();

      // 5. Hero Headline Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px Inter, sans-serif';
      ctx.textAlign = 'start';
      ctx.fillText(headline, 80, 235);

      // 6. Event Card Frame
      const eventBoxY = 275;
      const eventBoxH = 260;
      ctx.fillStyle = 'rgba(15, 20, 28, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(80, eventBoxY, width - 160, eventBoxH, 16) : ctx.rect(80, eventBoxY, width - 160, eventBoxH);
      ctx.fill();
      ctx.stroke();

      // Accent indicator pill inside event box
      ctx.fillStyle = accentColor;
      ctx.fillRect(115, eventBoxY + 35, 4, 32);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 15px monospace';
      ctx.fillText('OFFICIAL CHAPTER EVENT', 130, eventBoxY + 57);

      // Event Title (Wrap if too long)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Inter, sans-serif';
      const truncatedTitle = eventTitle.length > 48 ? eventTitle.substring(0, 48) + '...' : eventTitle;
      ctx.fillText(truncatedTitle, 115, eventBoxY + 125);

      // Event Metadata
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 20px Inter, sans-serif';
      ctx.fillText(`📅 ${eventDate} · ${eventTime}`, 115, eventBoxY + 180);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText(`📍 ${location}`, 115, eventBoxY + 215);

      // 7. Attendee Profile Section
      const photoSize = 220;
      const photoX = 80;
      const photoY = 600;
      const centerX = photoX + photoSize / 2;
      const centerY = photoY + photoSize / 2;
      const radius = photoSize / 2;

      // Draw Photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      if (userImg) {
        ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 64px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name.charAt(0) || 'B', centerX, centerY);
      }
      ctx.restore();

      // Photo border
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      // Attendee Details
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px Inter, sans-serif';
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(name || 'Student Builder', 335, 680);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 22px monospace';
      ctx.fillText(branchYear, 335, 725);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '19px Inter, sans-serif';
      ctx.fillText('Symbiosis Skills and Professional University', 335, 765);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('● CONFIRMED PARTICIPANT • OFFICIAL BUILDER PASS', 335, 805);

      // 8. Footer Strip
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 940);
      ctx.lineTo(width - 80, 940);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText('AWS Student Builder Group @ SSPU · Official Chapter Portal', 80, 990);

      ctx.fillStyle = accentColor;
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'end';
      ctx.fillText('DESIGN SYSTEM: AWS re:Invent', width - 80, 990);
    };

    // Load background image and user photo
    let loadedBg: HTMLImageElement | undefined;
    let loadedUser: HTMLImageElement | undefined;

    let pending = 0;
    const checkDone = () => {
      pending--;
      if (pending <= 0) {
        drawContent(loadedBg, loadedUser);
      }
    };

    if (currentTheme.imageUrl) {
      pending++;
      const bg = new Image();
      bg.crossOrigin = 'anonymous';
      bg.onload = () => {
        loadedBg = bg;
        checkDone();
      };
      bg.onerror = () => checkDone();
      bg.src = currentTheme.imageUrl;
    }

    if (photoDataUrl) {
      pending++;
      const user = new Image();
      user.crossOrigin = 'anonymous';
      user.onload = () => {
        loadedUser = user;
        checkDone();
      };
      user.onerror = () => checkDone();
      user.src = photoDataUrl;
    }

    if (pending === 0) {
      drawContent(undefined, undefined);
    }
  }, [name, branchYear, photoDataUrl, currentTheme, eventTitle, eventDate, eventTime, location, accentColor, headline, badgeText]);

  useEffect(() => {
    drawBanner();
  }, [drawBanner]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.download = `AWS-SBG-Attending-${name.replace(/\s+/g, '-') || 'Student'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Canvas export error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div>
        <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
          // SOCIAL MEDIA CANVASES & BADGES
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
          "I'm Attending" Event Banner Studio
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
          Select from the 3 curated themes, upload your photo, and download an official 1080×1080 attendance graphic for LinkedIn, Instagram & X.
        </p>
      </div>

      {/* 3 Theme Selector Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#ff9900]" />
          <span>Select Poster Theme ({themes.length} Available)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {themes.map((theme, idx) => (
            <button
              key={theme.id || idx}
              type="button"
              onClick={() => setSelectedThemeIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedThemeIndex === idx
                  ? 'bg-white/[0.08] border-white shadow-lg'
                  : 'bg-[#0f141c] border-white/[0.08] hover:border-white/[0.2] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white">
                  Theme {idx + 1}
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.accentColor || '#a855f7' }}
                />
              </div>
              <div className="text-sm font-semibold text-white font-sans">{theme.name}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                "{theme.defaultHeadline || "I'm Attending!"}"
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Dedicated Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Controls */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-[#ff9900] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#ff9900]" />
              <span>CUSTOMIZE POSTER</span>
            </div>
            <AwsLogo className="w-6 h-auto" variant="dual" />
          </div>

          {/* Attendee Name Input */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Attendee Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
              placeholder="e.g. Laksh Meghani"
            />
          </div>

          {/* Academic Branch Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">
                Branch / Year
              </label>
              <button
                type="button"
                onClick={() => setCustomBranch(!customBranch)}
                className="text-[11px] font-mono text-[#a855f7] hover:underline"
              >
                {customBranch ? 'Use Preset List' : 'Custom Input'}
              </button>
            </div>

            {customBranch ? (
              <input
                type="text"
                value={branchYear}
                onChange={(e) => setBranchYear(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none"
                placeholder="e.g. B.Tech CSIT · Class of 2026"
              />
            ) : (
              <select
                value={branchYear}
                onChange={(e) => setBranchYear(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-xs text-white font-mono focus:border-[#a855f7] focus:outline-none"
              >
                {BRANCH_OPTIONS.map((branch) => (
                  <option key={branch} value={branch} className="bg-[#0f141c] text-white">
                    {branch}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Photo Upload Zone */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Upload Your Photo
            </label>
            <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-white/[0.15] hover:border-[#a855f7] rounded-lg cursor-pointer bg-[#0f141c]/50 hover:bg-[#0f141c] transition-all">
              <Upload className="w-4 h-4 text-[#a855f7] mb-1" />
              <span className="text-xs font-mono text-slate-300 font-medium">Click to Upload Headshot</span>
              <span className="text-[10px] text-slate-500 font-mono">JPG, PNG, WebP</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Preset Avatars */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-2 font-medium">
              Or pick sample avatar:
            </span>
            <div className="flex items-center gap-2">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.name}
                  type="button"
                  onClick={() => setPhotoDataUrl(avatar.url)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    photoDataUrl === avatar.url
                      ? 'border-[#ff9900] scale-105 shadow-sm'
                      : 'border-white/[0.1] hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                  title={avatar.name}
                >
                  <img src={avatar.url} alt={avatar.name} className="w-10 h-10 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Export PNG Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs tracking-tight flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating High-DPI PNG...' : 'Download Attendee Poster (.PNG)'}</span>
          </button>
        </div>

        {/* Right Side: Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Live 1080×1080 Viewport
            </span>
            <button
              type="button"
              onClick={drawBanner}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Redraw Canvas</span>
            </button>
          </div>

          <div className="w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border border-white/[0.12] bg-[#080b10] shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          <div className="mt-3.5 text-center text-xs font-mono text-slate-500">
            Export resolution: 1080 × 1080 PNG · Optimized for LinkedIn, X & Instagram
          </div>
        </div>
      </div>
    </div>
  );
}
