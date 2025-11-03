// src/components/hex/Stage.tsx
import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useHexStore } from '@/state/useHexStore';
import { Hex } from './Hex';
import {
  calculateLayout,
  axialToPixel,
  getRingAxialCoords,
} from '@/lib/geometry';

/** Pomiar rozmiaru kontenera (bez ryzyka null). */
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

type HexLayout = {
  id: number | string;
  cx: number;
  cy: number;
  size: number;
  ring: number;
  payload: Record<string, unknown>;
};

type LayoutData =
  | { viewBox: string; hexLayouts: HexLayout[] }
  | null;

/** Główna scena SVG z siatką heksów. */
export const Stage: React.FC = () => {
  const { ref, bounds } = useBounds<HTMLDivElement>();

  // Store
  const hexes = useHexStore((s) => s.hexes);
  const payloads = useHexStore((s) => s.payloads);
  const setActiveHexId = useHexStore((s) => s.setActiveHexId);
  const openRecruitModal = useHexStore((s) => s.openRecruitModal);

  /** Obliczenie pozycji heksów dla aktualnych wymiarów sceny. */
  const layoutData: LayoutData = useMemo(() => {
    const { width, height } = bounds;
    if (!width || !height) return null;

    const layout = calculateLayout(width, height);

    const rings = {
      0: getRingAxialCoords(0),
      1: getRingAxialCoords(1),
      2: getRingAxialCoords(2),
      3: getRingAxialCoords(3),
    } as const;

    const ringCounters: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

    const hexLayouts = hexes
      .map<HexLayout | null>((hex) => {
        const ring = hex.ring as 0 | 1 | 2 | 3;
        const index = ringCounters[ring]++;
        const axial = rings[ring][index];

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
          ring,
          payload: (payloads[hex.id] as Record<string, unknown>) ?? {},
        };
      })
      .filter((h): h is HexLayout => h !== null);

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
          {/* Gradienty + delikatna poświata */}
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

          {/* Siatka heksów */}
          <g id="grid" filter="url(#glow)">
            {layoutData.hexLayouts.map((h) => (
              <Hex
                key={h.id}
                id={h.id}
                cx={h.cx}
                cy={h.cy}
                size={h.size}
                ring={h.ring}
                payload={h.payload}
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
