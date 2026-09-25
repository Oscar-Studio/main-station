import { StrictMode, useEffect } from 'react';
import { CustomCursor } from '@/components/overlays/CustomCursor';
import { ScrollProgress } from '@/components/overlays/ScrollProgress';
import { TopNav } from '@/components/nav/TopNav';
import { SectionIndicator } from '@/components/nav/SectionIndicator';
import { OpilotModal } from '@/components/nav/OpilotModal';
import { Hero } from '@/components/sections/Hero';
import { SectionIndex } from '@/components/sections/SectionIndex';
import { ModuleAI } from '@/components/sections/ModuleAI';
import { ModuleTeaching } from '@/components/sections/ModuleTeaching';
import { ModuleTools } from '@/components/sections/ModuleTools';
import { ModuleGames } from '@/components/sections/ModuleGames';
import { ModulePPT } from '@/components/sections/ModulePPT';
import { Closing } from '@/components/sections/Closing';
import { Footer } from '@/components/sections/Footer';
import { useTheme } from '@/hooks/useTheme';
import { useKeyPress } from '@/hooks/useKeyPress';
// 用 ?inline 让 Vite 把 CSS 作为字符串内联到 chunk,避免主 HTML <link>
// 预加载 crazy/4 的样式给所有 classic 用户下载。
import atlasCss from '@/styles/globals.css?inline';
import { useState } from 'react';

let styleInjected = false;

/**
 * atlas 主题(crazy/4):以 #atlas-scope 为根,挂载整棵 crazy/4 子树。
 * Vite alias 把 `@/` 指向 `src/themes/atlas`,所以这里的 import
 * 全部解析到本主题的 components/hooks/data/lib。
 *
 * 外层包 #atlas-scope 的目的:
 *   1. tailwind.config.ts 里 important: '#atlas-scope',utility 类只在子树里生效
 *   2. globals.css 里的 :where(#atlas-scope) 限定 CSS 变量 + body 背景只作用在子树
 *   3. 子树与 classic 树互不干扰,用户切换主题时独立卸载/重建
 */
export default function ThemeApp() {
  const [theme, , toggleTheme] = useTheme();
  const [opilotOpen, setOpilotOpen] = useState(false);

  // global ⌘K / Ctrl+K to open opilot
  useKeyPress('k', () => setOpilotOpen((v) => !v), { cmd: true });

  // Eagerly preload fonts so SplitText animation is not delayed
  useEffect(() => {
    if ('fonts' in document) {
      document.fonts.ready.catch(() => undefined);
    }
  }, []);

  // Inject scoped CSS once (StrictMode double-mount guard).
  useEffect(() => {
    if (styleInjected) return;
    styleInjected = true;
    const tag = document.createElement('style');
    tag.setAttribute('data-atlas-styles', '');
    tag.textContent = atlasCss;
    document.head.appendChild(tag);
  }, []);

  return (
    <StrictMode>
      <div id="atlas-scope" className="atlas-host relative bg-paper text-ink font-display min-h-screen">
        <CustomCursor />
        <ScrollProgress />
        <TopNav onOpenOpilot={() => setOpilotOpen(true)} />
        <SectionIndicator />
        <OpilotModal open={opilotOpen} onClose={() => setOpilotOpen(false)} />

        <main>
          <Hero />
          <SectionIndex />
          <ModuleAI />
          <ModuleTeaching />
          <ModuleTools />
          <ModuleGames />
          <ModulePPT />
          <Closing theme={theme} onToggleTheme={toggleTheme} />
        </main>

        <Footer />
      </div>
    </StrictMode>
  );
}