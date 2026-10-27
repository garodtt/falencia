import type { ComponentProps } from 'react';
import { TR, gc, gv } from '../../../game/data.ts';
import type { Gob } from '../../../game/data.ts';
import type { Player } from '../../../game/types.ts';
import { Icon, TraitIcons } from '../Icon.tsx';
import { GoblinTip } from '../tips/GoblinTip.tsx';
import { useTooltip } from '../tooltip/useTooltip.tsx';
import { CARD_BASE, CLAN_BG, CLAN_TEXT } from './cardBase.ts';

type Props = Omit<ComponentProps<'div'>, 'title' | 'ref'> & {
  g: Gob;
  eff?: number; // valor efetivo (Maldição etc.); aparece no canto se for diferente do impresso
  kingLend?: boolean; // ganhou as características do rei
  owner?: Player; // de quem é (o balão explica o que o rei, o Disfarce e a Maldição mudam)
  sm?: boolean; // versão pequena (voando, ou virada do rival): esconde valor/traços/selos
};

const traitSize = {
  width: 'calc(var(--cw) * 0.17)',
  height: 'calc(var(--cw) * 0.17)',
  strokeWidth: 2.2,
};

// carta de goblin: cor do território, valor e características (passe o mouse para detalhes)
export function GobCard({ g, eff, kingLend, owner, sm, className = '', ...rest }: Props) {
  const v = gv(g),
    clan = gc(g);
  const tip = useTooltip(() => <GoblinTip g={g} p={owner} />);
  return (
    <>
      <div
        data-card
        className={`${CARD_BASE} ${CLAN_BG[clan]} ${CLAN_TEXT[clan]} grid grid-rows-[auto_1fr_auto] border border-white/[0.14] p-[calc(var(--cw)*0.1)] ${className}`}
        {...tip.anchor(rest)}
      >
        {!sm && eff !== undefined && eff !== v && (
          <span className="absolute -top-[7px] -right-[7px] z-[2] rounded-full border border-accent bg-bg px-1.5 font-ui text-xs font-extrabold text-accent">
            {eff}
          </span>
        )}
        {!sm && kingLend && (
          <span className="absolute -top-2 -left-1.5 z-[2] grid size-[18px] place-items-center rounded-full bg-bg text-accent">
            <Icon name="crown" style={{ width: 12, height: 12 }} />
          </span>
        )}
        {!sm && (
          <span className="font-ui text-[calc(var(--cw)*0.16)] leading-none font-bold opacity-[0.85]">
            {v}
          </span>
        )}
        <span className="place-self-center font-display text-[calc(var(--cw)*0.52)] leading-none font-extrabold tracking-[-1px]">
          {v}
        </span>
        {!sm && (
          <span className="flex justify-center gap-[calc(var(--cw)*0.04)] opacity-90">
            <TraitIcons t={TR[v]} style={traitSize} />
          </span>
        )}
      </div>
      {tip.tooltip}
    </>
  );
}
