import type { HTMLAttributes, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/cn';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  threshold?: number;
}

export function Reveal({ children, className, delay, threshold, ...rest }: RevealProps) {
  const ref = useReveal<HTMLDivElement>({ threshold });
  return (
    <div
      ref={ref}
      className={cn('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}