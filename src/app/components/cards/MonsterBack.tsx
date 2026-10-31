import type { ReactNode } from 'react';
import { Icon } from '../Icon.tsx';
import { CARD_BASE } from './cardBase.ts';

// verso do monstro; `children` são as pistas (Luneta, território) e `className` serve ao flip
export function MonsterBack({
  className = '',
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      data-card
      className={`${CARD_BASE} grid place-items-center border border-mon-edge bg-mon-back text-moon ${className}`}
    >
      <Icon
        name="moon"
        style={{
          width: 'calc(var(--cw) * 0.36)',
          height: 'calc(var(--cw) * 0.36)',
          strokeWidth: 1.4,
        }}
      />
      {children}
    </div>
  );
}
