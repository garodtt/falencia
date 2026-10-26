import { G } from '../../game/state.ts';
import { fmt } from '../../ui/html.ts';
import { useTick } from '../store.ts';

// o histórico da partida, do mais recente para o mais antigo
export function LogList() {
  useTick();
  if (!G || !G.log) return null;
  const n = G.log.length;
  return [...G.log].reverse().map((l, i) => (
    <div key={n - i} className={`l ${l.cls || ''}`}>
      {fmt(l.msg)}
    </div>
  ));
}
