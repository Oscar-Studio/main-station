import { createContext, useContext, useEffect, useState } from 'react';
import type { GlassOptics } from '@samasante/liquid-glass';

const API_BASE = 'https://api.oscarstudio.cn/api';

const DEFAULT_OPTICS: Partial<GlassOptics> = {
  sheenWidth: 80,
  strength: 0.7,
  curvature: 0.5,
  frost: 4,
  dispersion: 0.3,
  brightness: 0.06,
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
