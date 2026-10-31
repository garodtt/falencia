import { CLAN, ITEMS, TNAME } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import type { UsedItem } from '../../../game/types.ts';
import { KIND, itemKind } from '../itemKind.ts';
import { TipBody, TipNote } from '../tooltip/TipBody.tsx';

// O item: quando se usa e o que faz. Com `used`, também o que foi escolhido e se levou NÃO!.
export function ItemTip({ k, used }: { k: ItemKey; used?: UsedItem }) {
  const [name, text] = ITEMS[k],
    kind = KIND[itemKind(k)];
  const choice = used && usedChoice(used);
  return (
    <TipBody accent={kind.accent} title={name} sub={kind.sub}>
      <TipNote>{text}</TipNote>
      {k === 'NAO' ? (
        <TipNote>
          Não tem botão: o jogo pergunta na hora em que alguém usa um item ou revela uma Armadilha.
        </TipNote>
      ) : k === 'ARMADILHA' ? (
        <TipNote>Não tem botão: fica escondida na sua mão até alguém tirar uma carta sua.</TipNote>
      ) : null}
      {choice ? <TipNote>{`Usado: ${choice}`}</TipNote> : null}
      {used && used.x ? <TipNote warn>Cancelado com NÃO!</TipNote> : null}
    </TipBody>
  );
}

function usedChoice(u: UsedItem) {
  if (u.d) return `${u.d > 0 ? '+' : ''}${u.d}`;
  if (u.c !== undefined) return CLAN[u.c];
  if (u.t) return TNAME[u.t];
  return '';
}
