import { useCountUp } from '@/hooks/useCountUp';

interface CountUpProps {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function CountUp({ to, decimals = 0, duration, className }: CountUpProps) {
  const value = useCountUp(to, { duration, decimals });
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');
  return <span className={className}>{formatted}</span>;
}