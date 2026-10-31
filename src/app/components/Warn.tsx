import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

// aviso vermelho com o ícone de alerta
export function Warn({ children }: { children: ReactNode }) {
  return (
    <span
      data-warn
      className="inline-flex items-center gap-1.5 rounded-lg border border-bad/35 bg-bad/12 px-2.5 py-1.5 text-small text-bad"
    >
      <Icon name="alert" />
      {children}
    </span>
  );
}
