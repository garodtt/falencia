import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

// aviso vermelho com o ícone de alerta
export function Warn({ children }: { children: ReactNode }) {
  return (
    <span className="warn">
      <Icon name="alert" />
      {children}
    </span>
  );
}
