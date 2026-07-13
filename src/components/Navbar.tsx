import { useEffect, useRef, useState } from 'react';
import { Glass } from '@samasante/liquid-glass';
import { useI18n } from '../i18n/I18nProvider';
import { useGlassConfig } from '../lib/useUserGlassConfig';
import type { Lang } from '../i18n/translations';

declare global {
  interface Window {
    Opilot?: { openPanel?: () => void };
  }
}

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const gc = useGlassConfig();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const onOpilot = () => window.Opilot?.openPanel?.();

  const onPickLang = (next: Lang) => {
    setLang(next);
    setOpen(false);
  };

  return (
    <nav>
      <a href="https://oscarstudio.cn" className="logo" aria-label={t('brand')}>
        <img src="/logo.png" alt={t('brand')} />
      </a>

      <ul>
        <li><a href="#ai">{t('navAi')}</a></li>
        <li><a href="#teaching-tools">{t('navTeaching')}</a></li>
        <li><a href="#html-ppt">{t('navPpt')}</a></li>
        <li><a href="#games">{t('navGames')}</a></li>
        <li><a href="https://api.oscarstudio.cn/feedback" target="_blank" rel="noopener">{t('navFeedback')}</a></li>
      </ul>

      <div className="nav-right-group">
        <a href="https://docs.oscarstudio.cn" target="_blank" rel="noopener">{t('navDocs')}</a>

        <Glass
          className="glass-element"
          style={{
            display: 'inline-flex',
            borderRadius: 50,
            padding: 0,
            background: 'rgba(253,224,71,0.12)',
          }}
          optics={{ brightness: 0.08, sheen: 0.6, sheenWidth: 60, ...gc }}
        >
          <a
            href="https://api.oscarstudio.cn/user/settings"
            className="nav-cta-btn"
          >
            {t('navCta')}
          </a>
        </Glass>

        <Glass
          className="glass-element"
          style={{
            display: 'inline-flex',
            borderRadius: 50,
            padding: 0,
            background: 'rgba(255,255,255,0.05)',
          }}
          optics={{ brightness: 0.05, sheen: 0.5, sheenWidth: 50, ...gc }}
        >
          <button
            type="button"
            className="opilot-trigger"
            id="opilotTrigger"
            title="Opilot (⌘K)"
            onClick={onOpilot}
          >
            <span className="opilot-trigger-icon">✨</span>
            <span>{t('opilotLabel')}</span>
            <kbd>⌘K</kbd>
          </button>
        </Glass>

        <div
          ref={dropdownRef}
          className={`lang-dropdown${open ? ' open' : ''}`}
        >
          <Glass
            className="glass-element"
            style={{
              display: 'inline-flex',
              borderRadius: 50,
              padding: 0,
              background: 'rgba(255,255,255,0.05)',
            }}
            optics={{ brightness: 0.05, sheen: 0.5, sheenWidth: 50, ...gc }}
          >
            <button
              type="button"
              className="lang-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
            >
              {lang === 'zh' ? t('langZh') : t('langEn')}
            </button>
          </Glass>
          <Glass
            style={{
              borderRadius: 16,
              padding: 0,
              background: 'rgba(15,23,42,0.94)',
              border: '0.5px solid rgba(255,255,255,0.2)',
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: 140,
              zIndex: 1001,
            }}
            className="glass-element lang-menu-glass"
            optics={{ brightness: 0.08, sheen: 0.55, sheenWidth: 60, depth: 0.6, ...gc }}
          >
            <ul className="lang-menu">
              <li>
                <button
                  type="button"
                  className={lang === 'zh' ? 'active' : ''}
                  onClick={() => onPickLang('zh')}
                >
                  {t('langZh')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={lang === 'en' ? 'active' : ''}
                  onClick={() => onPickLang('en')}
                >
                  {t('langEn')}
                </button>
              </li>
            </ul>
          </Glass>
        </div>

        <div id="userButtonContainer" />
      </div>
    </nav>
  );
}
