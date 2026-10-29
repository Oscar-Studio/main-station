import { useEffect, useRef, useState } from 'react';
import COS from 'cos-js-sdk-v5';

const KEY = 'oscar-atlas-cover';
export const DEMO_COVER = 'https://api.oscarstudio.cn/default-bg.jpeg';
type Cover = { image: string; overlay: number; blur: number; objectKey?: string };
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
  const [uploading, setUploading] = useState(false);
  const revision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef(Promise.resolve());
  function apply(next: Cover) {
    setCover(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); }
    catch { setError('本机缓存空间不足，请重新选择图片保存到云端。'); }
  }
  useEffect(() => {
    let active = true;
    async function refresh() {
      if (!token()) return;
      const startRevision = revision.current;
      try {
        const { ui } = await api('');
        if (!active || revision.current !== startRevision) return;
        // Keep existing local-only photos until the user explicitly uploads one.
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (startRevision > 0) {
          if (saved?.objectKey && saved.objectKey === ui.backgroundObjectKey) apply({ ...saved, image: ui.backgroundImage });
          return;
        }
        if (saved?.image?.startsWith('data:') && !ui.backgroundObjectKey) return;
        apply({ image: ui.backgroundImage ? resolveImage(ui.backgroundImage) : '', objectKey: ui.backgroundObjectKey || undefined,
          overlay: Math.max(0, Math.min(70, (ui.backgroundOverlay ?? .35) * 100)), blur: Math.max(0, Math.min(16, ui.backgroundBlur ?? 0)) });
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
        if (revision.current === currentRevision && next.objectKey) apply({ ...next, image: ui.backgroundImage });
      } catch (e) { if (revision.current === currentRevision) setError((e as Error).message); }
    });
  }
  function update(next: Cover) {
    const current = ++revision.current;
    setError('');
    apply(next);
    clearTimeout(timer.current);
    if (token() && !next.image.startsWith('data:')) timer.current = setTimeout(() => persist(next, current), 400);
  }
  async function upload(file: File) {
    if (!token()) { setError('请先登录，再上传背景到云端。'); return; }
    setUploading(true); setError('');
    clearTimeout(timer.current);
    try {
      const { upload: ticket } = await api('/background-ticket', { type: file.type, size: file.size });
      const cos = new COS({ getAuthorization: (_options, callback) => callback(ticket.credentials) });
      await new Promise<void>((resolve, reject) => cos.putObject({ Bucket: ticket.Bucket, Region: ticket.Region, Key: ticket.Key,
        Body: file, ContentType: file.type }, error => error ? reject(new Error('图片上传失败，请重试')) : resolve()));
      const next = { ...cover, objectKey: ticket.Key };
      const current = ++revision.current;
      queue.current = queue.current.catch(() => {}).then(async () => {
        const { ui } = await api('', { backgroundObjectKey: ticket.Key, backgroundOverlay: next.overlay / 100, backgroundBlur: next.blur });
        if (revision.current === current) apply({ ...next, image: ui.backgroundImage });
      });
      await queue.current;
    } catch (e) { setError((e as Error).message); }
    finally { setUploading(false); }
  }
  return { cover, update, error, setError, upload, uploading };
}
