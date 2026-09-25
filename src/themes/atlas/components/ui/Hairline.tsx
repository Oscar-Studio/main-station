import { cn } from '@/lib/cn';

interface HairlineProps {
  className?: string;
  strong?: boolean;
}

export function Hairline({ className, strong }: HairlineProps) {
  return (
    <div
      className={cn(
        'h-px w-full',
        strong ? 'bg-hairline-strong' : 'bg-hairline',
        className,
      )}
      aria-hidden
    />
  );
}