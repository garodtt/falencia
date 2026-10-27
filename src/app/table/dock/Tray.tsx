import { ITEMS, REACT } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import { canUse } from '../../../game/rules.ts';
import type { Pending, Player } from '../../../game/types.ts';
import { Icon } from '../../components/Icon.tsx';
import { activateItem } from '../actions.ts';

// os seus itens (com "Usar" nos que valem agora)
export function Tray({ me, pe }: { me: Player; pe: Pending | null }) {
  const ph = pe && pe.kind;
  return (
    <div className="grid gap-2.5 rounded-xl border border-line bg-surface p-3" id="trayBox">
      <h4 className="m-0 flex justify-between font-display text-[15px] font-semibold">
        Itens{' '}
        <span className="font-ui text-[13px] font-medium text-muted" id="trayCount">
          {me.items.length}
        </span>
      </h4>
      <div className="grid max-h-[260px] gap-1.5 overflow-auto" id="tray">
        {me.items.length ? (
          me.items.map((k, i) => <TrayItem key={i} k={k} usable={!!ph && canUse(me, k, ph)} />)
        ) : (
          <div className="text-[13px] text-muted">
            Vença rodadas para ganhar itens. Os com <Icon name="moon" /> são usados antes de o
            monstro acordar; os com <Icon name="sun" />, depois.
          </div>
        )}
      </div>
    </div>
  );
}

// um item: quando se usa (lua = antes do monstro acordar, sol = depois) e o botão, se puder agora
function TrayItem({ k, usable }: { k: ItemKey; usable: boolean }) {
  const [name, text, when] = ITEMS[k];
  const moon = when === 'D';
  return (
    <div
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[9px] bg-surface-2 px-2.5 py-2 ${usable ? '' : 'opacity-[0.55]'}`}
    >
      <span
        className={`grid size-7 place-items-center rounded-[7px] ${
          moon
            ? 'bg-[color-mix(in_srgb,var(--color-moon)_18%,transparent)] text-moon'
            : 'bg-[color-mix(in_srgb,var(--color-sun)_18%,transparent)] text-sun'
        }`}
      >
        <Icon name={moon ? 'moon' : 'sun'} />
      </span>
      <div style={{ minWidth: 0 }}>
        <b className="block font-bold">{name}</b>
        <small className="block text-xs text-muted">{text}</small>
      </div>
      {REACT.includes(k) ? (
        <span className="text-xs font-bold text-muted">reação</span>
      ) : usable ? (
        <button
          className="px-3 py-1.5 text-[13px]"
          data-use={k}
          onClick={() => void activateItem(k)}
        >
          Usar
        </button>
      ) : (
        <span className="text-xs font-bold text-muted">{when === 'D' ? 'antes' : 'depois'}</span>
      )}
    </div>
  );
}
