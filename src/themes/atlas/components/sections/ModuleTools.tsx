import DotField from '@/components/effects/DotField/DotField';
import SplitText from '@/components/effects/SplitText/SplitText';
import { Magnetic } from '@/components/ui/Magnetic';
import { Reveal } from '@/components/ui/Reveal';
import { UTILS } from '@/data/content';

export function ModuleTools() {
  return (
    <section id="tools" className="relative py-32 overflow-hidden" data-module="2">
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
            <span className="mono-label">03 — TOOLS</span>
            <h2 className="mt-6 font-display text-display-lg font-semibold tracking-[-0.03em] leading-[0.95]">
              <SplitText
                text="Quick utilities"
                delay={18}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
              <br />
              <em className="italic font-serif">for the in-between.</em>
            </h2>
            <p className="mt-6 max-w-xl text-[16px] text-ink-2">
              Everyday micro-tools — converters, generators, and tiny scripts — live on
              <span className="text-ink"> tools.oscarstudio.cn</span>. Open the toolbox when you need a thing.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UTILS.map((util, i) => (
            <Reveal key={util.slug} delay={i * 50}>
              <a
                href={`https://tools.oscarstudio.cn/${util.slug === 'whiteboard' ? '#/whiteboard' : util.slug}`}
                target="_blank"
                rel="noopener"
                data-cursor="Open"
                className="group block rounded-card border border-hairline bg-canvas-soft p-6 h-full hover:border-hairline-strong hover:-translate-y-1 transition-all duration-500 ease-snap"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-[26px]" aria-hidden>
                    {util.icon}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-mute group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                    ↗
                  </span>
                </div>
                <h3 className="font-display text-[20px] font-medium tracking-[-0.02em] mb-2">
                  {util.name}
                </h3>
                <p className="text-[13px] text-mute leading-relaxed mb-6">{util.desc}</p>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-mute">
                  tools.oscarstudio.cn / {util.slug}
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-16 flex items-end justify-between flex-wrap gap-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[64px] font-medium leading-none">
                {UTILS.length}
              </span>
              <span className="text-[40px] font-display text-accent leading-none">+</span>
              <span className="text-[14px] text-mute ml-2">
                utilities, all in HTML · runs locally
              </span>
            </div>
            <Magnetic strength={3}>
              <a
                href="https://tools.oscarstudio.cn"
                target="_blank"
                rel="noopener"
                data-cursor="Open"
                className="link-arrow inline-flex"
              >
                Open Tools <span>↗</span>
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}