import React, { useMemo, useRef, useState, useEffect } from 'react';
import './SplitText.css';

// Pure-CSS SplitText — replicates the GSAP SplitText behaviour without requiring
// the paid GSAP SplitText plugin. Each character/word/line is wrapped in a
// span with a stagger delay, then a CSS transition reveals them on scroll-into-view.

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: { opacity?: number; y?: number };
  to?: { opacity?: number; y?: number };
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const TAG_KEY: Record<string, string> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  p: 'p', span: 'span', div: 'div',
};

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 22,
  duration = 0.7,
  ease = 'cubic-bezier(0.22, 1, 0.36, 1)',
  splitType = 'chars',
  from = { opacity: 0, y: 24 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'span',
  textAlign,
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) {
      setFontsLoaded(true);
      return;
    }
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true)).catch(() => setFontsLoaded(true));
    }
  }, []);

  const parts = useMemo(() => {
    if (splitType.includes('lines')) return text.split('\n');
    if (splitType.includes('words')) return text.split(/(\s+)/);
    return Array.from(text);
  }, [text, splitType]);

  useEffect(() => {
    if (!ref.current || !fontsLoaded) return;
    if (completedRef.current) return;

    const el = ref.current;
    const items = Array.from(el.querySelectorAll<HTMLElement>('.split-token'));

    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((t) => t.classList.add('is-in'));
      completedRef.current = true;
      onLetterAnimationComplete?.();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          items.forEach((t) => t.classList.add('is-in'));
          completedRef.current = true;
          onLetterAnimationComplete?.();
          io.disconnect();
          break;
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fontsLoaded, threshold, rootMargin, onLetterAnimationComplete, parts]);

  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    overflow: 'hidden',
    textAlign,
    whiteSpace: 'pre-wrap',
  };

  const tokenStyle = (i: number): React.CSSProperties => ({
    display: 'inline-block',
    opacity: from.opacity ?? 0,
    transform: `translateY(${from.y ?? 24}px)`,
    transition: `opacity ${duration}s ${ease}, transform ${duration}s ${ease}`,
    transitionDelay: `${i * delay}ms`,
    willChange: 'opacity, transform',
  });

  const targetOpacity = to.opacity ?? 1;
  const targetY = to.y ?? 0;

  // Render the appropriate tag element via dynamic component to keep ref types clean.
  // NOTE: 用 dangerouslySetInnerHTML 注入 CSS 字符串 — 不能用 `<style>{`...`}</style>`,
  // 因为 React 19 + esbuild production build 会把 <style> 的 string children 当成
  // text 节点注入到父元素,而不是创建 <style> 元素(已知 react@19 的变化)。
  const cssString = `.split-token.is-in { opacity: ${targetOpacity} !important; transform: translateY(${targetY}px) !important; }`;
  const content = (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssString }} />
      {parts.map((p, i) => {
        if (/^\s+$/.test(p)) {
          return <span key={`ws-${i}`}>{p}</span>;
        }
        if (splitType.includes('lines') && p === '') {
          return <br key={`br-${i}`} />;
        }
        return (
          <span key={i} className="split-token" style={tokenStyle(i)}>
            {p}
          </span>
        );
      })}
    </>
  );

  const tagKey = TAG_KEY[tag] ?? 'span';

  // Build element via createElement to bypass intrinsic JSX element type union complexity.
  return React.createElement(
    tagKey,
    {
      ref: ref as React.Ref<HTMLElement>,
      className: `split-text ${className}`,
      style: baseStyle,
    },
    content,
  );
};

export default SplitText;