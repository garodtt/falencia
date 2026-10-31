import { Banner } from './Banner.tsx';
import { FxLayer } from './FxLayer.tsx';
import { Modal } from './Modal.tsx';
import { RotateHint } from './RotateHint.tsx';
import { Tips } from './Tips.tsx';
import { Toast } from './Toast.tsx';

// tudo que fica por cima da tela: avisos, modal, dicas, efeitos (o jogo e o sandbox usam)
export function Overlays() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-banner grid place-items-center">
        <Banner />
      </div>
      <Modal />
      <div className="fixed top-16 left-1/2 z-toast max-w-[calc(100vw-32px)] -translate-x-1/2">
        <Toast />
      </div>
      <Tips />
      <RotateHint />
      <FxLayer />
    </>
  );
}
