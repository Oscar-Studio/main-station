export type Theme = 'paper' | 'ink';

export const DEFAULT_THEME: Theme = 'paper';
export const THEME_STORAGE_KEY = 'oscar-crazy-4-theme';

export const THEME_LABELS: Record<Theme, string> = {
  paper: 'Paper',
  ink: 'Ink',
};