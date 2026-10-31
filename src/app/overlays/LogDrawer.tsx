import { Dialog } from 'radix-ui';
import { useUi } from '../store.ts';
import { LogList } from './LogList.tsx';

const setOpen = (logOpen: boolean) => useUi.setState({ logOpen });

// gaveta do histórico (botão Histórico na barra do topo). Radix Dialog não modal: a mesa continua
// clicável com ela aberta, e ela só fecha pelo botão ou pelo Esc (clicar na mesa não fecha).
// Fica sempre montada (forceMount) para deslizar ao abrir e ao fechar; invisible só depois de
// fechar, porque a transição de visibility espera o deslize acabar.
export function LogDrawer() {
  const open = useUi((s) => s.logOpen);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <Dialog.Content
        forceMount
        id="logDrawer"
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="fixed top-13.25 right-0 bottom-0 z-drawer w-[min(340px,100vw)] overflow-auto border-l border-line bg-surface p-3.5 transition-[translate,visibility] duration-250 data-[state=closed]:invisible data-[state=closed]:translate-x-full land:top-[41px]"
      >
        <Dialog.Title className="m-0 mb-2 font-display text-lg font-semibold">
          Histórico
        </Dialog.Title>
        <LogList />
      </Dialog.Content>
    </Dialog.Root>
  );
}
