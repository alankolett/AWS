'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';
import { EventSession } from '@/lib/types';
import { useAppStore } from '@/lib/store';

interface EventRSVPModalProps {
  event: EventSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admissionCode: string) => void;
}

export const EventRSVPModal: React.FC<EventRSVPModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toggleEventRegistration, registeredEventIds } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [prn, setPrn] = useState('');
  const [branch, setBranch] = useState('B.Tech CSIT');
  const [email, setEmail] = useState('');
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !prn.trim() || !email.trim()) return;

    // Generate deterministic clean admission code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `SSPU-AWS-ADMIT-${randomSuffix}`;

    if (!registeredEventIds.includes(event.id)) {
      toggleEventRegistration(event.id);
    }

    setConfirmedCode(code);
    onSuccess(code);
  };

  const handleDone = () => {
    setConfirmedCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080b10]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f141c] border border-white/[0.12] p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.04]"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedCode ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-xs font-mono text-[#a855f7] tracking-wider uppercase mb-1 font-semibold">
                // LAB SEAT RESERVATION
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
                RSVP for {event.title}
              </h2>
              <div className="text-xs text-slate-400 font-sans mt-1.5 flex items-center gap-2">
                <span>{event.date}</span>
                <span>•</span>
                <span>{event.location}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Atharva Kulkarni"
                  className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-sm text-white placeholder-slate-500 font-sans focus:outline-none focus:border-white/[0.25]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                    SSPU PRN (Roll Number)
                  </label>
                  <input
                    type="text"
                    required
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    placeholder="e.g. 20240104042"
                    className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-white/[0.25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                    Academic Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-xs text-white font-sans focus:outline-none focus:border-white/[0.25]"
                  >
                    <option value="B.Tech CSIT">B.Tech CSIT (Cloud & IT)</option>
                    <option value="B.Tech Cybersecurity">B.Tech Cybersecurity</option>
                    <option value="B.Tech Data Science & AI">B.Tech Data Science & AI</option>
                    <option value="B.Tech Mechatronics">B.Tech Mechatronics & IoT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
                  University / Personal Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@sspu.ac.in"
                  className="w-full h-10 px-3 rounded-lg bg-[#080b10] border border-white/[0.08] text-sm text-white placeholder-slate-500 font-sans focus:outline-none focus:border-white/[0.25]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-white hover:bg-slate-100 text-[#080b10] font-semibold text-xs font-sans tracking-normal transition-colors flex items-center justify-center gap-2"
              >
                <span>Confirm Reservation & Generate Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="py-2 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-sans">
                Seat Confirmed in Computer Lab 3
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Your admission token has been issued. Present this at the Lab 3 entrance kiosk.
              </p>
            </div>

            {/* Admission Code Box */}
            <div className="p-4 rounded-xl bg-[#080b10] border border-white/[0.08] text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>OFFICIAL ADMISSION TOKEN</span>
                <span className="text-emerald-400 font-semibold">VERIFIED</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#ff9900] tracking-wider">
                {confirmedCode}
              </div>
              <div className="text-xs font-sans text-slate-300 pt-1 border-t border-white/[0.06]">
                Attendee: <span className="font-semibold text-white">{fullName}</span> (PRN: {prn})
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Session: {event.title}
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full h-10 rounded-lg bg-white text-[#080b10] font-semibold text-xs font-sans hover:bg-slate-100 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
