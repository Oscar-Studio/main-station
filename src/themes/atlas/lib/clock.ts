// Pure helpers for clock formatting — no React.

const pad = (n: number) => n.toString().padStart(2, '0');

export function formatTimeHMS(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatTimeHM(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}