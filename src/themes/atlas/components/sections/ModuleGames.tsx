import DotField from '@/components/effects/DotField/DotField';
import { Reveal } from '@/components/ui/Reveal';
import { GAMES, LEADERBOARD } from '@/data/content';
import { cn } from '@/lib/cn';

export function ModuleGames() {
  return (
    <section id="games" className="relative py-32 overflow-hidden" data-module="3">
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
            <span className="mono-label">04 — GAMES</span>
            <h2 className="mt-6 font-display text-display-lg font-semibold tracking-[-0.03em] leading-[0.95]">
              Quiet puzzles
              <br />
              <em className="italic font-serif">for restless evenings.</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GAMES.map((g, i) => (
              <Reveal key={g.name} delay={i * 60}>
                <a
                  href={g.href}
                  target="_blank"
                  rel="noopener"
                  data-cursor="Play"
                  className="group block rounded-card border border-hairline bg-canvas-soft p-6 hover:border-hairline-strong hover:-translate-y-1 transition-all duration-500"
                >
                  <GameVisual kind={g.visual} />
                  <div className="mt-6">
                    <h4 className="font-display text-[18px] font-medium tracking-[-0.02em] mb-1">
                      {g.name}
                    </h4>
                    <p className="text-[13px] text-mute leading-relaxed">{g.desc}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <aside className="rounded-card border border-hairline bg-canvas-soft p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] text-mute tracking-[0.14em] uppercase">
                  Live · Top players
                </span>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    background: 'var(--green)',
                    animation: 'dotPulse 2s ease-in-out infinite',
                  }}
                />
              </div>
              <ol className="space-y-1">
                {LEADERBOARD.map((row, i) => (
                  <li
                    key={row.rank}
                    className={cn(
                      'flex items-center gap-3 py-2 border-b border-hairline last:border-0',
                      'opacity-0 translate-y-2',
                    )}
                    style={{
                      animation: `fadeIn 0.5s ${i * 0.05}s cubic-bezier(0.22,1,0.36,1) forwards`,
                    }}
                  >
                    <span className="font-mono text-[11px] text-mute w-6">{row.rank}</span>
                    <span className="flex-1 text-[14px]">{row.name}</span>
                    <span className="font-mono text-[12px] text-ink">{row.score}</span>
                  </li>
                ))}
              </ol>
              <a
                href="https://games.oscarstudio.cn"
                target="_blank"
                rel="noopener"
                data-cursor="Open"
                className="link-arrow mt-6 inline-flex"
              >
                All leaderboards <span>→</span>
              </a>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function GameVisual({ kind }: { kind: string }) {
  if (kind === 'xiangqi') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-32 text-ink">
        <rect x="2" y="2" width="116" height="116" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="2" y1="60" x2="118" y2="60" stroke="currentColor" strokeWidth="0.5" />
        <line x1="60" y1="2" x2="60" y2="118" stroke="currentColor" strokeWidth="0.5" />
        <g>
          <circle cx="30" cy="30" r="8" fill="currentColor" />
          <circle cx="90" cy="90" r="8" fill="currentColor" />
        </g>
        <g style={{ color: 'var(--accent)' }}>
          <circle cx="30" cy="90" r="8" fill="currentColor" />
          <circle cx="90" cy="30" r="8" fill="currentColor" />
        </g>
      </svg>
    );
  }
  if (kind === 'gomoku') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-32 text-ink">
        <g stroke="currentColor" strokeWidth="0.5">
          {[10, 30, 50, 70, 90, 110].map((y) => (
            <line key={`h${y}`} x1="10" y1={y} x2="110" y2={y} />
          ))}
          {[10, 30, 50, 70, 90, 110].map((x) => (
            <line key={`v${x}`} x1={x} y1="10" x2={x} y2="110" />
          ))}
        </g>
        <g>
          <circle cx="30" cy="30" r="5" fill="currentColor" />
          <circle cx="70" cy="70" r="5" fill="currentColor" />
          <circle cx="90" cy="50" r="5" fill="currentColor" />
        </g>
        <g style={{ color: 'var(--accent)' }}>
          <circle cx="50" cy="50" r="5" fill="currentColor" />
          <circle cx="30" cy="90" r="5" fill="currentColor" />
        </g>
      </svg>
    );
  }
  if (kind === 'twentyfour') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-32 text-ink">
        <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="70" y="10" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="70" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="70" y="70" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="30" y="36" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="18" fill="currentColor">3</text>
        <text x="90" y="36" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="18" fill="currentColor">8</text>
        <text x="30" y="96" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="18" fill="currentColor">3</text>
        <text x="90" y="96" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="18" fill="var(--accent)">8</text>
        <text x="60" y="68" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="22" fill="currentColor">=</text>
      </svg>
    );
  }
  if (kind === 'tt2048') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-32 text-ink">
        <rect x="6" y="6" width="108" height="108" rx="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
        {[
          [14, 14, 0.15], [42, 14, 0.3], [70, 14, 0.5],
          [14, 42, 0.2], [42, 42, 1, true], [70, 42, 0.4],
          [14, 70, 0.15], [42, 70, 0.25], [70, 70, 0.35],
        ].map(([x, y, op, hi], i) => (
          <rect
            key={i}
            x={x as number}
            y={y as number}
            width="22"
            height="22"
            rx="3"
            fill={hi ? 'var(--accent)' : 'currentColor'}
            opacity={op as number}
          />
        ))}
      </svg>
    );
  }
  return null;
}