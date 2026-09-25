import DotField from '@/components/effects/DotField/DotField';
import SplitText from '@/components/effects/SplitText/SplitText';
import { Reveal } from '@/components/ui/Reveal';
import { MODULES } from '@/data/content';

export function SectionIndex() {
  return (
    <section id="section-index" className="relative py-32 overflow-hidden">
      {/* DotField background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <DotField
          dotRadius={1.6}
          dotSpacing={28}
          cursorRadius={140}
          bulgeStrength={28}
          gradientFrom="rgba(61, 90, 254, 0.20)"
          gradientTo="rgba(61, 90, 254, 0.05)"
          disableGlow
        />
      </div>

      <div className="relative max-w-container mx-auto px-8 w-full">
        <Reveal>
          <div className="mb-16">
            <div className="mb-6">
              <span className="mono-label">Index · Five modules</span>
            </div>
            <h2 className="font-display text-display-lg font-semibold tracking-[-0.03em] leading-[0.95]">
              <SplitText
                text="What we make."
                delay={18}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </h2>
            <p className="mt-6 max-w-xl text-[16px] text-ink-2">
              Five small platforms, each with its own gravity. Pick one, or wander through all of them.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {MODULES.map((m) => {
            const cursor = m.cursor ?? String(m.index).padStart(2, '0');
            const href = m.external ? m.href ?? '#' : `#${m.id}`;
            return (
              <Reveal key={m.id} delay={m.index * 60}>
                <a
                  href={href}
                  target={m.external ? '_blank' : undefined}
                  rel={m.external ? 'noopener' : undefined}
                  data-cursor={cursor}
                  className="group block rounded-card border border-hairline hover:bg-canvas-soft transition-all duration-500 ease-snap p-6 h-full"
                >
                  <div className="flex items-center justify-between mb-16">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute">
                      0{m.index}
                    </span>
                    <span className="text-mute group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                      {m.external ? '↗' : '→'}
                    </span>
                  </div>
                  <h3 className="font-display text-[24px] font-medium tracking-[-0.02em] mb-3">{m.name}</h3>
                  <p className="text-[14px] text-mute leading-relaxed mb-8">{m.desc}</p>
                  <div className="font-mono text-[11px] text-mute tracking-[0.06em]">{m.tagline}</div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}