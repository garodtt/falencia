import { chaosDesc, chaosIc, chaosTitle } from '../../game/data.ts';
import { G } from '../../game/state.ts';
import { Icon } from '../components/Icon.tsx';

const base =
  'flex min-h-[42px] flex-wrap items-center gap-2.5 rounded-[10px] px-3.5 py-[9px] max-sm:gap-x-2 max-sm:gap-y-1 max-sm:px-3 max-sm:py-2 max-sm:text-[13px] land:min-h-0 land:gap-x-2 land:gap-y-0 land:px-3 land:py-1 land:text-xs';
const tg = 'font-ui text-[11px] font-bold tracking-[0.08em] uppercase';

// faixa do topo: o Caos desta rodada (ou o da próxima, entre rodadas)
export function RuleBar() {
  const shown = G.chaos && G.phase ? 'now' : G.nextChaos ? 'next' : null;
  if (!shown)
    return (
      <div className={`${base} border border-line bg-surface`} id="chaosSlot">
        <Icon name="bolt" />
        <span className={`${tg} text-muted`}>Regra da rodada</span>
        <span className="text-muted">
          Sem Caos nesta rodada. Uma carta de Caos é revelada no fim de cada rodada.
        </span>
      </div>
    );
  const k = shown === 'now' ? G.chaos! : G.nextChaos!;
  return (
    <div
      className={`${base} border border-[color-mix(in_srgb,var(--color-chaos)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-chaos)_13%,var(--color-surface))]`}
      id="chaosSlot"
    >
      <span className="text-chaos">
        <Icon name={chaosIc(k)} />
      </span>
      <span className={`${tg} text-chaos`}>
        {shown === 'now' ? 'Regra da rodada' : 'Próxima rodada'}
      </span>
      <b className="font-display text-base font-semibold land:text-sm">{chaosTitle(k)}</b>
      <span className="text-muted">{`— ${chaosDesc(k)}`}</span>
    </div>
  );
}
