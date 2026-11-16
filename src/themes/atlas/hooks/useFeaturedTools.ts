import { useEffect, useState } from 'react';
import { getSessionToken } from '../lib/sessionToken';

export function useFeaturedTools() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let session: string | null = null;
    let request: AbortController | undefined;

    async function refresh() {
      request?.abort();
      const token = getSessionToken();
      if (token !== session) setIds([]);
      session = token;
      if (!token) return;

      const controller = new AbortController();
      request = controller;
      try {
        const response = await fetch(`${window.API_BASE || 'https://api.oscarstudio.cn'}/api/ui`, {
          credentials: 'include',
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 401 || response.status === 403) {
          setIds([]);
          return;
        }
        if (!response.ok) return;
        const { ui } = await response.json();
        if (controller.signal.aborted) return;
        const saved: unknown = ui?.featuredToolIds;
        setIds(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : []);
      } catch { /* Keep the last selection during a temporary connection failure. */ }
    }

    const onLoginChanged = () => { if (getSessionToken() !== session) void refresh(); };
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) void refresh(); };
    void refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('user:login-changed', onLoginChanged);
    return () => {
      request?.abort();
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('user:login-changed', onLoginChanged);
    };
  }, []);

  return ids;
}
