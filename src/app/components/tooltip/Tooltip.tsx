import { Tooltip as Radix } from 'radix-ui';
import type { ReactElement, ReactNode } from 'react';

// Balão de informação (Radix Tooltip): abre ao passar o mouse ou focar pelo teclado. No toque não
// abre: o toque é para jogar. `content` é uma função, então o conteúdo só é montado com o balão
// aberto; null = sem balão. O filho (um elemento só) é a âncora e recebe os eventos.
//   <Tooltip content={() => <ItemTip k="LUNETA" />}>
//     <span>Luneta</span>
//   </Tooltip>
// O <TooltipProvider> do App.tsx/Sandbox.tsx define o atraso.
export function Tooltip({
  content,
  side = 'top',
  children,
}: {
  content: (() => ReactNode) | null;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactElement;
}) {
  if (!content) return children;
  return (
    <Radix.Root>
      <Radix.Trigger asChild>{children}</Radix.Trigger>
      <Radix.Portal>
        <Radix.Content
          side={side}
          sideOffset={10}
          collisionPadding={8}
          className="pointer-events-none z-tooltip data-[state=delayed-open]:animate-rise"
        >
          <div className="w-max max-w-[264px] overflow-hidden rounded-box border border-line bg-surface-2 text-left font-ui text-small leading-[1.45] font-medium text-text shadow-pop">
            {content()}
          </div>
          <Radix.Arrow width={14} height={7} className="fill-surface-2" />
        </Radix.Content>
      </Radix.Portal>
    </Radix.Root>
  );
}

// perto um do outro (cartas da mão), o primeiro balão demora e os seguintes abrem na hora
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <Radix.Provider delayDuration={350} skipDelayDuration={300} disableHoverableContent>
      {children}
    </Radix.Provider>
  );
}
