import type { CSSProperties } from 'react';
import { mk } from '../../game/data.ts';
import { GobCard } from '../components/cards/GobCard.tsx';

// o leque de cartas decorativo do topo
const FAN = [mk(0, 7), mk(3, 13), mk(1, 4), mk(2, 18), mk(0, 20)];

// título, resumo do jogo e o leque
export function Hero() {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6 max-[700px]:grid-cols-1">
      <div>
        <h1 className="m-0 font-display text-[clamp(40px,7vw,72px)] leading-[0.95] font-extrabold tracking-[-1.5px] [text-wrap:balance]">
          Falência: <span className="text-accent">Goblins</span>
        </h1>
        <p className="mt-2.5 mb-0 max-w-[52ch] text-[15px] text-muted">
          Chegue o mais perto do monstro, para cima ou para baixo. Crave o valor para roubar cartas.
          A cada rodada uma carta de Caos muda a regra. O último goblin em pé vence.
        </p>
      </div>
      <div className="relative h-[150px] w-[260px] max-[700px]:mx-auto" id="fanDemo">
        {FAN.map((g, i) => (
          <GobCard
            key={g}
            g={g}
            className="absolute bottom-0 left-1/2 [transform-origin:50%_130%]"
            style={
              {
                transform: `translateX(-50%) rotate(${(i - 2) * 11}deg) translateY(${Math.abs(i - 2) * 6}px)`,
                '--cw': '72px',
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
