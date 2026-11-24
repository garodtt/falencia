import { Dialog } from 'radix-ui';
import { Icon } from '../components/Icon.tsx';
import { DIALOG, GHOST, PRIMARY, SCRIM } from '../components/variants.ts';
import { useUi } from '../store.ts';

// o manual impresso (frente e verso do folder), servido pela pasta public/
export const MANUAL_URL = `${import.meta.env.BASE_URL}manual.pdf`;

const setOpen = (manualOpen: boolean) => useUi.setState({ manualOpen });

// janela com o PDF do manual (botão "Manual" da barra). Diferente do modal de escolha, fecha com
// Esc ou clique fora: ninguém está esperando resposta. No celular, que nem sempre mostra PDF
// dentro da página, o botão "Abrir em nova aba" leva ao arquivo direto.
export function ManualDialog() {
  const open = useUi((s) => s.manualOpen);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={`${SCRIM} z-modal`}>
          <Dialog.Content
            className={`${DIALOG} h-[min(88vh,900px)] w-[min(1200px,100%)] grid-rows-[auto_1fr] p-4 max-sm:p-3`}
            aria-describedby={undefined}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Dialog.Title className="m-0 mr-auto font-display text-title font-semibold">
                Manual
              </Dialog.Title>
              <a
                className={`${PRIMARY} px-3 py-[7px] text-small no-underline`}
                href={MANUAL_URL}
                target="_blank"
                rel="noopener"
              >
                <Icon name="file" />
                Abrir em nova aba
              </a>
              <Dialog.Close className={`${GHOST} px-3 py-[7px] text-small`}>Fechar</Dialog.Close>
            </div>
            <iframe
              src={`${MANUAL_URL}#view=FitH`}
              title="Manual de Falência: Goblins"
              className="h-full min-h-0 w-full rounded-box border border-line bg-white"
            />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
