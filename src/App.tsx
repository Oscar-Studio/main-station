import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolSection from './components/ToolSection';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useUserBackground } from './lib/useUserBackground';
import { useGlassConfig } from './lib/useUserGlassConfig';
import { initWebGLGlass, destroyWebGLGlass } from './lib/webglGlass';

function useExternalScripts() {
  useEffect(() => {
    const id = 'oscar-user-button';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://api.oscarstudio.cn/user-button.js';
    s.crossOrigin = 'anonymous';
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

function useBrowserClass() {
  const gc = useGlassConfig();
  useEffect(() => {
    // 用 feature detection 代替 UA 嗅探：Safari 自 9 起支持
    // `-webkit-backdrop-filter`，但 @samasante/liquid-glass 在不支持
    // `backdrop-filter` 的浏览器里需要回落到 WebGL canvas 渲染折射。
    // 同时检查 unprefixed 与 webkit 形式，避免漏判。
    const supportsBD = (): boolean => {
      if (typeof CSS === 'undefined' || !CSS.supports) return false;
      return CSS.supports('backdrop-filter', 'blur(1px)')
        || CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    };
    if (supportsBD()) return;
    document.body.classList.add('no-lg-refraction');
    initWebGLGlass(gc);
    return () => destroyWebGLGlass();
  }, [gc]);
}

export default function App() {
  useExternalScripts();
  useUserBackground();
  useBrowserClass();
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
        id="html-ppt"
        icon="📊"
        titleKey="pptTitle"
        descKey="pptDesc"
        actionKey="pptAction"
        href="https://ppt.oscarstudio.cn"
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
      <Footer />
      <BackToTop />
    </>
  );
}
