import { chaosDesc, chaosIc, chaosTitle } from '../../../game/data.ts';
import { Icon } from '../Icon.tsx';
import { CARD_BASE } from './cardBase.ts';

const iconSize = { width: 'calc(var(--cw) * 0.09)', height: 'calc(var(--cw) * 0.09)' };

// carta de Caos com nome e regra
export function ChaosCard({ k, curse }: { k: string; curse?: number }) {
  return (
    <div
      data-card
      className={`${CARD_BASE} grid content-start gap-1 p-[calc(var(--cw)*0.09)] text-left text-[calc(var(--cw)*0.085)] leading-[1.25] [background:color-mix(in_srgb,var(--color-chaos)_18%,var(--color-surface-2))] [border:1px_solid_color-mix(in_srgb,var(--color-chaos)_50%,transparent)]`}
    >
      <i className="flex items-center gap-1 text-[calc(var(--cw)*0.07)] font-bold not-italic tracking-[0.06em] text-chaos uppercase">
        <Icon name={chaosIc(k)} style={iconSize} />
        Caos · para todos
      </i>
      <b className="font-display text-[calc(var(--cw)*0.12)] leading-[1.1] font-semibold">
        {chaosTitle(k, curse)}
      </b>
      <span>{chaosDesc(k, curse)}</span>
    </div>
  );
}
