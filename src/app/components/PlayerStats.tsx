import type { ReactNode } from 'react';
import { G } from '../../game/state.ts';
import type { Player } from '../../game/types.ts';
import { Icon } from './Icon.tsx';
import { TipBody, TipNote } from './tooltip/TipBody.tsx';
import { Tooltip } from './tooltip/Tooltip.tsx';

// um número com ícone (cartas, itens, cemitério), com o que ele significa no balão
export function Stat({
  icon,
  title,
  hint,
  n,
}: {
  icon: string;
  title: string;
  hint: string;
  n: number;
}) {
  return (
    <Tooltip
      content={() => (
        <TipBody title={`${title}: ${n}`}>
          <TipNote>{hint}</TipNote>
        </TipBody>
      )}
    >
      {(anchor) => (
        <span className="inline-flex items-center gap-1" {...anchor()}>
          <Icon name={icon} />
          <b className="font-bold text-text">{n}</b>
        </span>
      )}
    </Tooltip>
  );
}

// cartas na mão, itens e cemitério de um jogador; `children` entra no fim da linha
export function PlayerStats({ p, children }: { p: Player; children?: ReactNode }) {
  return (
    <div className="mt-[3px] flex flex-wrap gap-3 text-[13px] text-muted land:mt-0 land:gap-2 land:text-xs">
      <Stat
        icon="cards"
        title="Cartas na mão"
        hint="Quando acabarem, o jogador fale."
        n={p.hand.length}
      />
      <Stat
        icon="bag"
        title="Itens"
        hint="Quem vence uma rodada compra 1 item."
        n={p.items.length}
      />
      <Stat
        icon="grave"
        title="Cemitério"
        hint="Goblins perdidos: descartados ao perder ou eliminados por um rival."
        n={G.grave[p.id].length}
      />
      {children}
    </div>
  );
}
