import { useEffect } from 'react';

export type KeyHandler = (e: KeyboardEvent) => void;

// Calls handler when the named key (or ⌘K / Ctrl+K shortcut) is pressed.
export function useKeyPress(key: string | string[], handler: KeyHandler, opts?: { cmd?: boolean; meta?: boolean }) {
  useEffect(() => {
    const keys = Array.isArray(key) ? key : [key];
    const cmd = opts?.cmd ?? false;
    const meta = opts?.meta ?? false;

    const onKey = (e: KeyboardEvent) => {
      if (cmd && !(e.metaKey || e.ctrlKey)) return;
      if (meta && !e.metaKey) return;
      if (keys.includes(e.key)) handler(e);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [key, handler, opts?.cmd, opts?.meta]);
}