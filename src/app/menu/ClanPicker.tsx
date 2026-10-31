import { ToggleGroup } from 'radix-ui';
import { CLAN, KINGS, heirsTxt } from '../../game/data.ts';
import { MENU } from '../../game/state.ts';
import { CLAN_FG } from '../components/cards/cardBase.ts';
import { ColorDot } from '../components/ColorDot.tsx';
import { Icon, TraitIcons } from '../components/Icon.tsx';
import { setMenu } from '../store.ts';

// a escolha de território (e do rei ou rainha que vem com ele)
export function ClanPicker() {
  return (
    <ToggleGroup.Root
      type="single"
      id="clanPicks"
      aria-label="Território"
      className="grid grid-cols-4 gap-2.5 max-[760px]:grid-cols-2"
      value={String(MENU.color)}
      onValueChange={(v) => v && setMenu({ color: +v })}
    >
      {CLAN.map((name, clan) => (
        <ToggleGroup.Item
          key={name}
          value={String(clan)}
          data-clan-pick
          className="grid content-start gap-1.5 rounded-xl border border-transparent bg-surface-2 p-3 text-left data-[state=on]:border-accent"
        >
          <ClanCard clan={clan} />
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

// o conteúdo da opção (dentro de um <button>, por isso só <span>)
function ClanCard({ clan }: { clan: number }) {
  const king = KINGS[clan];
  return (
    <>
      <span className="flex items-center gap-2 font-display text-base font-semibold">
        <ColorDot color={clan} />
        {CLAN[clan]}
      </span>
      <span className="flex items-center gap-1.5 font-bold text-text">
        <span className={CLAN_FG[clan]}>
          <Icon name="crown" />
        </span>
        {king.name}
      </span>
      <span className="text-small text-muted">{king.text}</span>
      <span className="text-small text-muted">
        <TraitIcons t={king.tr} />
        {` herdada pelos ${heirsTxt(clan)}.`}
      </span>
    </>
  );
}
