import type { CSSProperties } from 'react';
import { TICO, TRAITS } from '../../game/data.ts';

// ícones do sprite <svg> do index.html (#i-crown, #i-moon...). O tamanho padrão (16px) e a
// espessura do traço vão em `style` (não em classe): assim quem precisa de outro tamanho
// (características na carta, coroa pequena...) só passa `style`, sem disputar com a classe base.
export function Icon({
  name,
  className = '',
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`inline-block flex-none align-[-3px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] ${className}`}
      style={{ width: 16, height: 16, strokeWidth: 1.8, ...style }}
      aria-hidden="true"
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}

// as características de um goblin (bitmask) como ícones
export function TraitIcons({ t, style }: { t: number; style?: CSSProperties }) {
  return TRAITS.filter((x) => t & x).map((x) => <Icon key={x} name={TICO[x]} style={style} />);
}
