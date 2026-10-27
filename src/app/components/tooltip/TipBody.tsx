import type { CSSProperties, ReactNode } from 'react';

// a lombada colorida (à esquerda) diz do que o balão fala (território, lua/sol, rei...)
const body =
  "relative grid gap-1.5 pt-2.5 pr-3 pb-[11px] pl-[15px] before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[var(--tip-accent,var(--color-line))]";

// o miolo de um balão: título, subtítulo e o resto; `accent` é a cor da lombada
export function TipBody({
  accent,
  title,
  sub,
  children,
}: {
  accent?: string;
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={body} style={{ '--tip-accent': accent } as CSSProperties}>
      <div className="font-display text-[15px] leading-[1.2] font-semibold">{title}</div>
      {sub ? <div className="-mt-1 text-xs text-muted">{sub}</div> : null}
      {children}
    </div>
  );
}

// uma linha com ícone: nome em negrito, uma etiqueta opcional e a explicação embaixo
export function TipRow({
  icon,
  name,
  tag,
  children,
}: {
  icon: ReactNode;
  name: ReactNode;
  tag?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(18px,auto)_minmax(0,1fr)] items-start gap-1.5">
      <span className="inline-flex justify-center gap-0.5 pt-px">{icon}</span>
      <div>
        <b className="font-bold">{name}</b>
        {tag ? <span className="ml-1.5 text-[11px] font-bold text-accent">{tag}</span> : null}
        {children ? <span className="block text-xs text-muted">{children}</span> : null}
      </div>
    </div>
  );
}

// parágrafo comum (`warn` = algo que está atrapalhando agora, em vermelho)
export function TipNote({ warn, children }: { warn?: boolean; children: ReactNode }) {
  return <p className={`m-0 ${warn ? 'text-bad' : 'text-muted'}`}>{children}</p>;
}
