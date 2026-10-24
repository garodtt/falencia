import { rawSum, standing, val } from '../../../game/rules.ts';
import { G, SPEED } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { BackCard } from '../../components/cards/BackCard.tsx';
import { GobCard } from '../../components/cards/GobCard.tsx';
import { LastPlay } from '../LastPlay.tsx';

// o que o rival jogou: a última jogada (fim da rodada), as cartas viradas ou os versos
export function SeatPlay({ p }: { p: Player }) {
  const rd = G.rd[p.id],
    L = G.last && G.last[p.id];
  if (L) return <LastPlay p={p} gs={L.gs} sum={L.S} small />;
  if (!rd.gs.length) return null;
  if (!(G.revealed || G.openPlays)) return rd.gs.map((_, i) => <BackCard key={i} className="sm" />);

  // revelação lenta: cada carta vira uma por uma, assento por assento. A animação toca uma vez,
  // quando a carta aparece; os nós continuam os mesmos nos próximos renders, então ela não reinicia.
  const R = G.revealed && G.monster ? standing() : null,
    x = R ? R.F.find((y) => y.p === p) : null,
    seatI = G.order.indexOf(p.id),
    sp = SPEED || 1,
    delay = (n: number) => ({ animationDelay: `${((seatI * 0.35 + n * 0.3) * sp).toFixed(2)}s` });
  return (
    <>
      {rd.gs.map((g, i) => (
        <GobCard key={g} g={g} className="sm revIn" style={delay(i)} eff={val(p, g)} owner={p} />
      ))}
      <span className="sumT revIn" style={delay(rd.gs.length)}>
        {x ? x.S : rawSum(p)}
      </span>
    </>
  );
}
