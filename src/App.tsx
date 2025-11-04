import React from 'react';

// Używamy aliasu z tsconfig ("@/*": ["src/*"])
import { Stage } from '@/components/hex/Stage';
import { Topbar } from '@/components/panes/Topbar';
import { LeftPane } from '@/components/panes/LeftPane';
import { AIPanel } from '@/components/panes/AIPanel';
import { RecruitModal } from '@/components/modal/RecruitModal';

/**
 * Główny komponent aplikacji – layout heksów + panele boczne + modal.
 */
function App() {
  return (
    <>
      <div
        className="app"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr 420px',
          gridTemplateRows: '56px 1fr',
          gridTemplateAreas: `
            "topbar topbar topbar"
            "left   main   right"
          `,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Topbar */}
        <header style={{ gridArea: 'topbar' }}>
          <Topbar />
        </header>

        {/* Lewy panel */}
        <aside style={{ gridArea: 'left', minWidth: 0, overflow: 'hidden' }}>
          <LeftPane />
        </aside>

        {/* Scena (heksy) */}
        <main style={{ gridArea: 'main', minWidth: 0, overflow: 'hidden' }}>
          <Stage />
        </main>

        {/* Prawy panel (AI) */}
        <aside style={{ gridArea: 'right', minWidth: 0, overflow: 'hidden' }}>
          <AIPanel />
        </aside>
      </div>

      {/* Modal na wierzchu */}
      <RecruitModal />
    </>
  );
}

export default App;
