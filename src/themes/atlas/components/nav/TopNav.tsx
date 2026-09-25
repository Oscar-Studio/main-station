import { useState } from 'react';
import { NAV_LINKS, SITE } from '@/data/content';
import { formatTimeHMS } from '@/lib/clock';
import { useNow } from '@/hooks/useClock';
import { useScrollY } from '@/hooks/useScrollProgress';
import { useSectionActive } from '@/hooks/useSectionActive';
import { MODULES } from '@/data/content';
import { UserButton } from '@/components/auth/UserButton';
import { cn } from '@/lib/cn';

interface TopNavProps {
  onOpenOpilot: () => void;
}

export function TopNav({ onOpenOpilot }: TopNavProps) {
  const now = useNow();
  const y = useScrollY();
  const scrolled = y > 24;
  const active = useSectionActive(MODULES.map((m) => m.id));
  const [time] = useState(formatTimeHMS(now));

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-snap',
        scrolled
          ? 'bg-[var(--bg-card)] backdrop-blur-xl border-b border-hairline'
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <div className="max-w-container-wide mx-auto px-8 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-8">
        <a href="#hero" data-cursor="Studio" className="flex items-center gap-3 group">
          <span
            aria-hidden
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: 'var(--accent)',
              display: 'inline-block',
              animation: 'markPulse 2s ease-in-out infinite',
            }}
          />
          <span className="font-medium tracking-tight text-[15px]">{SITE.brand}</span>
        </a>

        <ul className="hidden md:flex items-center gap-7 justify-center">
          {NAV_LINKS.map((link, i) => {
            const isModule = link.href.startsWith('#');
            const isActive =
              isModule && active === MODULES.findIndex((m) => `#${m.id}` === link.href);
            return (
              <li key={link.href} className="relative">
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    data-cursor={link.cursor}
                    className="text-[13px] text-mute hover:text-ink transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    href={link.href}
                    data-cursor={link.cursor}
                    className={cn(
                      'relative text-[13px] transition-colors duration-300',
                      isActive ? 'text-ink' : 'text-mute hover:text-ink',
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 right-0 h-px bg-ink origin-left transition-transform duration-300',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </a>
                )}
                {/* keep TS happy with index */}
                {i < 0 && null}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 justify-end">
          <button
            onClick={onOpenOpilot}
            data-cursor="Search"
            className="hidden md:inline-flex items-center gap-2 rounded-pill border border-hairline-strong px-3 py-1.5 text-[12px] font-mono text-mute hover:text-ink hover:border-ink transition-colors duration-300"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search</span>
            <kbd className="text-[10px] border border-hairline-strong rounded px-1.5 py-0.5 ml-1">⌘K</kbd>
          </button>
          <div className="font-mono text-[12px] text-mute hidden md:block">{formatTimeHMS(now)}</div>
          <UserButton />
          {/* suppress unused warning */}
          <span className="hidden">{time}</span>
        </div>
      </div>
    </nav>
  );
}