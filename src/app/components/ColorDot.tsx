import { CLAN_BG } from './cards/cardBase.ts';

// a bolinha da cor do território (sem cor: vaga livre)
export function ColorDot({ color }: { color?: number }) {
  return (
    <span
      className={`inline-block size-3 flex-none rounded-full ${color === undefined ? 'bg-surface-3' : CLAN_BG[color]}`}
    />
  );
}
