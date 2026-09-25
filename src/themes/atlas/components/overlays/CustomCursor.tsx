import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';

// Smooth-follow cursor with hover label. Ported from crazy/2 initCustomCursor.
export function CustomCursor() {
  const fine = useFinePointer();
  const pos = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const [label, setLabel] = useState('');
  const [hover, setHover] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    if (!fine) return;
    visible.current = true;

    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      // find data-cursor label on the element under cursor
      let target = e.target as HTMLElement | null;
      let found = false;
      while (target && target !== document.body) {
        const c = target.getAttribute('data-cursor');
        if (c) {
          setLabel(c);
          setHover(true);
          found = true;
          break;
        }
        target = target.parentElement;
      }
      if (!found) {
        setLabel('');
        setHover(false);
      }
    };
    const onLeave = () => {
      visible.current = false;
      setLabel('');
      setHover(false);
    };

    let raf = 0;
    const loop = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.18;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.18;
      const el = document.getElementById('cursor');
      const lbl = document.getElementById('cursorLabel');
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (lbl) lbl.textContent = label;
      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [fine, label]);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add('has-cursor');
    return () => document.documentElement.classList.remove('has-cursor');
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          html.has-cursor, html.has-cursor * { cursor: none !important; }
        }
      `}</style>
      <div
        id="cursor"
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hover ? 56 : 16,
          height: hover ? 56 : 16,
          borderRadius: 9999,
          border: '1px solid var(--ink)',
          background: hover ? 'var(--ink)' : 'transparent',
          color: hover ? 'var(--paper)' : 'var(--ink)',
          pointerEvents: 'none',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.25s ease, height 0.25s ease, background 0.25s ease, color 0.25s ease',
        }}
      >
        <span
          id="cursorLabel"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
      </div>
    </>
  );
}