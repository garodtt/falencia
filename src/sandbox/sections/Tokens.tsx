// Os tokens do @theme (src/styles.css). As classes ficam escritas por extenso de propósito: o
// Tailwind só gera a classe que aparece inteira no código.
import { Amostra, Bloco, LINHA } from '../layout.tsx';

const CORES: [string, string][] = [
  ['bg', 'bg-bg'],
  ['surface', 'bg-surface'],
  ['surface-2', 'bg-surface-2'],
  ['surface-3', 'bg-surface-3'],
  ['line', 'bg-line'],
  ['text', 'bg-text'],
  ['muted', 'bg-muted'],
  ['accent', 'bg-accent'],
  ['red', 'bg-red'],
  ['green', 'bg-green'],
  ['blue', 'bg-blue'],
  ['yellow', 'bg-yellow'],
  ['chaos', 'bg-chaos'],
  ['moon', 'bg-moon'],
  ['sun', 'bg-sun'],
  ['good', 'bg-good'],
  ['bad', 'bg-bad'],
  ['on-accent', 'bg-on-accent'],
  ['on-yellow', 'bg-on-yellow'],
  ['scrim', 'bg-scrim'],
  ['card-edge', 'bg-card-edge'],
  ['card-mark', 'bg-card-mark'],
  ['mon-edge', 'bg-mon-edge'],
  ['mon-edge-lit', 'bg-mon-edge-lit'],
];
const LETRAS: [string, string][] = [
  ['text-note · 11', 'text-note'],
  ['text-xs · 12', 'text-xs'],
  ['text-small · 13', 'text-small'],
  ['text-body · 14', 'text-body'],
  ['text-md · 15', 'text-md'],
  ['text-lg · 18', 'text-lg'],
  ['text-title · 22', 'text-title'],
  ['text-sum · 26', 'text-sum'],
  ['text-sum-lg · 32', 'text-sum-lg'],
];
const SOMBRAS = [
  'shadow-card',
  'shadow-float',
  'shadow-pop',
  'shadow-dialog',
  'shadow-dock',
  'shadow-glow',
  'shadow-glow-strong',
  'inset-ring inset-ring-line',
];
const CANTOS = ['rounded-box', 'rounded-panel', 'rounded-lg', 'rounded-xl', 'rounded-2xl'];
const CAMADAS = [
  'z-dock 30',
  'z-fly 32',
  'z-drawer 35',
  'z-banner 40',
  'z-tip 42',
  'z-toast 44',
  'z-modal 45',
  'z-rotate 50',
  'z-confetti 55',
  'z-tooltip 60',
];

export function Tokens() {
  return (
    <>
      <Bloco titulo="Cores" desc="Transparência com /NN: bg-bad/12, ring-accent/40, bg-scrim/72.">
        <div className={LINHA}>
          {CORES.map(([nome, cls]) => (
            <Amostra key={nome} nome={nome}>
              <span className={`block size-14 rounded-box inset-ring inset-ring-line ${cls}`} />
            </Amostra>
          ))}
        </div>
      </Bloco>
      <Bloco titulo="Letras" desc="font-display (títulos e números) e font-ui (o resto).">
        {LETRAS.map(([nome, cls]) => (
          <div key={nome} className="flex items-baseline gap-4">
            <span className="w-32 font-mono text-note text-muted">{nome}</span>
            <span className={cls}>Goblin cravou o monstro 27</span>
            <span className={`font-display font-extrabold ${cls}`}>27</span>
          </div>
        ))}
      </Bloco>
      <Bloco titulo="Sombras e cantos">
        <div className={LINHA}>
          {SOMBRAS.map((cls) => (
            <Amostra key={cls} nome={cls}>
              <span className={`block size-20 rounded-box bg-surface-2 ${cls}`} />
            </Amostra>
          ))}
        </div>
        <div className={LINHA}>
          {CANTOS.map((cls) => (
            <Amostra key={cls} nome={cls}>
              <span className={`block size-20 border border-line bg-surface-2 ${cls}`} />
            </Amostra>
          ))}
        </div>
      </Bloco>
      <Bloco
        titulo="Camadas (z-index)"
        desc="De baixo para cima. Dentro de uma carta use z-1 a z-5."
      >
        <div className="flex flex-wrap gap-2 font-mono text-small">
          {CAMADAS.map((z) => (
            <span key={z} className="rounded-box bg-surface-2 px-2.5 py-1">
              {z}
            </span>
          ))}
        </div>
      </Bloco>
    </>
  );
}
