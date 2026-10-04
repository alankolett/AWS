'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, Trash2, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
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

const FALLBACK_DEFAULT_THEMES: BannerTheme[] = [
  {
    id: 'theme-cyber',
    name: 'Cyber Neon Pulse',
    accentColor: '#a855f7',
    defaultHeadline: "I'm Attending!",
    badgeText: 'AWS SBG · BUILDER INITIATIVE',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'
  }
];

const BRANCH_OPTIONS = [
  'B.Tech CSIT · Class of 2026',
  'B.Tech CSIT · Class of 2027',
  'B.Tech CSIT · Class of 2028',
  'B.Tech CSIT (Cybersecurity) · Class of 2026',
  'B.Tech CSIT (Cybersecurity) · Class of 2027',
  'B.Tech AI & Data Science · Class of 2026',
  'B.Tech AI & Data Science · Class of 2027',
  'B.Tech AI & Data Science · Class of 2028',
  'B.Tech Software Engineering · Class of 2025',
  'B.Tech Software Engineering · Class of 2026',
  'B.Tech Mechatronics & Robotics · Class of 2026',
  'M.Tech Cloud Computing · Class of 2026',
  'M.Tech AI & Machine Learning · Class of 2026',
  'BCA / MCA · Class of 2026',
];

export default function BannerGenerator({
  eventTitle = 'AWS Architecture & Serverless Workshop',
  eventDate = 'Upcoming Session',
  eventTime = '14:00 - 16:00 IST',
  location = 'Computer Lab 3, SSPU Kiwale Campus',
  themeTemplates
}: BannerGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // If themeTemplates is passed from the event (even if 1 or 2 styles), respect it strictly!
  const themes = (themeTemplates && Array.isArray(themeTemplates) && themeTemplates.length > 0)
    ? themeTemplates
    : FALLBACK_DEFAULT_THEMES;

  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  // User form data - No default avatars; starts empty
  const [name, setName] = useState('');
  const [branchYear, setBranchYear] = useState(BRANCH_OPTIONS[0]);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const awsLogoRef = useRef<HTMLImageElement | null>(null);

  // Clamp selected theme index if themes changed
  const validIndex = selectedThemeIndex < themes.length ? selectedThemeIndex : 0;
  const currentTheme = themes[validIndex] || themes[0] || FALLBACK_DEFAULT_THEMES[0];
  const accentColor = currentTheme.accentColor || '#a855f7';
  const headline = currentTheme.defaultHeadline || "I'm Attending!";
  const badgeText = currentTheme.badgeText || 'AWS SBG · BUILDER INITIATIVE';

  // Preload official AWS Logo for the banner header
  useEffect(() => {
    const img = new Image();
    img.src = '/aws-logo.png';
    img.onload = () => {
      awsLogoRef.current = img;
      drawBanner();
    };
  }, []);

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
      // Reset text alignment baseline to prevent bleed from previous renders
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';

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

      // 4. Header Bar with AWS Logo
      let logoDrawn = false;
      if (awsLogoRef.current && awsLogoRef.current.complete && awsLogoRef.current.naturalWidth > 0) {
        try {
          ctx.drawImage(awsLogoRef.current, 80, 54, 48, 29);
          logoDrawn = true;
        } catch (e) {
          logoDrawn = false;
        }
      }

      if (!logoDrawn) {
        // High-tech vector fallback AWS symbol
        ctx.save();
        ctx.fillStyle = '#0f141c';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(80, 54, 48, 29);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AWS', 104, 73);
        ctx.restore();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'start';
      ctx.fillText('STUDENT BUILDER GROUP', 140, 77);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.textAlign = 'start';
      ctx.fillText('Symbiosis Skills & Professional University (SSPU)', 140, 101);


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

      // Event Metadata
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 14px monospace';
      ctx.fillText('OFFICIAL CHAPTER EVENT', 115, eventBoxY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Inter, sans-serif';
      // Truncate title if longer than 40 chars
      const displayTitle = eventTitle.length > 42 ? eventTitle.substring(0, 42) + '...' : eventTitle;
      ctx.fillText(displayTitle, 115, eventBoxY + 90);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(115, eventBoxY + 120);
      ctx.lineTo(width - 115, eventBoxY + 120);
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 20px Inter, sans-serif';
      ctx.fillText(`📅 ${eventDate} · ${eventTime}`, 115, eventBoxY + 165);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText(`📍 ${location}`, 115, eventBoxY + 205);

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
        // Enforce 1:1 aspect ratio auto center-crop so the photo is never squashed or compressed!
        const imgW = userImg.naturalWidth || userImg.width;
        const imgH = userImg.naturalHeight || userImg.height;
        const sSize = Math.min(imgW, imgH);
        const sx = (imgW - sSize) / 2;
        const sy = (imgH - sSize) / 2;
        ctx.drawImage(userImg, sx, sy, sSize, sSize, photoX, photoY, photoSize, photoSize);
      } else {
        // High-tech placeholder if user hasn't uploaded a photo
        ctx.fillStyle = '#0f141c';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 64px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : '⚡';
        ctx.fillText(initial, centerX, centerY);
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
      ctx.fillText(name.trim() || 'Student Builder', 335, 680);

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

  // Temporary in-memory client-side upload only (Zero Supabase storage bottlenecks)
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

  // Clear all data button and clear after download
  const handleClearAll = () => {
    setName('');
    setBranchYear(BRANCH_OPTIONS[0]);
    setPhotoDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.download = `AWS-SBG-Attending-${name.trim().replace(/\s+/g, '-') || 'Student'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Clear all data once downloaded as requested
        handleClearAll();
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
          Select from the active event poster styles declared by chapter admins, upload your headshot, and generate your 1080×1080 attendance graphic.
        </p>
      </div>

      {/* Theme Selector Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#ff9900]" />
          <span>Active Poster Styles ({themes.length})</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {themes.map((theme, idx) => (
            <button
              key={theme.id || idx}
              type="button"
              onClick={() => setSelectedThemeIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                validIndex === idx
                  ? 'bg-white/[0.08] border-white shadow-lg'
                  : 'bg-[#0f141c] border-white/[0.08] hover:border-white/[0.2] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white">
                  Style {idx + 1}
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

          {/* Academic Branch Selector (Dropdown Only - No Custom Input) */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Branch & Graduation Class
            </label>
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
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              Select your registered academic specialization at SSPU.
            </p>
          </div>

          {/* Temporary Photo Upload Zone (In-memory only, no DB/Storage bottleneck) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300 font-medium">
                Upload Headshot Photo
              </label>
              <span className="text-[10px] font-mono text-[#ff9900]">1:1 Square Auto-Cropped</span>
            </div>
            <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-white/[0.15] hover:border-[#a855f7] rounded-lg cursor-pointer bg-[#0f141c]/50 hover:bg-[#0f141c] transition-all relative overflow-hidden">
              {photoDataUrl ? (
                <div className="flex items-center gap-3 p-2 w-full h-full justify-center">
                  <img
                    src={photoDataUrl}
                    alt="Uploaded headshot preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#a855f7]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-emerald-400 font-mono font-bold">Photo Loaded (1:1 Auto-Cropped)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Click to replace photo</span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#a855f7] mb-1" />
                  <span className="text-xs font-mono text-slate-300 font-medium">Click to Upload Headshot</span>
                  <span className="text-[10px] text-slate-400 font-mono">Square 1:1 recommended · Auto-centered without distortion</span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons: Download + Clear All Data */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs tracking-tight flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating High-DPI PNG...' : 'Download Attendee Poster (.PNG)'}</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="w-full h-9 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live Poster Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl bg-[#080b10]">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-3 text-center">
            Square 1:1 format (1080×1080) rendered natively via HTML5 2D Canvas.
          </span>
        </div>
      </div>
    </div>
  );
}
