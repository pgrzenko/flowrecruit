// src/state/useHexStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Hex, HexPayload } from './types';

/** Domyślny payload dla heksa */
const createDefaultPayload = (title: string, ring: number): HexPayload => ({
  title,
  status: 'To Do',
  ring: ring === 0 ? 'P0' : ring === 1 ? 'P1' : ring === 2 ? 'P2' : 'P3',
  links: [],
  kanban: { todo: [], doing: [], done: [] },
  chat: [],
});

/** Generuje 37 heksów (1 + 6 + 12 + 18) */
const generateInitialState = (): { hexes: Hex[]; payloads: Record<string, HexPayload> } => {
  const hexes: Hex[] = [];
  const payloads: Record<string, HexPayload> = {};

  // centrum
  const centerId = 'c-0';
  hexes.push({ id: centerId, ring: 0 });
  payloads[centerId] = createDefaultPayload('FLOWer Recruit', 0);

  // pierścienie 1..3
  const ringSizes = [6, 12, 18];
  let idx = 1;
  ringSizes.forEach((count, ringIdx) => {
    const ring = ringIdx + 1;
    for (let i = 0; i < count; i++) {
      const id = `r${ring}-${i}`;
      hexes.push({ id, ring });
      payloads[id] = createDefaultPayload(`Hex ${idx++}`, ring);
    }
  });

  return { hexes, payloads };
};

const initialState = generateInitialState();

/** Główny store */
export const useHexStore = create<AppState>()(
  persist(
    (set, get) => ({
      hexes: initialState.hexes,
      payloads: initialState.payloads,
      activeHexId: 'c-0',
      modalState: { isOpen: false, activeHexId: null },

      setActiveHexId: (hexId: string) => set({ activeHexId: hexId }),

      openRecruitModal: (hexId: string) => {
        if (hexId === 'c-0') return; // nie otwieramy dla centrum
        set({ modalState: { isOpen: true, activeHexId: hexId } });
      },

      closeRecruitModal: () => set({ modalState: { isOpen: false, activeHexId: null } }),

      addChatMessage: (hexId, role, content) => {
        set((state) => {
          const existing = state.payloads[hexId];
          if (!existing) return {};
          const chat = [...(existing.chat || []), { role, content }];
          return {
            payloads: {
              ...state.payloads,
              [hexId]: { ...existing, chat },
            },
          };
        });
      },

      getActiveHexData: () => {
        const { modalState, hexes, payloads } = get();
        const id = modalState.isOpen ? modalState.activeHexId : null;
        if (!id) return null;
        const hex = hexes.find((h) => h.id === id);
        const payload = payloads[id];
        if (!hex || !payload) return null;
        return { hex, payload };
      },
    }),
    {
      name: 'flower-recruit-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
