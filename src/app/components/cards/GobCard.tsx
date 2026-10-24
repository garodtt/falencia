import type { ComponentProps } from 'react';
import { TR, gc, gv } from '../../../game/data.ts';
import type { Gob } from '../../../game/data.ts';
import type { Player } from '../../../game/types.ts';
import { Icon, TraitIcons } from '../Icon.tsx';
import { GoblinTip } from '../tips/GoblinTip.tsx';
import { useTooltip } from '../tooltip/useTooltip.tsx';

type Props = Omit<ComponentProps<'div'>, 'title' | 'ref'> & {
  g: Gob;
  eff?: number; // valor efetivo (Maldição etc.); aparece no canto se for diferente do impresso
  kingLend?: boolean; // ganhou as características do rei
  owner?: Player; // de quem é (o balão explica o que o rei, o Disfarce e a Maldição mudam)
};

// carta de goblin: cor do território, valor e características (passe o mouse para detalhes)
export function GobCard({ g, eff, kingLend, owner, className = '', ...rest }: Props) {
  const v = gv(g);
  const tip = useTooltip(() => <GoblinTip g={g} p={owner} />);
  return (
    <>
      <div className={`card gob c${gc(g)} ${className}`} {...tip.anchor(rest)}>
        {eff !== undefined && eff !== v && <span className="eff">{eff}</span>}
        {kingLend && (
          <span className="kb">
            <Icon name="crown" />
          </span>
        )}
        <span className="s">{v}</span>
        <span className="n">{v}</span>
        <span className="t">
          <TraitIcons t={TR[v]} />
        </span>
      </div>
      {tip.tooltip}
    </>
  );
}
