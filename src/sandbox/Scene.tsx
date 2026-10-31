// Uma cena da mesa em tela cheia: #/sandbox/cena/<id>?n=4&caos=NECRO&seed=1
// O sandbox mostra esta página dentro de um iframe (assim o tamanho de celular vale de verdade).
import { useEffect, useState } from 'react';
import type { ChaosKey } from '../game/data.ts';
import { App } from '../app/App.tsx';
import { CENAS, montar, mostrar } from './scenes.ts';

export function lerCena(hash: string) {
  const [path, q = ''] = hash.replace('#/sandbox/cena/', '').split('?');
  const p = new URLSearchParams(q);
  return {
    cena: CENAS.find((c) => c.id === path) || CENAS[0],
    n: Math.min(4, Math.max(2, +(p.get('n') || 4))),
    caos: (p.get('caos') || undefined) as ChaosKey | undefined,
    seed: +(p.get('seed') || 1),
  };
}

// a partida é global (G): só uma montagem por página, mesmo com o StrictMode rodando o efeito 2×
let started = false;

export default function Scene() {
  const [state, setState] = useState<'montando' | 'pronta' | 'falhou'>('montando');
  useEffect(() => {
    if (started) return;
    started = true;
    void montar(lerCena(location.hash)).then((s) => {
      if (s === null) return setState('falhou');
      mostrar();
      setState('pronta');
    });
  }, []);
  if (state === 'pronta') return <App />;
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center text-muted">
      {state === 'montando'
        ? 'Montando a partida…'
        : 'Nenhuma partida chegou nesse momento (com esse Caos e esse número de jogadores). Tente outra combinação.'}
    </div>
  );
}
