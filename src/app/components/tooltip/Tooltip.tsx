import type { Placement } from '@floating-ui/react';
import type { HTMLProps, ReactNode } from 'react';
import { useTooltip } from './useTooltip.tsx';

type Anchor = (props?: HTMLProps<Element>) => Record<string, unknown>;

// Para usar sem criar um componente: o filho é uma função que recebe `anchor`.
//   <Tooltip content={() => <ItemTip k="LUNETA" />}>
//     {(anchor) => <span {...anchor()}>Luneta</span>}
//   </Tooltip>
export function Tooltip({
  content,
  placement,
  children,
}: {
  content: (() => ReactNode) | null;
  placement?: Placement;
  children: (anchor: Anchor) => ReactNode;
}) {
  const tip = useTooltip(content, placement);
  return (
    <>
      {children(tip.anchor)}
      {tip.tooltip}
    </>
  );
}
