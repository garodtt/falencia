import type { CSSProperties, ReactNode } from 'react';
import css from './Tooltip.module.css';

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
    <div className={css.body} style={{ '--tip-accent': accent } as CSSProperties}>
      <div className={css.title}>{title}</div>
      {sub ? <div className={css.sub}>{sub}</div> : null}
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
    <div className={css.row}>
      <span>{icon}</span>
      <div>
        <b>{name}</b>
        {tag ? <span className={css.tag}>{tag}</span> : null}
        {children ? <span className={css.desc}>{children}</span> : null}
      </div>
    </div>
  );
}

// parágrafo comum (`warn` = algo que está atrapalhando agora, em vermelho)
export function TipNote({ warn, children }: { warn?: boolean; children: ReactNode }) {
  return <p className={warn ? css.warn : css.note}>{children}</p>;
}
