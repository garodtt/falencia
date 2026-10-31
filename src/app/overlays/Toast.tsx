import { useUi } from '../store.ts';

// recado curto no topo ("Você roubou o 7 azul!")
export function Toast() {
  const t = useUi((s) => s.toast);
  return t ? (
    <div
      key={t.id}
      className="animate-rise rounded-box bg-text px-4 py-[9px] text-center font-bold text-bg shadow-float"
    >
      {t.msg}
    </div>
  ) : null;
}
