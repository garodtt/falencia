import { ToggleGroup } from 'radix-ui';
import { MENU } from '../../game/state.ts';
import { setMenu } from '../store.ts';

const PLAYER_COUNTS = [2, 3, 4];

// quantos jogadores na partida contra bots (e na mesa online que você criar)
export function PlayerCountPicker() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-muted">Jogadores</span>
      <ToggleGroup.Root
        type="single"
        id="segN"
        aria-label="Jogadores"
        className="inline-flex rounded-box bg-surface-2 p-[3px]"
        value={String(MENU.n)}
        onValueChange={(v) => v && setMenu({ n: +v })}
      >
        {PLAYER_COUNTS.map((n) => (
          <ToggleGroup.Item
            key={n}
            value={String(n)}
            className="rounded-box px-3.5 py-1.5 font-bold text-muted data-[state=on]:bg-surface-3 data-[state=on]:text-text"
          >
            {n}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
