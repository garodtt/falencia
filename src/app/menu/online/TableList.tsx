import type { GameState } from '../../../game/types.ts';
import { GHOST } from '../../components/variants.ts';
import { joinWithTips } from './join.ts';

// uma linha de botões de mesa (nada, se a lista estiver vazia)
export function TableList({
  title,
  tables,
  label,
}: {
  title?: string;
  tables: GameState[];
  label: (t: GameState) => string;
}) {
  if (!tables.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {title ? <span className="text-muted">{title}</span> : null}
      {tables.map((t) => (
        <button key={t.code} className={GHOST} onClick={() => joinWithTips(t.code!)}>
          {label(t)}
        </button>
      ))}
    </div>
  );
}
