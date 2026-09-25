import { useState } from 'react';
import SplitText from '@/components/effects/SplitText/SplitText';
import DotField from '@/components/effects/DotField/DotField';
import { Reveal } from '@/components/ui/Reveal';
import { THEME_LABELS, type Theme } from '@/data/themes';

interface ClosingProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Closing({ theme, onToggleTheme }: ClosingProps) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMsg({ ok: false, text: 'Please enter a valid email address.' });
      return;
    }
    setMsg({ ok: true, text: 'Thanks. We\'ll send one quiet email a month.' });
    setEmail('');
  };

  return (
    <section id="closing" className="relative py-32 overflow-hidden text-ink">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <DotField
          dotRadius={1.4}
          dotSpacing={32}
          cursorRadius={120}
          bulgeStrength={20}
          gradientFrom="rgba(180, 200, 255, 0.18)"
          gradientTo="rgba(180, 200, 255, 0.04)"
          disableGlow
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.7) 100%)',
        }}
      />

      <div className="relative max-w-container mx-auto px-8 w-full">
        <Reveal>
          <div className="mb-8">
            <span className="mono-label" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Closing · 05
            </span>
          </div>
          <h2
            className="font-display font-semibold tracking-[-0.04em] leading-[0.95] text-paper mb-8"
            style={{ color: '#fff' }}
          >
            <span className="block text-display-xl">
              <SplitText
                text="Build"
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
            <span className="block italic font-serif font-medium text-display-xl">
              <SplitText
                text="with us."
                delay={20}
                duration={0.9}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                className="inline-block"
              />
            </span>
          </h2>
          <p className="max-w-xl text-[16px] text-paper/80 leading-relaxed">
            We are open source, open studio. Subscribe to the lab notebook — one quiet email a month, with new tools and what we're learning.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submit} className="mt-10 max-w-md">
            <div
              data-electric
              className="flex items-center gap-2 rounded-pill bg-paper/10 backdrop-blur-md border border-paper/20 p-1.5 focus-within:border-accent transition-colors"
            >
              <span className="font-mono text-[12px] text-paper/60 ml-3">email →</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.dev"
                className="flex-1 bg-transparent text-paper placeholder:text-paper/40 outline-none px-2 py-2 text-[14px]"
              />
              <button
                type="submit"
                data-cursor="Send"
                className="rounded-pill bg-paper text-ink px-5 py-2 text-[13px] font-medium hover:bg-paper-soft transition-colors"
              >
                Subscribe →
              </button>
            </div>
            {msg && (
              <div
                className="mt-3 font-mono text-[12px]"
                style={{ color: msg.ok ? 'var(--green)' : 'var(--accent)' }}
              >
                {msg.text}
              </div>
            )}
          </form>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <button
              onClick={onToggleTheme}
              data-cursor="Toggle"
              className="inline-flex items-center gap-2 rounded-pill border border-paper/20 px-4 py-2 text-[12px] text-paper hover:border-paper/60 transition-colors"
            >
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Theme · </span>
              <span>{THEME_LABELS[theme === 'paper' ? 'ink' : 'paper']}</span>
            </button>
            <a
              href="https://github.com/oscarstudio"
              target="_blank"
              rel="noopener"
              data-cursor="Star"
              className="inline-flex items-center gap-2 rounded-pill border border-paper/20 px-4 py-2 text-[12px] text-paper hover:border-paper/60 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5C24 5.9 18.6.5 12 .5z" />
              </svg>
              <span>Star on GitHub</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}