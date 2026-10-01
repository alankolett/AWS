import { create } from 'zustand';
import { ActiveTabType } from './types';

export interface UserPassProfile {
  name: string;
  prn: string;
  branchYear: string;
  role: string;
  tier: 'PRO' | 'FELLOW' | 'MEMBER' | 'ARCHITECT';
  avatarUrl: string;
  builderId: string;
}

interface AppState {
  activeTab: ActiveTabType;
  searchQuery: string;
  isMobileDrawerOpen: boolean;
  isAskSbgOpen: boolean;
  isJoinModalOpen: boolean;
  registeredEventIds: string[];
  userProfile: UserPassProfile;
  hasHydrated: boolean;

  // Actions
  setActiveTab: (tab: ActiveTabType) => void;
  setSearchQuery: (query: string) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setAskSbgOpen: (open: boolean) => void;
  setJoinModalOpen: (open: boolean) => void;
  toggleEventRegistration: (eventId: string) => void;
  updateUserProfile: (profile: Partial<UserPassProfile>) => void;
  setHasHydrated: (state: boolean) => void;
}

const DEFAULT_PROFILE: UserPassProfile = {
  name: 'Disha Pure',
  prn: '20220104001',
  branchYear: 'B.Tech CSIT (Cybersecurity) · Class of 2026',
  role: 'Founder & Community Lead',
  tier: 'ARCHITECT',
  avatarUrl: '/disha-pure.png',
  builderId: 'disha-pure-sspu',
};

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'home',
  searchQuery: '',
  isMobileDrawerOpen: false,
  isAskSbgOpen: false,
  isJoinModalOpen: false,
  registeredEventIds: ['evt-reinvent-watch-party'],
  userProfile: DEFAULT_PROFILE,
  hasHydrated: false,

  setActiveTab: (tab) => set({ activeTab: tab, isMobileDrawerOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  setAskSbgOpen: (open) => set({ isAskSbgOpen: open }),
  setJoinModalOpen: (open) => set({ isJoinModalOpen: open }),
  toggleEventRegistration: (eventId) => {
    const current = get().registeredEventIds;
    if (current.includes(eventId)) {
      set({ registeredEventIds: current.filter((id) => id !== eventId) });
    } else {
      set({ registeredEventIds: [...current, eventId] });
    }
  },
  updateUserProfile: (profile) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...profile },
    }));
  },
  setHasHydrated: (state) => set({ hasHydrated: state }),
}));
