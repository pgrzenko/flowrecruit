import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Hex, HexPayload, KanbanTask } from './types';

/**
 * Tworzy domyślny payload dla nowego heksagonu.
 */
const createDefaultPayload = (title: string, ring: number): HexPayload => ({
  title: title,
  status: 'To Do',
  ring: ring === 0 ? 'P0' : (ring === 1 ? 'P1' : (ring === 2 ? 'P2' : 'P3')),
  links: [],
  kanban: {
    todo: [],
    doing: [],
    done: [],
  },
  chat: [], // Inicjalizuj pustą historię czatu
});

/**
 * Generuje stan początkowy - 37 heksagonów i ich puste payloady.
 * Logika wzorowana na 'loadData' z flower.html.
 */
const generateInitialState = (): { hexes: Hex[], payloads: Record<string, HexPayload> } => {
  const hexes: Hex[] = [];
  const payloads: Record<string, HexPayload> = {};

  // 1. Heks centralny
  const centerId = 'c-0';
  hexes.push({ id: centerId, ring: 0 });
  payloads[centerId] = createDefaultPayload('FLOWer Recruit', 0);

  // 2. Pierścienie 1, 2, 3
  // Liczba heksów w pierścieniach: 6, 12, 18
  const ringSizes = [6, 12, 18];
  let hexCounter = 1;

  ringSizes.forEach((count, ringIndex) => {
    const ring = ringIndex + 1; // ring 1, 2, 3
    for (let i = 0; i < count; i++) {
      const id = `r${ring}-${i}`;
      const title = `Hex ${hexCounter++}`;
      hexes.push({ id, ring });
      payloads[id] = createDefaultPayload(title, ring);
    }
  });

  return { hexes, payloads };
};

const initialState = generateInitialState();

/**
 * Główny store aplikacji FLOWer Recruit.
 */
export const useHexStore = create<AppState>()(
  persist(
    (set, get) => ({
      hexes: initialState.hexes,
      payloads: initialState.payloads,
      activeHexId: 'c-0', // Domyślnie aktywne centrum
      modalState: {
        isOpen: false,
        activeHexId: null,
      },

      setActiveHexId: (hexId: string) => {
        set({ activeHexId: hexId });
      },

      openRecruitModal: (hexId: string) => {
        // Nie otwieramy modala dla heksa centralnego
        if (hexId === 'c-0') return;

        set({
          modalState: {
            isOpen: true,
            activeHexId: hexId,
          },
        });
      },

      closeRecruitModal: () => {
        set({
          modalState: {
            isOpen: false,
            activeHexId: null,
          },
        });
      },

      addChatMessage: (hexId: string, role: 'user' | 'assistant', content: string) => {
        set((state) => {
          const payload = state.payloads[hexId];
          if (!payload) return {}; // Hex nie istnieje
          
          const newChat = [...(payload.chat || []), { role, content }];

          return {
            payloads: {
              ...state.payloads,
              [hexId]: {
                ...payload,
                chat: newChat,
              },
            },
          };
        });
      },

      getActiveHexData: () => {
        const { modalState, hexes, payloads } = get();
        if (!modalState.isOpen || !modalState.activeHexId) {
          return null;
        }

        const hex = hexes.find(h => h.id === modalState.activeHexId);
        const payload = payloads[modalState.activeHexId];

        if (!hex || !payload) return null;

        return {
          ...hex,
          payload,
        };
      },
    }),
    {
      name: 'flower-recruit-storage', // Nazwa klucza w localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
