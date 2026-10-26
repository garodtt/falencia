import { useUi } from '../store.ts';

// recado curto no topo ("Você roubou o 7 azul!")
export function Toast() {
  const t = useUi((s) => s.toast);
  return t ? <div key={t.id}>{t.msg}</div> : null;
}
