import { Glass } from '@samasante/liquid-glass';
import { useI18n } from '../i18n/I18nProvider';

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="hero">
      <h1>{t('heroTitle')}</h1>
      <p>{t('heroSubtitle')}</p>
      <div className="hero-buttons">
        <Glass
          style={{
            display: 'inline-flex',
            borderRadius: 50,
            padding: 0,
            background: 'rgba(99,102,241,0.15)',
            border: '0.5px solid rgba(99,102,241,0.4)',
          }}
          optics={{ brightness: 0.1, sheen: 0.55, sheenWidth: 80, depth: 0.6 }}
        >
          <a href="#ai" className="btn-liquid btn-liquid-primary">
            {t('heroPrimary')}
          </a>
        </Glass>
        <Glass
          style={{
            display: 'inline-flex',
            borderRadius: 50,
            padding: 0,
            background: 'rgba(255,255,255,0.06)',
          }}
          optics={{ brightness: 0.06, sheen: 0.5, sheenWidth: 60 }}
        >
          <a
            href="https://github.com/oscarstudio"
            target="_blank"
            rel="noopener"
            className="btn-liquid btn-liquid-ghost"
          >
            {t('heroSecondary')}
          </a>
        </Glass>
      </div>
    </section>
  );
}
