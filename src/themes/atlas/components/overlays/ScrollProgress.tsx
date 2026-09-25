import { useScrollProgress } from '@/hooks/useScrollProgress';

export function ScrollProgress() {
  const p = useScrollProgress();
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 2,
        width: `${p * 100}%`,
        background: 'var(--accent)',
        zIndex: 9997,
        transition: 'width 0.15s ease-out',
      }}
    />
  );
}