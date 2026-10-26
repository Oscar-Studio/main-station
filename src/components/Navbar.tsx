import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { ThemeToggle } from './ThemeToggle';
import type { Lang } from '../i18n/translations';

type NavLink = { href: string; label: string; external?: boolean };

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

function MobileDrawer({
  open,
  onClose,
  links,
  lang,
  onPickLang,
  langZh,
  langEn,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  lang: Lang;
  onPickLang: (next: Lang) => void;
  langZh: string;
  langEn: string;
}) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`mobile-drawer-mask${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`mobile-drawer${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="导航菜单"
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">导航</span>
          <button
            ref={closeBtnRef}
            type="button"
            className="mobile-drawer-close"
            onClick={onClose}
            aria-label="关闭菜单"
          >
            ✕
          </button>
        </div>
        <nav className="mobile-drawer-nav" aria-label="主导航">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={onClose}
                  {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-drawer-lang" role="group" aria-label="语言切换">
          <button
            type="button"
            className={lang === 'zh' ? 'active' : ''}
            onClick={() => onPickLang('zh')}
          >
            {langZh}
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => onPickLang('en')}
          >
            {langEn}
          </button>
        </div>
      </aside>
    </>
  );
}

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const onPickLang = (next: Lang) => {
    setLang(next);
    setOpen(false);
  };

  const onCloseDrawer = () => setDrawerOpen(false);

  const navLinks: NavLink[] = [
    { href: '#ai', label: t('navAi') },
    { href: '#teaching-tools', label: t('navTeaching') },
    { href: '#tools', label: t('navTools') },
    { href: '#games', label: t('navGames') },
    { href: '#html-ppt', label: t('navPpt') },
    { href: 'https://api.oscarstudio.cn/feedback', label: t('navFeedback'), external: true },
    { href: 'https://docs.oscarstudio.cn', label: t('navDocs'), external: true },
  ];

  return (
    <>
      <nav className="top-bar">
        <a href="https://oscarstudio.cn" className="logo" aria-label={t('brand')}>
          <img src="/logo.png" alt={t('brand')} />
        </a>

        <ul className="nav-desktop">
          <li><a href="#ai">{t('navAi')}</a></li>
          <li><a href="#teaching-tools">{t('navTeaching')}</a></li>
          <li><a href="#tools">{t('navTools')}</a></li>
          <li><a href="#games">{t('navGames')}</a></li>
          <li><a href="#html-ppt">{t('navPpt')}</a></li>
          <li><a href="https://api.oscarstudio.cn/feedback" target="_blank" rel="noopener">{t('navFeedback')}</a></li>
        </ul>

        <div className="nav-right-group">
          <a
            href="https://api.oscarstudio.cn/user/settings"
            className="nav-cta-btn"
          >
            {t('navCta')}
          </a>

          <div
            ref={dropdownRef}
            className={`lang-dropdown${open ? ' open' : ''}`}
          >
            <button
              type="button"
              className="lang-toggle"
              aria-label="切换语言"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
            >
              <span className="lang-toggle-text">{lang === 'zh' ? t('langZh') : t('langEn')}</span>
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

          <ThemeToggle />

          <div id="userButtonContainer" />

          <button
            type="button"
            className="nav-hamburger"
            aria-label={drawerOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <HamburgerIcon open={drawerOpen} />
          </button>
        </div>
      </nav>

      <MobileDrawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        links={navLinks}
        lang={lang}
        onPickLang={(next) => {
          onPickLang(next);
          onCloseDrawer();
        }}
        langZh={t('langZh')}
        langEn={t('langEn')}
      />
    </>
  );
}
