import { useEffect, useState } from 'react';

// Tracks current Date at ~1Hz. Same value across components in a frame.
let sharedNow = Date.now();
let timerId: ReturnType<typeof setInterval> | null = null;
const subscribers = new Set<() => void>();

function ensureTimer() {
  if (timerId != null) return;
  timerId = setInterval(() => {
    sharedNow = Date.now();
    subscribers.forEach((cb) => cb());
  }, 1000);
}

export function useNow(): Date {
  const [, setTick] = useState(0);
  useEffect(() => {
    ensureTimer();
    const cb = () => setTick((t) => (t + 1) | 0);
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
      if (subscribers.size === 0 && timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };
  }, []);
  return new Date(sharedNow);
}