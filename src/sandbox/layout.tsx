// Peças de layout das páginas do sandbox (não são do jogo).
import type { ReactNode } from 'react';

// um grupo dentro da seção: título, explicação curta e os exemplos
export function Bloco({
  titulo,
  desc,
  children,
}: {
  titulo: string;
  desc?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3 rounded-panel border border-line bg-surface p-4">
      <div>
        <h3 className="m-0 font-display text-lg font-semibold">{titulo}</h3>
        {desc && <p className="m-0 mt-1 text-small text-muted">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

// um exemplo com o nome (classe, componente, token) embaixo
export function Amostra({ nome, children }: { nome: string; children: ReactNode }) {
  return (
    <figure className="m-0 grid justify-items-center gap-1.5">
      {children}
      <figcaption className="font-mono text-note text-muted">{nome}</figcaption>
    </figure>
  );
}

export const LINHA = 'flex flex-wrap items-end gap-4';
