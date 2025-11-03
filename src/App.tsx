// src/App.tsx
import { Stage } from './components/hex/Stage';
import { Topbar } from './Topbar';
import { LeftPane } from './LeftPane';
import { AIPanel } from './AIPanel';
import { RecruitModal } from './RecruitModal';

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
        {/* top bar */}
        <div style={{ gridArea: 'top' }}>
          <Topbar />
        </div>

        {/* left pane */}
        <div style={{ gridArea: 'left' }}>
          <LeftPane />
        </div>

        {/* main stage */}
        <main style={{ gridArea: 'scene', position: 'relative' }}>
          <Stage />
        </main>

        {/* right pane */}
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
