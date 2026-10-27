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
        <span
          data-chip
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            when === 'D'
              ? 'bg-[color-mix(in_srgb,var(--color-moon)_18%,transparent)] text-moon'
              : 'bg-[color-mix(in_srgb,var(--color-sun)_16%,transparent)] text-sun'
          } ${u.x ? 'line-through opacity-60' : ''}`}
          {...anchor()}
        >
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
    <div className="col-span-full flex flex-wrap gap-1">
      {rd.used.map((u, i) => (
        <Chip key={i} u={u} />
      ))}
    </div>
  );
}
