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
    <div className="grid items-end gap-4 [grid-template-columns:minmax(220px,280px)_minmax(0,1fr)_minmax(220px,300px)] max-[960px]:grid-cols-1 land:grid-cols-[clamp(140px,22vw,210px)_minmax(0,1fr)_clamp(140px,24vw,230px)] land:gap-3">
      <MeBox me={me} />
      {/* no celular em pé a mão e a barra ficam presas no rodapé (#game reserva o espaço) */}
      <div className="grid min-w-0 justify-items-center gap-2.5 pin:fixed pin:inset-x-0 pin:bottom-0 pin:z-30 pin:gap-0 pin:border-t pin:border-line pin:bg-bg pin:pt-1 pin:pr-[max(16px,env(safe-area-inset-right,0px))] pin:pb-[env(safe-area-inset-bottom,0px)] pin:pl-[max(16px,env(safe-area-inset-left,0px))] pin:shadow-[0_-8px_24px_rgba(0,0,0,0.35)] land:gap-1">
        <Hand me={me} sel={sel} can={pe?.kind === 'select'} />
        <div
          className="flex min-h-[46px] flex-wrap items-center justify-center gap-3 max-[960px]:sticky max-[960px]:bottom-0 max-[960px]:z-[5] max-[960px]:bg-bg max-[960px]:py-2 pin:static land:static land:min-h-0 land:gap-2 land:bg-transparent land:py-0"
          id="actionBar"
        >
          <ActionBar pe={pe} me={me} sel={sel} />
        </div>
      </div>
      <Tray me={me} pe={pe} />
    </div>
  );
}
