import { useEffect, useRef } from 'react';

// Adds `.in` to the element when 12% visible (matches crazy/2 initReveals).
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts?: { threshold?: number; once?: boolean }) {
  const ref = useRef<T | null>(null);
  const threshold = opts?.threshold ?? 0.12;
  const once = opts?.once ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('in');
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            (entry.target as HTMLElement).classList.remove('in');
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return ref;
}