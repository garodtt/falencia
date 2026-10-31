import { Icon } from '../Icon.tsx';
import { CARD_BASE } from './cardBase.ts';

// verso de uma carta de Caos (monte de Caos)
export function ChaosBack({ className = '' }: { className?: string }) {
  return (
    <div
      data-card
      className={`${CARD_BASE} grid place-items-center border border-card-edge bg-surface-3 text-chaos ${className}`}
    >
      <Icon name="bolt" />
    </div>
  );
}
