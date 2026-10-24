import type { CSSProperties } from 'react';
import { G, ME } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { Seat } from './Seat.tsx';

// os rivais, no topo da mesa, na ordem de quem joga depois de você
export function Opponents() {
  const opps: Player[] = [];
  for (let k = 1; k < G.n; k++) opps.push(G.players[(ME + k) % G.n]);
  return (
    <div className="opps" id="opps" style={{ '--no': String(opps.length) } as CSSProperties}>
      {opps.map((p) => (
        <Seat key={p.id} p={p} />
      ))}
    </div>
  );
}
