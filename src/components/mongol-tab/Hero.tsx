import type { MongolMovie } from '@/lib/types';
import { HERO_CSS } from './hero/styles';
import { HeroMosaicLanes, type HeroLane } from './hero/MosaicLanes';
import { HeroOverlays } from './hero/Overlays';
import { HeroTitleBlock } from './hero/TitleBlock';
import { HeroScrollHint } from './hero/ScrollHint';

const HERO_POOL_SIZE = 36;
const LANE_ITEM_CAP = 24;

export function Hero({ movies }: { movies: MongolMovie[] }) {
  // Keep hero payload small for fast first paint.
  const all = movies
    .filter((m) => m.category !== 'trailer')
    .slice(0, HERO_POOL_SIZE);
  const n = all.length;

  const makeLane = (offset: number) => {
    if (!n) return [];
    const shifted = [...all.slice(offset % n), ...all.slice(0, offset % n)];
    return [...shifted, ...shifted].slice(0, LANE_ITEM_CAP);
  };

  const lanes: readonly HeroLane[] = [
    { items: makeLane(0), dir: 'left', speed: '62s', rowH: '160px', offset: 0 },
    { items: makeLane(Math.floor(n * 0.18)), dir: 'right', speed: '48s', rowH: '185px', offset: 1 },
    { items: makeLane(Math.floor(n * 0.36)), dir: 'left', speed: '55s', rowH: '160px', offset: 2 },
    { items: makeLane(Math.floor(n * 0.54)), dir: 'right', speed: '70s', rowH: '175px', offset: 3 },
    { items: makeLane(Math.floor(n * 0.72)), dir: 'left', speed: '50s', rowH: '160px', offset: 4 },
  ] as const;

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 62px)',
        overflow: 'hidden',
        background: '#080b18',
      }}
    >
      <style>{HERO_CSS}</style>

      <HeroMosaicLanes lanes={lanes} />
      <HeroOverlays />
      <HeroTitleBlock />
      <HeroScrollHint />
    </section>
  );
}

