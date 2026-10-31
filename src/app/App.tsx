// A página inteira: barra do topo, a tela da vez (menu, sala de espera ou mesa) e as camadas
// por cima (histórico, avisos, modal, dicas, efeitos).
import { Sprites } from './components/Sprites.tsx';
import { Header } from './Header.tsx';
import { Lobby } from './lobby/Lobby.tsx';
import { Menu } from './menu/Menu.tsx';
import { LogList } from './overlays/LogList.tsx';
import { Overlays } from './overlays/Overlays.tsx';
import { useUi } from './store.ts';
import { Table } from './table/Table.tsx';

const SCREEN = 'grid min-h-[calc(100vh-53px)] px-safe';

export function App() {
  const screen = useUi((s) => s.screen),
    logOpen = useUi((s) => s.logOpen),
    shake = useUi((s) => s.shake);
  return (
    <>
      <Sprites />
      <Header />
      {screen === 'menu' && (
        <section id="menu" className={`${SCREEN} place-items-center py-8`}>
          <Menu />
        </section>
      )}
      {screen === 'lobby' && (
        <section id="lobby" className={`${SCREEN} place-items-center py-8`}>
          <Lobby />
        </section>
      )}
      {screen === 'game' && (
        <section
          id="game"
          className={`${SCREEN} grid-rows-[auto_auto_1fr_auto] gap-3 py-3 land:min-h-[calc(100dvh-41px)] land:gap-1.5 land:py-1.5 pin:pb-[calc(200px+env(safe-area-inset-bottom,0px))] ${shake ? 'animate-shake' : ''}`}
        >
          <Table />
        </section>
      )}
      {/* invisible só depois de fechar: a transição de visibility espera o deslize acabar */}
      <aside
        id="logDrawer"
        className={`fixed top-13.25 right-0 bottom-0 z-drawer w-[min(340px,100vw)] overflow-auto border-l border-line bg-surface p-3.5 transition-[translate,visibility] duration-250 land:top-[41px] ${logOpen ? '' : 'invisible translate-x-full'}`}
      >
        <h3 className="m-0 mb-2 font-display text-lg font-semibold">Histórico</h3>
        <LogList />
      </aside>
      <Overlays />
    </>
  );
}
