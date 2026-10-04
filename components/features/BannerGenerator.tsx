'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, Trash2, Sparkles, Layers, Image as ImageIcon, RotateCcw, CheckCircle2 } from 'lucide-react';
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
  allowBgUpload?: boolean;
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
  themeTemplates,
  allowBgUpload = false,
}: BannerGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // If themeTemplates is passed from the event, respect it strictly
  const themes = (themeTemplates && Array.isArray(themeTemplates) && themeTemplates.length > 0)
    ? themeTemplates
    : FALLBACK_DEFAULT_THEMES;

  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  // User form data
  const [name, setName] = useState('');
  const [branchYear, setBranchYear] = useState(BRANCH_OPTIONS[0]);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [bgPhotoDataUrl, setBgPhotoDataUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const awsLogoRef = useRef<HTMLImageElement | null>(null);

  // Clamp selected theme index if themes changed
  const validIndex = selectedThemeIndex < themes.length ? selectedThemeIndex : 0;
  const currentTheme = themes[validIndex] || themes[0] || FALLBACK_DEFAULT_THEMES[0];
  const accentColor = currentTheme.accentColor || '#a855f7';
  const headline = currentTheme.defaultHeadline || "I'm Attending!";
  const badgeText = currentTheme.badgeText || 'AWS SBG · BUILDER INITIATIVE';

  // Preload official AWS Logo for the blue section of the banner
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

    // Fixed 1080x1080 Canvas (Square 1:1 Aspect Ratio)
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    const drawContent = (bgImg?: HTMLImageElement, userImg?: HTMLImageElement) => {
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';

      // 1. Base Canvas Background
      ctx.fillStyle = '#080b10';
      ctx.fillRect(0, 0, width, height);

      // Subtle blueprint grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Top Accent strip
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, width, 5);

      // =====================================================================
      // REQUIREMENT 1 & WIREFRAME: 16:9 RATIO BACKGROUND (GREEN SECTION)
      // Exact 16:9 ratio: 960w x 540h (960 * 9 / 16 = 540)
      // =====================================================================
      const boxX = 60;
      const boxY = 60;
      const boxW = 960;
      const boxH = 540;
      const boxRadius = 20;

      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(boxX, boxY, boxW, boxH, boxRadius);
      } else {
        ctx.rect(boxX, boxY, boxW, boxH);
      }
      ctx.clip();

      if (bgImg) {
        // Enforce 16:9 center-crop so photo is never squashed or distorted
        const imgW = bgImg.naturalWidth || bgImg.width;
        const imgH = bgImg.naturalHeight || bgImg.height;
        const targetRatio = boxW / boxH; // 16/9 = 1.777778
        const imgRatio = imgW / imgH;

        let sx = 0, sy = 0, sw = imgW, sh = imgH;
        if (imgRatio > targetRatio) {
          // Wider than 16:9 -> crop left & right
          sw = imgH * targetRatio;
          sx = (imgW - sw) / 2;
        } else {
          // Taller than 16:9 -> crop top & bottom
          sh = imgW / targetRatio;
          sy = (imgH - sh) / 2;
        }
        ctx.drawImage(bgImg, sx, sy, sw, sh, boxX, boxY, boxW, boxH);

        // Subtle gradient overlay for contrast and depth
        const grad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
        grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.1)');
        grad.addColorStop(1, 'rgba(8, 11, 16, 0.65)');
        ctx.fillStyle = grad;
        ctx.fillRect(boxX, boxY, boxW, boxH);
      } else {
        // High-tech cyber gradient background
        const techGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
        techGrad.addColorStop(0, '#0a2318');
        techGrad.addColorStop(0.5, '#071810');
        techGrad.addColorStop(1, '#050f0a');
        ctx.fillStyle = techGrad;
        ctx.fillRect(boxX, boxY, boxW, boxH);

        // Grid lines inside 16:9 section
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.lineWidth = 1;
        for (let gx = boxX; gx <= boxX + boxW; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, boxY);
          ctx.lineTo(gx, boxY + boxH);
          ctx.stroke();
        }
        for (let gy = boxY; gy <= boxY + boxH; gy += 40) {
          ctx.beginPath();
          ctx.moveTo(boxX, gy);
          ctx.lineTo(boxX + boxW, gy);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('16:9 Event Background', boxX + boxW / 2, boxY + boxH / 2);
      }

      // =====================================================================
      // REQUIREMENT 2: AWS LOGO (No container box - direct logo render)
      // Positioned at top-left of the 16:9 section
      // =====================================================================
      const logoX = boxX + 32;
      const logoY = boxY + 22;
      const logoH = 46;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      let logoDrawn = false;
      if (awsLogoRef.current && awsLogoRef.current.complete && awsLogoRef.current.naturalWidth > 0) {
        try {
          const naturalW = awsLogoRef.current.naturalWidth;
          const naturalH = awsLogoRef.current.naturalHeight;
          const logoW = (naturalW / naturalH) * logoH;
          ctx.drawImage(awsLogoRef.current, logoX, logoY, logoW, logoH);
          logoDrawn = true;
        } catch (e) {
          logoDrawn = false;
        }
      }

      if (!logoDrawn) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 32px Inter, sans-serif';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillText('aws', logoX, logoY);
      }
      ctx.restore();

      // Top-right Headline Pill inside 16:9 section
      ctx.save();
      const badgeW = 280;
      const badgeH = 42;
      const badgeX = boxX + boxW - badgeW - 24;
      const badgeY = boxY + 24;
      ctx.fillStyle = 'rgba(8, 11, 16, 0.75)';
      ctx.strokeStyle = `${accentColor}88`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
      } else {
        ctx.rect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(headline.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2);
      ctx.restore();

      ctx.restore(); // End 16:9 clip

      // Border around 16:9 section
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(boxX, boxY, boxW, boxH, boxRadius);
      } else {
        ctx.rect(boxX, boxY, boxW, boxH);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // =====================================================================
      // REQUIREMENT 3 & 4: BOTTOM AREA
      // Left: Round Profile Photo | Right: Text Data Box
      // =====================================================================
      const bottomAreaY = 635;
      const bottomAreaH = 390;

      // 3. ROUND PROFILE PHOTO (Requirement 3: "Round = Profile Photo Uploading")
      const photoRadius = 120; // 240px diameter
      const centerX = 60 + photoRadius;
      const centerY = bottomAreaY + bottomAreaH / 2;
      const photoSize = photoRadius * 2;
      const photoX = centerX - photoRadius;
      const photoY = centerY - photoRadius;

      // Draw Round Profile Photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
      ctx.clip();

      if (userImg) {
        // Enforce 1:1 auto center-crop
        const imgW = userImg.naturalWidth || userImg.width;
        const imgH = userImg.naturalHeight || userImg.height;
        const sSize = Math.min(imgW, imgH);
        const sx = (imgW - sSize) / 2;
        const sy = (imgH - sSize) / 2;
        ctx.drawImage(userImg, sx, sy, sSize, sSize, photoX, photoY, photoSize, photoSize);
      } else {
        // High-tech avatar fallback
        ctx.fillStyle = '#0f141c';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 72px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : '⚡';
        ctx.fillText(initial, centerX, centerY);
      }
      ctx.restore();

      // Outer accent border around round profile photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff9900'; // AWS Builder Orange
      ctx.lineWidth = 5;
      ctx.shadowColor = 'rgba(255, 153, 0, 0.4)';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      // 4. TEXT DATA CARD (Requirement 4: "All the text data goes the right of the Profile Photot")
      const cardX = 330;
      const cardY = bottomAreaY;
      const cardW = width - 60 - cardX; // 690px
      const cardH = bottomAreaH;
      const cardRadius = 18;

      ctx.save();
      // Text Data Frame
      ctx.fillStyle = 'rgba(15, 20, 28, 0.95)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
      } else {
        ctx.rect(cardX, cardY, cardW, cardH);
      }
      ctx.fill();
      ctx.stroke();

      // Top accent bar
      ctx.fillStyle = accentColor;
      ctx.fillRect(cardX + 24, cardY, cardW - 48, 3);

      const tx = cardX + 32;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';

      // 4.1 Tagline / Badge
      ctx.fillStyle = '#ff9900';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('AWS STUDENT BUILDER GROUP · OFFICIAL PASS', tx, cardY + 44);

      // 4.2 Attendee Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px Inter, sans-serif';
      const attendeeName = name.trim() || 'Student Builder';
      const displayAttendee = attendeeName.length > 26 ? attendeeName.substring(0, 26) + '...' : attendeeName;
      ctx.fillText(displayAttendee, tx, cardY + 90);

      // 4.3 Branch & Year
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 16px monospace';
      ctx.fillText(branchYear, tx, cardY + 122);

      // 4.4 University
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Symbiosis Skills and Professional University (SSPU)', tx, cardY + 148);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx, cardY + 172);
      ctx.lineTo(cardX + cardW - 32, cardY + 172);
      ctx.stroke();

      // 4.5 Event Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Inter, sans-serif';
      const cleanEventTitle = eventTitle.length > 38 ? eventTitle.substring(0, 38) + '...' : eventTitle;
      ctx.fillText(cleanEventTitle, tx, cardY + 210);

      // 4.6 Event Date & Time
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.fillText(`📅 ${eventDate} · ${eventTime}`, tx, cardY + 248);

      // 4.7 Location
      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px Inter, sans-serif';
      const cleanLoc = location.length > 40 ? location.substring(0, 40) + '...' : location;
      ctx.fillText(`📍 ${cleanLoc}`, tx, cardY + 280);

      // 4.8 Status Pass Indicator
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('● CONFIRMED PARTICIPANT • OFFICIAL BUILDER PASS', tx, cardY + 325);

      ctx.restore();
    };

    // Load background image (custom user upload takes priority over theme template)
    let loadedBg: HTMLImageElement | undefined;
    let loadedUser: HTMLImageElement | undefined;

    let pending = 0;
    const checkDone = () => {
      pending--;
      if (pending <= 0) {
        drawContent(loadedBg, loadedUser);
      }
    };

    const bgSourceUrl = bgPhotoDataUrl || currentTheme.imageUrl;
    if (bgSourceUrl) {
      pending++;
      const bg = new Image();
      bg.crossOrigin = 'anonymous';
      bg.onload = () => {
        loadedBg = bg;
        checkDone();
      };
      bg.onerror = () => checkDone();
      bg.src = bgSourceUrl;
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
  }, [name, branchYear, photoDataUrl, bgPhotoDataUrl, currentTheme, eventTitle, eventDate, eventTime, location, accentColor, headline, badgeText]);

  useEffect(() => {
    drawBanner();
  }, [drawBanner]);

  // Handle Profile Photo Upload (Round)
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

  // Handle 16:9 Background Photo Upload (Green Section)
  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgPhotoDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearBgPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBgPhotoDataUrl(null);
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
  };

  // Clear all data button
  const handleClearAll = () => {
    setName('');
    setBranchYear(BRANCH_OPTIONS[0]);
    setPhotoDataUrl(null);
    setBgPhotoDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
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
          Select from active event poster styles, upload your round profile photo, and generate your 1080×1080 attendance graphic.
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

          {/* 16:9 Background Photo Upload (Admin Config Only) */}
          {allowBgUpload && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-300 font-medium">
                  Upload 16:9 Background Photo (Admin Mode)
                </label>
                <span className="text-[10px] font-mono text-[#10b981] font-bold">16:9 Ratio BG</span>
              </div>
              <label className="flex flex-col items-center justify-center w-full min-h-[96px] border border-dashed border-white/[0.15] hover:border-[#10b981] rounded-lg cursor-pointer bg-[#0f141c]/50 hover:bg-[#0f141c] transition-all relative overflow-hidden p-3">
                {bgPhotoDataUrl ? (
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <img
                        src={bgPhotoDataUrl}
                        alt="Uploaded 16:9 background"
                        className="w-20 h-11 object-cover rounded-md border border-[#10b981]"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Custom 16:9 BG Active</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Click to replace photo</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearBgPhoto}
                      className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 font-mono text-[10px] flex items-center gap-1 transition-colors"
                      title="Reset to Event Template"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 text-[#10b981] mb-1" />
                    <span className="text-xs font-mono text-slate-300 font-medium">Click to Upload 16:9 Background</span>
                    <span className="text-[10px] text-slate-400 font-mono">Admin Override · Defaults to event template</span>
                  </>
                )}
                <input
                  ref={bgFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* REQUIREMENT 3: Headshot Photo Upload (Round Profile Photo) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300 font-medium">
                Upload Headshot Photo (Round)
              </label>
              <span className="text-[10px] font-mono text-[#ff9900]">1:1 Round Auto-Cropped</span>
            </div>
            <label className="flex flex-col items-center justify-center w-full min-h-[96px] border border-dashed border-white/[0.15] hover:border-[#ff9900] rounded-lg cursor-pointer bg-[#0f141c]/50 hover:bg-[#0f141c] transition-all relative overflow-hidden p-3">
              {photoDataUrl ? (
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoDataUrl}
                      alt="Uploaded headshot preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#ff9900]"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        <span>Round Photo Active</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Click to replace photo</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoDataUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 font-mono text-[10px] flex items-center gap-1 transition-colors"
                    title="Remove Headshot"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-[#ff9900] mb-1" />
                  <span className="text-xs font-mono text-slate-300 font-medium">Click to Upload Headshot Photo</span>
                  <span className="text-[10px] text-slate-400 font-mono">Square 1:1 recommended · Auto-clipped to circle</span>
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
