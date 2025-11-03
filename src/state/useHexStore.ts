// src/state/useHexStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, Hex, HexPayload } from '@/types';

/**
 * Tworzy domyślny payload dla nowego heksagonu.
 * Uwaga: 'ring' w HexPayload jest liczbą (0,1,2,3), zgodnie z wymaganiami TS w innych plikach.
 */
const createDefaultPayload = (title: string, ring: number): HexPayload => ({
  title,
  status: 'To Do',
  ring,            // ważne: number, nie "P0/P1..."
  links: [],
  kanban: {
    todo: [],
    doing: [],
    done: [],
  },
  chat: [],
});

/**
 * Generuje stan początkowy - 37 heksagonów i ich puste payloady.
 * (1 centralny + 3 pierścienie: 6, 12, 18)
 */
const generateInitialState = (): { hexes: Hex[]; payloads: Record<string, HexPayload> } => {
  const hexes: Hex[] = [];
  const payloads: Record<string, HexPayload> = {};

  // 1) Heks centralny
  const centerId = 'c-0';
  hexes.push({ id: centerId, ring: 0 });
  payloads[centerId] = createDefaultPayload('FLOWer Recruit', 0);

  // 2) Pierścienie
  const ringSizes = [6, 12, 18];
  let hexCounter = 1;

  ringSizes.forEach((count, ringIndex) => {
    const ring = ringIndex + 1; // 1..3
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
 * Upewniamy się, że:
 *  - mamy 'updatePayload' (wymagane przez AppState),
 *  - 'getActiveHexData' korzysta z get() i zwraca { id, payload } lub null,
 *  - modalState steruje widocznością modala rekrutacyjnego.
 */
export const useHexStore = create<AppState>()(
  persist(
    (set, get) => ({
      hexes: initialState.hexes,
      payloads: initialState.payloads,

      activeHexId: 'c-0',
      modalState: {
        isOpen: false,
        activeHexId: null,
      },

      setActiveHexId: (hexId: string) => {
        set({ activeHexId: hexId });
      },

      openRecruitModal: (hexId: string) => {
        // Nie otwieramy modala dla heksa centralnego (opcjonalna logika biznesowa)
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
          if (!payload) return {};
          const newChat = [...(payload.chat ?? []), { role, content }];

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

      /**
       * KLUCZOWA AKCJA — brakowało jej w stanie: dodajemy updatePayload,
       * aby można było modyfikować częściowo HexPayload (np. title/status).
       */
      updatePayload: (hexId, partial) =>
        set((state) => {
          const prev: HexPayload =
            state.payloads[hexId] ??
            createDefaultPayload('Untitled', 0);
          const next: HexPayload = { ...prev, ...partial };
          return { payloads: { ...state.payloads, [hexId]: next } };
        }),

      /**
       * Helper do modala – pobiera aktualnie aktywny hex i jego payload,
       * oparty o modalState (jeśli modal zamknięty → null).
       */
      getActiveHexData: () => {
        const { modalState, payloads } = get();
        if (!modalState.isOpen || !modalState.activeHexId) return null;

        const id = modalState.activeHexId;
        const payload = payloads[id];
        if (!payload) return null;

        return { id, payload };
      },
    }),
    {
      name: 'flower-recruit-storage',
      storage: createJSONStorage(() => localStorage),
      // (opcjonalnie) version / migrate można dodać w przyszłości
    }
  )
);
