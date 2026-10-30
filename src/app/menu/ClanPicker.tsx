import { CLAN, KINGS, heirsTxt } from '../../game/data.ts';
import { MENU } from '../../game/state.ts';
import { CCSS } from '../../ui/html.ts';
import { ColorDot } from '../components/ColorDot.tsx';
import { Icon, TraitIcons } from '../components/Icon.tsx';
import { setMenu } from '../store.ts';

// a escolha de território (e do rei ou rainha que vem com ele)
export function ClanPicker() {
  return (
    <div className="grid grid-cols-4 gap-2.5 max-[760px]:grid-cols-2" id="clanPicks">
      {CLAN.map((name, i) => (
        <ClanCard key={name} clan={i} on={MENU.color === i} onPick={() => setMenu({ color: i })} />
      ))}
    </div>
  );
}

function ClanCard({ clan, on, onPick }: { clan: number; on: boolean; onPick: () => void }) {
  const king = KINGS[clan];
  return (
    <div
      data-clan-pick
      className={`grid cursor-pointer gap-1.5 rounded-xl border bg-surface-2 p-3 ${on ? 'border-accent' : 'border-transparent'}`}
      role="button"
      aria-pressed={on}
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        onPick();
      }}
    >
      <div className="flex items-center gap-2 font-display text-base font-semibold">
        <ColorDot color={clan} />
        {CLAN[clan]}
      </div>
      <div className="flex items-center gap-1.5 font-bold text-text">
        <span style={{ color: CCSS[clan] }}>
          <Icon name="crown" />
        </span>
        {king.name}
      </div>
      <p className="m-0 text-[12.5px] text-muted">{king.text}</p>
      <p className="m-0 text-[12.5px] text-muted">
        <TraitIcons t={king.tr} />
        {` herdada pelos ${heirsTxt(clan)}.`}
      </p>
    </div>
  );
}
