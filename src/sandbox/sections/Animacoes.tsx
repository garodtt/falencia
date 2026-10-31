// Os efeitos do jogo, disparados pelas mesmas funções que o motor usa (app/fx.tsx).
import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { makeMonsters, mk } from '../../game/data.ts';
import type { FxCard } from '../../game/types.ts';
import { MonsterBack } from '../../app/components/cards/MonsterBack.tsx';
import { MonsterCard } from '../../app/components/cards/MonsterCard.tsx';
import { GHOST } from '../../app/components/variants.ts';
import { banner, confetti, fly, fxCard, popAt, toast } from '../../app/fx.tsx';
import { Flip } from '../../app/table/center/Flip.tsx';
import { Amostra, Bloco, LINHA } from '../layout.tsx';

const VOOS: [string, FxCard][] = [
  ['goblin', { g: mk(2, 13), pub: 1 }],
  ['goblin escondido', { g: mk(1, 4) }],
  ['item', { item: 'LUNETA', vis: [0] }],
  ['item escondido', { t: 'item' }],
  ['Caos', { chaos: 'IMA' }],
  ['monstro', { t: 'mon' }],
];
const BANNERS: [string, string, string, string][] = [
  ['padrão', 'Cravou!', 'Você rouba cartas e compra um item', ''],
  ['bad', 'Perdeu', 'Azul venceu a rodada', 'bad'],
  ['cool', 'Verde + Azul', 'venceu a rodada', 'cool'],
  ['pink (Caos)', 'Ímã', 'Próxima rodada: somas de 20 a 30 contam 5 mais longe', 'pink'],
];
// classes de animação do @theme; a chave nova faz a animação tocar de novo
const CLASSES = ['animate-rise', 'animate-rev-in', 'animate-pop', 'animate-blink', 'animate-shake'];
const MONSTRO = makeMonsters()[17];

export function Animacoes() {
  const de = useRef<HTMLDivElement>(null),
    para = useRef<HTMLDivElement>(null),
    alvo = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false),
    [vez, setVez] = useState(0);
  const caixa = 'grid size-28 place-items-center rounded-panel border border-dashed border-line';
  return (
    <>
      <Bloco
        titulo="Carta voando (fly)"
        desc="Da caixa da esquerda para a da direita. É o que acontece ao jogar, roubar, comprar item..."
      >
        <div className="flex items-center gap-10 [--cw:70px]">
          <div ref={de} className={caixa}>
            de
          </div>
          <div className="flex flex-wrap gap-2">
            {VOOS.map(([nome, c]) => (
              <button
                key={nome}
                className={GHOST}
                onClick={() => void fly(de.current, para.current, fxCard(c), { rot: 8 })}
              >
                {nome}
              </button>
            ))}
          </div>
          <div ref={para} className={caixa}>
            para
          </div>
        </div>
      </Bloco>
      <Bloco titulo="Virar o monstro (Flip)" desc="Monstro dormindo → acordado.">
        <div className="flex items-center gap-6 [--cw:90px]">
          <Flip open={aberto}>
            <MonsterBack />
            <MonsterCard m={MONSTRO} mod={0} className="front" />
          </Flip>
          <button onClick={() => setAberto(!aberto)}>{aberto ? 'Fechar' : 'Acordar'}</button>
        </div>
      </Bloco>
      <Bloco titulo="Avisos">
        <div className="flex flex-wrap gap-2">
          {BANNERS.map(([nome, t, sub, kind]) => (
            <button key={nome} className={GHOST} onClick={() => void banner(t, sub, kind)}>
              banner {nome}
            </button>
          ))}
          <button className={GHOST} onClick={() => toast('Você roubou o 7 azul!')}>
            toast
          </button>
          <button className={GHOST} onClick={confetti}>
            confete
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div ref={alvo} className={`${caixa} mt-8`}>
            assento
          </div>
          <button className={GHOST} onClick={() => popAt(alvo.current, '+1 item', true)}>
            balãozinho bom
          </button>
          <button className={GHOST} onClick={() => popAt(alvo.current, '−2 cartas')}>
            balãozinho ruim
          </button>
        </div>
      </Bloco>
      <Bloco titulo="Classes de animação" desc="Clique em uma para tocar de novo.">
        <div className={LINHA}>
          {CLASSES.map((cls) => (
            <Amostra key={cls} nome={cls}>
              <button className={GHOST} onClick={() => setVez(vez + 1)}>
                <span
                  key={vez}
                  className={`block size-12 rounded-box bg-accent ${cls}`}
                  style={{ '--spd': 1 } as CSSProperties}
                />
              </button>
            </Amostra>
          ))}
        </div>
      </Bloco>
    </>
  );
}
