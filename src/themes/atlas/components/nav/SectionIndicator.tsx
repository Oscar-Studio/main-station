import { useEffect, useState } from 'react';
import { MODULES } from '@/data/content';
import { useSectionActive } from '@/hooks/useSectionActive';
import { cn } from '@/lib/cn';

export function SectionIndicator() {
  const active = useSectionActive(MODULES.map((m) => m.id));
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      const start = document.getElementById('section-index');
      const end = document.getElementById('closing');
      if (!start || !end) return;
      const startRect = start.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();
      const vh = window.innerHeight;
      // Show only while start is above viewport AND end is below
      setShown(startRect.top < vh * 0.5 && endRect.top > vh * 0.5);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <aside
      aria-hidden
      className={cn(
        'fixed left-6 top-1/2 -translate-y-1/2 z-40 transition-opacity duration-500 ease-snap',
        'hidden md:block',
        shown ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      <ul className="flex flex-col gap-5">
        {MODULES.map((m, i) => {
          const cursor = m.cursor ?? String(i + 1).padStart(2, '0');
          const href = m.external ? m.href ?? '#' : `#${m.id}`;
          return (
            <li key={m.id}>
              <a
                href={href}
                target={m.external ? '_blank' : undefined}
                rel={m.external ? 'noopener' : undefined}
                data-cursor={cursor}
                className={cn(
                  'flex items-center gap-3 group',
                  'text-[11px] font-mono tracking-[0.14em] uppercase',
                  !m.external && active === i ? 'text-ink' : 'text-mute hover:text-ink',
                )}
              >
                <span
                  className={cn(
                    'transition-all duration-300',
                    !m.external && active === i ? 'w-6 h-px bg-ink' : 'w-3 h-px bg-hairline-strong group-hover:w-6 group-hover:bg-ink',
                  )}
                />
                <span className="text-[10px] text-mute mr-1">
                  0{i + 1}
                </span>
                <span>{m.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}