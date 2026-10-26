import { CLAN, KINGS, lendTxt } from '../../game/data.ts';
import { MENU } from '../../game/state.ts';
import { CCSS } from '../../ui/html.ts';
import { ColorDot } from '../components/ColorDot.tsx';
import { Icon, TraitIcons } from '../components/Icon.tsx';
import { setMenu } from '../store.ts';

// a escolha de território (e do rei ou rainha que vem com ele)
export function ClanPicker() {
  return (
    <div className="clans" id="clanPicks">
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
      className={`clanPick ${on ? 'on' : ''}`}
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
      <div className="nm">
        <ColorDot color={clan} />
        {CLAN[clan]}
      </div>
      <div className="kn">
        <span style={{ color: CCSS[clan] }}>
          <Icon name="crown" />
        </span>
        {king.name}
      </div>
      <p>{king.text}</p>
      <p>
        Empresta <TraitIcons t={king.tr} />
        {` aos ${lendTxt(clan)}.`}
      </p>
    </div>
  );
}
