'use client';

import React, { useState } from 'react';
import { Award, Search, ShieldCheck, CheckCircle2, Copy, Check, ExternalLink, Printer } from 'lucide-react';
import { MOCK_CERTIFICATES } from '@/lib/mockData';
import { CertificateRecord } from '@/lib/types';
import { AwsLogo } from '@/components/common/AwsLogo';

const SAMPLE_IDS = [
  { id: 'SSPU-AWS-2026-001', label: 'SSPU-AWS-2026-001 (Disha Pure)' },
  { id: 'SSPU-AWS-2026-042', label: 'SSPU-AWS-2026-042 (Aarav Sharma)' },
  { id: 'SSPU-AWS-2026-088', label: 'SSPU-AWS-2026-088 (Rohan Kulkarni)' },
  { id: 'SSPU-AWS-2026-114', label: 'SSPU-AWS-2026-114 (Ananya Deshmukh)' },
];

export const CertificatesPortal: React.FC = () => {
  const [certInput, setCertInput] = useState('SSPU-AWS-2026-001');
  const [verifiedRecord, setVerifiedRecord] = useState<CertificateRecord | null>(MOCK_CERTIFICATES[0]);
  const [hasSearched, setHasSearched] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleVerify = (queryId?: string) => {
    const raw = (queryId !== undefined ? queryId : certInput).trim();
    if (!raw) return;

    setHasSearched(true);
    const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, '');

    const found = MOCK_CERTIFICATES.find((cert) => {
      const matchId = cert.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchIssue = cert.issueId.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchPrn = cert.prn.toLowerCase().replace(/[^a-z0-9]/g, '');
      return matchId.includes(clean) || clean.includes(matchId) || matchIssue.includes(clean) || matchPrn === clean;
    });

    setVerifiedRecord(found || null);
  };

  const handleCopyLink = () => {
    if (!verifiedRecord) return;
    navigator.clipboard.writeText(`https://builder.aws.com/sspu/verify?id=${verifiedRecord.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Feature Header */}
      <div>
        <div className="text-xs font-mono text-[#34d399] tracking-wider uppercase mb-1">
          // FEATURE #8 • VERIFICATION PORTAL
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
          Official Certificates Portal
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
          Verify technical workshop credentials, cohort completions, and student leadership honors
          issued by the AWS Student Builder Group at Symbiosis Skills and Professional University.
        </p>
      </div>

      {/* Minimalist Verification Input */}
      <div className="p-6 rounded-xl bg-[#080b10] border border-white/[0.08] space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-2 font-medium">
            Enter Certificate ID or Student PRN
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="e.g. SSPU-AWS-2026-001 or 20220104001"
                className="w-full h-11 pl-9 pr-4 rounded-lg bg-[#0f141c] border border-white/[0.08] text-sm text-white placeholder-slate-600 font-mono focus:border-[#34d399] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => handleVerify()}
              className="h-11 px-6 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-bold font-sans text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Credential</span>
            </button>
          </div>
        </div>

        {/* Quick Sample IDs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-500">Quick Test:</span>
          {SAMPLE_IDS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setCertInput(sample.id);
                handleVerify(sample.id);
              }}
              className="px-2.5 py-1 rounded bg-[#0f141c] hover:bg-[#161c28] border border-white/[0.08] text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
            >
              {sample.id}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Display */}
      {hasSearched && verifiedRecord && (
        <div className="rounded-2xl bg-[#080b10] border border-white/[0.08] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Institution & Green Cryptographic Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="h-10 px-2.5 rounded-lg bg-[#0f141c] border border-white/[0.12] flex items-center justify-center">
                <AwsLogo className="w-8 h-auto" variant="dual" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-white tracking-wider">
                  AWS STUDENT BUILDER GROUP
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Symbiosis Skills & Professional University · Kiwale, Pune
                </div>
              </div>
            </div>

            {/* Green Cryptographic Seal */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="font-mono text-xs font-semibold">
                CRYPTOGRAPHICALLY VERIFIED
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center py-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
              OFFICIAL CERTIFICATE OF TECHNICAL RECOGNITION
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              {verifiedRecord.recipientName}
            </h2>

            <div className="text-xs font-mono text-[#ff9900] font-medium">
              STUDENT PRN: {verifiedRecord.prn} · TIER: {verifiedRecord.credentialTier.toUpperCase()}
            </div>

            <p className="text-sm text-slate-300 max-w-xl mx-auto font-sans leading-relaxed pt-1">
              Has successfully demonstrated hands-on technical proficiency and completed the curriculum for:
            </p>

            <div className="text-base sm:text-lg font-bold text-white font-mono bg-[#0f141c] py-2.5 px-4 rounded-lg inline-block border border-white/[0.08]">
              {verifiedRecord.eventName}
            </div>
          </div>

          {/* Verified AWS Skills */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 text-center">
              Verified Technical Competencies
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {verifiedRecord.skillsVerified.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded bg-[#0f141c] border border-white/[0.08] text-xs font-mono text-slate-300"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Ledger Details */}
          <div className="p-3.5 rounded-lg bg-[#0f141c] border border-white/[0.06] text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
            <div className="truncate">
              <span className="text-slate-500">SHA-256 HASH:</span>{' '}
              <span className="text-slate-300 font-mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
            </div>
            <div className="shrink-0 text-emerald-400 font-semibold">
              IMMUTABLE RECORD · COMPUTER LAB 3
            </div>
          </div>

          {/* Issuer & Metadata Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">DATE OF ISSUANCE</div>
              <div className="text-white font-medium">{verifiedRecord.date}</div>
              <div className="text-[10px] text-slate-400">CREDENTIAL ID: {verifiedRecord.issueId}</div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-[10px] text-slate-500 uppercase">AUTHORIZED SIGNATURE</div>
              <div className="text-[#a855f7] font-bold">Disha Pure, Community Lead</div>
              <div className="text-[10px] text-slate-400">AWS Student Builder Group @ SSPU</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-lg bg-[#0f141c] hover:bg-[#161c28] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-[#0f141c] hover:bg-[#161c28] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Credential</span>
            </button>
          </div>
        </div>
      )}

      {/* No Record Found State */}
      {hasSearched && !verifiedRecord && (
        <div className="p-8 rounded-xl bg-[#080b10] border border-red-500/20 text-center space-y-2">
          <div className="text-sm font-bold text-red-400 font-mono">
            No Verified Certificate Record Found
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
            We couldn't locate a certificate matching "{certInput}". Please double-check the Certificate ID or Student PRN
            as issued by the AWS Student Builder Group steering committee.
          </p>
        </div>
      )}
    </div>
  );
};
