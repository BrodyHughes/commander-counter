import { create } from 'zustand';

interface CommanderDamageModeState {
  isReceiving: boolean;
  defenderId: number | null;
  startReceiving: (defenderId: number) => void;
  stopReceiving: () => void;
}

export const useCommanderDamageModeStore = create<CommanderDamageModeState>((set) => ({
  isReceiving: false,
  defenderId: null,
  startReceiving: (defenderId: number) => set({ isReceiving: true, defenderId }),
  stopReceiving: () => set({ isReceiving: false, defenderId: null }),
}));
