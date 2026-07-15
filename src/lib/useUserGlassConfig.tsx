import { createContext, useContext, useEffect, useState } from 'react';
import type { GlassOptics } from '@samasante/liquid-glass';

const API_BASE = 'https://api.oscarstudio.cn/api';

const DEFAULT_OPTICS: Partial<GlassOptics> = {
  sheenWidth: 30,
  strength: 0.15,
  curvature: 0.15,
  frost: 3,
  dispersion: 0.10,
  brightness: 0.04,
};

const GlassConfigContext = createContext<Partial<GlassOptics>>(DEFAULT_OPTICS);

export function GlassConfigProvider({ children }: { children: React.ReactNode }) {
  const [optics, setOptics] = useState<Partial<GlassOptics>>(DEFAULT_OPTICS);

  useEffect(() => {
    const token = localStorage.getItem('ai_token');
    if (!token) return;
    fetch(`${API_BASE}/ui`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.ui?.liquidGlass?.params) {
          setOptics(prev => ({ ...prev, ...data.ui.liquidGlass.params }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <GlassConfigContext.Provider value={optics}>
      {children}
    </GlassConfigContext.Provider>
  );
}

export function useGlassConfig(): Partial<GlassOptics> {
  return useContext(GlassConfigContext);
}
