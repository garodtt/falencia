import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

// aviso vermelho com o ícone de alerta
export function Warn({ children }: { children: ReactNode }) {
  return (
    <span
      data-warn
      className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--color-bad)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-bad)_12%,transparent)] px-2.5 py-1.5 text-[13px] text-bad"
    >
      <Icon name="alert" />
      {children}
    </span>
  );
}
