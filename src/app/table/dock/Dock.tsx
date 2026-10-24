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
    <div className="dock">
      <MeBox me={me} />
      <div className="handwrap">
        <Hand me={me} sel={sel} can={pe?.kind === 'select'} />
        <div className="actionBar" id="actionBar">
          <ActionBar pe={pe} me={me} sel={sel} />
        </div>
      </div>
      <Tray me={me} pe={pe} />
    </div>
  );
}
