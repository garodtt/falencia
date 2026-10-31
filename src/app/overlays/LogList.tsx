import { G, fmt } from '../../game/state.ts';

import { useTick } from '../store.ts';

const CLS: Record<string, string> = {
  rh: '!pt-[10px] font-bold text-text',
  ch: 'text-chaos',
  it: 'text-sun',
};

// o histórico da partida, do mais recente para o mais antigo
export function LogList() {
  useTick();
  if (!G || !G.log) return null;
  const n = G.log.length;
  return [...G.log].reverse().map((l, i) => (
    <div
      key={n - i}
      className={`border-b border-line py-[5px] text-small text-muted ${l.cls ? CLS[l.cls] || '' : ''}`}
    >
      {fmt(l.msg)}
    </div>
  ));
}
