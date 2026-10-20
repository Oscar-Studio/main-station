import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolSection from './components/ToolSection';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useUserBackground } from './lib/useUserBackground';
import { useHomeTheme } from './hooks/useHomeTheme';

// Atlas（crazy/4 实验主题）整棵子树懒加载。
// 没选 Atlas 的用户首屏不会下载 three.js / framer-motion 等 ~150kb JS。
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
        // to render again when switching between classic and the lazy Atlas tree.
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

function ClassicTree() {
  return (
    <>
      <Navbar />
      <Hero />
      <ToolSection
        id="ai"
        icon="🤖"
        titleKey="aiTitle"
        descKey="aiDesc"
        actionKey="aiAction"
        href="https://ai.oscarstudio.cn"
        external
      />
      <ToolSection
        id="teaching-tools"
        icon="📚"
        titleKey="teachingTitle"
        descKey="teachingDesc"
        actionKey="teachingAction"
        href="https://edu.oscarstudio.cn"
        external
      />
      <ToolSection
        id="tools"
        icon="🧰"
        titleKey="toolsTitle"
        descKey="toolsDesc"
        actionKey="toolsAction"
        href="https://tools.oscarstudio.cn"
        external
      />
      <ToolSection
        id="games"
        icon="🎮"
        titleKey="gamesTitle"
        descKey="gamesDesc"
        actionKey="gamesAction"
        href="https://games.oscarstudio.cn"
        external
      />
      <ToolSection
        id="html-ppt"
        icon="📊"
        titleKey="pptTitle"
        descKey="pptDesc"
        actionKey="pptAction"
        href="https://ppt.oscarstudio.cn"
        external
      />
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  useExternalScripts();
  useShortenedLoginButton();
  const [homeTheme] = useHomeTheme();
  // useUserBackground 内部已感知 homeTheme === 'atlas'，会自动跳过 userBgLayer
  useUserBackground(homeTheme);

  if (homeTheme === 'atlas') {
    return (
      <Suspense fallback={<AtlasLoading />}>
        <AtlasApp />
      </Suspense>
    );
  }

  return <ClassicTree />;
}
