import { CCSS } from '../../ui/html.ts';

// a bolinha da cor do território
export function ColorDot({ color }: { color: number }) {
  return (
    <span
      className="inline-block size-3 flex-none rounded-full"
      style={{ background: CCSS[color] }}
    />
  );
}
