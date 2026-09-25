import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';
import { cn } from '@/lib/cn';

const API_BASE = 'https://api.oscarstudio.cn';
const LS_USER_KEY = 'ai_user';

interface SessionUser {
  username?: string;
  email?: string;
  is_guest?: boolean;
}

function getLoginUrl(): string {
  const ret = window.location.href;
  // Auth page returns to current URL; api.oscarstudio.cn validates same-origin via isLocalUrl.
  return `${API_BASE}/auth.html?return=${encodeURIComponent(ret)}`;
}

function readUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function UserButton() {
  const fine = useFinePointer();
  const [user, setUser] = useState<SessionUser | null>(() => readUser());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Listen for login/logout events from user-button.js (cross-tab storage events too).
  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener('user:login-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('user:login-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // ignore — localStorage cleanup still happens
    }
    localStorage.removeItem('ai_token');
    localStorage.removeItem(LS_USER_KEY);
    setUser(null);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('user:login-changed', { detail: { loggedIn: false } }));
    // Use reload so any cached `/api/user` reads and DOM state reset.
    window.location.reload();
  };

  // ---------- Logged out ----------
  if (!user) {
    return (
      <a
        href={getLoginUrl()}
        target="_blank"
        rel="noopener"
        data-cursor={fine ? 'Login' : undefined}
        className="flex items-center gap-2 rounded-pill border border-hairline-strong px-3 py-1.5 text-[12px] hover:bg-ink hover:text-paper transition-colors duration-300"
      >
        <span>Login</span>
      </a>
    );
  }

  // ---------- Logged in ----------
  const firstChar = (user.username ?? 'U').charAt(0).toUpperCase();
  const isGuest = !!user.is_guest;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor={user.username}
        aria-label={user.username}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-pill border border-hairline-strong pl-1 pr-3 py-1 text-[12px] hover:border-ink transition-colors duration-300"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-ink text-paper font-medium text-[11px]">
          {firstChar}
        </span>
        <span className="hidden md:inline">{user.username}</span>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full mt-2 w-60 rounded-card border border-hairline-strong bg-paper overflow-hidden z-50',
            'shadow-[0_18px_48px_rgba(10,10,10,0.12)]',
          )}
        >
          <div className="px-4 py-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium">{user.username}</span>
              {isGuest && (
                <span className="text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-pill border border-accent/40 text-accent">
                  访客
                </span>
              )}
            </div>
            <div className="mt-1 text-[11px] text-mute truncate">
              {user.email || (isGuest ? '临时访客 · 7 天有效' : '')}
            </div>
          </div>

          {isGuest && (
            <a
              href={`${API_BASE}/auth.html?action=promote&return=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener"
              data-cursor="Upgrade"
              className="block px-4 py-2.5 text-[12px] hover:bg-canvas-soft border-b border-hairline"
            >
              升级账号 →
            </a>
          )}

          <a
            href={`${API_BASE}/user/settings`}
            target="_blank"
            rel="noopener"
            data-cursor="Settings"
            className="block px-4 py-2.5 text-[12px] hover:bg-canvas-soft"
          >
            UI 设置
          </a>

          <button
            type="button"
            onClick={handleLogout}
            data-cursor="Logout"
            className="block w-full text-left px-4 py-2.5 text-[12px] text-[color:var(--accent,)] hover:bg-canvas-soft border-t border-hairline"
            style={{ color: 'var(--accent)' }}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}