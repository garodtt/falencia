import type { ReactNode } from 'react';

// etiqueta de resultado: verde (venceu/cravou) ou vermelha (perdeu, faliu...)
export function Badge({ tone, children }: { tone: 'w' | 'l'; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-ui text-note font-bold tracking-[0.05em] uppercase ${
        tone === 'w' ? 'bg-good/22 text-good' : 'bg-bad/18 text-bad'
      }`}
    >
      {children}
    </span>
  );
}
