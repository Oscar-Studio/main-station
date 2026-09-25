import { useCallback, useEffect, useState } from 'react';
import DotField from '@/components/effects/DotField/DotField';
import SplitText from '@/components/effects/SplitText/SplitText';
import { Reveal } from '@/components/ui/Reveal';
import { DECK_SLIDES } from '@/data/content';
import { useKeyPress } from '@/hooks/useKeyPress';
import { cn } from '@/lib/cn';

const AUTO_ADVANCE_MS = 5000;

export function ModulePPT() {
  const [idx, setIdx] = useState(0);
  const slideCount = DECK_SLIDES.length;

  const next = useCallback(() => setIdx((i) => (i + 1) % slideCount), [slideCount]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + slideCount) % slideCount), [slideCount]);
  const go = useCallback((i: number) => setIdx(i), []);

  useKeyPress(['ArrowRight', ' '], next);
  useKeyPress('ArrowLeft', prev);

  useEffect(() => {
    const id = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section id="ppt" className="relative py-32 overflow-hidden" data-module="4">
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
          <div className="text-center mb-16">
            <span className="mono-label">05 — HTML-PPT</span>
            <h2 className="mt-6 font-display font-semibold tracking-[-0.04em] leading-[0.95]">
              <span className="block text-display-xl">
                <SplitText text="Slides" delay={20} duration={0.9} splitType="chars" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} tag="span" className="inline-block" />
              </span>
              <span className="block italic font-serif font-medium text-display-xl">
                <SplitText text="that breathe." delay={20} duration={0.9} splitType="chars" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} tag="span" className="inline-block" />
              </span>
            </h2>
            <p className="mt-6 max-w-xl mx-auto text-[16px] text-ink-2">
              Pure HTML, CSS, and a sprinkle of JavaScript. No installs. No export hell. The deck is the URL.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-card bg-canvas-soft border border-hairline overflow-hidden">
            {/* Stage */}
            <div
              className="relative aspect-[16/9] bg-canvas cursor-pointer group"
              onClick={next}
              data-cursor="Next"
            >
              {DECK_SLIDES.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute inset-0 grid grid-cols-2 gap-8 p-12 transition-opacity duration-700',
                    idx === i ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                >
                  <div className="flex flex-col justify-center">
                    <div className="font-mono text-[11px] text-mute tracking-[0.14em] uppercase mb-6">
                      {s.meta}
                    </div>
                    <div className="font-mono text-[11px] text-accent tracking-[0.14em] uppercase mb-4">
                      {s.eyebrow}
                    </div>
                    <h3 className="font-display font-semibold tracking-[-0.03em] leading-[0.95] text-display-md whitespace-pre-line">
                      {s.title}
                    </h3>
                    {'body' in s && s.body && (
                      <p className="mt-6 text-[14px] text-mute leading-relaxed max-w-md">{s.body}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    <SlideVisual kind={s.visual} active={idx === i} />
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-hairline">
              <button
                onClick={prev}
                data-cursor="Prev"
                className="font-mono text-[12px] text-mute hover:text-ink transition-colors"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-3">
                {DECK_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    data-cursor={`Slide ${i + 1}`}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      'h-1 rounded-pill transition-all duration-300',
                      idx === i ? 'w-6 bg-accent' : 'w-2 bg-hairline-strong hover:bg-ink',
                    )}
                  />
                ))}
              </div>
              <button
                onClick={next}
                data-cursor="Next"
                className="font-mono text-[12px] text-mute hover:text-ink transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 text-center">
            <a href="https://ppt.oscarstudio.cn" target="_blank" rel="noopener" data-cursor="Open" className="link-arrow">
              Open HTML-PPT <span>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SlideVisual({ kind, active }: { kind: string; active: boolean }) {
  if (kind === 'orb') {
    return (
      <div
        aria-hidden
        style={{
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, var(--accent), var(--accent-2) 70%)',
          animation: active ? 'orbFloat 4s ease-in-out infinite' : 'none',
          opacity: active ? 1 : 0.7,
        }}
      />
    );
  }
  if (kind === 'bars') {
    return (
      <div className="flex items-end gap-3 h-40" aria-hidden>
        {[30, 60, 45, 80, 55].map((h, i) => (
          <span
            key={i}
            style={{
              width: 36,
              height: `${h}%`,
              background: 'var(--ink)',
              transformOrigin: 'bottom',
              animation: active ? `barsUp 0.6s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1) both` : 'none',
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-3" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              background: i === 4 ? 'var(--accent)' : 'var(--ink)',
              opacity: i === 4 ? 1 : 0.7,
              animation: active ? `fadeIn 0.6s ${i * 0.05}s both` : 'none',
            }}
          />
        ))}
      </div>
    );
  }
  return null;
}