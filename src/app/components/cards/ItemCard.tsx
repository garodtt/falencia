import { ITEMS } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import { Icon } from '../Icon.tsx';

// item com nome e texto (ex.: escolha da Mercadora)
export function ItemCard({ k }: { k: ItemKey }) {
  const [name, text, when] = ITEMS[k];
  return (
    <div className={`card txtcard icard ${when}`}>
      <i>
        <Icon name={when === 'D' ? 'moon' : 'sun'} />
        {when === 'D' ? 'Monstro dormindo' : 'Monstro acordado'}
      </i>
      <b>{name}</b>
      <span>{text}</span>
    </div>
  );
}
