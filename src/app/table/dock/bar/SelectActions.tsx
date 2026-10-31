import type { Gob } from '../../../../game/data.ts';
import { inZone, playLimit, val } from '../../../../game/rules.ts';
import { chaosIs } from '../../../../game/state.ts';
import type { Player } from '../../../../game/types.ts';
import { GHOST } from '../../../components/variants.ts';
import { Warn } from '../../../components/Warn.tsx';
import { clearCards, playCards } from '../../actions.ts';

// escolhendo goblins: a soma, o aviso de Zona Proibida/Ímã e os botões
export function SelectActions({ me, sel }: { me: Player; sel: Gob[] }) {
  const sum = sel.reduce((a, g) => a + val(me, g), 0),
    [kmin, kmax] = playLimit(me);
  return (
    <>
      <span data-sum className="font-display text-sum-lg leading-none text-accent">
        {sel.length ? sum : '—'}
      </span>
      {sel.length && chaosIs('ZONA') && inZone(sum) ? (
        <Warn>{`Zona Proibida: ${sum} perde nesta rodada`}</Warn>
      ) : sel.length && chaosIs('IMA') && inZone(sum) ? (
        <Warn>{`Ímã: ${sum} conta 5 mais longe`}</Warn>
      ) : null}
      <button
        id="btnPlayCards"
        disabled={!(sel.length >= kmin && sel.length <= kmax)}
        onClick={() => void playCards()}
      >
        {`Jogar ${sel.length || ''}`}
      </button>
      <button className={GHOST} id="btnClear" disabled={!sel.length} onClick={clearCards}>
        Limpar
      </button>
    </>
  );
}
