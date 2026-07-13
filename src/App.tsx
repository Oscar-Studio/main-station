import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolSection from './components/ToolSection';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useUserBackground } from './lib/useUserBackground';

function useExternalScripts() {
  useEffect(() => {
    const id = 'oscar-user-button';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://ai.oscarstudio.cn/user-button.js';
    s.crossOrigin = 'anonymous';
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

function useBrowserClass() {
  useEffect(() => {
    const isChromium = /Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/CriOS|EdgiOS/.test(navigator.userAgent);
    if (!isChromium) document.body.classList.add('no-lg-refraction');
  }, []);
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
        href="https://tools.oscarstudio.cn"
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
