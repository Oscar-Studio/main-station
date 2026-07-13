import { useEffect, useState } from 'react';
import { Glass } from '@samasante/liquid-glass';
import { useI18n } from '../i18n/I18nProvider';
import { useGlassConfig } from '../lib/useUserGlassConfig';

export default function BackToTop() {
  const { t } = useI18n();
  const gc = useGlassConfig();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const onScroll = () => {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setVisible(window.scrollY > heroBottom - 100);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Glass
      style={{
        position: 'fixed',
        right: '2rem',
        bottom: '2rem',
        width: 50,
        height: 50,
        borderRadius: '50%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(99,102,241,0.45)',
        border: '0.5px solid rgba(255,255,255,0.3)',
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.3s, transform 0.3s, visibility 0.3s',
        zIndex: 999,
      }}
      className={`back-to-top${visible ? ' visible' : ''}`}
      optics={{ brightness: 0.1, sheen: 0.7, sheenWidth: 70, specular: 1.2, ...gc }}
    >
      <button
        type="button"
        aria-label={t('backToTopAria')}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        ↑
      </button>
    </Glass>
  );
}
