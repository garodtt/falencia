import { CLAN, ITEMS, TNAME } from '../../game/data.ts';
import type { Round, UsedItem } from '../../game/types.ts';
import { ItemTip } from './tips/ItemTip.tsx';
import { Tooltip } from './tooltip/Tooltip.tsx';

// um item usado na rodada, com o que foi escolhido (+2, Bandeira Azul...); riscado se levou NÃO!
export function Chip({ u }: { u: UsedItem }) {
  const [name, , when] = ITEMS[u.k];
  const detail = `${u.d ? ` ${u.d > 0 ? '+' : ''}${u.d}` : ''}${u.c !== undefined ? ` ${CLAN[u.c]}` : ''}${u.t ? ` ${TNAME[u.t]}` : ''}${u.x ? ' · cancelado' : ''}`;
  return (
    <Tooltip content={() => <ItemTip k={u.k} used={u} />}>
      {(anchor) => (
        <span className={`chip ${when} ${u.x ? 'x' : ''}`} {...anchor()}>
          {name + detail}
        </span>
      )}
    </Tooltip>
  );
}

// os itens usados por um jogador nesta rodada (nada, se nenhum)
export function UsedChips({ rd }: { rd: Round }) {
  if (!rd.used || !rd.used.length) return null;
  return (
    <div className="chips">
      {rd.used.map((u, i) => (
        <Chip key={i} u={u} />
      ))}
    </div>
  );
}
