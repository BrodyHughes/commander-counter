import { create } from 'zustand';
import { SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST } from '@/consts/consts';

/* ── Types ───────────────────────────────────────── */
export interface PlayerState {
  id: number;
  life: number;
  delta: number;
  timer?: NodeJS.Timeout;
  backgroundColor: string;
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6;

interface LifeStore {
  totalPlayers: PlayerCount;
  players: PlayerState[];

  changeLife: (index: number, amount: number) => void;
  setTotalPlayers: (total: PlayerCount) => void;
}

/* ── Helpers ───────────────────────────────────────── */

const createPlayers = (total: PlayerCount): PlayerState[] => {
  const panelColors = [SWAMP, ISLAND, MOUNTAIN, PLAINS, FOREST];
  // Fisher-Yates shuffle
  for (let i = panelColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [panelColors[i], panelColors[j]] = [panelColors[j], panelColors[i]];
  }

  return Array.from({ length: total }, (_, i) => ({
    id: i,
    life: 40,
    delta: 0,
    backgroundColor: panelColors[i % panelColors.length], // Use modulo to loop if more players than colors
  }));
};

/* ── Store ───────────────────────────────────────── */
export const useLifeStore = create<LifeStore>((set) => ({
  totalPlayers: 4,
  players: createPlayers(4),

  changeLife: (index, amount) =>
    set((state) => {
      const next = [...state.players];
      const p = { ...next[index] };

      if (p.timer) clearTimeout(p.timer);
      p.life += amount;
      p.delta += amount;

      p.timer = setTimeout(() => {
        set((cur) => {
          const upd = [...cur.players];
          upd[index] = { ...upd[index], delta: 0, timer: undefined };
          return { players: upd };
        });
      }, 3000);

      next[index] = p;
      return { players: next };
    }),

  setTotalPlayers: (total) =>
    set((state) => {
      if (total < 2 || total > 6) return state;
      return { totalPlayers: total, players: createPlayers(total) };
    }),
}));
