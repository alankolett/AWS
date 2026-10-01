'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import {
  Download,
  RotateCw,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  QrCode as QrIcon,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AwsLogo } from '@/components/common/AwsLogo';

export default function DigitalBuilderPass() {
  const { userProfile, updateUserProfile } = useAppStore();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // 3D Tilt calculation based on mouse coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleExportPass = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.download = `AWS-SBG-Pass-${(userProfile.name || 'Builder').replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export pass badge', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Exact QR verification URL specified in prompt
  const verificationUrl = `https://builder.aws.com/sspu/verify?id=${encodeURIComponent(userProfile.prn || '20220104001')}`;

  return (
    <div className="space-y-8">
      {/* Feature Header */}
      <div>
        <div className="text-xs font-mono text-[#ff9900] tracking-wider uppercase mb-1">
          // FEATURE #15 • COMMUNITY CREDENTIAL ENGINE
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
          Digital Builder Pass (Community ID)
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
          Your official membership credential for AWS SBG @ SSPU. Features an interactive 3D holographic tilt,
          dark titanium finish, dynamic vector verification QR, and offline wallet export.
        </p>
      </div>

      {/* 2-Column Dedicated Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Customize Pass Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#a855f7] flex items-center gap-1.5 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
              PASS CUSTOMIZER
            </span>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs font-mono text-[#ff9900] hover:underline flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCw className="w-3 h-3" />
              <span>Flip ({isFlipped ? 'Back' : 'Front'})</span>
            </button>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Student Name
            </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => updateUserProfile({ name: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
              placeholder="e.g. Disha Pure"
            />
          </div>

          {/* SSPU PRN */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              SSPU PRN (Roll Number)
            </label>
            <input
              type="text"
              value={userProfile.prn}
              onChange={(e) => updateUserProfile({ prn: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
              placeholder="e.g. 20220104001"
            />
          </div>

          {/* Branch & Batch */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Academic Branch & Cohort
            </label>
            <input
              type="text"
              value={userProfile.branchYear}
              onChange={(e) => updateUserProfile({ branchYear: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
              placeholder="e.g. B.Tech CSIT · Class of 2026"
            />
          </div>

          {/* Builder ID */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Builder ID
            </label>
            <input
              type="text"
              value={userProfile.builderId || 'disha-pure-sspu'}
              onChange={(e) => updateUserProfile({ builderId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white font-mono placeholder-slate-600 focus:border-[#a855f7] focus:outline-none transition-colors"
              placeholder="e.g. disha-pure-sspu"
            />
          </div>

          {/* Chapter Tier */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
              Accreditation Tier
            </label>
            <select
              value={userProfile.tier}
              onChange={(e) => updateUserProfile({ tier: e.target.value as any })}
              className="w-full h-10 px-3 rounded-lg bg-[#0f141c] border border-white/[0.08] text-xs text-white font-mono focus:border-[#a855f7] focus:outline-none"
            >
              <option value="ARCHITECT" className="bg-[#0f141c] text-white">ARCHITECT (Gold / Leader)</option>
              <option value="PRO" className="bg-[#0f141c] text-white">PRO (Certified Associate)</option>
              <option value="FELLOW" className="bg-[#0f141c] text-white">FELLOW (Community Contributor)</option>
              <option value="MEMBER" className="bg-[#0f141c] text-white">MEMBER (Student Builder)</option>
            </select>
          </div>

          {/* Export PNG Button */}
          <button
            type="button"
            onClick={handleExportPass}
            disabled={isExporting}
            className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs tracking-tight flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting Pass...' : 'Export Pass (.PNG)'}</span>
          </button>
        </div>

        {/* Right Side: 3D Holographic Titanium Card Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono text-slate-400">
              Interactive 3D Badge (Hover to tilt, click to flip)
            </span>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs font-mono text-[#a855f7] hover:underline flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip to {isFlipped ? 'Front' : 'Back'}</span>
            </button>
          </div>

          {/* Perspective 3D Container */}
          <div
            className="w-full max-w-[340px] h-[500px] cursor-pointer"
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative w-full h-full transition-transform duration-150"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
              }}
            >
              {/* Outer Holographic Gradient Border Container */}
              <div
                ref={cardRef}
                className="w-full h-full p-[1.5px] rounded-2xl bg-gradient-to-tr from-[#a855f7] via-[#38bdf8] to-[#ff9900] shadow-2xl relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* ================= FRONT FACE: DARK TITANIUM FINISH ================= */}
                <div
                  className="w-full h-full rounded-[15px] bg-gradient-to-b from-[#18202d] via-[#10151f] to-[#080b10] p-6 flex flex-col justify-between overflow-hidden relative"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  {/* Subtle Titanium Metallic Sheen Texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.07] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#a855f7]/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#ff9900]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Row */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 px-1.5 rounded bg-black/40 border border-white/[0.15] flex items-center justify-center">
                          <AwsLogo className="w-6 h-auto" variant="dual" />
                        </div>
                        <span className="font-bold text-xs text-white tracking-wider font-mono">
                          SBG @ SSPU
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[9px] font-mono text-emerald-400 font-semibold">
                        ap-south-1
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Symbiosis Skills & Professional Univ.
                    </div>
                  </div>

                  {/* Center: Delegate Photo & Identity */}
                  <div className="flex flex-col items-center my-2 relative z-10">
                    <div className="relative mb-3">
                      <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/[0.2] shadow-md"
                      />
                      <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#ff9900] text-[9px] font-mono font-black text-[#080b10] tracking-wider shadow">
                          {userProfile.tier}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white text-center font-sans tracking-tight mt-1">
                      {userProfile.name}
                    </h4>

                    {/* Builder ID */}
                    <div className="text-xs font-mono text-[#a855f7] font-semibold text-center mt-0.5">
                      ID: {userProfile.builderId || 'disha-pure-sspu'}
                    </div>

                    {/* PRN & Branch */}
                    <div className="text-[11px] font-mono text-slate-300 text-center mt-1">
                      PRN: <span className="font-semibold text-white">{userProfile.prn}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 text-center mt-0.5 max-w-[240px] truncate">
                      {userProfile.branchYear}
                    </div>
                  </div>

                  {/* Titanium Security Chip & Footer Strip */}
                  <div className="pt-3 border-t border-white/[0.08] relative z-10">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase">VALIDITY</div>
                        <div className="text-emerald-400 font-bold">2026 – 2027 ACTIVE</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] text-slate-500 uppercase">LOCATION</div>
                        <div className="text-slate-300">Lab 3 · Kiwale</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= BACK FACE: DYNAMIC VECTOR QR CODE ================= */}
                <div
                  className="absolute inset-0 w-full h-full rounded-[15px] bg-gradient-to-b from-[#18202d] via-[#10151f] to-[#080b10] p-6 flex flex-col justify-between overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/[0.05] via-transparent to-transparent pointer-events-none" />

                  {/* Back Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-[#ff9900] uppercase tracking-wider">
                        VERIFY CREDENTIAL
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Scan vector QR code to verify on builder.aws.com
                    </div>
                  </div>

                  {/* Dynamic Vector QR Code */}
                  <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-xl shadow-lg mx-auto my-1">
                    <QRCodeSVG
                      value={verificationUrl}
                      size={140}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="text-[9px] font-mono text-slate-700 mt-2 font-semibold">
                      PRN: {userProfile.prn}
                    </div>
                  </div>

                  {/* Verification Endpoint Target */}
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase mb-1 text-center">
                      OFFICIAL VERIFICATION URI
                    </div>
                    <div className="px-2 py-1.5 rounded bg-[#080b10] border border-white/[0.08] text-[9px] font-mono text-slate-300 truncate text-center mb-2">
                      {verificationUrl}
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center">
                      Authorized by AWS Student Builder Group · SSPU Lab 3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs font-mono text-slate-500 text-center">
            Click pass or toggle button to inspect Front & Back faces
          </div>
        </div>
      </div>
    </div>
  );
}
