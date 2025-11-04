import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useHexStore } from "@/state/useHexStore";
import type { Hex as HexModel, HexPayload } from "@/types";
import { Hex as HexView } from "@/Hex";
import {
  calculateLayout,      // zwraca { size, cx, cy }
  getRingAxialCoords,   // generuje axial coords dla danego pierścienia
  axialToPixel,         // zamiana axial -> pixel, z uwzględnieniem stretch
} from "@/lib/geometry";

/**
 * Prosty hook do mierzenia rozmiaru kontenera (SVG viewport).
 */
function useBounds<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [bounds, setBounds] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

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

  return { ref, width: bounds.width, height: bounds.height };
}

/**
 * Zwraca mapę pozycji { [hexId]: { cx, cy } }:
 * - centrum → (layout.cx, layout.cy)
 * - pierścienie r=1..3 → korzystamy z getRingAxialCoords(r)
 *   i przypisujemy po indeksie z ID (rX-idx) do axial coords, a potem na piksele.
 */
function useHexPositions(
  hexes: HexModel[],
  stageW: number,
  stageH: number
): { size: number; centerX: number; centerY: number; positions: Record<string, { cx: number; cy: number }> } {
  // fallback rozmiar przy 0x0, żeby uniknąć dzielenia przez 0
  const w = Math.max(320, stageW || 0);
  const h = Math.max(240, stageH || 0);

  // bazowe parametry sceny (rozmiar jednego heksa i środek sceny)
  const base = calculateLayout(w, h); // { size, cx, cy }

  // prekomputacja axial coords dla pierścieni
  const ringAxials: Record<number, [number, number][]> = {
    0: [[0, 0]],
    1: getRingAxialCoords(1),
    2: getRingAxialCoords(2),
    3: getRingAxialCoords(3),
  };

  const positions: Record<string, { cx: number; cy: number }> = {};

  for (const hex of hexes) {
    if (hex.ring === 0) {
      positions[String(hex.id)] = { cx: base.cx, cy: base.cy };
      continue;
    }

    const ring = Number(hex.ring); // 1..3
    const axials = ringAxials[ring] || [];
    // ID ma postać r{ring}-{idx}, np. r2-7
    let idx = 0;
    const match = String(hex.id).match(/^r(\d+)-(\d+)$/);
    if (match) idx = Number(match[2]) || 0;

    // zabezpieczenie modulo (gdyby idx > liczba pól w pierścieniu)
    const [q, r] = axials.length ? axials[idx % axials.length] : [0, 0];
    const { x, y } = axialToPixel(q, r, base.size);

    positions[String(hex.id)] = {
      cx: base.cx + x,
      cy: base.cy + y,
    };
  }

  return {
    size: base.size,
    centerX: base.cx,
    centerY: base.cy,
    positions,
  };
}

/**
 * Scena heksów w SVG – renderuje wszystkie heksy z pozycjami wyliczonymi przez geometry.
 */
export const Stage: React.FC = () => {
  const { ref, width, height } = useBounds<HTMLDivElement>();

  // dane z store (typowane)
  const hexes = useHexStore((s) => s.hexes) as HexModel[];
  const payloads = useHexStore((s) => s.payloads) as Record<string, HexPayload>;
  const setActiveHexId = useHexStore((s) => s.setActiveHexId);
  const openRecruitModal = useHexStore((s) => s.openRecruitModal);

  // layout + mapowanie pozycji
  const layout = useMemo(() => useHexPositions(hexes, width, height), [hexes, width, height]);

  return (
    <div ref={ref} className="h-full w-full">
      <svg
        role="img"
        aria-label="FLOWer Stage"
        width="100%"
        height="100%"
        viewBox={`0 0 ${Math.max(1, width)} ${Math.max(1, height)}`}
      >
        {/* Heksy */}
        {hexes.map((hex: HexModel) => {
          const pos = layout.positions[String(hex.id)];
          const cx = pos?.cx ?? layout.centerX;
          const cy = pos?.cy ?? layout.centerY;
          const size = layout.size;

          // payload z domyślnymi wartościami (bez castów na unknown)
          const payload: HexPayload =
            payloads[hex.id] ??
            {
              title: "",
              status: "To Do",
              ring: hex.ring,
              links: [],
              kanban: { todo: [], doing: [], done: [] },
              chat: [],
            };

          const isCenter = hex.ring === 0;

          return (
            <HexView
              key={String(hex.id)}
              id={String(hex.id)}
              cx={cx}
              cy={cy}
              size={size}
              ring={hex.ring}
              payload={payload}
              onClick={() => {
                setActiveHexId(hex.id);
                if (!isCenter) openRecruitModal(hex.id);
              }}
              onDoubleClick={() => {
                setActiveHexId(hex.id);
                openRecruitModal(hex.id);
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
