import {
  CLAN,
  ITEMS,
  KINGS,
  TNAME,
  TR,
  TRAITS,
  TRAIT_ITEM,
  TICO,
  gc,
  gv,
} from '../../../game/data.ts';
import type { Gob } from '../../../game/data.ts';
import { lendsTo, traitsOf, val } from '../../../game/rules.ts';
import { G, ME } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { CCSS } from '../../../ui/html.ts';
import { Icon } from '../Icon.tsx';
import { TipBody, TipNote, TipRow } from '../tooltip/TipBody.tsx';

// O goblin: território, valor nesta rodada e as características. Só explica o que importa agora:
// com `p` (o dono, numa partida), o que o rei emprestou, o Disfarce, a Maldição e os itens que
// o dono tem na mão para aproveitar alguma característica.
export function GoblinTip({ g, p }: { g: Gob; p?: Player }) {
  const v = gv(g),
    clan = gc(g),
    printed = TR[v];
  const live = p && G && G.rd ? p : undefined; // fora de partida (menu): só o que está impresso
  const traits = live ? traitsOf(live, g) : printed;
  const fromKing = live && lendsTo(live, g) ? KINGS[live.king].tr & ~printed : 0;
  const cursed = live ? val(live, g) !== v : false;
  return (
    <TipBody accent={CCSS[clan]} title={`Goblin ${v}`} sub={`Território ${CLAN[clan]}`}>
      {cursed ? (
        <TipNote warn>{`Vale 0 nesta rodada: a Maldição anula ${TNAME[G.curse]}.`}</TipNote>
      ) : null}
      {TRAITS.filter((t) => traits & t).map((t) => (
        <TipRow
          key={t}
          icon={<Icon name={TICO[t]} />}
          name={TNAME[t]}
          tag={printed & t ? null : fromKing & t ? `de ${KINGS[live!.king].name}` : 'do Disfarce'}
        >
          {live && live.id === ME ? itemFor(live, t) : null}
        </TipRow>
      ))}
    </TipBody>
  );
}

// o item que você tem e que dá efeito a esta característica (nada, se não tiver). Só nas suas
// cartas: os itens dos rivais são segredo.
function itemFor(p: Player, t: number) {
  const k = TRAIT_ITEM[t];
  return k && p.items.includes(k) ? `Você tem ${ITEMS[k][0]}: ${ITEMS[k][1]}` : null;
}
