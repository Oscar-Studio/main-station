import { useEffect, useState } from 'react';

// True when the device has a fine pointer (mouse / trackpad) — matches crazy/2
// initCustomCursor gating.
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return fine;
}