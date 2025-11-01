import React from 'react';

/**
 * Lewy panel boczny (placeholder).
 * Przeniesiony z .left w flower.html
 */
export const LeftPane: React.FC = () => {
  // Style dla 'pill'
  const pillClass = "bg-ui-bg-2 border border-ui-border text-ui-ink rounded-xl p-2.5 cursor-pointer flex justify-between items-center";
  const pillActiveClass = "border-ui-accent shadow-[0_0_0_1px_rgba(34,211,238,.18)_inset]";

  return (
    <aside className="grid-area-left p-4 border-r border-ui-border overflow-auto bg-ui-bg">
      <div className="section mb-4">
        <h3 className="my-2 text-ui-muted text-xs uppercase tracking-widest">Filtry (Wkrótce)</h3>
        <div className="pill-group grid gap-2">
          <div className={`${pillClass} ${pillActiveClass}`}>Wszystkie</div>
          <div className={pillClass}>Pierścień 1 (P1)</div>
          <div className={pillClass}>Pierścień 2 (P2)</div>
        </div>
      </div>
      <div className="section mb-4">
        <h3 className="my-2 text-ui-muted text-xs uppercase tracking-widest">Status (Wkrótce)</h3>
        <div className="pill-group grid gap-2">
          <div className={pillClass}>Wszystkie</div>
          <div className={pillClass}>Do zrobienia</div>
          <div className={pillClass}>W trakcie</div>
          <div className={pillClass}>Ukończone</div>
        </div>
      </div>
    </aside>
  );
};
