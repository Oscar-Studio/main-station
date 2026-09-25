import { useMemo, useState } from 'react';
import DotField from '@/components/effects/DotField/DotField';
import { Magnetic } from '@/components/ui/Magnetic';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { NEURAL_STATS, NEURAL_TAGS, TYPING_DEMO } from '@/data/content';
import { useTypewriter } from '@/hooks/useTypewriter';
import { buildNeuralGraph } from '@/lib/neural';
import { cn } from '@/lib/cn';

export function ModuleAI() {
  const graph = useMemo(() => buildNeuralGraph(42), []);
  const [highlight, setHighlight] = useState<number | null>(null);

  const connected = useMemo(() => {
    if (highlight == null) return new Set<number>();
    const s = new Set<number>([highlight]);
    graph.links.forEach((l) => {
      if (l.from === highlight) s.add(l.to);
      if (l.to === highlight) s.add(l.from);
    });
    return s;
  }, [graph, highlight]);

  return (
    <section id="ai" className="relative py-32 overflow-hidden" data-module="0">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <DotField
          dotRadius={1.4}
          dotSpacing={32}
          cursorRadius={120}
          bulgeStrength={20}
          gradientFrom="rgba(61, 90, 254, 0.16)"
          gradientTo="rgba(61, 90, 254, 0.04)"
          disableGlow
        />
      </div>

      <div className="relative max-w-container mx-auto px-8 w-full">
        <Reveal>
          <div className="mb-16">
            <span className="mono-label">01 — AI</span>
            <h2 className="mt-6 font-display text-display-lg font-semibold tracking-[-0.03em] leading-[0.95]">
              Conversations,
              <br />
              <em className="italic font-serif">augmented.</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Neural graph card */}
          <Reveal>
            <div className="relative rounded-card border border-hairline bg-canvas-soft p-8 overflow-hidden">
              <svg viewBox="0 0 600 600" className="w-full h-auto">
                <g>
                  {graph.links.map((l, i) => {
                    const from = graph.nodes[l.from];
                    const to = graph.nodes[l.to];
                    const active = highlight != null && (l.from === highlight || l.to === highlight);
                    return (
                      <line
                        key={i}
                        x1={from.cx}
                        y1={from.cy}
                        x2={to.cx}
                        y2={to.cy}
                        stroke={active ? 'var(--accent)' : 'var(--hairline-strong)'}
                        strokeWidth={active ? 1.5 : 0.6}
                        opacity={active ? 1 : 0.6}
                      />
                    );
                  })}
                </g>
                <g>
                  {graph.nodes.map((n) => {
                    const active = highlight != null && connected.has(n.id);
                    return (
                      <circle
                        key={n.id}
                        cx={n.cx}
                        cy={n.cy}
                        r={active ? 12 : 8}
                        fill={active ? 'var(--accent)' : 'var(--ink)'}
                        opacity={active ? 1 : 0.8}
                        style={{ transition: 'r 0.3s ease, fill 0.3s ease' }}
                      />
                    );
                  })}
                </g>
              </svg>
              <div className="absolute inset-0 pointer-events-none">
                {graph.nodes.map((n, i) => {
                  const angle = (i / graph.nodes.length) * 2 * Math.PI - Math.PI / 2;
                  const r = 200;
                  const x = 50 + (Math.cos(angle) * r) / 6;
                  const y = 50 + (Math.sin(angle) * r) / 6;
                  const active = highlight != null && connected.has(n.id);
                  return (
                    <button
                      key={n.id}
                      data-cursor={NEURAL_TAGS[i]}
                      onMouseEnter={() => setHighlight(i)}
                      onMouseLeave={() => setHighlight(null)}
                      className={cn(
                        'absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] tracking-[0.06em] px-3 py-1.5 rounded-pill border transition-all duration-300 pointer-events-auto',
                        active
                          ? 'border-accent text-accent bg-paper'
                          : 'border-hairline-strong text-ink bg-paper/60 hover:border-ink',
                      )}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {NEURAL_TAGS[i]}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-8 font-mono text-[12px]">
                {NEURAL_STATS.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-2">
                    <CountUp to={s.num} className="text-[28px] font-display font-medium text-ink" />
                    <span className="text-mute">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <p className="text-[18px] leading-relaxed text-ink-2">
                We route between the world's best models so you don't have to pick one.
                Conversations stream in real time, with voice in, voice out, and a memory that actually remembers.
              </p>
              <ul className="space-y-3 text-[14px]">
                <li className="flex items-center gap-3">
                  <span className="bullet" />
                  Multi-model routing with fallback chains
                </li>
                <li className="flex items-center gap-3">
                  <span className="bullet" />
                  Streaming responses &amp; tool use
                </li>
                <li className="flex items-center gap-3">
                  <span className="bullet" />
                  Voice synthesis &amp; live transcription
                </li>
                <li className="flex items-center gap-3">
                  <span className="bullet" />
                  Persistent context across sessions
                </li>
              </ul>
              <Magnetic strength={3}>
                <a
                  href="https://ai.oscarstudio.cn"
                  target="_blank"
                  rel="noopener"
                  data-cursor="Open"
                  className="link-arrow inline-flex mt-4"
                >
                  Open AI Studio <span>→</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* Typing demo */}
        <Reveal delay={240}>
          <TypingDemo />
        </Reveal>
      </div>
    </section>
  );
}

function TypingDemo() {
  const [prompt, setPrompt] = useState<string>(TYPING_DEMO.initialPrompt);
  const response = useTypewriter(prompt === TYPING_DEMO.initialPrompt ? TYPING_DEMO.initialResponse : '', {
    enabled: !!prompt,
    speed: 16,
    delay: 600,
  });

  return (
    <div className="mt-16 rounded-card border border-hairline bg-canvas-soft overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-hairline">
        <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#ff5f57' }} />
        <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#febc2e' }} />
        <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#28c840' }} />
        <span className="font-mono text-[11px] text-mute ml-3 tracking-[0.1em] uppercase">
          {TYPING_DEMO.title}
        </span>
      </div>

      <div className="px-6 py-5 font-mono text-[13px]">
        <div className="flex items-baseline gap-3">
          <span className="text-accent">›</span>
          <span>{prompt}</span>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 16,
              background: 'var(--accent)',
              animation: 'blink 1s steps(2) infinite',
            }}
          />
        </div>
        {response && (
          <div className="mt-4 pl-5 border-l-2 border-accent text-ink-2 leading-relaxed">{response}</div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-hairline font-mono text-[11px]">
        {TYPING_DEMO.suggestions.map((s) => (
          <button
            key={s}
            data-cursor="Try"
            onClick={() => setPrompt(s)}
            className="px-3 py-1.5 rounded-pill border border-hairline-strong hover:border-ink hover:text-ink transition-colors"
          >
            Try: "{s}"
          </button>
        ))}
      </div>
    </div>
  );
}