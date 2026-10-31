import { ITEMS } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import { KIND, itemKind } from '../itemKind.ts';
import { TextCard } from './TextCard.tsx';

// item com nome e texto (ex.: escolha da Mercadora)
export function ItemCard({ k }: { k: ItemKey }) {
  const [name, text] = ITEMS[k],
    kind = KIND[itemKind(k)];
  return (
    <TextCard
      icon={kind.icon}
      label={kind.label}
      labelCls={kind.text}
      title={name}
      text={text}
      className="border border-line bg-surface-2"
    />
  );
}
