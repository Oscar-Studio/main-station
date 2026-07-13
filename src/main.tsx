import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
import { GlassConfigProvider } from './lib/useUserGlassConfig';
import './styles/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root element');

createRoot(rootEl).render(
  <StrictMode>
    <I18nProvider>
      <GlassConfigProvider>
        <App />
      </GlassConfigProvider>
    </I18nProvider>
  </StrictMode>,
);
