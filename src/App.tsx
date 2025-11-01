import  React from 'react';
import { Stage } from './components/hex/Stage';
import { Topbar } from '/src/components/panes/Topbar.tsx';
import { LeftPane } from './components/panes/LeftPane';
import { AIPanel } from '@/components/panes/AIPanel';
import { RecruitModal } from './components/modal/RecruitModal';

/**
 * Główny komponent aplikacji.
 * Definiuje layout siatki (grid) na wzór flower.html.
 */
function App() {
  return (
    <>
      <div
        className="app"
        style={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: '300px 1fr 380px', // left | scene | right
          gridTemplateRows: '56px 1fr', // top | content
          gridTemplateAreas:
            '"top top top"' +
            '"left scene right"',
        }}
      >
        {/* Definiujemy style inline dla grid-area, aby uniknąć konieczności
            dodawania kolejnego pliku CSS dla layoutu. */}
        
        <div style={{ gridArea: 'top' }}>
          <Topbar />
        </div>
        
        <div style={{ gridArea: 'left' }}>
          <LeftPane />
        </div>
        
        <main style={{ gridArea: 'scene', position: 'relative' }}>
          <Stage />
        </main>
        
        <div style={{ gridArea: 'right' }}>
          <AIPanel />
        </div>
      </div>

      {/* Modal renderuje się na wierzchu */}
      <RecruitModal />
    </>
  );
}

export default App;
