import React from 'react';
import type { HexPayload } from '@/state/types';
import { getHexPoints, getStatusDotPosition } from '@/lib/geometry';

interface HexProps {
  id: string;
  cx: number;
  cy: number;
  size: number;
  ring: number; // 0=center, 1..3=rings
  payload: HexPayload;
  onClick: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

/** Kolor kropki statusu. */
const getStatusColor = (status: HexPayload['status']): string => {
  switch (status) {
    case 'Done':
      return 'var(--status-green)';
    case 'In Progress':
      return 'var(--status-orange)';
    case 'To Do':
    default:
      return 'var(--status-red)';
  }
};

export const Hex: React.FC<HexProps> = ({
  id,
  cx,
  cy,
  size,
  ring,
  payload,
  onClick,
  onDoubleClick,
}) => {
  const points = getHexPoints(cx, cy, size);
  const { cx: dotCx, cy: dotCy, r: dotR } = getStatusDotPosition(cx, cy, size);

  const isCenter = ring === 0;
  const isRing2 = ring === 2; // P2 = błękitny
  const statusColor = getStatusColor(payload.status);

  // Twarz i etykiety
  const faceCls = (isCenter || isRing2) ? 'face face--cyan' : 'face face--deep';
  const labelCls = isCenter
    ? 'label label--onCyan label--large'
    : (isRing2 ? 'label label--onCyan' : 'label label--onDeep');

  // Krawędzie (dla P2 zostawiamy tę samą klasę edge, ale można dopalić wariantem)
  const edgeCls = `edge ${isRing2 ? 'edge--ring2' : ''}`;

  const title = payload.title || 'Hex';
  const displayTitle = title.length > 15 ? `${title.substring(0, 14)}…` : title;
  const ringTag = isCenter ? '' : `[P${ring}]`;

  return (
    <g
      className="hex"
      data-id={id}
      onClick={() => onClick(id)}
      onDoubleClick={() => onDoubleClick(id)}
    >
      {/* Wypełnienie */}
      <polygon className={faceCls} points={points} />

      {/* Obramowanie */}
      <polygon
        className={edgeCls}
        points={points}
        vectorEffect="non-scaling-stroke"
      />

      {/* Kropka statusu */}
      {!isCenter && (
        <circle
          className="s-dot"
          cx={dotCx}
          cy={dotCy}
          r={dotR}
          fill={statusColor}
        />
      )}

      {/* Etykiety */}
      <text className={labelCls} x={cx} y={cy + (isCenter ? 2 : -2)}>
        {displayTitle}
      </text>
      {!isCenter && (
        <text className={labelCls} x={cx} y={cy + 16} fontSize="12px" opacity="0.7">
          {ringTag}
        </text>
      )}
    </g>
  );
};
