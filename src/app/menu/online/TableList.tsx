import type { GameState } from '../../../game/types.ts';
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
    <div className="row">
      {title ? <span className="muted">{title}</span> : null}
      {tables.map((t) => (
        <button key={t.code} className="ghost" onClick={() => joinWithTips(t.code!)}>
          {label(t)}
        </button>
      ))}
    </div>
  );
}
