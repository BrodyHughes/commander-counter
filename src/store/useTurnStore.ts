import { create } from 'zustand';

interface TurnState {
  current: number | null;
  isSpinning: boolean;
  isFinished: boolean;
  set: (id: number | null) => void;
  startSpin: () => void;
  finishSpin: (id: number) => void;
  reset: () => void;
}

export const useTurnStore = create<TurnState>((set) => ({
  current: null,
  isSpinning: false,
  isFinished: false,
  set: (id) => set({ current: id }),
  startSpin: () => set({ isSpinning: true, isFinished: false, current: null }),
  finishSpin: (id) => set({ current: id, isSpinning: false, isFinished: true }),
  reset: () => set({ current: null, isSpinning: false, isFinished: false }),
}));
