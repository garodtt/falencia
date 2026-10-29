import { useState, useSyncExternalStore } from 'react';
import { Icon } from '../components/Icon.tsx';

// celular ou tablet (tela de toque) em pé: a mesa cabe melhor deitada
const PORTRAIT = '(orientation: portrait) and (pointer: coarse) and (max-width: 1100px)';
const KEY = 'rotateHintOff';

function watch(cb: () => void) {
  const mq = matchMedia(PORTRAIT);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

// lembra só nesta aba: quem dispensou não vê de novo até abrir o jogo outra vez
function dismissed() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

// aviso para girar a tela; some sozinho quando o aparelho deita
export function RotateHint() {
  const portrait = useSyncExternalStore(watch, () => matchMedia(PORTRAIT).matches);
  const [off, setOff] = useState(dismissed);
  if (!portrait || off) return null;
  const close = () => {
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      // sem storage: some só até recarregar
    }
    setOff(true);
  };
  return (
    <div className="fixed inset-0 z-[50] grid place-items-center bg-[rgba(10,11,14,0.78)] p-4">
      <div
        className="grid w-[min(340px,100%)] justify-items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-rise"
        role="dialog"
        aria-labelledby="rotateTitle"
      >
        <span className="grid size-16 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)] text-accent">
          <Icon name="rotate" style={{ width: 36, height: 36, strokeWidth: 1.6 }} />
        </span>
        <h3 className="m-0 font-display text-[22px] font-semibold" id="rotateTitle">
          Gire a tela
        </h3>
        <p className="m-0 text-muted">
          A mesa fica melhor com o aparelho deitado: rivais, monstro e sua mão cabem de uma vez na
          tela.
        </p>
        <button
          className="bg-transparent text-text shadow-[inset_0_0_0_1px_var(--color-line)] hover:enabled:bg-surface-2"
          onClick={close}
        >
          Continuar assim
        </button>
      </div>
    </div>
  );
}
