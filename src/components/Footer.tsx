import { useI18n } from '../i18n/I18nProvider';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer>
      <p>{t('footerCopy')}</p>
      <p>
        <a href="https://github.com/oscarstudio" target="_blank" rel="noopener noreferrer">
          {t('footerGithub')}
        </a>
        {' | '}
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          {t('footerIcp')}
        </a>
      </p>
    </footer>
  );
}
