import type { Pending, Player } from '../../../game/types.ts';
import { useUi } from '../../store.ts';
import { ActionBar } from './bar/ActionBar.tsx';
import { Hand } from './Hand.tsx';
import { MeBox } from './MeBox.tsx';
import { Tray } from './Tray.tsx';

// a parte de baixo da mesa: a sua área, a mão, a barra de ação e os itens
export function Dock({ pe, me }: { pe: Pending | null; me: Player }) {
  const sel = useUi((s) => s.sel).filter((g) => me.hand.includes(g));
  return (
    <div className="grid items-end gap-4 [grid-template-columns:minmax(220px,280px)_minmax(0,1fr)_minmax(220px,300px)] max-[960px]:grid-cols-1">
      <MeBox me={me} />
      <div className="grid min-w-0 justify-items-center gap-2.5">
        <Hand me={me} sel={sel} can={pe?.kind === 'select'} />
        <div
          className="flex min-h-[46px] flex-wrap items-center justify-center gap-3 max-[960px]:sticky max-[960px]:bottom-0 max-[960px]:z-[5] max-[960px]:bg-bg max-[960px]:py-2"
          id="actionBar"
        >
          <ActionBar pe={pe} me={me} sel={sel} />
        </div>
      </div>
      <Tray me={me} pe={pe} />
    </div>
  );
}
