import { TICO, TNAME } from '../../../game/data.ts';
import { monOf, monVal } from '../../../game/rules.ts';
import { G, ME } from '../../../game/state.ts';
import { CCSS } from '../../../ui/html.ts';
import { CARD_BASE } from '../../components/cards/cardBase.ts';
import { MonsterBack } from '../../components/cards/MonsterBack.tsx';
import { MonsterCard } from '../../components/cards/MonsterCard.tsx';
import { Icon } from '../../components/Icon.tsx';
import { MonsterTip, SleepingMonsterTip } from '../../components/tips/MonsterTip.tsx';
import { useTooltip } from '../../components/tooltip/useTooltip.tsx';
import { Flip } from './Flip.tsx';

// o monstro da rodada e, com Monstros Opostos, o segundo monstro
export function MonsterSlot() {
  const first = G.monster,
    second = G.monster2 && G.revealed ? G.monster2 : null;
  const tip1 = useTooltip(
    first ? () => (G.revealed ? <MonsterTip m={first} /> : <SleepingMonsterTip />) : null,
    'right',
  );
  const tip2 = useTooltip(second ? () => <MonsterTip m={second} /> : null, 'right');
  return (
    <div className="flex items-center gap-3.5 land:col-start-1 land:row-span-3 land:row-start-1">
      <div
        id="monsterSlot"
        className="[--cw:clamp(92px,min(9vw,15vh),140px)] land:[--cw:60px]"
        {...tip1.anchor()}
      >
        <Monster />
      </div>
      <div
        id="monsterSlot2"
        className={`[--cw:clamp(92px,min(9vw,15vh),140px)] land:[--cw:60px] ${second ? '' : '!hidden'}`}
        {...tip2.anchor()}
      >
        {second ? <MonsterCard m={second} mod={monOf(second) - second.v} /> : null}
      </div>
      {tip1.tooltip}
      {tip2.tooltip}
    </div>
  );
}

// verso com as pistas (Luneta com a passiva, Faro, território) enquanto dorme; vira quando acorda
function Monster() {
  if (!G.monster)
    return (
      <div
        data-card
        className={`${CARD_BASE} grid place-items-center border border-[#45425e] bg-[linear-gradient(170deg,#2b2a3a,#1c1b26)] text-moon opacity-25`}
      >
        <Icon name="moon" />
      </div>
    );
  const h = (G.rd[ME] || {}).hint || {},
    mod = monVal() - G.monster.v;
  const hint =
    h.value >= 0
      ? `Luneta: ${h.value}`
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
              style={{ background: CCSS[h.t1] }}
            />
          </span>
        ) : null}
        {h.value >= 0 && G.monster.curse ? (
          <span className="absolute bottom-[21%] right-0 left-0 flex items-center justify-center gap-1 text-[calc(var(--cw)*0.09)] font-bold text-bad">
            <Icon name={TICO[G.monster.curse]} />
            {`${TNAME[G.monster.curse]} = 0`}
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
