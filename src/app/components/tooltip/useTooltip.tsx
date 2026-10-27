import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import { useState } from 'react';
import type { HTMLProps, ReactNode } from 'react';

// Balão de informação que abre ao passar o mouse ou ao focar pelo teclado (no toque, não abre:
// o toque é para jogar). `content` é uma função: o conteúdo só é montado com o balão aberto.
// Espalhe `anchor(...)` no elemento de referência (passando as props dele, para juntar os eventos)
// e renderize `tooltip` em qualquer lugar (ele vai para o <body> num portal).
export function useTooltip(content: (() => ReactNode) | null, placement: Placement = 'top') {
  const [open, setOpen] = useState(false);
  // a seta fica em estado (não em ref): o posicionamento precisa dela durante o render
  const [arrowEl, setArrowEl] = useState<SVGSVGElement | null>(null);
  const {
    // são funções estáveis do Floating UI (não usam this), feitas para passar direto como ref
    // oxlint-disable-next-line typescript/unbound-method
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      arrow({ element: arrowEl }),
    ],
  });
  // perto um do outro (cartas da mão), o primeiro balão demora e os seguintes abrem na hora
  const { delay, isInstantPhase } = useDelayGroup(context);
  const enabled = !!content;
  const hover = useHover(context, { enabled, delay, move: false, mouseOnly: true });
  const focus = useFocus(context, { enabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: isInstantPhase ? 0 : { open: 120, close: 80 },
    initial: { opacity: 0, transform: 'translateY(4px)' },
  });

  return {
    anchor: (props?: HTMLProps<Element>) => ({
      ...getReferenceProps(props),
      ref: setReference,
    }),
    tooltip:
      isMounted && content ? (
        <FloatingPortal>
          <div
            ref={setFloating}
            className="z-[60] pointer-events-none"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div style={styles}>
              <div className="w-max max-w-[264px] overflow-hidden rounded-[10px] border border-line bg-surface-2 text-left font-ui text-[13px] leading-[1.45] font-medium text-text shadow-[0_14px_34px_rgba(0,0,0,0.5)]">
                {content()}
              </div>
              <FloatingArrow
                ref={setArrowEl}
                context={context}
                fill="var(--color-surface-2)"
                stroke="var(--color-line)"
                strokeWidth={1}
              />
            </div>
          </div>
        </FloatingPortal>
      ) : null,
  };
}
