// Sandbox (#/sandbox): tudo que o jogo tem de visual, numa página só, com os componentes de
// verdade. Edite o código com `npm run dev` aberto e veja mudar aqui na hora.
import { useSyncExternalStore } from 'react';
import type { ComponentType } from 'react';
import { newState } from '../game/engine.ts';
import { G, setG } from '../game/state.ts';
import { Sprites } from '../app/components/Sprites.tsx';
import { Overlays } from '../app/overlays/Overlays.tsx';
import { SeletorTema } from './SeletorTema.tsx';
import { Animacoes } from './sections/Animacoes.tsx';
import { Cartas } from './sections/Cartas.tsx';
import { Janelas } from './sections/Janelas.tsx';
import { Mesa } from './sections/Mesa.tsx';
import { Pecas } from './sections/Pecas.tsx';
import { Tokens } from './sections/Tokens.tsx';

const SECOES: [string, string, ComponentType][] = [
  ['mesa', 'Mesa', Mesa],
  ['cartas', 'Cartas', Cartas],
  ['animacoes', 'Animações', Animacoes],
  ['janelas', 'Janelas', Janelas],
  ['pecas', 'Peças', Pecas],
  ['tokens', 'Tokens', Tokens],
];

const onHash = (cb: () => void) => {
  addEventListener('hashchange', cb);
  return () => removeEventListener('hashchange', cb);
};

// os balões das cartas (dono, rei, passiva) leem a partida: aqui vale uma partida parada de 4
if (!G)
  setG(
    newState(
      4,
      [0, 1, 2, 3].map((color) => ({ color, bot: color > 0 })),
    ),
  );

export default function Sandbox() {
  const id = useSyncExternalStore(onHash, () => location.hash.split('/')[2] || 'mesa');
  const [, titulo, Secao] = SECOES.find(([s]) => s === id) || SECOES[0];
  return (
    <>
      <Sprites />
      <header className="sticky top-0 z-dock flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line bg-bg py-2.5 px-safe">
        <b className="font-display text-xl font-extrabold">
          Sandbox <span className="text-accent">Goblins</span>
        </b>
        <nav className="flex flex-wrap gap-1">
          {SECOES.map(([s, nome]) => (
            <a
              key={s}
              href={`#/sandbox/${s}`}
              className={`rounded-box px-3 py-1.5 text-small font-bold ${s === id ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'}`}
            >
              {nome}
            </a>
          ))}
        </nav>
        <a className="ml-auto text-small text-muted hover:text-text" href="#/">
          ← Voltar ao jogo
        </a>
        <div className="basis-full">
          <SeletorTema />
        </div>
      </header>
      <main className="mx-auto grid max-w-[1100px] gap-4 py-5 px-safe">
        <h2 className="m-0 font-display text-title font-semibold">{titulo}</h2>
        <Secao />
      </main>
      <Overlays />
    </>
  );
}
