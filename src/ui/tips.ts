// Dicas de como jogar: qual está aberta e quais já foram vistas. O desenho fica em app/overlays/Tips.tsx.
import { flushSync } from 'react-dom';
import { TIP } from '../app/overlays/tipContent.tsx';
import { useUi } from '../app/store.ts';
import { $ } from './html.ts';

export const TIPS = {
  on: true,
  seen: new Set<string>(),
  cur: null as string | null,
  after: null as string | null, // dica que abre quando a atual fechar
};

export function tipFor(key: string) {
  if (!TIPS.on || TIPS.seen.has(key) || !TIP[key]) return;
  TIPS.seen.add(key);
  TIPS.cur = key;
  if (key === 'start') TIPS.after = 'king';
  $('tut').classList.remove('!hidden');
  tipPlace();
}

export function tipClose() {
  TIPS.cur = null;
  $('tut').classList.add('!hidden');
  if (TIPS.after) {
    const k = TIPS.after;
    TIPS.after = null;
    tipFor(k);
  }
}

// redesenha e reposiciona a dica aberta (a mesa pode ter mudado de lugar)
export function tipPlace() {
  if (!TIPS.cur) return;
  flushSync(() => useUi.setState((s) => ({ tip: s.tip + 1 })));
}
