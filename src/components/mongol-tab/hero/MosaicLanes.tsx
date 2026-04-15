'use client';

import type { MongolMovie } from '@/lib/types';
import { SIZE_PATTERN } from './constants';

export type HeroLane = {
  items: MongolMovie[];
  dir: 'left' | 'right';
  speed: string;
  rowH: string;
  offset: number;
};

export function HeroMosaicLanes({ lanes }: { lanes: readonly HeroLane[] }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '-30% -20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px',
        transform: 'rotate(-6deg)',
        zIndex: 1,
      }}
    >
      {lanes.map((lane, ri) => (
        <div key={ri} style={{ overflow: 'hidden', flexShrink: 0 }}>
          <div className={`ms-track ms-${lane.dir}`} style={{ '--spd': lane.speed } as React.CSSProperties}>
            {lane.items.map((m, i) => {
              const sz = SIZE_PATTERN[(i + lane.offset * 3) % SIZE_PATTERN.length];
              const src = m.preview || m.poster;
              return (
                <div key={`${ri}-${i}`} className="ms-card" style={{ width: sz.w, height: lane.rowH }}>
                  <img src={src} alt="" loading="lazy" draggable={false} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

