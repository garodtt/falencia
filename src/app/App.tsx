// A página inteira: barra do topo, a tela da vez (menu, sala de espera ou mesa) e as camadas
// por cima (histórico, avisos, modal, dicas, efeitos).
import { Sprites } from './components/Sprites.tsx';
import { Header } from './Header.tsx';
import { Lobby } from './lobby/Lobby.tsx';
import { Menu } from './menu/Menu.tsx';
import { LogDrawer } from './overlays/LogDrawer.tsx';
import { Overlays } from './overlays/Overlays.tsx';
import { useUi } from './store.ts';
import { Table } from './table/Table.tsx';

const SCREEN = 'grid min-h-[calc(100vh-53px)] px-safe';

export function App() {
  const screen = useUi((s) => s.screen),
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
      <LogDrawer />

      <Overlays />
    </>
  );
}
