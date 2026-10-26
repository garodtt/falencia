import { val } from '../../game/rules.ts';
import type { Gob } from '../../game/data.ts';
import type { Player } from '../../game/types.ts';
import { GobCard } from '../components/cards/GobCard.tsx';

// a jogada da rodada que acabou (fica esmaecida até a próxima): cartas e a soma
export function LastPlay({
  p,
  gs,
  sum,
  small,
}: {
  p: Player;
  gs: Gob[];
  sum: string | number;
  small?: boolean;
}) {
  return (
    <span className="lastp">
      {gs.map((g) => (
        <GobCard key={g} g={g} className={small ? 'sm' : ''} eff={val(p, g)} owner={p} />
      ))}
      <span className="sumT">{sum}</span>
    </span>
  );
}
