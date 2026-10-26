import type { CSSProperties } from 'react';
import { mk } from '../../game/data.ts';
import { GobCard } from '../components/cards/GobCard.tsx';

// o leque de cartas decorativo do topo
const FAN = [mk(0, 7), mk(3, 13), mk(1, 4), mk(2, 18), mk(0, 20)];

// título, resumo do jogo e o leque
export function Hero() {
  return (
    <div className="hero">
      <div>
        <h1>
          Falência: <span>Goblins</span>
        </h1>
        <p>
          Chegue o mais perto do monstro, para cima ou para baixo. Crave o valor para roubar cartas.
          A cada rodada uma carta de Caos muda a regra. O último goblin em pé vence.
        </p>
      </div>
      <div className="fanDemo" id="fanDemo">
        {FAN.map((g, i) => (
          <GobCard
            key={g}
            g={g}
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
