// Leituras do estado que mais de um pedaço da mesa usa.
import { G, LOCAL, ME, MODE, NET } from '../../game/state.ts';
import type { Pending, Player } from '../../game/types.ts';
import { useUi } from '../store.ts';

// o pedido em aberto para quem está nesta tela (null se não há, se já respondeu ou se só assiste)
export const myPending = (): Pending | null =>
  !LOCAL.spec && G.pend[ME] && !LOCAL.answered[G.pend[ME].nonce] ? G.pend[ME] : null;

// goblins escolhidos que ainda estão na mão (a mão pode ter mudado: roubo, Às Cegas...)
export const selection = () => {
  const hand = G.players[ME].hand;
  return useUi.getState().sel.filter((g) => hand.includes(g));
};

// por que o jogador perdeu sem precisar comparar distância
export function outLabel(pid: number) {
  const o = G.result && (G.result.out || []).find((x) => x[0] === pid);
  return o ? (o[1] === 'zona' ? 'Zona Proibida' : 'Soma igual') : '';
}

// online, o anfitrião pode pôr um bot no lugar de quem está demorando mais de 30s
export const canKick = (p: Player, waiting: boolean) =>
  MODE === 'online' &&
  NET.isHost &&
  waiting &&
  Date.now() - (NET.waitSince[p.id] || Date.now()) > 30000;
