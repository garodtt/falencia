import { ITEMS } from '../../../game/data.ts';
import type { ItemKey } from '../../../game/data.ts';
import { canUse } from '../../../game/rules.ts';
import type { Pending, Player } from '../../../game/types.ts';
import { Icon } from '../../components/Icon.tsx';
import { activateItem } from '../actions.ts';

// os seus itens (com "Usar" nos que valem agora)
export function Tray({ me, pe }: { me: Player; pe: Pending | null }) {
  const ph = pe && pe.kind;
  return (
    <div className="trayBox" id="trayBox">
      <h4>
        Itens <span id="trayCount">{me.items.length}</span>
      </h4>
      <div id="tray">
        {me.items.length ? (
          me.items.map((k, i) => <TrayItem key={i} k={k} usable={!!ph && canUse(me, k, ph)} />)
        ) : (
          <div className="muted" style={{ fontSize: 13 }}>
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
  return (
    <div className={`itm ${when} ${usable ? '' : 'off'}`}>
      <span className="ico">
        <Icon name={when === 'D' ? 'moon' : 'sun'} />
      </span>
      <div style={{ minWidth: 0 }}>
        <b>{name}</b>
        <small>{text}</small>
      </div>
      {k === 'NAO' ? (
        <span className="later">reação</span>
      ) : usable ? (
        <button data-use={k} onClick={() => void activateItem(k)}>
          Usar
        </button>
      ) : (
        <span className="later">{when === 'D' ? 'antes' : 'depois'}</span>
      )}
    </div>
  );
}
