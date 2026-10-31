import { CLAN, ITEMS, TNAME } from '../../game/data.ts';
import type { Round, UsedItem } from '../../game/types.ts';
import { KIND, itemKind } from './itemKind.ts';
import { ItemTip } from './tips/ItemTip.tsx';
import { Tooltip } from './tooltip/Tooltip.tsx';

// um item usado na rodada, com o que foi escolhido (+2, Bandeira Azul...); riscado se levou NÃO!
export function Chip({ u }: { u: UsedItem }) {
  const name = ITEMS[u.k][0];
  const detail = `${u.d ? ` ${u.d > 0 ? '+' : ''}${u.d}` : ''}${u.c !== undefined ? ` ${CLAN[u.c]}` : ''}${u.t ? ` ${TNAME[u.t]}` : ''}${u.x ? ' · cancelado' : ''}`;
  return (
    <Tooltip content={() => <ItemTip k={u.k} used={u} />}>
      <span
        data-chip
        className={`rounded-full px-2 py-0.5 text-note font-bold ${KIND[itemKind(u.k)].tint} ${
          u.x ? 'line-through opacity-60' : ''
        }`}
      >
        {name + detail}
      </span>
    </Tooltip>
  );
}

// os itens usados por um jogador nesta rodada (nada, se nenhum)
export function UsedChips({ rd }: { rd: Round }) {
  if (!rd.used || !rd.used.length) return null;
  return (
    <div className="col-span-full flex flex-wrap gap-1">
      {rd.used.map((u, i) => (
        <Chip key={i} u={u} />
      ))}
    </div>
  );
}
