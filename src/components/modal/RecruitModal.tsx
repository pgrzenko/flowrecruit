import React, { useState } from 'react';
import { useHexStore } from '@/state/useHexStore';

type ModalTab = 'overview' | 'kanban' | 'notes' | 'links' | 'attach' | 'assistant';

const TABS: { id: ModalTab; label: string }[] = [
  { id: 'overview', label: 'Overview (JD)' },
  { id: 'kanban', label: 'CV Match' },
  { id: 'notes', label: 'Interview Prep' },
  { id: 'links', label: 'Tracking' },
  { id: 'attach', label: 'Attachments' },
  { id: 'assistant', label: 'Assistant' },
];

/**
 * Główny modal rekrutacyjny.
 * Zastępuje #hexModal i jest kontrolowany przez Zustand.
 */
export const RecruitModal: React.FC = () => {
  const { isOpen, activeHexId } = useHexStore((s) => s.modalState);
  const getActiveHexData = useHexStore((s) => s.getActiveHexData);
  const closeRecruitModal = useHexStore((s) => s.closeRecruitModal);

  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  
  const hexData = getActiveHexData();

  if (!isOpen || !hexData) {
    return null;
  }

  const { payload } = hexData;

  return (
    <div className="modal" id="recruitModal">
      {/* Tło */}
      <div className="modal__backdrop" onClick={closeRecruitModal} />

      {/* Okno Modala */}
      <div className="modal__window" role="dialog" aria-modal="true">
        
        {/* Topbar Modala */}
        <div className="modal__topbar">
          <div className="modal__row">
            <div className="field grow">
              <label>Tytuł (Job Title):</label>
              <input
                type="text"
                placeholder="Nazwa stanowiska..."
                defaultValue={payload.title}
                // onChange={(e) => updatePayload(hexData.id, { title: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Status:</label>
              <select defaultValue={payload.status}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <button
              aria-label="Close"
              className="btn-close"
              onClick={closeRecruitModal}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Zakładki Modala */}
        <div className="modal__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`mtab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Treść Modala */}
        <div className="modal__content">
          {activeTab === 'overview' && (
            <div className="mpane" data-pane="m-overview">
              <h3>Job Description (JD)</h3>
              <p className="muted">Tu będzie analiza opisu stanowiska (PDF biznesowy).</p>
              <textarea
                placeholder="Wklej opis stanowiska (JD)..."
                className="w-full min-h-[300px] bg-ui-bg-2 text-ui-ink border border-ui-border rounded-xl p-2.5"
              ></textarea>
            </div>
          )}
          {activeTab === 'kanban' && (
            <div className="mpane" data-pane="m-kanban">
              <h3>CV Match</h3>
              <p className="muted">Tu będzie analiza dopasowania CV (PDF biznesowy).</p>
            </div>
          )}
          {activeTab === 'notes' && (
            <div className="mpane" data-pane="m-notes">
              <h3>Interview Prep</h3>
              <p className="muted">Tu będą notatki do rozmowy (PDF biznesowy).</p>
            </div>
          )}
           {activeTab === 'links' && (
            <div className="mpane" data-pane="m-links">
              <h3>Tracking</h3>
              <p className="muted">Tu będzie śledzenie statusu aplikacji (PDF biznesowy).</p>
            </div>
          )}
          {/* Pozostałe zakładki jako placeholder */}
        </div>

      </div>
    </div>
  );
};
