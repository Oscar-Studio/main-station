import CircularText from '@/components/effects/CircularText/CircularText';
import { useNow } from '@/hooks/useClock';
import { formatTimeHMS } from '@/lib/clock';
import { FOOTER, SITE } from '@/data/content';

export function Footer() {
  const now = useNow();
  return (
    <footer className="relative py-20 border-t border-hairline">
      <div className="max-w-container mx-auto px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
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
            </div>
            <p className="text-[13px] text-mute leading-relaxed max-w-sm">{FOOTER.brandTag}</p>
          </div>

          <FooterCol title="Studio" items={[
            { label: 'Home', href: '#hero' },
            { label: 'Index', href: '#section-index' },
            { label: 'Documentation', href: 'https://docs.oscarstudio.cn', external: true },
            { label: 'Feedback', href: 'https://api.oscarstudio.cn/feedback', external: true },
          ]} />

          <FooterCol title="Modules" items={[
            { label: 'AI Studio ↗', href: 'https://ai.oscarstudio.cn', external: true },
            { label: 'Teaching Tools ↗', href: 'https://edu.oscarstudio.cn', external: true },
            { label: 'HTML-PPT ↗', href: 'https://ppt.oscarstudio.cn', external: true },
            { label: 'Games ↗', href: 'https://games.oscarstudio.cn', external: true },
          ]} />

          <FooterCol title="Playground" items={[
            { label: 'Firework Simulator', href: '../Firework_Simulator/index.html', external: true },
            { label: 'Snake Online ↗', href: 'https://snake.oscarstudio.cn', external: true },
            { label: 'Account ↗', href: 'https://api.oscarstudio.cn/user/settings', external: true },
          ]} />
        </div>

        <div className="flex items-center justify-between gap-6 flex-wrap pt-8 border-t border-hairline">
          <div className="flex items-center gap-3 font-mono text-[11px] text-mute tracking-[0.08em] flex-wrap">
            <span>© 2026 Oscar Studio</span>
            <span className="text-hairline-strong">·</span>
            <span>{formatTimeHMS(now)}</span>
            <span className="text-hairline-strong">·</span>
            <a href={FOOTER.beianUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              {FOOTER.beian}
            </a>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-mute">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: 'var(--green)',
                animation: 'statusPulse 2s ease-in-out infinite',
              }}
            />
            <span>{FOOTER.statusText}</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              data-cursor="Spin"
              style={{ position: 'relative', width: 56, height: 56 }}
              className="flex items-center justify-center"
            >
              <CircularText text="OSCAR · STUDIO · OSCAR · STUDIO · " spinDuration={14} onHover="speedUp" />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  letterSpacing: '0.06em',
                }}
              >
                OS
              </span>
            </div>
            <span className="font-mono text-[10px] text-mute tracking-[0.14em] uppercase">{FOOTER.rights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterItem {
  label: string;
  href: string;
  external?: boolean;
}

function FooterCol({ title, items }: { title: string; items: FooterItem[] }) {
  return (
    <div>
      <h5 className="mono-label mb-4">{title}</h5>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target={it.external ? '_blank' : undefined}
              rel={it.external ? 'noopener noreferrer' : undefined}
              className="text-[13px] text-ink-2 hover:text-accent transition-colors"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}