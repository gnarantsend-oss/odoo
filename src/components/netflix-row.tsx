'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetflixRowProps {
  title: string;
  children: React.ReactNode;
  count: number;
}

export function NetflixRow({ title, children, count }: NetflixRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  if (count === 0) return null;

  return (
    <section className="mb-10 group/row">
      <h2 className="px-4 md:px-12 mb-3 text-sm md:text-base font-semibold
                     text-white/80 tracking-wide flex items-center gap-2
                     hover:text-primary transition-colors cursor-default">
        {title}
        <ChevronRight className="w-4 h-4 opacity-0 group-hover/row:opacity-100 -translate-x-1 group-hover/row:translate-x-0 transition-all text-primary" />
      </h2>

      <div className="relative">
        {/* Left fade edge */}
        <div className={cn(
          'absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none',
          'bg-gradient-to-r from-background to-transparent',
          'transition-opacity duration-300',
          !canLeft && 'opacity-0'
        )} />

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9',
            'flex items-center justify-center rounded-full',
            'bg-background/80 backdrop-blur border border-white/10',
            'hover:bg-background hover:border-primary/40 hover:scale-110',
            'transition-all duration-200 shadow-lg',
            'opacity-0 group-hover/row:opacity-100',
            !canLeft && 'pointer-events-none !opacity-0'
          )}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 md:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        {/* Right fade edge */}
        <div className={cn(
          'absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none',
          'bg-gradient-to-l from-background to-transparent',
          'transition-opacity duration-300',
          !canRight && 'opacity-0'
        )} />

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9',
            'flex items-center justify-center rounded-full',
            'bg-background/80 backdrop-blur border border-white/10',
            'hover:bg-background hover:border-primary/40 hover:scale-110',
            'transition-all duration-200 shadow-lg',
            'opacity-0 group-hover/row:opacity-100',
            !canRight && 'pointer-events-none !opacity-0'
          )}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </section>
  );
}

export function NetflixCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-none w-[28vw] sm:w-[18vw] md:w-[14vw] lg:w-[11vw] xl:w-[9.5vw] min-w-[110px] max-w-[180px]">
      {children}
    </div>
  );
}
