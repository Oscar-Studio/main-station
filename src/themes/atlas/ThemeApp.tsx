import { useEffect, useRef, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { StudioArtwork } from './components/studio/StudioArtwork';
import { Icon } from './components/studio/Icon';
import { CATEGORIES, PROJECTS, findTools } from './data/studio';
import atlasCss from './styles/globals.css?inline';

export default function ThemeApp() {
  const [theme, , toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const results = findTools(query, category);
  const exploring = Boolean(query.trim()) || category !== 'all';

  const focusSearch = () => {
    setMenuOpen(false);
    searchRef.current?.focus({ preventScroll: true });
    searchRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        event.stopImmediatePropagation();
        focusSearch();
      }
      if (event.key === 'Escape') {
        setMenuOpen(false);
        if (menuOpen) menuRef.current?.focus();
      }
    };
    // Capture before the global Opilot document shortcut; Atlas owns tool search.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [menuOpen]);

  return (
    <div id="atlas-scope" data-theme={theme}>
      <style>{atlasCss}</style>
      <a className="st-skip" href="#studio-main">跳至主要内容</a>
      <header className="st-header">
        <div className="st-shell st-header-inner">
          <a className="st-brand" href="#studio-top" aria-label="Oscar Studio 首页"><span className="st-brand-mark" aria-hidden="true">✳</span> Oscar Studio</a>
          <nav className="st-desktop-nav" aria-label="主导航">
            <a href="#explore">探索工具</a><a href="#projects">关于项目</a><a href="https://docs.oscarstudio.cn/" target="_blank" rel="noopener noreferrer">文档 <span aria-hidden="true">↗</span></a>
          </nav>
          <div className="st-header-actions">
            <button className="st-icon-button" onClick={focusSearch} aria-label="搜索工具"><Icon name="search" /></button>
            <button className="st-icon-button st-theme-button" onClick={toggleTheme} aria-label={theme === 'paper' ? '切换深色模式' : '切换浅色模式'}><Icon name={theme === 'paper' ? 'moon' : 'sun'} /></button>
            <div id="userButtonContainer" />
            <button ref={menuRef} className="st-icon-button st-menu-button" aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'} aria-expanded={menuOpen} aria-controls={menuOpen ? 'studio-mobile-nav' : undefined} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
          </div>
        </div>
        {menuOpen && <nav id="studio-mobile-nav" className="st-mobile-nav st-shell" aria-label="移动端导航" onClick={() => setMenuOpen(false)}><a href="#explore">探索工具 <span>↘</span></a><a href="#projects">关于项目 <span>↘</span></a><a href="https://docs.oscarstudio.cn/" target="_blank" rel="noopener noreferrer">使用文档 <span>↗</span></a></nav>}
      </header>

      <main id="studio-main" tabIndex={-1}>
        <section id="studio-top" className="st-shell st-hero" aria-labelledby="studio-title">
          <div className="st-hero-copy">
            <p className="st-eyebrow"><span className="st-small-star" aria-hidden="true">✳</span> 一个装得下好奇心的工具工作室</p>
            <h1 id="studio-title">让灵感，<br /><span>有处落地。</span><i aria-hidden="true">↗</i></h1>
            <p className="st-hero-description">探索 AI、教学、实用工具与游戏，<br className="st-desktop-break" />把想到的事做出来。</p>
            <div className="st-hero-actions"><a className="st-button" href="#explore">探索工具 <Icon name="arrow" /></a><a className="st-text-link" href="https://ai.oscarstudio.cn/" target="_blank" rel="noopener noreferrer">打开 AI Studio <span aria-hidden="true">↗</span></a></div>
            <div className="st-hero-note"><span aria-hidden="true">↳</span> 从一个小想法，到下一件有意思的事。</div>
          </div>
          <div className="st-hero-art"><StudioArtwork /><div className="st-art-caption"><span>THE WORKBENCH</span><span>想法正在发生 / 01</span></div></div>
        </section>

        <nav className="st-shell st-shortcuts" aria-label="子站快捷入口">
          {PROJECTS.map((project, index) => <a key={project.id} href={project.href} target="_blank" rel="noopener noreferrer"><span className="st-shortcut-number">0{index + 1}</span><Icon name={project.icon} /><span>{project.shortName}</span><span className="st-shortcut-arrow" aria-hidden="true">↗</span></a>)}
        </nav>

        <section id="explore" className="st-shell st-explore" aria-labelledby="explore-title">
          <div className="st-section-heading"><div><p className="st-eyebrow">THE TOOLBOX / 工具箱</p><h2 id="explore-title">好工具，随手可得<span className="st-orange">。</span></h2></div><p className="st-section-aside">少一点繁琐，<br />多一点创造的时间。</p></div>
          <div className="st-search-row"><div className="st-search"><Icon name="search" /><label className="st-sr-only" htmlFor="studio-search">搜索工具名称、分类或关键词</label><input id="studio-search" ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="找个工具，开始做点什么…" autoComplete="off" />{query ? <button className="st-icon-button" aria-label="清空搜索" onClick={() => { setQuery(''); searchRef.current?.focus(); }}><Icon name="close" /></button> : <kbd>⌘ / Ctrl K</kbd>}</div><span className="st-search-hint">好奇什么，就搜什么。</span></div>
          <div className="st-filter-row"><div className="st-filters" role="group" aria-label="工具分类">{CATEGORIES.map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><p className="st-result-count" role="status">{exploring ? `${results.length} 个结果` : '从这 6 个开始'}</p></div>
          <div className="st-tool-grid">{results.map((tool, index) => <a className="st-tool" key={tool.id} href={tool.href} target="_blank" rel="noopener noreferrer"><div className="st-tool-top"><span className={`st-tool-symbol st-tint-${tool.category}`}><Icon name={tool.icon} /></span><span className="st-tool-category">{tool.categoryLabel}</span><span className="st-tool-arrow" aria-hidden="true">↗</span></div><h3>{tool.name}</h3><p>{tool.description}</p><div className="st-tool-bottom"><span>打开工具</span><span className="st-mono">{String(index + 1).padStart(2, '0')}</span></div></a>)}</div>
          {results.length === 0 && <div className="st-empty"><Icon name="search" /><h3>暂时没找到这个工具</h3><p>试试「计算器」「写作」或切换分类。</p><button className="st-text-link" onClick={() => { setQuery(''); setCategory('all'); searchRef.current?.focus(); }}>清空搜索与筛选 <span aria-hidden="true">↗</span></button></div>}
          {!exploring && <div className="st-explore-end"><span>还有更多小而实用的工具，等你发现。</span><button className="st-text-link" onClick={() => setCategory('tools')}>查看实用工具 <span aria-hidden="true">↗</span></button></div>}
        </section>

        <section id="projects" className="st-project-section" aria-labelledby="projects-title"><div className="st-shell">
          <div className="st-section-heading"><div><p className="st-eyebrow">FIVE SPACES. ENDLESS POSSIBILITIES.</p><h2 id="projects-title">各有天地，都有意思<span className="st-orange">。</span></h2></div><p className="st-section-aside">认真做事，也认真玩。<br />找到属于你的那一块。</p></div>
          <div className="st-project-grid">{PROJECTS.map((project, index) => <a className={`st-project st-project-${project.id}`} key={project.id} href={project.href} target="_blank" rel="noopener noreferrer"><div className="st-project-meta"><span>0{index + 1} / {project.english}</span><span aria-hidden="true">↗</span></div><div className={`st-project-art st-project-art-${project.id}`} aria-hidden="true">{project.id === 'ai' ? <><span className="st-orbit" /><span className="st-ai-star">✳</span><span className="st-art-label">WHAT IF?</span></> : project.id === 'teaching' ? <><span className="st-axis" /><span className="st-formula">ƒ(x)</span><span className="st-math-circle" /></> : project.id === 'tools' ? <><span className="st-mini-window">Aa<span /> <b>Make it simple.</b></span><span className="st-mini-square" /></> : project.id === 'games' ? <><span className="st-game-tile">2</span><span className="st-game-tile">4</span><span className="st-game-tile">8</span><span className="st-game-tile">16</span></> : <><span className="st-slide-back" /><span className="st-slide-front">Ideas,<br /><i>in motion.</i><small>01 — OSCAR STUDIO</small></span></>}</div><div className="st-project-copy"><h3>{project.name}</h3><p>{project.description}</p><span className="st-project-link">{project.action} <span aria-hidden="true">↗</span></span></div></a>)}</div>
        </div></section>

        <section className="st-shell st-closing"><span className="st-closing-star" aria-hidden="true">✳</span><div><p className="st-eyebrow">STAY CURIOUS. KEEP MAKING.</p><h2>下一件有意思的事，<br />就从这里开始。</h2></div><a className="st-button" href="#explore">找到你的工具 <Icon name="arrow" /></a></section>
      </main>
      <footer className="st-footer"><div className="st-shell"><div className="st-footer-top"><div><a className="st-brand" href="#studio-top"><span className="st-brand-mark" aria-hidden="true">✳</span> Oscar Studio</a><p>为学习、创作和日常的小灵感，做一些好用的工具。</p></div><div className="st-footer-links"><a href="https://docs.oscarstudio.cn/" target="_blank" rel="noopener noreferrer">使用文档 ↗</a><a href="https://github.com/Oscar-Studio" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="#studio-top">回到顶部 ↑</a></div></div><div className="st-footer-bottom"><span>© {new Date().getFullYear()} Oscar Studio</span><span>保持好奇，动手创造。</span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备2026012488号-1</a></div></div></footer>
    </div>
  );
}
