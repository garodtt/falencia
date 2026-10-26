import { MFX } from '../../../game/data.ts';
import type { Monster } from '../../../game/data.ts';
import { CCSS } from '../../../ui/html.ts';

// frente do monstro: valor, territórios e quanto o Caos/Grito mudam o valor (`mod`)
export function MonsterCard({
  m,
  mod,
  className = '',
}: {
  m: Monster;
  mod: number;
  className?: string;
}) {
  return (
    <div className={`card monster ${className}`}>
      <span className="terr">
        {m.ts.map((c, i) => (
          <i key={i} style={{ background: CCSS[c] }} />
        ))}
      </span>
      {mod ? <span className="mod">{`${mod > 0 ? '+' : ''}${mod} → ${m.v + mod}`}</span> : null}
      <span className="mnum">{m.v}</span>
      <span className="mlbl">{m.fx && MFX[m.fx] ? MFX[m.fx][0] : 'Monstro'}</span>
    </div>
  );
}
