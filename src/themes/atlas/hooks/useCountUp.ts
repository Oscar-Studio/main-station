import { useEffect, useRef, useState } from 'react';

// Animate a numeric counter from 0 to target with cubic ease-out.
export function useCountUp(target: number, opts?: { duration?: number; decimals?: number }): number {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = elRef.current;
    if (!el) return;
    if (started.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started.current) continue;
          started.current = true;
          const duration = opts?.duration ?? 1400;
          const decimals = opts?.decimals ?? 0;
          const start = performance.now();
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const v = target * ease(t);
            setVal(decimals > 0 ? Number(v.toFixed(decimals)) : Math.round(v));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, opts?.duration, opts?.decimals]);

  return val;
}

// Helper to wire a count-up to a span/element ref.
export function useCountUpRef<T extends HTMLElement>(target: number, opts?: { duration?: number; decimals?: number }) {
  const value = useCountUp(target, opts);
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = value.toString();
  }, [value]);
  return ref;
}