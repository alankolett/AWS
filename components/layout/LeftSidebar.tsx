'use client';

import React from 'react';
import {
  Compass,
  Calendar,
  Sparkles,
  Users,
  Code2,
  Image as ImageIcon,
  QrCode,
  ScanLine,
  Award,
  BookOpen,
  GitFork,
  FileText,
  Briefcase,
  BellRing,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ActiveTabType } from '@/lib/types';

interface NavItem {
  id: ActiveTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const LeftSidebar: React.FC = () => {
  const { activeTab, setActiveTab, isMobileDrawerOpen, setMobileDrawerOpen } = useAppStore();

  const coreNav: NavItem[] = [
    { id: 'home', label: 'Overview', icon: Compass },
    { id: 'events', label: 'Sessions & Events', icon: Calendar },
    { id: 'founder', label: 'Founder Story', icon: Sparkles },
    { id: 'team', label: 'Core Team', icon: Users },
    { id: 'builders', label: 'Builder Directory', icon: Code2 },
  ];

  const toolsNav: NavItem[] = [
    { id: 'banner-gen', label: 'Banner Generator', icon: ImageIcon },
    { id: 'builder-pass', label: 'Digital Builder Pass', icon: QrCode },
    { id: 'attendance', label: 'Attendance Kiosk', icon: ScanLine },
    { id: 'certificates', label: 'Verify Credentials', icon: Award },
  ];

  const exploreNav: NavItem[] = [
    { id: 'learning', label: 'Learning Hub', icon: BookOpen },
    { id: 'pathgen', label: 'Roadmap Generator', icon: GitFork },
    { id: 'blog', label: 'Community Blog', icon: FileText },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'announcements', label: 'Announcements', icon: BellRing },
  ];

  const handleNavClick = (id: ActiveTabType) => {
    setActiveTab(id);
    if (isMobileDrawerOpen) {
      setMobileDrawerOpen(false);
    }
  };

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div className="px-3 mb-1.5 text-[11px] font-sans font-semibold tracking-wider text-slate-500 uppercase">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors ${
                isActive
                  ? 'bg-[#151d2a] text-white font-medium border-l-2 border-[#ff9900]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111722]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#ff9900]' : 'text-slate-500'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-[#0d121a] border-r border-[#1f2937] flex flex-col justify-between p-3 overflow-y-auto z-40 transition-transform duration-200 ease-in-out ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {renderSection('Console', coreNav)}
          {renderSection('Builder Tools', toolsNav)}
          {renderSection('Resources', exploreNav)}
        </div>

        {/* Sidebar Footer: Official AWS Links */}
        <div className="pt-3 border-t border-[#1f2937] space-y-1">
          <a
            href="https://builder.aws.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-[#111722] transition-colors"
          >
            <span>AWS Builder Center</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <a
            href="https://aws.amazon.com/events/reinvent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-[#111722] transition-colors"
          >
            <span>AWS re:Invent</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <div className="px-3 pt-2 text-[11px] font-mono text-slate-600">
            SSPU Chapter · ap-south-1
          </div>
        </div>
      </aside>
    </>
  );
};
