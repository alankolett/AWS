'use client';

import React, { useState } from 'react';
import { ScanLine, CheckCircle2, Search, Calendar, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { UPCOMING_EVENTS } from '@/lib/mockData';
import { AttendanceRecord } from '@/lib/types';

const INITIAL_RECORDS: AttendanceRecord[] = [
  { id: 'att-1', prn: '20220104001', studentName: 'Disha Pure', timestamp: '16:02:14 IST', eventId: 'evt-reinvent-watch-party', eventTitle: 'AWS re:Invent Watch Party', verified: true },
  { id: 'att-2', prn: '20220104042', studentName: 'Aarav Sharma', timestamp: '16:04:30 IST', eventId: 'evt-reinvent-watch-party', eventTitle: 'AWS re:Invent Watch Party', verified: true },
  { id: 'att-3', prn: '20220104114', studentName: 'Ananya Deshmukh', timestamp: '16:06:55 IST', eventId: 'evt-reinvent-watch-party', eventTitle: 'AWS re:Invent Watch Party', verified: true },
  { id: 'att-4', prn: '20230104088', studentName: 'Rohan Kulkarni', timestamp: '16:08:12 IST', eventId: 'evt-reinvent-watch-party', eventTitle: 'AWS re:Invent Watch Party', verified: true },
];

export const AttendanceKiosk: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState(UPCOMING_EVENTS[0].id);
  const [prnInput, setPrnInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [lastCheckedIn, setLastCheckedIn] = useState<AttendanceRecord | null>(null);

  const selectedEvent = UPCOMING_EVENTS.find((e) => e.id === selectedEventId) || UPCOMING_EVENTS[0];

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prnInput.trim() || !nameInput.trim()) return;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      prn: prnInput.trim(),
      studentName: nameInput.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      verified: true,
    };

    setRecords([newRecord, ...records]);
    setLastCheckedIn(newRecord);
    setPrnInput('');
    setNameInput('');
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
          FEATURE #8: LIVE EVENT OPERATIONS
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight mb-2">
          On-Campus Attendance & Verification Kiosk
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl font-sans">
          Fast-scan check-in terminal for SSPU campus events. Validates PRN credentials and issues verified
          attendance tokens for certificates and sandbox credit access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Check-in Form (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-aws-card border border-aws-border space-y-5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ScanLine className="w-4 h-4" />
            <span>KIOSK SCANNER / CHECK-IN</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
              Active Event Session
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-aws-sidebar border border-aws-border text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
            >
              {UPCOMING_EVENTS.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.date})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Student Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Rahul Patil"
                required
                className="w-full h-10 px-3 rounded-md bg-aws-sidebar border border-aws-border text-sm text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                SSPU PRN (11 Digits)
              </label>
              <input
                type="text"
                value={prnInput}
                onChange={(e) => setPrnInput(e.target.value)}
                placeholder="e.g. 20230104199"
                required
                className="w-full h-10 px-3 rounded-md bg-aws-sidebar border border-aws-border text-sm text-white font-mono focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Verify Check-In</span>
            </button>
          </form>

          {/* Instant Confirmation Card */}
          {lastCheckedIn && (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>CHECK-IN RECORDED</span>
              </div>
              <div className="text-white font-bold">{lastCheckedIn.studentName}</div>
              <div className="text-slate-400">PRN: {lastCheckedIn.prn}</div>
              <div className="text-slate-500 text-[10px]">Time: {lastCheckedIn.timestamp}</div>
            </div>
          )}
        </div>

        {/* Right: Live Stream of Check-ins (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-aws-card border border-aws-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase">
                LIVE CHECK-IN ROSTER
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Event: {selectedEvent.title}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 font-bold">
              {records.length} Checked In
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-aws-sidebar/80 border border-aws-border flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="font-bold text-white">{rec.studentName}</div>
                    <div className="text-[10px] text-slate-400">PRN: {rec.prn}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[11px]">{rec.timestamp}</div>
                  <span className="text-[10px] text-emerald-400">● Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
