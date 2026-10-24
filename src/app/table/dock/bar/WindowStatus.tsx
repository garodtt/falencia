import { standing } from '../../../../game/rules.ts';
import { ME } from '../../../../game/state.ts';
import type { Player } from '../../../../game/types.ts';
import { pass } from '../../actions.ts';
import { outLabel } from '../../view.ts';
import { Say } from './Say.tsx';

// janela de itens: a que distância do alvo você está, se está ganhando, e "Passar"
export function WindowStatus({ me }: { me: Player }) {
  const R = standing(),
    x = R.F.find((y) => y.p === me);
  return (
    <>
      <Say>
        Você está a <b>{x ? x.d : '—'}</b> do alvo e{' '}
        {x && x.out ? (
          <b style={{ color: 'var(--bad)' }}>{`já perdeu (${outLabel(ME)})`}</b>
        ) : R.w.includes(me) ? (
          <b style={{ color: 'var(--good)' }}>{R.kind === 'exact' ? 'cravando' : 'vencendo'}</b>
        ) : (
          <b style={{ color: 'var(--bad)' }}>perdendo</b>
        )}
        .
      </Say>
      <button id="btnPass" onClick={pass}>
        Passar
      </button>
    </>
  );
}
