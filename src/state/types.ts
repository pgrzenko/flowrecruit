// Definicje typów dla aplikacji FLOWer Recruit

/**
 * Podstawowa struktura zadania w panelu Kanban.
 */
export interface KanbanTask {
  id: string;
  title: string;
  // W przyszłości można dodać 'subtasks'
}

/**
 * Struktura danych (payload) przechowywana dla każdego heksagonu.
 * Odpowiada to logice 'seedPayload' z flower.html.
 */
export interface HexPayload {
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  ring: 'P1' | 'P2' | 'P3' | 'P0'; // P0 dla centrum
  description?: string;
  notes?: string;
  links?: Array<{
    title: string;
    url: string;
  }>;
  kanban?: {
    todo: KanbanTask[];
    doing: KanbanTask[];
    done: KanbanTask[];
  };
  /** Historia czatu AI dla tego heksa */
  chat?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  // Pola specyficzne dla rekrutacji (z PDF)
  jobDescription?: string;
  cvMatchPercent?: number;
  interviewPrep?: string;
  trackingStatus?: string; // np. 'Aplikowano', 'Rozmowa HR', 'Oferta'
}

/**
 * Definicja heksagonu w siatce.
 * Przechowuje tylko minimalne dane wizualne/identyfikacyjne.
 * Reszta danych jest w 'payloads'.
 */
export interface Hex {
  id: string;
  /** Logiczna przynależność do pierścienia (0 = centrum) */
  ring: number;
}

/**
 * Stan modala rekrutacyjnego.
 */
export interface ModalState {
  isOpen: boolean;
  activeHexId: string | null;
}

/**
 * Główny interfejs store'u Zustand.
 */
export interface AppState {
  /** Lista 37 heksagonów (definicje) */
  hexes: Hex[];
  /** Mapa przechowująca szczegółowe dane dla każdego heksa (po ID) */
  payloads: Record<string, HexPayload>;
  /** Stan modala */
  modalState: ModalState;
  /** ID heksa aktywowanego w panelu bocznym */
  activeHexId: string | null;

  // Akcje
  /** Ustawia aktywny heks dla panelu bocznego */
  setActiveHexId: (hexId: string) => void;
  /** Otwiera modal rekrutacyjny dla wybranego heksa */
  openRecruitModal: (hexId: string) => void;
  /** Zamyka modal rekrutacyjny */
  closeRecruitModal: () => void;
  /** Aktualizuje payload dla konkretnego heksa */
  updatePayload: (hexId: string, data: Partial<HexPayload>) => void;
  /** Dodaje wiadomość do historii czatu heksa */
  addChatMessage: (hexId: string, role: 'user' | 'assistant', content: string) => void;
  /** Zwraca pełne dane dla aktywnego heksa */
  getActiveHexData: () => (Hex & { payload: HexPayload }) | null;
}
