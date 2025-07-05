import { create } from 'zustand';

interface RulingsState {
  isSearchVisible: boolean;
  setIsSearchVisible: (isVisible: boolean) => void;
}

export const useRulingsStore = create<RulingsState>((set) => ({
  isSearchVisible: false,
  setIsSearchVisible: (isVisible) => set({ isSearchVisible: isVisible }),
}));
