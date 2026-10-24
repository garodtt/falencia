import { monocle, rawSum, standing, val } from '../../../game/rules.ts';
import { G, ME } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { GobCard } from '../../components/cards/GobCard.tsx';
import { LastPlay } from '../LastPlay.tsx';

// o que eu joguei nesta rodada (ou a minha última jogada, no fim dela) e a soma
export function MyPlay({ me }: { me: Player }) {
  const rd = G.rd[ME],
    L = G.last && G.last[ME];
  if (L) return <LastPlay p={me} gs={L.gs} sum={`= ${L.S}`} />;
  if (!rd.gs.length) return null;
  const R = G.revealed ? standing() : null,
    x = R ? R.F.find((y) => y.p === me) : null;
  return (
    <>
      {rd.gs.map((g) => (
        <GobCard key={g} g={g} eff={val(me, g)} owner={me} />
      ))}
      <span className="sumT">
        {`= ${x ? x.S : rawSum(me)}`}
        {x && x.mg ? (
          <small>
            {monocle(me, rd.gs) ? 'Monóculo: a 1 conta como cravada' : `±${x.mg} território`}
          </small>
        ) : null}
        {x && x.add ? <small>{`+${x.add} do vizinho`}</small> : null}
      </span>
    </>
  );
}
