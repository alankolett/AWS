'use client';

import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, ShieldCheck, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { AwsLogo } from '@/components/common/AwsLogo';

interface LabKioskTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabKioskTerminal: React.FC<LabKioskTerminalProps> = ({ isOpen, onClose }) => {
  const [prnInput, setPrnInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'AWS SBG @ SSPU — Computer Lab 3 Attendance Kiosk [v2.4]',
    'Active Region: ap-south-1 (Pune Campus) · Status: ONLINE',
    'Ready for PRN or QR Token verification...',
  ]);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (customPrn?: string) => {
    const targetPrn = customPrn || prnInput.trim();
    if (!targetPrn) return;

    const formattedPrn = targetPrn.toUpperCase();
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });

    const newLogs = [
      ...terminalLogs,
      `> VERIFY_ATTENDANCE --prn "${formattedPrn}" --venue "Computer Lab 3"`,
      `[${timestamp}] Querying SSPU AWS Chapter Registry...`,
      `[ap-south-1 KIOSK] 200 OK — Attendance confirmed for PRN: ${formattedPrn}.`,
      `Seat verified in Computer Lab 3. Certificate eligibility status: UNLOCKED.`,
    ];

    setTerminalLogs(newLogs);
    setVerifiedSuccess(true);
    setPrnInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080b10]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f141c] border border-white/[0.14] overflow-hidden shadow-2xl flex flex-col">
        {/* Terminal Header Bar */}
        <div className="h-11 bg-[#080b10] border-b border-white/[0.08] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="h-5 px-1.5 rounded bg-black/40 border border-white/[0.1] inline-flex items-center ml-2">
              <AwsLogo className="w-4 h-auto" variant="dual" />
            </div>
            <span className="text-xs font-mono text-slate-300">
              kiosk@sspu-lab3: ~ / attendance-terminal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Screen Area */}
        <div className="p-6 bg-[#080b10] font-mono text-xs text-slate-300 space-y-2 h-64 overflow-y-auto border-b border-white/[0.08]">
          {terminalLogs.map((log, index) => {
            const isSuccess = log.includes('200 OK');
            const isUnlocked = log.includes('UNLOCKED');
            const isCommand = log.startsWith('>');

            return (
              <div
                key={index}
                className={
                  isSuccess
                    ? 'text-emerald-400 font-bold'
                    : isUnlocked
                    ? 'text-[#ff9900] font-semibold'
                    : isCommand
                    ? 'text-purple-300'
                    : 'text-slate-400'
                }
              >
                {log}
              </div>
            );
          })}
        </div>

        {/* Input Bar & Controls */}
        <div className="p-6 bg-[#0f141c] space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                PRN:
              </span>
              <input
                type="text"
                value={prnInput}
                onChange={(e) => setPrnInput(e.target.value)}
                placeholder="e.g. SSPU-2026-042 or 20240104042"
                className="w-full h-10 pl-14 pr-3 rounded-lg bg-[#080b10] border border-white/[0.1] text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-white/[0.3]"
              />
            </div>

            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-sans font-semibold text-xs tracking-normal transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Scan & Confirm</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo PRNs */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
            <span>Quick Test Tokens:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleVerify('SSPU-2026-042')}
                className="text-xs text-[#a855f7] hover:underline"
              >
                SSPU-2026-042
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleVerify('SSPU-2026-114')}
                className="text-xs text-[#a855f7] hover:underline"
              >
                SSPU-2026-114
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
