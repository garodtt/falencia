// Camada dos efeitos que ficam por cima de tudo: cartas voando, balõezinhos dos assentos e confete.
// O estado vem de fx.tsx (fly, popAt, confetti).
import { useLayoutEffect, useRef } from 'react';
import { SPEED } from '../../game/state.ts';
import { landFlight } from '../fx.tsx';
import { useUi } from '../store.ts';
import type { Flight } from '../store.ts';

export function FxLayer() {
  const flights = useUi((s) => s.flights),
    pops = useUi((s) => s.pops),
    confetti = useUi((s) => s.confetti);
  return (
    <>
      {flights.map((f) => (
        <Flying key={f.id} f={f} />
      ))}
      {pops.map((p) => (
        <div
          key={p.id}
          className={`pointer-events-none fixed z-pop -translate-x-1/2 -translate-y-full animate-fade-up rounded-lg border border-line bg-surface-3 px-2.5 py-1 text-xs font-bold whitespace-nowrap ${p.good ? 'text-good' : 'text-text'}`}
          style={{ left: p.x, top: p.y }}
        >
          {p.text}
        </div>
      ))}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="pointer-events-none fixed -top-5 z-confetti h-3 w-2 animate-fall"
          style={{
            left: `${c.left}vw`,
            background: c.color,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </>
  );
}

// a carta sai do centro de `from`, faz um arco e pousa no centro de `to`
function Flying({ f }: { f: Flight }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const d = ref.current!,
      c = d.firstElementChild as HTMLElement | null,
      w = c?.offsetWidth || 60,
      h = c?.offsetHeight || 87;
    const x0 = f.from.left + f.from.width / 2 - w / 2,
      y0 = f.from.top + f.from.height / 2 - h / 2,
      x1 = f.to.left + f.to.width / 2 - w / 2,
      y1 = f.to.top + f.to.height / 2 - h / 2;
    // sem Web Animations (jsdom nos testes): pousa na hora
    if (!d.animate) return landFlight(f.id);
    const anim = d.animate(
      [
        { transform: `translate(${x0}px,${y0}px) rotate(${-f.rot}deg) scale(.85)` },
        {
          transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 40}px) scale(1.1)`,
          offset: 0.5,
        },
        { transform: `translate(${x1}px,${y1}px) rotate(${f.rot}deg) scale(1)` },
      ],
      // 'both': durante o delay a carta já espera na origem (e não no canto da tela)
      { duration: f.dur * SPEED, delay: f.delay * SPEED, easing: 'ease-in-out', fill: 'both' },
    );
    // cancelada só quando o React desmonta e remonta o efeito (StrictMode): a nova animação pousa
    anim.finished.then(
      () => landFlight(f.id),
      () => {},
    );
    return () => anim.cancel();
  }, [f]);
  return (
    <div ref={ref} className="pointer-events-none fixed top-0 left-0 z-fly">
      {f.card}
    </div>
  );
}
