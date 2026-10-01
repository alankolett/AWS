'use client';

import React, { useState } from 'react';
import { Users, Plus, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface SpaceItem {
  id: string;
  name: string;
  category: string;
  members: string;
  avatarBg: string;
  initials: string;
}

const SPACES: SpaceItem[] = [
  {
    id: 'space-1',
    name: 'Student Builders',
    category: 'General Cloud',
    members: '450 members',
    avatarBg: 'bg-[#ff9900]/20 text-[#ff9900] border-[#ff9900]/30',
    initials: 'SB',
  },
  {
    id: 'space-2',
    name: 'AWS AI & ML Scholars',
    category: 'Bedrock & GenAI',
    members: '180 members',
    avatarBg: 'bg-purple-900/30 text-purple-300 border-purple-500/30',
    initials: 'AI',
  },
  {
    id: 'space-3',
    name: 'Cloud Security SIG',
    category: 'IAM & Governance',
    members: '95 members',
    avatarBg: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/30',
    initials: 'CS',
  },
];

export const RightSpacesRail: React.FC = () => {
  const { setJoinModalOpen } = useAppStore();
  const [joinedSpaces, setJoinedSpaces] = useState<string[]>(['space-1']);

  const toggleJoin = (id: string) => {
    if (joinedSpaces.includes(id)) {
      setJoinedSpaces(joinedSpaces.filter((s) => s !== id));
    } else {
      setJoinedSpaces([...joinedSpaces, id]);
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-72 h-[calc(100vh-3.5rem)] sticky top-14 right-0 bg-[#0d121a] border-l border-[#1f2937] p-4 overflow-y-auto justify-between">
      {/* Top: Authentic Builder Center "Spaces" List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-sans font-semibold tracking-wider text-slate-500 uppercase">
            Spaces
          </span>
          <button
            onClick={() => setJoinModalOpen(true)}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Browse
          </button>
        </div>

        <div className="space-y-2">
          {SPACES.map((space) => {
            const isJoined = joinedSpaces.includes(space.id);

            return (
              <div
                key={space.id}
                className="p-3 rounded-lg bg-[#111722] border border-[#1f2937] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold border ${space.avatarBg} shrink-0`}
                  >
                    {space.initials}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-white truncate">
                      {space.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {space.members}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoin(space.id)}
                  className={`h-6 px-2.5 rounded text-[11px] font-sans transition-colors shrink-0 flex items-center gap-1 ${
                    isJoined
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-white hover:bg-slate-200 text-slate-950 font-medium'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Join</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Minimal 3-line Telemetry Box */}
      <div className="p-3 rounded-lg bg-[#111722] border border-[#1f2937] text-xs font-mono space-y-1.5 text-slate-400">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">SSPU Lab 3:</span>
          <span className="text-emerald-400">Active</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Next Jam:</span>
          <span className="text-slate-200">Oct 18, 2026</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Region:</span>
          <span className="text-slate-200">ap-south-1</span>
        </div>
      </div>
    </aside>
  );
};
