import { useUi } from '../store.ts';

// recado curto no topo ("Você roubou o 7 azul!")
export function Toast() {
  const t = useUi((s) => s.toast);
  return t ? (
    <div
      key={t.id}
      className="animate-rise rounded-[10px] bg-text px-4 py-[9px] text-center font-bold text-bg shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
    >
      {t.msg}
    </div>
  ) : null;
}
