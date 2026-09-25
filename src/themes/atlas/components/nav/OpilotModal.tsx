import { useEffect, useRef, useState } from 'react';
import { useKeyPress } from '@/hooks/useKeyPress';
import { MODULES } from '@/data/content';

interface OpilotModalProps {
  open: boolean;
  onClose: () => void;
}

export function OpilotModal({ open, onClose }: OpilotModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useKeyPress('Escape', () => onClose());
  useKeyPress('k', () => {
    /* also handled by parent that toggles open */
  }, { cmd: true });

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  if (!open) return null;

  const matches = MODULES.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-6"
      style={{ background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-card bg-paper border border-hairline-strong overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a module…"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-mute"
          />
          <kbd className="text-[10px] font-mono border border-hairline-strong rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-auto">
          {matches.length === 0 ? (
            <li className="px-5 py-4 text-[13px] text-mute">No matches.</li>
          ) : (
            matches.map((m) => (
              <li key={m.id}>
                <a
                  href={m.external ? m.href ?? '#' : `#${m.id}`}
                  target={m.external ? '_blank' : undefined}
                  rel={m.external ? 'noopener' : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3 hover:bg-canvas-soft transition-colors"
                >
                  <div>
                    <div className="text-[14px] font-medium">{m.name}</div>
                    <div className="text-[12px] text-mute">{m.desc}</div>
                  </div>
                  <span className="font-mono text-[11px] text-mute">{m.external ? '↗' : `0${m.index}`}</span>
                </a>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center justify-between px-5 py-2 border-t border-hairline text-[10px] font-mono text-mute">
          <span>↑↓ to move · ↵ to select</span>
          <span>opilot · v0.1</span>
        </div>
      </div>
    </div>
  );
}