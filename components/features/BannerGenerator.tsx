'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Upload, RefreshCw, Sparkles, Image as ImageIcon, Calendar, User, CheckCircle2 } from 'lucide-react';
import { UPCOMING_EVENTS } from '@/lib/mockData';
import { AwsLogo } from '@/components/common/AwsLogo';

const PRESET_AVATARS = [
  { name: 'Disha Pure', url: '/disha-pure.png' },
  { name: 'Aarav Sharma', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rohan Kulkarni', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { name: 'Ananya Deshmukh', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' },
];

const BRANCH_OPTIONS = [
  'B.Tech CSIT (Cybersecurity) · Class of 2026',
  'B.Tech CSIT · Class of 2026',
  'B.Tech Cybersecurity · Class of 2026',
  'B.Tech AI & Data Science · Class of 2027',
  'B.Tech Software Engineering · Class of 2025',
  'M.Tech Cloud Computing · Class of 2026',
];

export default function BannerGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [name, setName] = useState('Disha Pure');
  const [branchYear, setBranchYear] = useState('B.Tech CSIT (Cybersecurity) · Class of 2026');
  const [selectedEventId, setSelectedEventId] = useState(UPCOMING_EVENTS[0]?.id || 'evt-reinvent-bedrock');
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0].url);
  const [isExporting, setIsExporting] = useState(false);
  const [customBranch, setCustomBranch] = useState(false);

  const selectedEvent = UPCOMING_EVENTS.find((e) => e.id === selectedEventId) || UPCOMING_EVENTS[0];

  // Draw 1080x1080 HTML5 canvas with strict editorial aesthetics
  const drawBanner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Background: Deep Obsidian Canvas (#080b10)
    ctx.fillStyle = '#080b10';
    ctx.fillRect(0, 0, width, height);

    // 2. Blueprint Grid: subtle, minimal 48px grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
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

    // 3. Subtle Violet / Orange Angular Geometric Lines & Ambient Sweeps
    // Ambient radial glow top-right (re:Invent Violet)
    const glowViolet = ctx.createRadialGradient(900, 160, 20, 900, 160, 480);
    glowViolet.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
    glowViolet.addColorStop(1, 'rgba(8, 11, 16, 0)');
    ctx.fillStyle = glowViolet;
    ctx.fillRect(0, 0, width, height);

    // Ambient radial glow bottom-left (AWS Smile Orange)
    const glowOrange = ctx.createRadialGradient(180, 920, 20, 180, 920, 420);
    glowOrange.addColorStop(0, 'rgba(255, 153, 0, 0.10)');
    glowOrange.addColorStop(1, 'rgba(8, 11, 16, 0)');
    ctx.fillStyle = glowOrange;
    ctx.fillRect(0, 0, width, height);

    // Precision Angular Geometric Lines
    ctx.save();
    // Angular Orange Line (Crisp 2px)
    ctx.beginPath();
    ctx.moveTo(width - 480, 0);
    ctx.lineTo(width, 480);
    ctx.strokeStyle = 'rgba(255, 153, 0, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Parallel Subtle Violet Line (Crisp 2px)
    ctx.beginPath();
    ctx.moveTo(width - 530, 0);
    ctx.lineTo(width, 530);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Secondary subtle bottom angular line
    ctx.beginPath();
    ctx.moveTo(0, height - 320);
    ctx.lineTo(320, height);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 4. Header Bar: AWS SBG & University Identity
    const awsLogoImg = new Image();
    awsLogoImg.src = '/aws-logo.png';
    const drawAwsLogo = () => {
      try {
        ctx.drawImage(awsLogoImg, 80, 78, 64, 42);
      } catch (e) {}
    };
    if (awsLogoImg.complete) {
      drawAwsLogo();
    } else {
      awsLogoImg.onload = drawAwsLogo;
    }

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Inter, sans-serif';
    ctx.fillText('AWS STUDENT BUILDER GROUP', 160, 98);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px monospace';
    ctx.fillText('SYMBIOSIS SKILLS & PROFESSIONAL UNIVERSITY (SSPU)', 160, 126);

    // Right Region Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width - 320, 80, 240, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('REGION: ap-south-1', width - 296, 107);

    // 5. Eyebrow & Bold "I'M ATTENDING"
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('// OFFICIAL EVENT DELEGATE', 80, 240);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 92px Inter, sans-serif';
    ctx.fillText("I'M ATTENDING", 80, 335);

    // 6. Event Card Container
    const eventBoxY = 380;
    const eventBoxHeight = 175;
    ctx.fillStyle = '#0f141c';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(80, eventBoxY, width - 160, eventBoxHeight, 16);
    ctx.fill();
    ctx.stroke();

    // Event Tag
    ctx.fillStyle = '#ff9900';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`[ ${selectedEvent.type.toUpperCase()} • COMPUTER LAB 3 ]`, 115, eventBoxY + 45);

    // Event Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, sans-serif';
    const cleanTitle = selectedEvent.title.length > 46 ? selectedEvent.title.substring(0, 43) + '...' : selectedEvent.title;
    ctx.fillText(cleanTitle, 115, eventBoxY + 95);

    // Date & Venue
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText(`📅 ${selectedEvent.date} · ${selectedEvent.time} • SSPU Kiwale Campus`, 115, eventBoxY + 140);

    // 7. Attendee Profile Section
    const photoSize = 220;
    const photoX = 80;
    const photoY = 620;

    const renderAttendeeInfo = () => {
      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 52px Inter, sans-serif';
      ctx.fillText(name || 'Student Builder', 340, 695);

      // Branch & Cohort
      ctx.fillStyle = '#ff9900';
      ctx.font = '600 24px monospace';
      ctx.fillText(branchYear, 340, 742);

      // Institution
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px Inter, sans-serif';
      ctx.fillText('Symbiosis Skills and Professional University', 340, 782);

      // Verified Status Ribbon
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('● CONFIRMED ATTENDEE • LAB 3 RESERVED SEAT', 340, 822);

      // 8. Clean Minimal Footer: "AWS Student Builder Group @ SSPU"
      // Crisp 1px divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 960);
      ctx.lineTo(width - 80, 960);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.fillText('AWS Student Builder Group @ SSPU · builder.aws.com/sspu', 80, 1005);

      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('COMMUNITY ID: VERIFIED', width - 290, 1005);
    };

    // Load and draw photo inside clean circular frame with crisp 2px border
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;

    const drawPhotoAndDetails = (sourceImg?: HTMLImageElement) => {
      ctx.save();
      const centerX = photoX + photoSize / 2;
      const centerY = photoY + photoSize / 2;
      const radius = photoSize / 2;

      // Circular clip
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      if (sourceImg) {
        ctx.drawImage(sourceImg, photoX, photoY, photoSize, photoSize);
      } else {
        // Fallback placeholder
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(photoX, photoY, photoSize, photoSize);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 64px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name.charAt(0) || 'B', centerX, centerY);
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
      }
      ctx.restore();

      // Clean circular frame with crisp 2px border
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      renderAttendeeInfo();
    };

    img.onload = () => {
      drawPhotoAndDetails(img);
    };

    img.onerror = () => {
      drawPhotoAndDetails(undefined);
    };
  }, [name, branchYear, selectedEventId, photoUrl, selectedEvent]);

  useEffect(() => {
    drawBanner();
  }, [drawBanner]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
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
        <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1">
          // FEATURE #7 • SOCIAL MEDIA CANVAS ENGINE
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
          "I'm Attending" Event Banner Studio
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
          Generate an official 1080×1080 high-resolution attendance banner for upcoming AWS SBG @ SSPU workshops,
          re:Invent watch parties, and bootcamps. No watermarks, clean typography, direct high-DPI export.
        </p>
      </div>

      {/* 2-Column Dedicated Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#ff9900] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#ff9900]" />
              <span>BANNER CONTROLS</span>
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
              placeholder="e.g. Disha Pure"
            />
          </div>

          {/* Academic Branch Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">
                SSPU Branch & Cohort
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

          {/* Event Selection Dropdown */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Target Event Session
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-xs text-white font-mono focus:border-[#a855f7] focus:outline-none"
            >
              {UPCOMING_EVENTS.map((evt) => (
                <option key={evt.id} value={evt.id} className="bg-[#0f141c] text-white">
                  {evt.title} ({evt.date})
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload Zone */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Delegate Photo
            </label>
            <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-white/[0.15] hover:border-[#a855f7] rounded-lg cursor-pointer bg-[#0f141c]/50 hover:bg-[#0f141c] transition-all">
              <Upload className="w-4 h-4 text-[#a855f7] mb-1" />
              <span className="text-xs font-mono text-slate-300 font-medium">Upload Attendee Photo</span>
              <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, WebP</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Preset Avatars for Quick Testing */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-2 font-medium">
              Or pick sample delegate:
            </span>
            <div className="flex items-center gap-2">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.name}
                  type="button"
                  onClick={() => setPhotoUrl(avatar.url)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    photoUrl === avatar.url
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
            className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs tracking-tight flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating High-DPI PNG...' : 'Export Banner (.PNG)'}</span>
          </button>
        </div>

        {/* Right Side: Live Canvas Preview (7 cols) */}
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

          {/* Scaled Canvas Container */}
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
