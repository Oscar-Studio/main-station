import { useEffect, useState } from 'react';

// Returns the index of the section currently most visible.
// Pass an array of element ids in document order.
export function useSectionActive(ids: readonly string[]): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;
    const ratios = new Map<number, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = elements.indexOf(e.target as HTMLElement);
          if (idx >= 0) ratios.set(idx, e.intersectionRatio);
        }
        let best = 0;
        let bestVal = -1;
        ratios.forEach((v, k) => {
          if (v > bestVal) {
            bestVal = v;
            best = k;
          }
        });
        if (bestVal > 0) setActive(best);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}