import { CLAN, MFX } from '../../../game/data.ts';
import type { Monster } from '../../../game/data.ts';
import { monOf } from '../../../game/rules.ts';
import { G, chaosIs } from '../../../game/state.ts';
import { CCSS } from '../../../ui/html.ts';
import { ColorDot } from '../ColorDot.tsx';
import { TipBody, TipNote, TipRow } from '../tooltip/TipBody.tsx';

// O monstro acordado: quanto vale de verdade (e por quê) e de que territórios é
export function MonsterTip({ m }: { m: Monster }) {
  const worth = monOf(m);
  return (
    <TipBody
      accent={CCSS[m.ts[0]]}
      title={`Monstro ${worth}`}
      sub={worth !== m.v ? `Impresso: ${m.v}` : undefined}
    >
      {m.fx && MFX[m.fx] ? <TipNote>{`${MFX[m.fx][0]}: ${MFX[m.fx][1]}`}</TipNote> : null}
      {changes().map((c) => (
        <TipNote key={c}>{c}</TipNote>
      ))}
      {m.ts.map((c) => (
        <TipRow key={c} icon={<ColorDot color={c} />} name={`Território ${CLAN[c]}`} />
      ))}
      <TipNote>Jogue algum goblin de um desses territórios e você ganha margem de ±1.</TipNote>
    </TipBody>
  );
}

// o monstro ainda dormindo
export function SleepingMonsterTip() {
  return (
    <TipBody accent="var(--moon)" title="Monstro dormindo">
      <TipNote>Vale de 10 a 40. Ele acorda depois que todos jogarem.</TipNote>
      <TipNote>A Luneta revela o valor antes da hora.</TipNote>
    </TipBody>
  );
}

// o que mudou o valor impresso nesta rodada
function changes() {
  const out: string[] = [];
  if (chaosIs('GIGANTE')) out.push('Monstro Gigante: +10.');
  if (chaosIs('ANAO')) out.push('Monstro Anão: −6 (no mínimo 1).');
  if (chaosIs('MUTANTE') && G.mutant)
    out.push(`Monstro Mutante: o ${G.mutantCard} é ${G.mutant > 0 ? 'par, +5' : 'ímpar, −5'}.`);
  if (G.monMod) out.push(`Grito de Guerra: ${G.monMod > 0 ? '+' : ''}${G.monMod}.`);
  return out;
}
