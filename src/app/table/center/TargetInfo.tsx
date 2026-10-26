import { CLAN } from '../../../game/data.ts';
import { monOf, monVal } from '../../../game/rules.ts';
import { G, chaosIs } from '../../../game/state.ts';

// o que vale nesta rodada: o alvo (com território e mutante) ou a regra de corrida
export function TargetInfo() {
  if (!G.monster) return null;
  if (!G.revealed) return <span>Escolha seus goblins antes de o monstro acordar</span>;
  if (chaosIs('MENOR')) return <Goal title="Vence a menor soma" sub="Corrida dos Pequenos" />;
  if (chaosIs('MAIOR')) return <Goal title="Vence a maior soma" sub="Corrida dos Grandes" />;
  return (
    <Goal
      title={`Alvo ${monVal()}${G.monster2 ? ` ou ${monOf(G.monster2)}` : ''}`}
      sub={
        chaosIs('INVERSO')
          ? 'Mundo Invertido: vence quem ficar mais longe'
          : `Território ${G.monster.ts.map((c) => CLAN[c]).join(' e ')}${G.mutantCard ? ` · mutante ${G.mutantCard} (${G.mutant > 0 ? '+5' : '−5'})` : ''}`
      }
    />
  );
}

function Goal({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <b>{title}</b>
      <span>{sub}</span>
    </>
  );
}
