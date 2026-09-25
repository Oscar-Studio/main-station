import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
}

export function Pill({ children, variant = 'default', className, ...rest }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill px-4 py-2 text-eyebrow font-mono uppercase tracking-[0.14em]',
        variant === 'default' && 'bg-ink text-paper border border-ink',
        variant === 'outline' && 'border border-hairline-strong text-ink bg-transparent',
        variant === 'ghost' && 'text-ink bg-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
}

export function PillButton({ children, variant = 'primary', className, ...rest }: PillButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-[14px] font-medium transition-all duration-300 ease-snap',
        variant === 'primary' && 'bg-ink text-paper hover:bg-ink-2',
        variant === 'ghost' && 'border border-hairline-strong text-ink bg-transparent hover:bg-ink hover:text-paper',
        variant === 'outline' && 'border border-hairline-strong text-ink bg-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}