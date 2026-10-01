'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Image as ImageIcon, QrCode, ScanLine, Award } from 'lucide-react';

const BannerGenerator = dynamic(
  () => import('@/components/features/BannerGenerator'),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 text-center font-mono text-xs text-slate-500">
        Loading Banner Generator...
      </div>
    ),
  }
);

const DigitalBuilderPass = dynamic(
  () => import('@/components/features/DigitalBuilderPass'),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 text-center font-mono text-xs text-slate-500">
        Loading Digital Builder Pass...
      </div>
    ),
  }
);

const AttendanceKiosk = dynamic(
  () => import('@/components/features/AttendanceKiosk').then((m) => m.AttendanceKiosk),
  { ssr: false }
);

const CertificatesPortal = dynamic(
  () => import('@/components/features/CertificatesPortal').then((m) => m.CertificatesPortal),
  { ssr: false }
);

export const InteractiveToolsSuite: React.FC = () => {
  const [activeSubTool, setActiveSubTool] = useState<'banner' | 'pass' | 'attendance' | 'certs'>('pass');

  const tools = [
    { id: 'pass', label: 'Digital Builder Pass', icon: QrCode },
    { id: 'banner', label: '"I\'m Attending" Banner Studio', icon: ImageIcon },
    { id: 'certs', label: 'Certificates Portal', icon: Award },
    { id: 'attendance', label: 'Campus Kiosk (Lab 3)', icon: ScanLine },
  ];

  return (
    <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] scroll-mt-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1">
              // INTERACTIVE ENGINES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Community Builder Suite
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Client-side credential issuance, dynamic QR verification, and 1080p social media badge rendering.
            </p>
          </div>

          {/* Clean Segment Switch */}
          <div className="flex items-center p-1 rounded-lg bg-[#0f141c] border border-white/[0.08] self-start sm:self-auto overflow-x-auto max-w-full">
            {tools.map((t) => {
              const Icon = t.icon;
              const isActive = activeSubTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveSubTool(t.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white text-[#080b10] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tool Canvas */}
        <div className="rounded-2xl bg-[#0f141c] border border-white/[0.08] p-4 sm:p-6 lg:p-8">
          {activeSubTool === 'pass' && <DigitalBuilderPass />}
          {activeSubTool === 'banner' && <BannerGenerator />}
          {activeSubTool === 'attendance' && <AttendanceKiosk />}
          {activeSubTool === 'certs' && <CertificatesPortal />}
        </div>
      </div>
    </section>
  );
};
