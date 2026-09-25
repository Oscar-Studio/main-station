import type { ReactNode } from 'react';
import MagnetRaw from '@/components/effects/Magnet/Magnet';

// Thin wrapper over react-bits Magnet for project-internal use.
interface MagneticProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
  innerClassName?: string;
  as?: 'div' | 'span' | 'a' | 'button';
}

export function Magnetic({
  children,
  padding = 80,
  strength = 2,
  className,
  innerClassName,
}: MagneticProps) {
  return (
    <MagnetRaw
      padding={padding}
      magnetStrength={strength}
      wrapperClassName={className}
      innerClassName={innerClassName}
    >
      {children}
    </MagnetRaw>
  );
}