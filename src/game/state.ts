// Estado compartilhado da partida.
// G é o estado da partida (JSON puro, é o que vai para o banco).
// ME é o assento de quem está vendo esta tela.
import { CLAN, gc, gv } from './data.ts';
import type { Gob } from './data.ts';
import type { FxEvent, GameState, LogLine, Player, Reply } from './types.ts';
import type { Fb } from '../net/firebase.ts';

// G é null fora de uma partida (no menu); o código que roda nessa hora checa `G && G.players`
export let G: GameState = null!,
  ME = 0,
  MODE: 'local' | 'online' = 'local',
  SPEED = 1;
// escolhas do menu: quantos jogadores e o território de quem joga
export const MENU = { n: 4, color: 0 };
export const setG = (v: GameState | null) => {
    G = v!;
  },
  setME = (v: number) => {
    ME = v;
  },
  setMODE = (v: typeof MODE) => {
    MODE = v;
  },
  setSPEED = (v: number) => {
    SPEED = v;
  };
// a tela se pendura aqui; sem tela (testes) nada acontece
export const hooks = { sync() {}, playFx: async (_ev: FxEvent) => {}, tip(_kind: string) {} };
export const sync = () => hooks.sync();
// estado só desta tela (seleção da mão, modal aberto...), nunca vai para o banco
// (o que é só de tela — seleção da mão, modal, rei aberto — fica na store do React: app/store.ts)
interface Local {
  hide: Set<Gob>; // goblins que acabei de jogar: somem da mão até a jogada ser aceita
  answered: Record<number, number>; // pedidos que já respondi (online), por nonce
  seenFx: number; // último efeito visual já tocado
  busy: boolean; // escolhendo o alvo/valor de um item
  spec: boolean; // só assistindo (online, sem assento)
  deadShown?: boolean; // o aviso de "você faliu" já apareceu
  modalNonce?: number | null; // o modal aberto responde a este pedido
}
export const LOCAL: Local = {
  hide: new Set(),
  answered: {},
  seenFx: 0,
  busy: false,
  spec: false,
};
interface Net {
  db: Fb['db'] | null;
  user: Fb['user'] | null;
  uid: string | null;
  names: Record<string, string>;
  code: string | null;
  isHost: boolean;
  unGame: (() => void) | null;
  unActs: (() => void) | null;
  actSeen: Record<string, number>;
  writing: boolean;
  dirty: boolean;
  lobbies: GameState[];
  mine: GameState[];
  unLobby: (() => void) | null;
  unMine: (() => void) | null;
  waitSince: Record<number, number>;
  canWrite?: boolean;
}
export const NET: Net = {
  db: null,
  user: null,
  uid: null,
  names: {},
  code: null,
  isHost: false,
  unGame: null,
  unActs: null,
  actSeen: {},
  writing: false,
  dirty: false,
  lobbies: [],
  mine: [],
  unLobby: null,
  unMine: null,
  waitSince: {},
};
// respostas pendentes: nonce do pedido -> quem está esperando
export const PENDRES: Record<number, { pid: number; res: (v: Reply) => void }> = {};
export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms * SPEED));
export const P = (id: number) => G.players[id];
export const alivePl = () => G.players.filter((p) => p.alive);
export const ord = () => G.order.map(P);
export const leftOf = (p: Player) => {
  for (let k = 1; k <= G.n; k++) {
    const q = G.players[(p.id + k) % G.n];
    if (q.alive && q !== p) return q;
  }
  return null;
};
export const chaosIs = (k: string) => G.chaos === k;
export const nm = (p: Player) => `[[p${p.id}]]`;
export const gobTxt = (g: Gob) => `${gv(g)} ${CLAN[gc(g)].toLowerCase()}`;
export const isHuman = (p: Player) => !p.bot;
export function nameOf(pid: number) {
  const p = G.players[pid];
  if (!p) return '?';
  if (pid === ME && !LOCAL.spec && !p.bot && (MODE === 'local' || p.uid === NET.uid)) return 'Você';
  if (p.bot) return MODE === 'local' ? CLAN[p.color] : `Bot ${CLAN[p.color]}`;
  return NET.names[p.uid!] || `Jogador ${CLAN[p.color]}`;
}
// troca os [[pN]] dos textos do motor pelo nome do jogador, do ponto de vista desta tela
export const fmt = (s: unknown) => String(s).replace(/\[\[p(\d)\]\]/g, (_, i) => nameOf(+i));
export function log(msg: string, cls?: LogLine['cls']) {
  G.log.push({ msg, cls });
  if (G.log.length > 120) G.log.splice(0, G.log.length - 120);
}
// jogador vivo à direita (o anterior na ordem da mesa)
export function rightOf(p: Player) {
  for (let k = 1; k < G.n; k++) {
    const q = G.players[(p.id - k + G.n) % G.n];
    if (q.alive && q !== p) return q;
  }
  return null;
}
