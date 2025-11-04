import React, { useEffect, useRef, useState } from 'react';
import { useHexStore } from '@/state/useHexStore';
import type { Hex, HexPayload, ChatMessage } from '@/types';

/**
 * Prawy panel (AI / Chat). Minimalna, typowana wersja, bez "implicit any".
 */
export const AIPanel: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Typowane selektory ze store
  const activeHexId = useHexStore((s) => s.activeHexId);
  const hex = useHexStore((s) => s.hexes.find((h: Hex) => h.id === s.activeHexId));
  const payload = useHexStore((s) => (activeHexId ? s.payloads[activeHexId] : undefined));
  const addChatMessage = useHexStore((s) => s.addChatMessage);

  // Autoscroll logu
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [payload?.chat?.length]);

  const handleSend = async () => {
    const text = userInput.trim();
    if (!activeHexId || !text) return;

    setIsLoading(true);
    setUserInput('');

    // 1) wiadomość usera
    addChatMessage(activeHexId, 'user', text);

    // 2) prosta odpowiedź asystenta (placeholder)
    // (Jeśli masz API – tu można podpiąć call do backendu.)
    const reply = `Echo: ${text}`;
    addChatMessage(activeHexId, 'assistant', reply);

    setIsLoading(false);
  };

  const chat: ChatMessage[] = (payload?.chat ?? []) as ChatMessage[];

  return (
    <aside className="h-full flex flex-col bg-ui-bg-1 border-l border-ui-border">
      {hex && payload ? (
        <>
          {/* Nagłówek panelu */}
          <div className="p-3 border-b border-ui-border">
            <div className="text-sm text-ui-muted">Active Hex</div>
            <div className="font-semibold">{hex.id}</div>
            <div className="text-xs text-ui-muted">Status: {payload.status}</div>
          </div>

          {/* Log czatu */}
          <div ref={chatLogRef} className="flex-1 overflow-y-auto p-3 space-y-2" aria-live="polite">
            {chat.map((msg: ChatMessage, idx: number) => (
              <div
                key={idx}
                className={`p-2 rounded border ${
                  msg.role === 'user'
                    ? 'bg-blue-900/30 border-blue-600/50'
                    : 'bg-ui-bg-2 border-ui-border'
                }`}
              >
                <div className="text-[11px] uppercase opacity-70 mb-1">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap break-words text-sm">{msg.content}</div>
              </div>
            ))}
            {isLoading && <div className="text-ui-muted text-sm">Thinking…</div>}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-ui-border">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-ui-border bg-ui-bg-2 px-3 py-2"
                placeholder="Type a message…"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                className="px-3 py-2 rounded-lg bg-ui-accent text-white disabled:opacity-50"
                onClick={handleSend}
                disabled={isLoading || !userInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-ui-muted">
          <h3 className="text-lg">AI Panel</h3>
          <p>Choose a hex on the stage to start chatting.</p>
        </div>
      )}
    </aside>
  );
};
