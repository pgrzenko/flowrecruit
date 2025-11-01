import React from 'react';

/**
 * Górny pasek nawigacyjny (Topbar).
 * Przeniesiony z .topbar w flower.html
 */
export const Topbar: React.FC = () => {
  return (
    <header className="grid-area-top flex items-center justify-between px-4 py-2 border-b border-ui-border bg-ui-bg">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 border-2 border-ui-accent rounded-[4px] rotate-45" />
        <h1 className="m-0 text-xl tracking-wide">FLOWer Recruit</h1>
      </div>

      {/* Akcje */}
      <div className="actions">
        <button className="bg-ui-bg border border-ui-border text-ui-muted px-2.5 py-2 rounded-lg cursor-pointer ml-2 hover:border-ui-accent hover:text-ui-ink">
          Export/Share
        </button>
        <button className="bg-ui-bg border border-ui-border text-ui-muted px-2.5 py-2 rounded-lg cursor-pointer ml-2 hover:border-ui-accent hover:text-ui-ink">
          Import
        </button>
        <button className="bg-ui-bg border border-ui-border text-ui-muted px-2.5 py-2 rounded-lg cursor-pointer ml-2 hover:border-ui-accent hover:text-ui-ink">
          Theme
        </button>
      </div>
    </header>
  );
};
