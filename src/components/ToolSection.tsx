import { Glass } from '@samasante/liquid-glass';
import { useI18n } from '../i18n/I18nProvider';
import { useGlassConfig } from '../lib/useUserGlassConfig';
import type { TranslationKey } from '../i18n/translations';

type Props = {
  id: string;
  icon: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  actionKey: TranslationKey;
  href: string;
  external?: boolean;
};

export default function ToolSection({
  id,
  icon,
  titleKey,
  descKey,
  actionKey,
  href,
  external,
}: Props) {
  const { t } = useI18n();
  const gc = useGlassConfig();
  return (
    <section id={id} className="tool-section">
      <Glass
        className="glass-element tool-content glass-fallback"
        style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: '2rem 3rem',
          border: '0.5px solid rgba(255,255,255,0.18)',
        }}
        optics={{
          brightness: 0.06,
          sheen: 0.55,
          sheenWidth: 80,
          specular: 1.1,
          dispersion: 0.25,
          glow: 0.3,
          glowSpread: 0.18,
          depth: 0.7,
          ...gc,
        }}
      >
        <div className="tool-icon">{icon}</div>
        <h2>{t(titleKey)}</h2>
        <p>{t(descKey)}</p>
        <Glass
          className="glass-element"
          style={{
            display: 'inline-flex',
            borderRadius: 50,
            padding: 0,
            background: 'rgba(255,255,255,0.06)',
          }}
          optics={{ brightness: 0.06, sheen: 0.5, sheenWidth: 60, ...gc }}
        >
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="btn-liquid btn-liquid-ghost"
          >
            {t(actionKey)}
          </a>
        </Glass>
      </Glass>
    </section>
  );
}
