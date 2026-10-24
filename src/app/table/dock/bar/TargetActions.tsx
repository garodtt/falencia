import { P, nameOf } from '../../../../game/state.ts';
import type { Pending } from '../../../../game/types.ts';
import { pickTarget } from '../../actions.ts';
import { Say } from './Say.tsx';

// cravou (roubar) ou venceu por aproximação (eliminar): um botão por rival que pode ser alvo
export function TargetActions({ pe }: { pe: Pending }) {
  const steal = pe.kind === 'steal';
  return (
    <>
      <Say>{`${steal ? 'Roube' : 'Elimine'} uma carta (faltam ${pe.data.left}):`}</Say>
      {pe.data.T!.map((t) => (
        <button key={t} className={steal ? '' : 'red'} data-tgt={t} onClick={() => pickTarget(t)}>
          {`${nameOf(t)} · ${P(t).hand.length}`}
        </button>
      ))}
    </>
  );
}
