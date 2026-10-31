import { TICO, TNAME } from '../../../game/data.ts';
import { monOf, monVal, spied } from '../../../game/rules.ts';
import { G, ME } from '../../../game/state.ts';
import { CLAN_COLOR } from '../../components/cards/cardBase.ts';
import { CARD_BASE } from '../../components/cards/cardBase.ts';
import { MonsterBack } from '../../components/cards/MonsterBack.tsx';
import { MonsterCard } from '../../components/cards/MonsterCard.tsx';
import { Icon } from '../../components/Icon.tsx';
import { MonsterTip, SleepingMonsterTip } from '../../components/tips/MonsterTip.tsx';
import { Tooltip } from '../../components/tooltip/Tooltip.tsx';
import { Flip } from './Flip.tsx';

const SLOT = '[--cw:clamp(92px,min(9vw,15vh),140px)] land:[--cw:60px]';

// o monstro da rodada e, com Monstros Opostos, o segundo monstro
export function MonsterSlot() {
  const first = G.monster,
    second = G.monster2 && G.revealed ? G.monster2 : null;
  return (
    <div className="flex items-center gap-3.5 land:col-start-1 land:row-span-3 land:row-start-1">
      <Tooltip
        side="right"
        content={
          first ? () => (G.revealed ? <MonsterTip m={first} /> : <SleepingMonsterTip />) : null
        }
      >
        <div id="monsterSlot" className={SLOT}>
          <Monster />
        </div>
      </Tooltip>
      {second && (
        <Tooltip side="right" content={() => <MonsterTip m={second} />}>
          <div id="monsterSlot2" className={SLOT}>
            <MonsterCard m={second} mod={monOf(second) - second.v} />
          </div>
        </Tooltip>
      )}
    </div>
  );
}

// verso com as pistas (Luneta com a passiva, Faro, território) enquanto dorme; vira quando acorda
function Monster() {
  if (!G.monster)
    return (
      <div
        data-card
        className={`${CARD_BASE} grid place-items-center border border-mon-edge bg-mon-back text-moon opacity-25`}
      >
        <Icon name="moon" />
      </div>
    );
  const h = (G.rd[ME] || {}).hint || {},
    mod = monVal() - G.monster.v,
    seen = G.players[ME] ? spied(G.players[ME]) : null;
  const hint =
    h.value >= 0
      ? `Luneta: ${h.value}${G.monster2 ? (h.m ? ' (2º monstro)' : ' (1º monstro)') : ''}`
      : h.par
        ? `Faro: ${h.par === 2 ? 'ímpar' : 'par'}`
        : 'vale de 10 a 40';
  return (
    <Flip key={`${G.round}-${G.monster.v}-${mod}`} open={!!G.revealed}>
      <MonsterBack>
        {h.t1 !== undefined && h.t1 !== null ? (
          <span className="absolute top-[8%] right-0 left-0 flex justify-center gap-[5px]">
            <i
              className="block h-[calc(var(--cw)*0.1)] w-[calc(var(--cw)*0.1)] min-h-[9px] min-w-[9px] rounded-full"
              style={{ background: CLAN_COLOR[h.t1] }}
            />
          </span>
        ) : null}
        {seen && seen.curse ? (
          <span className="absolute bottom-[21%] right-0 left-0 flex items-center justify-center gap-1 text-[calc(var(--cw)*0.09)] font-bold text-bad">
            <Icon name={TICO[seen.curse]} />
            {`${TNAME[seen.curse]} = 0`}
          </span>
        ) : null}
        <span className="absolute bottom-[9%] right-0 left-0 text-center text-[calc(var(--cw)*0.1)] text-muted">
          {hint}
        </span>
      </MonsterBack>
      <MonsterCard m={G.monster} mod={mod} className="front" />
    </Flip>
  );
}
