// Dicas de como jogar: qual está aberta e quais já foram vistas. O desenho fica em overlays/Tips.tsx.
import { flushSync } from 'react-dom';
import { TIP } from './overlays/tipContent.tsx';
import { useUi } from './store.ts';

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
  tipPlace();
}

export function tipClose() {
  TIPS.cur = null;
  if (TIPS.after) {
    const k = TIPS.after;
    TIPS.after = null;
    tipFor(k);
  } else redraw();
}

const redraw = () => flushSync(() => useUi.setState((s) => ({ tip: s.tip + 1 })));

// redesenha e reposiciona a dica aberta (a mesa pode ter mudado de lugar)
export function tipPlace() {
  if (TIPS.cur) redraw();
}
