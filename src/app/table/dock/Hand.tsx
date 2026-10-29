import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { gc, gv } from '../../../game/data.ts';
import type { Gob } from '../../../game/data.ts';
import { lendsTo, val } from '../../../game/rules.ts';
import { G, LOCAL, ME } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { GobCard } from '../../components/cards/GobCard.tsx';
import { useUi } from '../../store.ts';
import { toggleCard } from '../actions.ts';

// a mão em leque: a largura disponível define o espaçamento entre as cartas
export function Hand({ me, sel, can }: { me: Player; sel: Gob[]; can: boolean }) {
  const dealing = useUi((s) => s.dealing);
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ hw: 520, cw: 70 });
  useLayoutEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() =>
      setBox({
        hw: el.clientWidth || 520,
        cw: parseFloat(getComputedStyle(el).getPropertyValue('--cw')) || 70,
      }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rd = G.rd[ME],
    hidden = new Set([...LOCAL.hide, ...rd.gs]); // as que já estão na mesa (ou voando para lá)
  const hand = LOCAL.spec
    ? []
    : me.hand.filter((g) => !hidden.has(g)).sort((a, b) => gc(a) - gc(b) || gv(a) - gv(b));
  const n = hand.length,
    span = Math.min(box.cw * 0.75, Math.max(10, (box.hw - box.cw - 10) / Math.max(n - 1, 1)));

  return (
    <div
      id="hand"
      className="relative w-full h-[calc(var(--ch)+40px)] land:h-[calc(var(--ch)+20px)]"
      ref={ref}
    >
      {n ? (
        hand.map((g, i) => (
          <HandCard
            key={g}
            g={g}
            me={me}
            off={i - (n - 1) / 2}
            many={n > 14}
            span={span}
            z={i + 1}
            selected={sel.includes(g)}
            can={can}
            deal={dealing ? i * 0.025 : undefined}
          />
        ))
      ) : (
        <div className="pt-10 text-center text-muted">
          {LOCAL.spec
            ? 'Você está assistindo esta mesa.'
            : rd.gs.length
              ? 'Todas as suas cartas estão na mesa.'
              : 'Sem cartas na mão.'}
        </div>
      )}
    </div>
  );
}

// uma carta da mão, na sua posição do leque (`off` = distância até o meio)
function HandCard({
  g,
  me,
  off,
  many,
  span,
  z,
  selected,
  can,
  deal,
}: {
  g: Gob;
  me: Player;
  off: number;
  many: boolean;
  span: number;
  z: number;
  selected: boolean;
  can: boolean;
  deal?: number; // atraso da animação de distribuir, se a mão acabou de chegar
}) {
  const rot = off * (many ? 1.2 : 2.2),
    y = off * off * (many ? 0.18 : 0.5),
    base = `translateX(calc(-50% + ${off * span}px)) translateY(${y}px) rotate(${rot}deg)`;
  return (
    <GobCard
      g={g}
      className={`!absolute bottom-1 left-1/2 [transform-origin:50%_140%] [transition:transform_0.18s_ease,filter_0.2s] ${can ? 'cursor-pointer' : ''}`}
      data-g={g}
      data-pick={can ? '' : undefined}
      data-selected={selected ? '' : undefined}
      style={
        {
          '--base': base,
          transform: base,
          zIndex: z,
          animation: deal !== undefined ? `dealIn .4s ${deal}s both` : undefined,
        } as CSSProperties
      }
      tabIndex={can ? 0 : undefined}
      eff={val(me, g)}
      owner={me}
      kingLend={lendsTo(me, g)}
      onClick={can ? () => toggleCard(g) : undefined}
      onKeyDown={
        can
          ? (e) => {
              if (e.key !== 'Enter' || useUi.getState().modal) return;
              e.preventDefault();
              toggleCard(g);
            }
          : undefined
      }
    />
  );
}
