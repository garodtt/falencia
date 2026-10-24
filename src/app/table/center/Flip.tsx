import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';

// carta que vira com transição CSS: o primeiro filho é o verso, o segundo a frente.
// A classe "open" é posta à mão (não pelo React) para a transição sempre partir da carta
// fechada, inclusive quando ela já nasce aberta.
export function Flip({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const f = ref.current!;
    if (!open) {
      f.classList.remove('open');
      return;
    }
    if (f.classList.contains('open')) return;
    void f.offsetWidth; // garante que o estado fechado foi desenhado antes de abrir
    const id = requestAnimationFrame(() => f.classList.add('open'));
    return () => cancelAnimationFrame(id);
  }, [open]);
  return (
    <div className="flip" ref={ref}>
      <div className="in">{children}</div>
    </div>
  );
}
