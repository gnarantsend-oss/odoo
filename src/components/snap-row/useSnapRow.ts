import { useCallback, useEffect, useRef, useState } from 'react';

export function useSnapRowObserver(deps: { itemIds: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const ratioMap = useRef<Map<string, number>>(new Map());

  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();
    ratioMap.current.clear();

    const el = scrollRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.id;
          if (id) ratioMap.current.set(id, entry.intersectionRatio);
        });

        let bestId: string | null = null;
        let bestRatio = 0;
        ratioMap.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId !== null && bestRatio > 0.3) setActiveId(bestId);
      },
      {
        root: el,
        rootMargin: '0px -20% 0px -20%',
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      },
    );

    el.querySelectorAll<HTMLElement>('[data-id]').forEach((card) => {
      observerRef.current!.observe(card);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(setupObserver, 100);
    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupObserver, deps.itemIds.join('|')]);

  return { scrollRef, activeId };
}

export function useSnapRowDragScroll(scrollRef: React.RefObject<HTMLDivElement | null>) {
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = 'grabbing';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!drag.current.active || !el) return;
    const dx = Math.abs(e.clientX - drag.current.startX);
    if (dx > 6) {
      drag.current.moved = true;
      if (!el.hasPointerCapture(e.pointerId)) {
        el.setPointerCapture(e.pointerId);
      }
      el.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX);
    }
  };

  const onPointerUp = () => {
    drag.current.active = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = 'grab';
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return { onPointerDown, onPointerMove, onPointerUp, onClickCapture };
}

