import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { Lang } from '../i18n/translations';

declare global {
  interface Window {
    Opilot?: { openPanel?: () => void };
  }
}

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
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
        <a
          href="https://api.oscarstudio.cn/user/settings"
          className="nav-cta-btn"
        >
          {t('navCta')}
        </a>
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

        <div
          ref={dropdownRef}
          className={`lang-dropdown${open ? ' open' : ''}`}
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
        </div>

        <div id="userButtonContainer" />
      </div>
    </nav>
  );
}
