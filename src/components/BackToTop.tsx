import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

export default function BackToTop() {
  const { t } = useI18n();
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
    <button
      type="button"
      className={`back-to-top${visible ? ' visible' : ''}`}
      aria-label={t('backToTopAria')}
      onClick={onClick}
    >
      ↑
    </button>
  );
}
