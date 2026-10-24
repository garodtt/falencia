import type { ReactNode } from 'react';
import { G } from '../../../game/state.ts';
import type { Pending } from '../../../game/types.ts';
import { ChaosBack } from '../../components/cards/ChaosBack.tsx';
import { ItemBack } from '../../components/cards/ItemBack.tsx';
import { MonsterBack } from '../../components/cards/MonsterBack.tsx';
import { TipBody, TipNote } from '../../components/tooltip/TipBody.tsx';
import { useTooltip } from '../../components/tooltip/useTooltip.tsx';
import { drawItem, revealChaos } from '../actions.ts';

// os três montes: monstros, itens e Caos
export function Decks({ pe }: { pe: Pending | null }) {
  const ph = pe && pe.kind;
  return (
    <div className="decks">
      <Pile
        id="monsterDeck"
        countId="mCount"
        label="Monstros"
        hint="Cada rodada abre um monstro deste monte. Quando ele acaba, os usados voltam embaralhados."
        count={G.monsters.length}
      >
        {G.monsters.length ? (
          <>
            <MonsterBack />
            <MonsterBack />
            <MonsterBack />
          </>
        ) : null}
      </Pile>
      <Pile
        id="itemDeck"
        countId="iCount"
        label="Itens"
        hint="Quem vence uma rodada compra 1 item daqui."
        count={G.ideck.length}
        need={ph === 'draw' ? pe!.data.left : undefined}
        onClick={drawItem}
      >
        <ItemBack />
        <ItemBack />
        <ItemBack />
      </Pile>
      <Pile
        id="chaosDeck"
        countId="cCount"
        label="Caos"
        hint="No fim de cada rodada, uma carta de Caos muda a regra da próxima para todos."
        count={G.cdeck.length}
        need={ph === 'chaos' ? 1 : undefined}
        onClick={revealChaos}
      >
        <ChaosBack />
        <ChaosBack />
        <ChaosBack />
      </Pile>
    </div>
  );
}

// um monte: as cartas empilhadas, o nome e quantas restam. Com `need`, é clicável e mostra
// quantas cartas falta comprar.
function Pile({
  id,
  countId,
  label,
  hint,
  count,
  need,
  onClick,
  children,
}: {
  id: string;
  countId: string;
  label: string;
  hint: string;
  count: number;
  need?: number;
  onClick?: () => void;
  children: ReactNode;
}) {
  const tip = useTooltip(() => (
    <TipBody title={`${label}: ${count}`}>
      <TipNote>{hint}</TipNote>
    </TipBody>
  ));
  return (
    <div
      className={`pile ${need !== undefined ? 'drawable' : ''}`}
      id={id}
      {...tip.anchor({ onClick })}
    >
      <div className="stack">
        {children}
        {need !== undefined ? <span className="need">{need}</span> : null}
      </div>
      <span>
        {`${label} `}
        <b id={countId}>{count}</b>
      </span>
      {tip.tooltip}
    </div>
  );
}
