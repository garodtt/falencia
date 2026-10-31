// Seletor de tema do sandbox: troca, ao vivo, a escala do cinza (--g-*) e a do destaque (--a-*)
// que os tokens do styles.css usam. Só para experimentar: o tema do jogo é o que está no
// styles.css. A escolha fica salva neste navegador (as cenas da mesa, em iframe, leem de lá).
import { useSyncExternalStore } from 'react';
import '@radix-ui/colors/gray-dark.css';
import '@radix-ui/colors/mauve-dark.css';
import '@radix-ui/colors/sage-dark.css';
import '@radix-ui/colors/olive-dark.css';
import '@radix-ui/colors/sand-dark.css';
import '@radix-ui/colors/yellow-dark.css';
import '@radix-ui/colors/gold-dark.css';
import '@radix-ui/colors/tomato-dark.css';
import '@radix-ui/colors/crimson-dark.css';
import '@radix-ui/colors/grass-dark.css';
import '@radix-ui/colors/jade-dark.css';
import '@radix-ui/colors/iris-dark.css';

export const CINZAS = ['slate', 'gray', 'mauve', 'sage', 'olive', 'sand'];
export const DESTAQUES = [
  'amber',
  'yellow',
  'orange',
  'gold',
  'tomato',
  'crimson',
  'grass',
  'jade',
  'iris',
  'violet',
];
// destaques claros: o texto em cima deles é escuro (como no Radix Themes)
const CLAROS = ['amber', 'yellow'];
// os tons do cinza que os tokens usam (ver :root em styles.css)
const TONS = [1, 2, 3, 4, 6, 7, 8, 11, 12];

export interface Tema {
  cinza: string;
  destaque: string;
}
export const PADRAO: Tema = { cinza: 'slate', destaque: 'amber' };
const KEY = 'sandbox-tema';

function ler(): Tema {
  try {
    return { ...PADRAO, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return PADRAO;
  }
}

export function aplicar(t: Tema, doc: Document = document) {
  const s = doc.documentElement.style;
  for (const i of TONS) s.setProperty(`--g-${i}`, `var(--${t.cinza}-${i})`);
  s.setProperty('--a-9', `var(--${t.destaque}-9)`);
  s.setProperty('--a-contrast', CLAROS.includes(t.destaque) ? `var(--${t.cinza}-1)` : 'white');
}

let atual = ler();
const ouvintes = new Set<() => void>();

// troca o tema desta página e das cenas da mesa abertas em iframe (mesma origem)
export function escolher(t: Partial<Tema>) {
  atual = { ...atual, ...t };
  try {
    localStorage.setItem(KEY, JSON.stringify(atual));
  } catch {
    // sem storage: vale só até recarregar
  }
  aplicar(atual);
  for (const f of document.querySelectorAll('iframe'))
    if (f.contentDocument) aplicar(atual, f.contentDocument);
  ouvintes.forEach((cb) => cb());
}

export const useTema = () =>
  useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => atual,
  );

aplicar(atual);
