import { Dialog } from 'radix-ui';
import { useState, useSyncExternalStore } from 'react';
import { Icon } from '../components/Icon.tsx';
import { DIALOG, GHOST, SCRIM } from '../components/variants.ts';

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

// aviso para girar a tela; some sozinho quando o aparelho deita. Com `onClose` aparece sempre e
// quem chamou decide quando fechar (o sandbox usa assim)
export function RotateHint({ onClose }: { onClose?: () => void }) {
  const portrait = useSyncExternalStore(watch, () => matchMedia(PORTRAIT).matches);
  const [off, setOff] = useState(dismissed);
  if (!onClose && (!portrait || off)) return null;
  const close =
    onClose ||
    (() => {
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        // sem storage: some só até recarregar
      }
      setOff(true);
    });
  return (
    <Dialog.Root open onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className={`${SCRIM} z-rotate`}>
          <Dialog.Content
            className={`${DIALOG} w-[min(340px,100%)] justify-items-center p-6 text-center`}
          >
            <span className="grid size-16 place-items-center rounded-2xl bg-accent/16 text-accent">
              <Icon name="rotate" style={{ width: 36, height: 36, strokeWidth: 1.6 }} />
            </span>
            <Dialog.Title className="m-0 font-display text-title font-semibold">
              Gire a tela
            </Dialog.Title>
            <Dialog.Description className="m-0 text-muted">
              A mesa fica melhor com o aparelho deitado: rivais, monstro e sua mão cabem de uma vez
              na tela.
            </Dialog.Description>
            <Dialog.Close className={GHOST}>Continuar assim</Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
