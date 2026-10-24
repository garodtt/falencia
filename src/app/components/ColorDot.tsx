import { CCSS } from '../../ui/html.ts';

// a bolinha da cor do território
export function ColorDot({ color }: { color: number }) {
  return <span className="dot" style={{ background: CCSS[color] }} />;
}
