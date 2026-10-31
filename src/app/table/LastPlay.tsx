import { val } from '../../game/rules.ts';
import type { Gob } from '../../game/data.ts';
import type { Player } from '../../game/types.ts';
import { GobCard } from '../components/cards/GobCard.tsx';

// a jogada da rodada que acabou (fica esmaecida até a próxima): cartas e a soma.
// `small` é o contexto de um rival (cartas e soma menores); a sua própria jogada é maior.
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
    <span className={`inline-flex items-center opacity-[0.62] ${small ? 'gap-1' : 'gap-1.5'}`}>
      {gs.map((g) => (
        <GobCard key={g} g={g} sm={small} eff={val(p, g)} owner={p} />
      ))}
      <span
        className={`font-display font-extrabold leading-none ${small ? 'ml-1 text-lg' : 'ml-2 text-sum'}`}
      >
        {sum}
      </span>
    </span>
  );
}
