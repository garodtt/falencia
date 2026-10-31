import { ITEMS } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import { canUse } from '../../../game/rules.ts';
import type { Pending, Player } from '../../../game/types.ts';
import { Icon } from '../../components/Icon.tsx';
import { KIND, itemKind } from '../../components/itemKind.ts';
import { activateItem } from '../actions.ts';

// os seus itens (com "Usar" nos que valem agora)
export function Tray({ me, pe }: { me: Player; pe: Pending | null }) {
  const ph = pe && pe.kind;
  return (
    <div
      className="grid gap-2.5 rounded-xl border border-line bg-surface p-3 land:gap-1.5 land:p-2"
      id="trayBox"
    >
      <h4 className="m-0 flex justify-between font-display text-md font-semibold">
        Itens{' '}
        <span className="font-ui text-small font-medium text-muted" id="trayCount">
          {me.items.length}
        </span>
      </h4>
      <div className="grid max-h-[260px] gap-1.5 overflow-auto land:max-h-[120px]" id="tray">
        {me.items.length ? (
          me.items.map((k, i) => <TrayItem key={i} k={k} usable={!!ph && canUse(me, k, ph)} />)
        ) : (
          <div className="text-small text-muted land:text-xs">
            Vença rodadas para ganhar itens. Os com <Icon name="moon" /> são usados antes de o
            monstro acordar; os com <Icon name="sun" />, depois.
          </div>
        )}
      </div>
    </div>
  );
}

// um item: quando se usa (lua = antes do monstro acordar, sol = depois, ! = reação) e o botão,
// se puder agora
const QUANDO = { dormindo: 'antes', acordado: 'depois', reacao: 'reação', nahora: 'na hora' };
function TrayItem({ k, usable }: { k: ItemKey; usable: boolean }) {
  const [name, text] = ITEMS[k],
    kind = itemKind(k);
  return (
    <div
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[9px] bg-surface-2 px-2.5 py-2 ${usable ? '' : 'opacity-[0.55]'}`}
    >
      <span className={`grid size-7 place-items-center rounded-[7px] ${KIND[kind].tint}`}>
        <Icon name={KIND[kind].icon} />
      </span>
      <div style={{ minWidth: 0 }}>
        <b className="block font-bold">{name}</b>
        <small className="block text-xs text-muted">{text}</small>
      </div>
      {usable && kind !== 'reacao' ? (
        <button
          className="px-3 py-1.5 text-small"
          data-use={k}
          onClick={() => void activateItem(k)}
        >
          Usar
        </button>
      ) : (
        <span className="text-xs font-bold text-muted">{QUANDO[kind]}</span>
      )}
    </div>
  );
}
