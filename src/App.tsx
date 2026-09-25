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
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://api.oscarstudio.cn/user-button.js';
    // 不设 crossOrigin:api.oscarstudio.cn 的静态资源 CORS 白名单只覆盖
    // oscarstudio.cn 域,dev 跑 localhost 时会触发 CORS 拒绝。script 标签
    // 默认不发 Origin header 所以不触发 CORS,反而是干净的跨域加载。
    s.async = true;
    document.body.appendChild(s);
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
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#7d8187',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
      }}
    >
      Loading Atlas…
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
