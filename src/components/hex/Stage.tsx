import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useHexStore } from '@/state/useHexStore';
import { Hex } from './Hex';
import {
  calculateLayout,
  axialToPixel,
  getRingAxialCoords,
} from '@/lib/geometry';

/**
 * Prosty hook do mierzenia wymiarów kontenera.
 * Przeniesiony z pierwotnego HexGrid.tsx.
 */
function useBounds<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBounds({ width, height });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, bounds };
}

/**
 * Główny komponent sceny, który renderuje siatkę heksagonów SVG.
 */
export const Stage: React.FC = () => {
  const { ref, bounds } = useBounds<HTMLDivElement>();
  
  // Pobranie danych i akcji ze store'u
  const hexes = useHexStore((s) => s.hexes);
  const payloads = useHexStore((s) => s.payloads);
  const setActiveHexId = useHexStore((s) => s.setActiveHexId);
  const openRecruitModal = useHexStore((s) => s.openRecruitModal);

  /**
   * Oblicza i memoizuje pozycje oraz rozmiary wszystkich heksów.
   * Uruchamia się ponownie tylko, gdy zmienią się wymiary kontenera.
   */
  const layoutData = useMemo(() => {
    const { width, height } = bounds;
    if (width === 0 || height === 0) return null;

    const layout = calculateLayout(width, height);
    const axialCoordsByRing: Record<number, [number, number][]> = {
      0: getRingAxialCoords(0),
      1: getRingAxialCoords(1),
      2: getRingAxialCoords(2),
      3: getRingAxialCoords(3),
    };

    let hexRingCounters: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

    const hexLayouts = hexes.map((hex) => {
      const ring = hex.ring;
      const index = hexRingCounters[ring]++;
      const axial = axialCoordsByRing[ring][index];

      if (!axial) {
        console.error(`Brak koordynatów dla hex ${hex.id} w pierścieniu ${ring}`);
        return null;
      }
      
      const [q, r] = axial;
      const { x: dx, y: dy } = axialToPixel(q, r, layout.size);
      
      return {
        id: hex.id,
        cx: layout.cx + dx,
        cy: layout.cy + dy,
        size: layout.size,
        ring: hex.ring,
        payload: payloads[hex.id] || {}, // Zapewnij pusty obiekt, jeśli payloadu brak
      };
    }).filter(Boolean); // Usuń nulle, jeśli wystąpił błąd

    return {
      viewBox: `0 0 ${layout.width} ${layout.height}`,
      hexLayouts,
    };

  }, [bounds, hexes, payloads]);

  return (
    <div ref={ref} className="relative w-full h-full">
      {layoutData && (
        <svg
          aria-label="FLOWer honeycomb"
          id="stage"
          role="img"
          viewBox={layoutData.viewBox}
          className="w-full h-full"
        >
          {/* Definicje gradientów i filtrów z flower.html */}
          <defs>
            <linearGradient id="faceGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--hex-cyan-1)" />
              <stop offset="100%" stopColor="var(--hex-cyan-2)" />
            </linearGradient>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="4"
                floodColor="#1fd6ff"
                floodOpacity=".22"
              />
            </filter>
          </defs>
          
          {/* Główna grupa renderująca heksy */}
          <g id="grid" filter="url(#glow)">
            {layoutData.hexLayouts.map((hex) => (
              <Hex
                key={hex.id}
                id={hex.id}
                cx={hex.cx}
                cy={hex.cy}
                size={hex.size}
                ring={hex.ring}
                payload={hex.payload as any} // 'as any' dla uproszczenia, store gwarantuje typ
                onClick={setActiveHexId}
                onDoubleClick={openRecruitModal}
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
};
