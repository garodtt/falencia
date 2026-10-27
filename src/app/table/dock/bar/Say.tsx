import type { ReactNode } from 'react';

// o texto da barra de ação
export function Say({ children }: { children: ReactNode }) {
  return <span className="text-[14px] text-muted">{children}</span>;
}
