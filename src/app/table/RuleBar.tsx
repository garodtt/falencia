import { chaosDesc, chaosIc, chaosTitle } from '../../game/data.ts';
import { G } from '../../game/state.ts';
import { Icon } from '../components/Icon.tsx';

// faixa do topo: o Caos desta rodada (ou o da próxima, entre rodadas)
export function RuleBar() {
  const shown = G.chaos && G.phase ? 'now' : G.nextChaos ? 'next' : null;
  if (!shown)
    return (
      <div className="rule calm" id="chaosSlot">
        <Icon name="bolt" />
        <span className="tg">Regra da rodada</span>
        <span className="sub">
          Sem Caos nesta rodada. Uma carta de Caos é revelada no fim de cada rodada.
        </span>
      </div>
    );
  const [k, curse] = shown === 'now' ? [G.chaos!, G.curse] : [G.nextChaos!, G.nextCurse];
  return (
    <div className="rule" id="chaosSlot">
      <span style={{ color: 'var(--chaos)' }}>
        <Icon name={chaosIc(k)} />
      </span>
      <span className="tg">{shown === 'now' ? 'Regra da rodada' : 'Próxima rodada'}</span>
      <b>{chaosTitle(k, curse)}</b>
      <span className="sub">{`— ${chaosDesc(k, curse)}`}</span>
    </div>
  );
}
