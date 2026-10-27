import { MFX } from '../../../game/data.ts';
import type { Monster } from '../../../game/data.ts';
import { CCSS } from '../../../ui/html.ts';
import { CARD_BASE } from './cardBase.ts';

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
    <div
      data-card
      className={`${CARD_BASE} grid place-items-center border border-[#5a5490] bg-[linear-gradient(170deg,#2e2b45,#1b1a26)] ${className}`}
    >
      <span className="absolute top-[8%] right-0 left-0 flex justify-center gap-[5px]">
        {m.ts.map((c, i) => (
          <i
            key={i}
            className="block h-[calc(var(--cw)*0.1)] w-[calc(var(--cw)*0.1)] min-h-[9px] min-w-[9px] rounded-full"
            style={{ background: CCSS[c] }}
          />
        ))}
      </span>
      {mod ? (
        <span className="absolute top-[20%] right-0 left-0 text-center font-ui text-[calc(var(--cw)*0.1)] font-bold text-accent">
          {`${mod > 0 ? '+' : ''}${mod} → ${m.v + mod}`}
        </span>
      ) : null}
      <span className="font-display text-[calc(var(--cw)*0.5)] leading-none font-extrabold tracking-[-1px] text-white">
        {m.v}
      </span>
      <span className="absolute bottom-[8%] right-0 left-0 text-center font-ui text-[calc(var(--cw)*0.085)] font-bold tracking-[0.1em] text-muted uppercase">
        {m.fx && MFX[m.fx] ? MFX[m.fx][0] : 'Monstro'}
      </span>
    </div>
  );
}
