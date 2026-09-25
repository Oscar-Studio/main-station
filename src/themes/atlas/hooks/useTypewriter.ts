import { useEffect, useState } from 'react';

// Async typewriter — type out a string char-by-char with optional onDone callback.
export function useTypewriter(text: string, opts?: { speed?: number; delay?: number; enabled?: boolean }): string {
  const speed = opts?.speed ?? 22;
  const delay = opts?.delay ?? 600;
  const enabled = opts?.enabled ?? true;
  const [shown, setShown] = useState('');

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      return;
    }
    setShown('');
    let i = 0;
    let cancelled = false;
    const startTimer = setTimeout(() => {
      if (cancelled) return;
      const tick = () => {
        if (cancelled) return;
        i++;
        setShown(text.slice(0, i));
        if (i < text.length) {
          setTimeout(tick, speed);
        }
      };
      tick();
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [text, speed, delay, enabled]);

  return shown;
}