import { useEffect, useRef, useState } from 'react';

function cacheKey() {
  try {
    const raw = token();
    if (raw) { const data = JSON.parse(atob(raw.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).data; return `oscar-atlas-cover:user:${data.id || data.user_id}`; }
  } catch { /* Fall back to guest cache. */ }
  return 'oscar-atlas-cover:guest';
}
const KEY = cacheKey();
export const DEMO_COVER = 'https://api.oscarstudio.cn/default-bg.jpeg';
type Cover = { image: string; overlay: number; blur: number; objectKey?: string; cloudImage?: string };
const EMPTY: Cover = { image: '', overlay: 35, blur: 0 };
const resolveImage = (url: string) => url.startsWith('/') && !url.startsWith('//') ? `https://api.oscarstudio.cn${url}` : url;
const base = () => window.API_BASE || 'https://api.oscarstudio.cn';
function token() {
  const cookie = document.cookie.match(/(?:^|;\s*)userToken=([^;]*)/)?.[1];
  if (cookie) return decodeURIComponent(cookie);
  try { return localStorage.getItem('ai_token') || localStorage.getItem('userToken'); } catch { return null; }
}
async function api(path: string, body?: unknown) {
  const auth = token();
  const response = await fetch(`${base()}/api/ui${path}`, {
    method: body ? 'POST' : 'GET', credentials: 'include',
    headers: { ...(auth ? { Authorization: `Bearer ${auth}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || '背景保存失败，请重试');
  return data;
}
export function useHeroBackground() {
  const [cover, setCover] = useState<Cover>(() => {
    if (import.meta.env.DEV && new URLSearchParams(location.search).get('cover') === 'demo') return { ...EMPTY, image: DEMO_COVER };
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && typeof saved.image === 'string') return { ...EMPTY, ...saved };
      const legacy = localStorage.getItem('lg-bg');
      if (legacy) return { ...EMPTY, image: resolveImage(legacy) };
    } catch { /* Local storage is optional. */ }
    return EMPTY;
  });
  const [error, setError] = useState('');
  const [backgrounds, setBackgrounds] = useState<{ key: string; url: string }[]>([]);
  const revision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef(Promise.resolve());
  function apply(next: Cover) {
    setCover(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); }
    catch {
      try { localStorage.setItem(KEY, JSON.stringify({ ...next, image: next.cloudImage || next.image })); } catch { /* Cloud settings remain available. */ }
    }
  }
  useEffect(() => {
    let active = true;
    async function refresh() {
      if (!token()) return;
      const startRevision = revision.current;
      try {
        const { ui } = await api('');
        if (!active) return;
        setBackgrounds(ui.backgrounds || []);
        if (revision.current !== startRevision) return;
        // Keep existing local-only photos until the user explicitly uploads one.
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (startRevision > 0) {
          if (saved?.objectKey && saved.objectKey === ui.backgroundObjectKey) apply({ ...saved, image: saved.image.startsWith('data:') ? saved.image : ui.backgroundImage, cloudImage: ui.backgroundImage });
          return;
        }
        if (saved?.image?.startsWith('data:') && !saved.objectKey && !ui.backgroundObjectKey) return;
        const image = saved?.objectKey && saved.objectKey === ui.backgroundObjectKey && saved.image.startsWith('data:') ? saved.image : (ui.backgroundImage ? resolveImage(ui.backgroundImage) : '');
        const next = { image, cloudImage: ui.backgroundImage, objectKey: ui.backgroundObjectKey || undefined,
          overlay: Math.max(0, Math.min(70, (ui.backgroundOverlay ?? .35) * 100)), blur: Math.max(0, Math.min(16, ui.backgroundBlur ?? 0)) };
        apply(next);
        cachePhoto(next, startRevision);
      } catch { /* Keep local preview when offline. */ }
    }
    refresh();
    const interval = setInterval(refresh, 45 * 60 * 1000);
    return () => { active = false; clearInterval(interval); clearTimeout(timer.current); };
  }, []);
  function persist(next: Cover, currentRevision: number) {
    queue.current = queue.current.catch(() => {}).then(async () => {
      try {
        const { ui } = await api('', { backgroundObjectKey: next.objectKey || null,
          backgroundImage: next.objectKey ? undefined : (next.image || null), backgroundOverlay: next.overlay / 100, backgroundBlur: next.blur });
        if (revision.current === currentRevision && next.objectKey) {
          const saved = { ...next, image: next.image.startsWith('data:') ? next.image : ui.backgroundImage, cloudImage: ui.backgroundImage };
          apply(saved); cachePhoto(saved, currentRevision);
        }
      } catch (e) { if (revision.current === currentRevision) setError((e as Error).message); }
    });
  }
  function update(next: Cover) {
    const current = ++revision.current;
    setError('');
    apply(next);
    clearTimeout(timer.current);
    if (token() && (next.objectKey || !next.image.startsWith('data:'))) timer.current = setTimeout(() => persist(next, current), 400);
  }
  async function cachePhoto(next: Cover, expectedRevision: number) {
    if (!next.objectKey || next.image.startsWith('data:')) return;
    try {
      const response = await fetch(next.cloudImage || next.image);
      if (!response.ok) return;
      const blob = await response.blob();
      if (!blob.type.startsWith('image/') || blob.size > 3 * 1024 * 1024) return;
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(blob);
      });
      if (revision.current === expectedRevision) apply({ ...next, image: data });
    } catch { /* Network URL remains usable if the cache is unavailable. */ }
  }
  return { cover, update, error, setError, backgrounds };
}
