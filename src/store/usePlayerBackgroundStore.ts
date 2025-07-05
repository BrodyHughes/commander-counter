import { create } from 'zustand';
import { produce } from 'immer';

interface PlayerBackgroundState {
  backgrounds: { [playerId: number]: string | null };
  setBackground: (playerId: number, url: string | null) => void;
  removeBackground: (playerId: number) => void;
}

export const usePlayerBackgroundStore = create<PlayerBackgroundState>((set) => ({
  backgrounds: {},
  setBackground: (playerId, url) => {
    set(
      produce((draft) => {
        draft.backgrounds[playerId] = url;
      }),
    );
  },
  removeBackground: (playerId) => {
    set(
      produce((draft) => {
        delete draft.backgrounds[playerId];
      }),
    );
  },
}));
