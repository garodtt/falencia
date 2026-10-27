import type { ReactNode } from 'react';

// etiqueta de resultado: verde (venceu/cravou) ou vermelha (perdeu, faliu...)
export function Badge({ tone, children }: { tone: 'w' | 'l'; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-ui text-[11px] font-bold tracking-[0.05em] uppercase ${
        tone === 'w'
          ? 'bg-[color-mix(in_srgb,var(--color-good)_22%,transparent)] text-good'
          : 'bg-[color-mix(in_srgb,var(--color-bad)_18%,transparent)] text-bad'
      }`}
    >
      {children}
    </span>
  );
}
