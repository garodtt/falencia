import { CARD_BASE } from './cardBase.ts';

// verso de um goblin (cartas que os outros não podem ver)
export function BackCard({ className = '' }: { className?: string }) {
  return (
    <div
      data-card
      className={`${CARD_BASE} grid place-items-center border border-[#40444c] bg-surface-3 text-[#6b717c] ${className}`}
    >
      <span className="font-display text-[calc(var(--cw)*0.38)] font-extrabold text-[#555a64]">
        F
      </span>
    </div>
  );
}
