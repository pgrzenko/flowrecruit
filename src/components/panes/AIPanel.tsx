import React, { useState, useEffect, useRef } from 'react';
import { useHexStore } from '@/state/useHexStore';
import { api, buildHexContext } from '@/lib/api';

/**
 * Prawy panel boczny (AI Panel) z logiką czatu.
 * Zastępuje .right z flower.html.
 */
export const AIPanel: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Subskrypcja aktywnego heksa i potrzebnych akcji
  const activeHexId = useHexStore((s) => s.activeHexId);
  const hex = useHexStore((s) => s.hexes.find(h => h.id === s.activeHexId));
  const payload = useHexStore((s) => (s.activeHexId ? s.payloads[s.activeHexId] : null));
  const addChatMessage = useHexStore((s) => s.addChatMessage);

  const kpiTotal = (payload?.kanban?.todo.length || 0) +
                   (payload?.kanban?.doing.length || 0) +
                   (payload?.kanban?.done.length || 0);
  const kpiDone = payload?.kanban?.done.length || 0;
  const kpiProgress = kpiTotal > 0 ? Math.round((kpiDone / kpiTotal) * 100) : 0;

  // Auto-scroll do dołu
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [payload?.chat]);

  const handleSend = async () => {
    if (!userInput.trim() || !activeHexId || !hex || !payload || isLoading) return;

    const message = userInput.trim();
    setIsLoading(true);
    setUserInput('');

    // 1. Dodaj wiadomość użytkownika do store'u
    addChatMessage(activeHexId, 'user', message);

    // 2. Zbuduj kontekst
    const context = buildHexContext(hex, payload);

    // 3. Wyślij do mock API
    try {
      const res = await api.post('/assistant/chat', {
        hexId: activeHexId,
        message,
        context,
      });
      // 4. Dodaj odpowiedź AI do store'u
      addChatMessage(activeHexId, 'assistant', res.reply);
    } catch (error) {
      console.error("Błąd mock API:", error);
      addChatMessage(activeHexId, 'assistant', 'Wystąpił błąd (mock).');
    } finally {
      setIsLoading(false);
    }
  };

  if (!payload || !hex) {
    return (
      <aside className="grid-area-right border-l border-ui-border bg-ui-bg flex flex-col min-w-[320px] overflow-auto p-4">
        <h3 className="text-ui-muted">Wybierz heksagon, aby zobaczyć szczegóły.</h3>
      </aside>
    );
  }
  
  const isCenter = hex.id === 'c-0';

  return (
    <aside className="grid-area-right border-l border-ui-border bg-ui-bg flex flex-col min-w-[320px] max-h-screen">
      {/* Karta KPI */}
      <div className="card p-4 border-b border-ui-border flex-shrink-0">
        <h3 className="m-0 mb-2 text-lg truncate" title={payload.title}>
          {payload.title}
        </h3>
        <div className="kpis grid grid-cols-2 gap-2.5">
          <div className="kpi bg-ui-bg-2 border border-ui-border rounded-lg p-3">
            <span>Zadania</span>
            <b className="block text-lg">{isCenter ? 'N/A' : kpiTotal}</b>
          </div>
          <div className="kpi bg-ui-bg-2 border border-ui-border rounded-lg p-3">
            <span>Postęp</span>
            <b className="block text-lg">{isCenter ? 'N/A' : `${kpiProgress}%`}</b>
          </div>
        </div>
      </div>

      {/* Panel AI (Czat) - ukryty dla centrum */}
      {!isCenter ? (
        <>
          {/* Log Czatuj */}
          <div 
            ref={chatLogRef}
            className="flex-1 p-4 overflow-y-auto space-y-3"
            aria-live="polite"
          >
            {(payload.chat || []).map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  msg.role === 'user'
                    ? 'bg-blue-900/30 border-blue-600/50 text-ui-ink'
                    : 'bg-ui-bg-2 border-ui-border text-ui-muted'
                }`}
              >
                <b className="block text-xs uppercase tracking-wider mb-1">
                  {msg.role === 'user' ? 'Ty' : 'Asystent'}
                </b>
                <p className="m-0 text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {isLoading && (
               <div className="p-3 rounded-lg border bg-ui-bg-2 border-ui-border text-ui-muted">
                 <b className="block text-xs uppercase tracking-wider mb-1">Asystent</b>
                 <p className="m-0 text-sm opacity-70 animate-pulse">...</p>
               </div>
            )}
          </div>

          {/* Input Czatuj */}
          <div className="p-4 border-t border-ui-border flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Zapytaj asystenta..."
                disabled={isLoading}
                className="flex-1 bg-ui-bg-2 border border-ui-border text-ui-ink rounded-lg px-3 py-2.5"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-ui-bg border border-ui-accent text-ui-accent px-4 py-2 rounded-lg cursor-pointer hover:border-ui-accent hover:text-ui-ink disabled:opacity-50"
              >
                Wyślij
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-ui-muted">
          <h3 className="text-lg">Panel Główny</h3>
          <p>Wybierz heksagon na scenie, aby rozpocząć pracę.</p>
        </div>
      )}
    </aside>
  );
};

