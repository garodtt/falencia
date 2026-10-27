import type { ReactNode } from 'react';
import type { Gob } from '../../../../game/data.ts';
import { G, LOCAL, ME, MODE, nameOf } from '../../../../game/state.ts';
import type { Pending, Player } from '../../../../game/types.ts';
import { GHOST } from '../../../components/buttonVariants.ts';
import { leaveAfterBust, nextRound } from '../../actions.ts';
import { GameOver } from './GameOver.tsx';
import { Say } from './Say.tsx';
import { SelectActions } from './SelectActions.tsx';
import { TargetActions } from './TargetActions.tsx';
import { WindowStatus } from './WindowStatus.tsx';

// a barra embaixo da mão: o que está acontecendo e o que você pode fazer agora
export function ActionBar({
  pe,
  me,
  sel,
}: {
  pe: Pending | null;
  me: Player;
  sel: Gob[];
}): ReactNode {
  const pendMine = LOCAL.spec ? null : G.pend[ME];
  const over = G.over || G.status === 'over';
  // quem faliu assiste (ou sai), a não ser que ainda tenha algo para responder
  if (!me.alive && !LOCAL.spec && !over && !(pendMine && !LOCAL.answered[pendMine.nonce]))
    return (
      <>
        <Say>Você faliu. A partida segue entre os outros.</Say>
        <button className={GHOST} id="btnLeave" onClick={leaveAfterBust}>
          Sair da partida
        </button>
      </>
    );
  if (over) return <GameOver />;
  if (pendMine && LOCAL.answered[pendMine.nonce])
    return <Say>Jogada enviada. Aguardando os outros…</Say>;

  switch (pe && pe.kind) {
    case 'select':
      return <SelectActions me={me} sel={sel} />;
    case 'window':
      return <WindowStatus me={me} />;
    case 'steal':
    case 'elim':
      return <TargetActions pe={pe!} />;
    case 'draw':
      return (
        <Say>
          Clique no monte de <b className="text-text">Itens</b>
          {` (faltam ${pe!.data.left})`}
        </Say>
      );
    case 'chaos':
      return (
        <Say>
          Clique no monte de <b className="text-text">Caos</b>
        </Say>
      );
    case 'next':
      return (
        <>
          <Say>{me.alive ? 'Rodada encerrada.' : 'Você faliu.'}</Say>
          <button id="btnNext" onClick={nextRound}>
            {MODE === 'online' ? 'Pronto' : 'Próxima rodada'}
          </button>
        </>
      );
  }
  const waitingFor = Object.keys(G.pend || {})
    .filter((k) => +k !== ME && G.pend[+k].kind !== 'next')
    .map(Number);
  if (waitingFor.length) return <Say>{`Aguardando ${waitingFor.map(nameOf).join(', ')}…`}</Say>;
  return (
    <Say>
      {G.phase === 'acordado'
        ? 'O monstro acordou…'
        : G.phase === 'resultado'
          ? 'Resolvendo a rodada…'
          : 'Os rivais estão pensando…'}
    </Say>
  );
}
