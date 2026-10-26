import { lazy, Suspense, useEffect } from 'react';

// Keep the studio page in its own chunk.
const AtlasApp = lazy(() => import('./themes/atlas/ThemeApp'));

function useExternalScripts() {
  useEffect(() => {
    const id = 'oscar-user-button';
    let lastContainer: HTMLElement | null = null;
    const mount = () => {
      const container = document.getElementById('userButtonContainer');
      if (!container || container === lastContainer) return;
      lastContainer = container;
      if (document.getElementById(id)) {
        // The SDK already owns authentication. Ask its existing storage listener
        // to render again after the lazy studio tree mounts.
        window.dispatchEvent(new StorageEvent('storage', { key: 'ai_user' }));
        return;
      }
      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://api.oscarstudio.cn/user-button.js';
      // Load only after the lazy theme has mounted the SDK container.
      // Do not set crossOrigin: localhost is outside the static resource allowlist.
      s.async = true;
      document.body.appendChild(s);
    };
    mount();
    const observer = new MutationObserver(mount);
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}

/** 把 user-button.js 生成的 "登录/注册" 按钮改名为 "登录" */
function useShortenedLoginButton() {
  useEffect(() => {
    const shorten = () => {
      const btn = document.querySelector<HTMLAnchorElement>('.login-register-btn');
      if (btn && btn.textContent && btn.textContent.includes('注册')) {
        btn.textContent = '登录';
      }
    };
    shorten();
    const observer = new MutationObserver(shorten);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
}

/** Atlas 加载期间的占位，避免整页闪白 */
function AtlasLoading() {
  let dark = false;
  try { dark = localStorage.getItem('oscar-crazy-4-theme') === 'ink'; } catch { /* ignore */ }
  return (
    <div
      style={{
        minHeight: '100vh',
        background: dark ? '#1b1e1b' : '#f8f7f2',
        color: dark ? '#b2b7a9' : '#686b61',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 14,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
      }}
    >
      Oscar Studio
    </div>
  );
}

export default function App() {
  useExternalScripts();
  useShortenedLoginButton();
  return <Suspense fallback={<AtlasLoading />}><AtlasApp /></Suspense>;
}
