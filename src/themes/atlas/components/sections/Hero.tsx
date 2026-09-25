import { useEffect, useRef } from 'react';
import Antigravity from '@/components/effects/Antigravity/Antigravity';
import SplitText from '@/components/effects/SplitText/SplitText';
import { useNow } from '@/hooks/useClock';
import { formatTimeHM } from '@/lib/clock';
import { SITE } from '@/data/content';
import { Magnetic } from '@/components/ui/Magnetic';

export function Hero() {
  const now = useNow();
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Track mouse inside hero so Antigravity only reacts when cursor is over hero
  // (crazy/2 had this behavior — the particle ring only forms near the mouse).
  useEffect(() => {
    const el = heroRef.current;
    const wrap = canvasRef.current;
    if (!el || !wrap) return;
    const onEnter = () => {
      wrap.style.opacity = '1';
    };
    const onLeave = () => {
      wrap.style.opacity = '0.55';
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    onEnter();
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Antigravity — full-bleed particle field, primary background effect */}
      <div
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700 ease-snap"
        style={{
          // mute down so the headline stays readable; full opacity when mouse enters
          opacity: 0.55,
        }}
      >
        <Antigravity
          count={420}
          magnetRadius={11}
          ringRadius={8}
          waveSpeed={0.45}
          waveAmplitude={1}
          particleSize={1.8}
          particleVariance={0.8}
          lerpSpeed={0.07}
          color="#3D5AFE"
          autoAnimate={false}
          rotationSpeed={0.05}
          depthFactor={1.1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={12}
        />
      </div>

      {/* Subtle dark overlay so the headline always wins against the particle field */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250,250,247,0.0) 0%, rgba(250,250,247,0.55) 70%, rgba(250,250,247,0.92) 100%)',
        }}
      />

      <div className="relative max-w-container-wide mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-32 pb-40 pointer-events-none">
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-eyebrow font-mono uppercase tracking-[0.14em] text-mute">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: 'var(--green)',
                display: 'inline-block',
                animation: 'dotPulse 2s ease-in-out infinite',
              }}
            />
            <span>{SITE.icp}</span>
          </div>

          <h1 className="font-display text-[clamp(48px,7vw,128px)] font-semibold leading-[0.95] tracking-[-0.04em]">
            <span className="block">
              <SplitText
                text="Tools for"
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
            <span className="block italic font-serif font-medium">
              <SplitText
                text="thinkers,"
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
            <span className="block">
              <SplitText
                text="makers,"
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
            <span className="block">
              <SplitText
                text="teachers,"
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
            <span className="block italic font-serif font-medium">
              <SplitText
                text="players."
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
          </h1>

          <p className="max-w-xl text-[17px] leading-relaxed text-ink-2">{SITE.sub}</p>

          <div className="flex items-center gap-3 pointer-events-auto">
            <Magnetic strength={2}>
              <a
                href="#section-index"
                data-magnet
                data-cursor="Begin"
                className="inline-flex items-center gap-2 rounded-pill bg-ink text-paper px-6 py-3 text-[14px] font-medium hover:bg-ink-2 transition-colors duration-300"
              >
                Start exploring <span className="ml-1">→</span>
              </a>
            </Magnetic>
            <Magnetic strength={3}>
              <a
                href="https://github.com/oscarstudio"
                target="_blank"
                rel="noopener"
                data-cursor="GitHub"
                className="inline-flex items-center gap-2 rounded-pill border border-hairline-strong px-6 py-3 text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors duration-300"
              >
                View source <span>↗</span>
              </a>
            </Magnetic>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-mono text-mute">
            <span className="flex items-center gap-2">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: 'var(--green)',
                  display: 'inline-block',
                  animation: 'dotPulse 2s ease-in-out infinite',
                }}
              />
              Online
            </span>
            <span className="text-hairline-strong">·</span>
            <span>{formatTimeHM(now)}</span>
            <span className="text-hairline-strong">·</span>
            <span>{SITE.version}</span>
          </div>
        </div>

        <div aria-hidden />
      </div>

      {/* Bottom-right HUD legend */}
      <div
        className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[10px] text-mute tracking-[0.12em] uppercase"
        aria-hidden
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: 'var(--green)',
            display: 'inline-block',
            animation: 'dotPulse 2s ease-in-out infinite',
          }}
        />
        <span>antigravity · instanced</span>
        <span className="text-hairline-strong">·</span>
        <span>420 pts · 60 fps</span>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-32 left-0 right-0 overflow-hidden" aria-hidden>
        <div
          className="flex gap-12 font-display text-[14px] uppercase tracking-[0.18em] text-ink whitespace-nowrap"
          style={{ animation: 'marquee 32s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>{SITE.marqueeText}</span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#section-index"
        data-cursor="Scroll"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group pointer-events-auto"
        aria-hidden
      >
        <span className="w-px h-10 bg-ink group-hover:bg-accent transition-colors" style={{ animation: 'hintScroll 1.6s ease-in-out infinite' }} />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-mute">scroll</span>
      </a>
    </section>
  );
}