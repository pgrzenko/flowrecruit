import { Hex, HexPayload } from '@/state/types';

/**
 * Kontekst przekazywany do AI (z buildHexContext w flower.html).
 */
export interface AssistantContext {
  id: string;
  title: string;
  ring: string;
  status: string;
  kanban: {
    todo: number;
    doing: number;
    done: number;
  };
  notes: string;
  links: number;
  description: string;
}

/**
 * Buduje obiekt kontekstu dla AI na podstawie danych heksa.
 */
export const buildHexContext = (hex: Hex, payload: HexPayload): AssistantContext => {
  const t = (s: string | undefined) => String(s || '').trim();
  
  const todo = payload.kanban?.todo?.length || 0;
  const doing = payload.kanban?.doing?.length || 0;
  const done = payload.kanban?.done?.length || 0;

  return {
    id: hex.id,
    title: t(payload.title),
    ring: t(payload.ring),
    status: t(payload.status),
    kanban: { todo, doing, done },
    notes: t(payload.notes),
    links: payload.links?.length || 0,
    description: t(payload.description || payload.jobDescription),
  };
};

/**
 * Mockowa funkcja asystenta AI (z mockAssistant w flower.html).
 */
const mockAssistant = (ctx: AssistantContext, msg: string): string => {
  const t = (s: string | undefined) => String(s || '').trim();
  const { todo, doing, done } = ctx.kanban;
  const total = todo + doing + done;
  const progress = (total > 0) ? Math.round((done / total) * 100) : 0;

  if (/blocker|blok|przeszk|risk|ryzyk/i.test(msg)) {
    const risks = !t(ctx.notes) && todo === 0 ? "Brak notatek i brak tasków – ryzyko niejasnego zakresu." : (doing === 0 && done === 0 ? "Brak prac w toku – projekt może nie mieć właściciela." : "");
    return `Blockers summary:\n- Status: ${ctx.status || 'To Do'} | Progress: ${progress}%\n- Tasks → To Do:${todo} In Progress:${doing} Done:${done}\n- Risks: ${risks || 'Brak krytycznych, monitoruj zależności.'}`;
  }
  if (/summa|summary|podsum/i.test(msg)) {
    return `Summary:\n• Title: ${t(ctx.title)} | Ring: ${t(ctx.ring)}\n• Status: ${t(ctx.status)}\n• Tasks: To Do ${todo}, In Progress ${doing}, Done ${done} (≈${progress}%)\n• Links: ${ctx.links}\n• Notes: ${ctx.notes.substring(0, 50)}...`;
  }
  return `Noted: "${msg}". Context title: ${t(ctx.title)}. Try: "Summarize" or "Find blockers".`;
};


/**
 * Symulacja wywołania API (logika z API.post w flower.html).
 */
export const api = {
  post: (path: '/assistant/chat', body: {
    hexId: string;
    message: string;
    context: AssistantContext;
  }): Promise<{ reply: string }> => {
    
    return new Promise((resolve) => {
      // Symuluj opóźnienie sieci
      setTimeout(() => {
        if (path === '/assistant/chat') {
          const { context, message } = body;
          const reply = mockAssistant(context, message);
          resolve({ reply });
        }
      }, 500); // 500ms opóźnienia
    });
  }
};
