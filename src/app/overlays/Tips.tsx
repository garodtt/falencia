// Dicas de como jogar: uma bolha que aponta para a parte da tela que importa agora.
import { useLayoutEffect, useRef } from 'react';
import { TIPS, tipClose } from '../tips.ts';
import { GHOST, PRIMARY } from '../components/variants.ts';
import { useTick, useUi } from '../store.ts';
import { TIP } from './tipContent.tsx';

export function Tips() {
  useTick(); // a mesa mudou: o alvo pode ter mexido
  useUi((s) => s.tip); // tipPlace()
  const spot = useRef<HTMLDivElement>(null);
  const bub = useRef<HTMLDivElement>(null);
  const st = TIPS.cur ? TIP[TIPS.cur] : null;

  useLayoutEffect(() => {
    if (st) place(st.target, spot.current!, bub.current!);
  });

  if (!st) return null;
  return (
    <div id="tut" className="pointer-events-none fixed inset-0 z-tip">
      {/* o "buraco" em volta do alvo: a sombra gigante escurece todo o resto */}
      <div
        className="pointer-events-none fixed rounded-xl shadow-spotlight outline-2 outline-offset-4 outline-accent transition-all duration-250"
        ref={spot}
      />
      <div
        className="pointer-events-auto fixed grid w-[min(360px,calc(100vw-24px))] animate-rise gap-2 rounded-panel border border-line bg-surface-2 px-4 py-3.5 text-text shadow-pop"
        ref={bub}
      >
        <b className="font-display text-lg font-semibold">{st.title}</b>
        <p className="m-0 text-muted">{st.text}</p>
        <div className="flex justify-between gap-2">
          <button
            className={GHOST}
            id="tipOff"
            onClick={() => {
              TIPS.on = false;
              TIPS.after = null;
              tipClose();
            }}
          >
            Desligar dicas
          </button>
          <button className={PRIMARY} id="tipOk" onClick={tipClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

// destaca o alvo e põe a bolha acima dele (ou ao lado/abaixo, se não couber)
function place(target: string | null, spot: HTMLElement, bub: HTMLElement) {
  let r: { left: number; top: number; right: number; bottom: number } | null = null;
  if (target) {
    const els = [...document.querySelectorAll<HTMLElement>(target)].filter(
      (e) => e.offsetParent && e.getBoundingClientRect().width,
    );
    if (els.length) {
      const rs = els.map((e) => e.getBoundingClientRect());
      r = {
        left: Math.min(...rs.map((x) => x.left)),
        top: Math.min(...rs.map((x) => x.top)),
        right: Math.max(...rs.map((x) => x.right)),
        bottom: Math.max(...rs.map((x) => x.bottom)),
      };
    }
  }
  const bw = bub.offsetWidth,
    bh = bub.offsetHeight,
    vw = innerWidth,
    vh = innerHeight;
  if (r) {
    spot.style.display = 'block';
    Object.assign(spot.style, {
      left: r.left - 8 + 'px',
      top: r.top - 8 + 'px',
      width: r.right - r.left + 16 + 'px',
      height: r.bottom - r.top + 16 + 'px',
    });
    let x = Math.min(Math.max(12, (r.left + r.right) / 2 - bw / 2), vw - bw - 12),
      y = r.top - bh - 22;
    if (y < 56) {
      const cy = Math.min(Math.max(56, (r.top + r.bottom) / 2 - bh / 2), vh - bh - 10);
      if (r.right + 22 + bw < vw - 8) {
        x = r.right + 22;
        y = cy;
      } else if (r.left - 22 - bw > 8) {
        x = r.left - 22 - bw;
        y = cy;
      } else y = r.bottom + 22;
    }
    if (y + bh > vh - 10) y = Math.max(56, vh - bh - 10);
    bub.style.left = x + 'px';
    bub.style.top = y + 'px';
  } else {
    spot.style.display = 'none';
    bub.style.left = (vw - bw) / 2 + 'px';
    bub.style.top = Math.max(56, (vh - bh) / 2) + 'px';
  }
}
