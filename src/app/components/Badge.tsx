import type { ReactNode } from 'react';

// etiqueta de resultado: verde (venceu/cravou) ou vermelha (perdeu, faliu...)
export function Badge({ tone, children }: { tone: 'w' | 'l'; children: ReactNode }) {
  return <span className={`res ${tone}`}>{children}</span>;
}
