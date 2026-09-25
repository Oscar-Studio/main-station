import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  wide?: boolean;
}

export function Container({ children, wide, className, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(wide ? 'max-w-container-wide' : 'max-w-container', 'mx-auto px-8 w-full', className)}
      {...rest}
    >
      {children}
    </div>
  );
}