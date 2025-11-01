// Klonstale geometryczne przeniesione z flower.html
const HEX_STRETCH_X = 1.28;
const HEX_STRETCH_Y = 0.836;
const STATUS_LIFT = 0.52; // Pionowe przesunięcie kropki statusu

// Domyślne wymiary, jeśli kontener jeszcze nie jest zmierzony
const DEFAULT_W = 1000;
const DEFAULT_H = 800;

/**
 * Oblicza optymalny układ (rozmiar heksa i środek) na podstawie wymiarów kontenera.
 * Logika bazuje na funkcji layout() z flower.html.
 */
export const calculateLayout = (width: number, height: number) => {
  const W = width || DEFAULT_W;
  const H = height || DEFAULT_H;
  const MARGIN_X = 70, MARGIN_Y = 52, FIT_SCALE = 0.95;

  // Obliczenia heurystyczne dla 3 pierścieni (centrum + 3 = promień 3)
  // 7 szerokości (1.5 * 2 dla pierścienia 3 + 1 dla centrum, w przybliżeniu)
  const sizeByW = (W - MARGIN_X * 2) / ((7 * 1.5) * HEX_STRETCH_X);
  // 7 wysokości (sqrt(3)/2 * 2 dla pierścienia 3 + 1 dla centrum, w przybliżeniu)
  const sizeByH = (H - MARGIN_Y * 2) / (7 * (Math.sqrt(3) / 2) * HEX_STRETCH_Y);

  let size = Math.min(sizeByW, sizeByH) * FIT_SCALE;
  size = Math.max(32, Math.min(size, 84)); // Ograniczenie rozmiaru min/max

  return {
    width: W,
    height: H,
    size: size,
    cx: W / 2,
    cy: H / 2,
  };
};

/**
 * Generuje 6 punktów wielokąta dla heksagonu (flat-top).
 * Uwzględnia rozciąganie X i Y.
 */
export const getHexPoints = (cx: number, cy: number, size: number): string => {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (60 * i) * Math.PI / 180;
    const x = cx + (size * HEX_STRETCH_X) * Math.cos(angle);
    const y = cy + (size * HEX_STRETCH_Y) * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
};

/**
 * Oblicza pozycję kropki statusu.
 */
export const getStatusDotPosition = (cx: number, cy: number, size: number) => {
  return {
    cx: cx,
    cy: cy - size * HEX_STRETCH_Y * STATUS_LIFT,
    r: 12, // Statyczny promień kropki z flower.html
  };
};

/**
 * Konwertuje współrzędne osiowe (axial) na piksele (środek heksa).
 * Uwzględnia rozciąganie.
 */
export const axialToPixel = (q: number, r: number, size: number) => {
  const x = (size * HEX_STRETCH_X) * (1.5 * q);
  const y = (size * HEX_STRETCH_Y) * (Math.sqrt(3) * r + (Math.sqrt(3) / 2) * q);
  return { x, y };
};

/**
 * Generuje współrzędne osiowe dla pełnego pierścienia o danym promieniu.
 * (q, r)
 */
export const getRingAxialCoords = (radius: number): [number, number][] => {
  if (radius === 0) return [[0, 0]];
  
  const results: [number, number][] = [];
  let q = 0, r = -radius;
  
  // Kierunki (zgodnie z ruchem wskazówek zegara, zaczynając od góry)
  const dirs: [number, number][] = [[+1, 0], [0, +1], [-1, +1], [-1, 0], [0, -1], [+1, -1]];
  
  for (let side = 0; side < 6; side++) {
    const [dq, dr] = dirs[side];
    for (let step = 0; step < radius; step++) {
      results.push([q, r]);
      q += dq;
      r += dr;
    }
  }
  return results;
};
