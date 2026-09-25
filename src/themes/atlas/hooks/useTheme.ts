import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from '@/data/themes';

function readStored(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'paper' || v === 'ink') return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  // atlas(crazy/4) 自己切 paper/ink,但不能动 <html> 的 data-theme —
  // <html> 的 data-theme 是主站 classic 主题在用(light/dark),
  // 两套独立。crazy/4 的 vars 定义在 :where(#atlas-scope) 上,
  // 所以这里只更新 #atlas-scope 的 data-theme 就够了。
  const scope = document.getElementById('atlas-scope');
  if (scope) scope.setAttribute('data-theme', t);
}

export function useTheme(): [Theme, (next: Theme) => void, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = readStored();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const set = useCallback((next: Theme) => setTheme(next), []);
  const toggle = useCallback(() => setTheme((t) => (t === 'paper' ? 'ink' : 'paper')), []);

  return [theme, set, toggle];
}