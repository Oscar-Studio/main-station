import { useEffect } from 'react';

declare global {
  interface Window {
    API_BASE?: string;
    UPLOAD_BASE?: string;
    OscarBackground?: {
      set: (url: string) => void;
      clear: () => void;
    };
  }
}

const DEFAULT_API_BASE = 'https://api.oscarstudio.cn';
const DEFAULT_UPLOAD_BASE = 'https://api.oscarstudio.cn';
const BG_STORAGE_KEY = 'lg-bg';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function applyBackground(url: string) {
  if (typeof document === 'undefined') return;
  const body = document.body;
  body.style.backgroundImage = `url(${url})`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundAttachment = 'fixed';
  body.dataset.bgReady = '1';
}

function clearBackground() {
  if (typeof document === 'undefined') return;
  const body = document.body;
  body.style.backgroundImage = '';
  body.style.backgroundSize = '';
  body.style.backgroundPosition = '';
  body.style.backgroundRepeat = '';
  body.style.backgroundAttachment = '';
  delete body.dataset.bgReady;
}

function persist(url: string) {
  try {
    window.localStorage.setItem(BG_STORAGE_KEY, url);
  } catch {
    /* ignore quota errors */
  }
}

async function loadFromApi(): Promise<string | null> {
  const token = window.localStorage.getItem('ai_token') || readCookie('userToken');
  if (!token) return null;
  const apiBase = (window.API_BASE || DEFAULT_API_BASE) + '/api';
  try {
    const resp = await fetch(`${apiBase}/ui`, { credentials: 'include' });
    if (!resp.ok) return null;
    const data = await resp.json().catch(() => null);
    if (!data?.success || !data.ui?.backgroundImage) return null;
    const uploadBase = window.UPLOAD_BASE || DEFAULT_UPLOAD_BASE;
    return uploadBase + data.ui.backgroundImage;
  } catch {
    return null;
  }
}

export function useUserBackground() {
  useEffect(() => {
    let cancelled = false;

    const cached = window.localStorage.getItem(BG_STORAGE_KEY);
    if (cached) applyBackground(cached);

    window.OscarBackground = {
      set(url: string) {
        applyBackground(url);
        persist(url);
      },
      clear() {
        clearBackground();
        try {
          window.localStorage.removeItem(BG_STORAGE_KEY);
        } catch {
          /* ignore */
        }
      },
    };

    loadFromApi().then((url) => {
      if (cancelled || !url) return;
      applyBackground(url);
      persist(url);
    });

    return () => {
      cancelled = true;
    };
  }, []);
}
