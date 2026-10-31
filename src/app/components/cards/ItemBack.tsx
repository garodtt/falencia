import { Icon } from '../Icon.tsx';
import { CARD_BASE } from './cardBase.ts';

// verso de um item (monte de itens)
export function ItemBack({ className = '' }: { className?: string }) {
  return (
    <div
      data-card
      className={`${CARD_BASE} grid place-items-center border border-card-edge bg-surface-3 text-sun ${className}`}
    >
      <Icon name="bag" />
    </div>
  );
}
