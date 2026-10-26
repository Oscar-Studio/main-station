import type { ReactNode } from 'react';

export function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    moon: <path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    menu: <path d="M4 7h16M4 17h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />,
    learn: <><path d="m3 8 9-5 9 5-9 5ZM6 10v7c4 3 8 3 12 0v-7M21 8v8" /></>,
    tools: <><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M8 8V4h8v4M4 13h16m-10 0v3h4v-3" /></>,
    game: <><rect x="3" y="6" width="18" height="14" rx="4" /><path d="M7 13h6m-3-3v6m6-4h.01M18 15h.01" /></>,
    slides: <><rect x="3" y="4" width="18" height="13" rx="1" /><path d="M12 17v5m-5 0 5-5 5 5M7 9h6m-6 4h10" /></>,
    pen: <path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4M4 16l4 4" />,
    text: <path d="M5 4h14M12 4v16M8 20h8M5 8V4m14 4V4" />,
    check: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="m8 12 3 3 5-6" /></>,
    calculator: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M8 6h8M8 10h8M8 14h1m6 0h1m-8 4h1m6 0h1" /></>,
    clock: <><circle cx="12" cy="13" r="8" /><path d="M12 9v5l3 2M9 2h6m-3 0v3" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.tools}</svg>;
}
