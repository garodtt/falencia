import type { ReactNode } from 'react';
import { Icon } from '../Icon.tsx';

// verso do monstro; `children` são as pistas (Luneta, território) e `className` serve ao flip
export function MonsterBack({
  className = '',
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`card mback ${className}`}>
      <Icon name="moon" />
      {children}
    </div>
  );
}
