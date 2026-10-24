import { monOf, monVal } from '../../../game/rules.ts';
import { G, ME } from '../../../game/state.ts';
import { CCSS } from '../../../ui/html.ts';
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
    <div className="mons">
      <div id="monsterSlot" {...tip1.anchor()}>
        <Monster />
      </div>
      <div id="monsterSlot2" className={second ? '' : 'hidden'} {...tip2.anchor()}>
        {second ? <MonsterCard m={second} mod={monOf(second) - second.v} /> : null}
      </div>
      {tip1.tooltip}
      {tip2.tooltip}
    </div>
  );
}

// verso com as pistas (Luneta, Faro, território) enquanto dorme; vira quando acorda
function Monster() {
  if (!G.monster)
    return (
      <div className="card mback" style={{ opacity: 0.25 }}>
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
      <MonsterBack className="backside">
        {h.t1 !== undefined && h.t1 !== null ? (
          <span className="terr">
            <i style={{ background: CCSS[h.t1] }} />
          </span>
        ) : null}
        <span className="hint2">{hint}</span>
      </MonsterBack>
      <MonsterCard m={G.monster} mod={mod} className="front" />
    </Flip>
  );
}
