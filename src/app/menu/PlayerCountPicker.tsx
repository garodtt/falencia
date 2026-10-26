import { MENU } from '../../game/state.ts';
import { setMenu } from '../store.ts';

const PLAYER_COUNTS = [2, 3, 4];

// quantos jogadores na partida contra bots (e na mesa online que você criar)
export function PlayerCountPicker() {
  return (
    <div className="row">
      <span className="muted">Jogadores</span>
      <div className="seg" id="segN">
        {PLAYER_COUNTS.map((n) => (
          <button key={n} className={MENU.n === n ? 'on' : ''} onClick={() => setMenu({ n })}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
