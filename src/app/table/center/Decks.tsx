import type { ReactNode } from 'react';
import { G } from '../../../game/state.ts';
import type { Pending } from '../../../game/types.ts';
import { ChaosBack } from '../../components/cards/ChaosBack.tsx';
import { ItemBack } from '../../components/cards/ItemBack.tsx';
import { MonsterBack } from '../../components/cards/MonsterBack.tsx';
import { TipBody, TipNote } from '../../components/tooltip/TipBody.tsx';
import { useTooltip } from '../../components/tooltip/useTooltip.tsx';
import { drawItem, revealChaos } from '../actions.ts';

// o brilho de quem pode ser comprado agora (o monte de monstros nunca é clicável)
const GLOW =
  'shadow-[0_0_0_2px_var(--color-accent),0_0_18px_color-mix(in_srgb,var(--color-accent)_50%,transparent)]';

// os três montes: monstros, itens e Caos
export function Decks({ pe }: { pe: Pending | null }) {
  const ph = pe && pe.kind;
  return (
    <div className="flex items-end gap-3.5 max-[960px]:order-2 max-sm:col-start-2 max-sm:row-start-1 max-sm:flex-col max-sm:items-center max-sm:gap-2.5 land:order-none land:gap-2.5 max-[720px]:land:gap-1.5">
      <Pile
        id="monsterDeck"
        countId="mCount"
        label="Monstros"
        hint="Cada rodada abre um monstro deste monte. Quando ele acaba, os usados voltam embaralhados."
        count={G.monsters.length}
      >
        {G.monsters.length ? (
          <>
            <MonsterBack className="!absolute inset-0 translate-[5px]" />
            <MonsterBack className="!absolute inset-0 translate-[2.5px]" />
            <MonsterBack className="!absolute inset-0" />
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
        <ItemBack className="!absolute inset-0 translate-[5px]" />
        <ItemBack className="!absolute inset-0 translate-[2.5px]" />
        <ItemBack className={`!absolute inset-0 ${ph === 'draw' ? GLOW : ''}`} />
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
        <ChaosBack className="!absolute inset-0 translate-[5px]" />
        <ChaosBack className="!absolute inset-0 translate-[2.5px]" />
        <ChaosBack className={`!absolute inset-0 ${ph === 'chaos' ? GLOW : ''}`} />
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
  const act = need !== undefined && onClick;
  return (
    <div
      className={`relative grid justify-items-center gap-[5px] text-xs text-muted ${need !== undefined ? 'cursor-pointer' : ''}`}
      id={id}
      {...(act ? { role: 'button', tabIndex: 0 } : {})}
      {...tip.anchor({
        onClick,
        onKeyDown: act
          ? (e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              onClick();
            }
          : undefined,
      })}
    >
      <div className="relative h-[72px] w-[52px] [--cw:52px]">
        {children}
        {need !== undefined ? (
          <span className="absolute -top-2 -right-2 z-[3] grid h-[22px] min-w-[22px] place-items-center rounded-full bg-accent font-ui text-xs font-extrabold text-[#1d1600]">
            {need}
          </span>
        ) : null}
      </div>
      <span className="whitespace-nowrap">
        {`${label} `}
        <b className="text-text" id={countId}>
          {count}
        </b>
      </span>
      {tip.tooltip}
    </div>
  );
}
