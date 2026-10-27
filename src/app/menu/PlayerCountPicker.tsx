import { MENU } from '../../game/state.ts';
import { setMenu } from '../store.ts';

const PLAYER_COUNTS = [2, 3, 4];

// quantos jogadores na partida contra bots (e na mesa online que você criar)
export function PlayerCountPicker() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-muted">Jogadores</span>
      <div className="inline-flex rounded-[10px] bg-surface-2 p-[3px]" id="segN">
        {PLAYER_COUNTS.map((n) => (
          <button
            key={n}
            className={`bg-transparent px-3.5 py-1.5 text-muted ${MENU.n === n ? 'bg-surface-3 text-text' : ''}`}
            aria-pressed={MENU.n === n}
            onClick={() => setMenu({ n })}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
