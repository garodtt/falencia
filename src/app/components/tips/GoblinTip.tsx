import {
  CLAN,
  ITEMS,
  KINGS,
  TNAME,
  TR,
  TRAITS,
  crownOf,
  TRAIT_ITEM,
  TICO,
  gc,
  gv,
} from '../../../game/data.ts';
import type { Gob } from '../../../game/data.ts';
import { monCurse, traitsOf } from '../../../game/rules.ts';
import { G, ME } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { CLAN_COLOR } from '../cards/cardBase.ts';
import { Icon } from '../Icon.tsx';
import { TipBody, TipNote, TipRow } from '../tooltip/TipBody.tsx';

// O goblin: território, valor nesta rodada e as características. Só explica o que importa agora:
// a característica herdada do rei ou rainha da cor do goblin; com `p` (o dono, numa partida), o
// Disfarce, a passiva do monstro e os itens que o dono tem na mão para aproveitar alguma característica.
export function GoblinTip({ g, p }: { g: Gob; p?: Player }) {
  const v = gv(g),
    clan = gc(g),
    printed = TR[v],
    crown = crownOf(g);
  const live = p && G && G.rd ? p : undefined; // fora de partida (menu): só o que está na carta
  const traits = live ? traitsOf(live, g) : printed | crown;
  const cursed = live ? !!(traits & monCurse()) : false;
  return (
    <TipBody accent={CLAN_COLOR[clan]} title={`Goblin ${v}`} sub={`Território ${CLAN[clan]}`}>
      {cursed ? (
        <TipNote
          warn
        >{`Vale 0 nesta rodada: a passiva do monstro anula ${cursedBy(traits)}.`}</TipNote>
      ) : null}
      {TRAITS.filter((t) => traits & t).map((t) => (
        <TipRow
          key={t}
          icon={<Icon name={TICO[t]} />}
          name={TNAME[t]}
          tag={printed & t ? null : crown & t ? `herdada de ${KINGS[clan].name}` : 'do Disfarce'}
        >
          {live && live.id === ME ? itemFor(live, t) : null}
        </TipRow>
      ))}
    </TipBody>
  );
}

// as características do goblin que a passiva do monstro anula
const cursedBy = (t: number) =>
  TRAITS.filter((x) => t & x & monCurse())
    .map((x) => TNAME[x])
    .join(' e ');

// os itens que você tem e que dão efeito a esta característica (nada, se não tiver). Só nas
// suas cartas: os itens dos rivais são segredo.
function itemFor(p: Player, t: number) {
  const ks = (TRAIT_ITEM[t] || []).filter((k) => p.items.includes(k));
  return ks.length
    ? ks.map((k) => (
        <span key={k} className="block">{`Você tem ${ITEMS[k][0]}: ${ITEMS[k][1]}`}</span>
      ))
    : null;
}
