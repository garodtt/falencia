import { ITEMS } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import { Icon } from '../Icon.tsx';
import { CARD_BASE } from './cardBase.ts';

const iconSize = { width: 'calc(var(--cw) * 0.09)', height: 'calc(var(--cw) * 0.09)' };

// item com nome e texto (ex.: escolha da Mercadora)
export function ItemCard({ k }: { k: ItemKey }) {
  const [name, text, when] = ITEMS[k];
  return (
    <div
      data-card
      className={`${CARD_BASE} grid content-start gap-1 border border-line bg-surface-2 p-[calc(var(--cw)*0.09)] text-left text-[calc(var(--cw)*0.085)] leading-[1.25]`}
    >
      <i
        className={`flex items-center gap-1 text-[calc(var(--cw)*0.07)] font-bold not-italic tracking-[0.06em] uppercase ${when === 'D' ? 'text-moon' : 'text-sun'}`}
      >
        <Icon name={when === 'D' ? 'moon' : 'sun'} style={iconSize} />
        {when === 'D' ? 'Monstro dormindo' : 'Monstro acordado'}
      </i>
      <b className="font-display text-[calc(var(--cw)*0.12)] leading-[1.1] font-semibold">{name}</b>
      <span>{text}</span>
    </div>
  );
}
