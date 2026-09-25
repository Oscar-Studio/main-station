import DotField from '@/components/effects/DotField/DotField';
import Magnet from '@/components/effects/Magnet/Magnet';
import ClickSpark from '@/components/effects/ClickSpark/ClickSpark';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { TOOLS } from '@/data/content';
import { cn } from '@/lib/cn';
import type { ReactElement } from 'react';

const ICON_MAP: Record<string, ReactElement> = {
  calc: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <rect x="6" y="5" width="12" height="3" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      <circle cx="15" cy="12" r="0.8" fill="currentColor" />
      <circle cx="9" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
      <circle cx="15" cy="15" r="0.8" fill="currentColor" />
      <circle cx="9" cy="18" r="0.8" fill="currentColor" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" />
      <circle cx="15" cy="18" r="0.8" fill="currentColor" />
    </svg>
  ),
  dice: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" />
      <path d="M9 3h6" />
    </svg>
  ),
  stopwatch: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" />
      <path d="M10 3h4" />
      <path d="M12 3v3" />
    </svg>
  ),
  group: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M14 20c0-2 1.5-3.5 4-3.5" />
    </svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="11" rx="2" />
      <path d="M3 19h18" />
      <path d="M8 12h2M12 12h2M16 12h0" />
    </svg>
  ),
  notebook: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 3h11a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V3z" />
      <path d="M5 19a2 2 0 0 1 2-2h11" />
      <line x1="9" y1="7" x2="14" y2="7" />
      <line x1="9" y1="11" x2="14" y2="11" />
      <line x1="9" y1="15" x2="12" y2="15" />
    </svg>
  ),
};

export function ModuleTeaching() {
  return (
    <section id="teaching" className="relative py-32 overflow-hidden" data-module="1">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <DotField
          dotRadius={1.4}
          dotSpacing={32}
          cursorRadius={120}
          bulgeStrength={20}
          gradientFrom="rgba(61, 90, 254, 0.14)"
          gradientTo="rgba(61, 90, 254, 0.04)"
          disableGlow
        />
      </div>

      <div className="relative max-w-container mx-auto px-8 w-full">
        <Reveal>
          <div className="mb-16">
            <span className="mono-label">02 — TEACHING</span>
            <h2 className="mt-6 font-display text-display-lg font-semibold tracking-[-0.03em] leading-[0.95]">
              Tools that make
              <br />
              <em className="italic font-serif">the abstract concrete.</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.name} delay={i * 50}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-16 flex items-end justify-between flex-wrap gap-6">
            <div className="flex items-baseline gap-3">
              <CountUp to={17} className="font-display text-[64px] font-medium leading-none" />
              <span className="text-[40px] font-display text-accent leading-none">+</span>
              <span className="text-[14px] text-mute ml-2">teaching instruments, all in HTML</span>
            </div>
            <a
              href="https://edu.oscarstudio.cn"
              target="_blank"
              rel="noopener"
              data-cursor="Open"
              className="link-arrow"
            >
              Open Teaching Tools <span>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

interface ToolCardProps {
  tool: { name: string; desc: string; icon: string; featured?: boolean };
}

function ToolCard({ tool }: ToolCardProps) {
  const featured = !!tool.featured;
  const icon = ICON_MAP[tool.icon] ?? null;

  const inner = (
    <div
      className={cn(
        'relative rounded-card border h-full p-6 flex flex-col gap-6 overflow-hidden transition-all duration-500',
        featured
          ? 'bg-ink text-paper border-ink hover:shadow-[0_0_60px_rgba(61,90,254,0.18)]'
          : 'bg-canvas-soft border-hairline hover:border-hairline-strong hover:-translate-y-1',
      )}
    >
      <div className={cn('flex items-center justify-between', featured ? 'text-paper' : 'text-ink')}>
        <div className="opacity-80">{icon}</div>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-70">
          {featured ? 'featured' : 'tool'}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-display text-[22px] font-medium tracking-[-0.02em] mb-3">{tool.name}</h3>
        <p className={cn('text-[13px] leading-relaxed', featured ? 'text-paper/70' : 'text-mute')}>
          {tool.desc}
        </p>
      </div>
      <div className={cn('font-mono text-[10px] tracking-[0.14em] uppercase opacity-50')}>
        edu.oscarstudio.cn / {tool.icon}
      </div>
    </div>
  );

  // Magnet wraps the card for subtle hover-follow
  const magnetWrap = (
    <Magnet padding={40} magnetStrength={4} className="block h-full" style={{ width: '100%' }}>
      {inner}
    </Magnet>
  );

  if (featured) {
    // Featured card: ClickSpark burst on click, Magnet hover-follow.
    // (ElectricBorder removed per design feedback — the live border felt busy.)
    return (
      <ClickSpark sparkColor="#FFFFFF" sparkCount={10} sparkRadius={22}>
        {magnetWrap}
      </ClickSpark>
    );
  }

  return magnetWrap;
}