// Formato do estado da partida. É JSON puro: é isso que o anfitrião grava no banco.
import type { ChaosKey, Gob, ItemKey, Monster } from './data.ts';
import type { PersonaKey } from './bots.ts';

export interface Player {
  id: number;
  color: number;
  king: number;
  uid: string | null;
  bot: boolean;
  persona: PersonaKey | null;
  hand: Gob[];
  items: ItemKey[];
  alive: boolean;
  out: number; // rodada em que faliu (0 = vivo)
  strat?: 'human' | 'noitems'; // só nas simulações (SIMQ)
}

// o que o monstro "parece" para um jogador antes de acordar (Luneta etc.)
export interface Hint {
  value: number;
  par: number;
  t1: number | null;
}
export interface UsedItem {
  k: ItemKey;
  d?: number;
  c?: number;
  t?: number;
  x?: number;
}

// a jogada de um jogador na rodada atual
export interface Round {
  gs: Gob[];
  delta: number;
  armed: ItemKey[];
  band: number;
  disg: number;
  tambor: boolean;
  hint: Hint;
  note: string;
  used?: UsedItem[];
  borrow?: Gob; // carta emprestada pela Roleta
}

export type PromptKind = 'select' | 'window' | 'steal' | 'elim' | 'draw' | 'ask' | 'chaos' | 'next';
export type AskValue = number | string | null;
export interface AskOption {
  label: string;
  value: AskValue;
  cls?: string;
}
export interface PromptData {
  left?: number;
  T?: number[];
  exact?: boolean;
  race?: number;
  title?: string;
  text?: string;
  options?: AskOption[];
  botValue?: AskValue;
  cards?: ItemKey[];
}
export interface Pending {
  kind: PromptKind;
  data: PromptData;
  nonce: number;
}
export interface ItemArgs {
  d?: number;
  c?: number;
  t?: number;
  g?: Gob;
  g2?: Gob; // Cicatrizes Compartilhadas: o goblin pego do cemitério de `target`
  target?: number;
  k?: ItemKey | ChaosKey; // Mapa do Tesouro / Profecia do Caos
}
export interface Reply {
  play?: Gob[];
  use?: ItemKey;
  args?: ItemArgs;
  pass?: number;
  target?: number;
  value?: AskValue;
  ok?: number;
  stale?: number;
}

// efeitos visuais: o motor publica, cada tela toca o seu
export interface FxCard {
  g?: Gob;
  vis?: number[];
  pub?: number;
  sm?: number;
  item?: ItemKey;
  chaos?: ChaosKey;
  curse?: number;
  t?: 'back' | 'item' | 'chaos' | 'mon';
}
export type FxEvent = { id?: number; to?: number | number[] } & (
  | {
      type: 'fly';
      from: string;
      to2: string;
      card: FxCard;
      dur?: number;
      rot?: number;
      delay?: number;
    }
  | { type: 'toast'; text: string }
  | { type: 'pop'; pid: number; text: string; good?: boolean }
  | { type: 'banner'; text: string; sub?: string; kind?: string }
  | { type: 'result'; w: number[]; kind: string; played: number[] }
  | { type: 'chaosShow'; k: ChaosKey; curse: number }
  | { type: 'end' }
);

export interface LogLine {
  msg: string;
  cls?: string;
}
export interface Seat {
  uid?: string;
  color: number;
  bot?: boolean;
}
export interface Result {
  w: number[];
  kind: string;
  out: [number, string][];
}
export interface LastPlay {
  gs: Gob[];
  S: number;
  d: number;
  out: string;
}
export type Phase = '' | 'dormindo' | 'acordado' | 'resultado';

export interface GameState {
  n: number;
  round: number;
  status: 'lobby' | 'playing' | 'over';
  players: Player[];
  order: number[];
  chief: number;
  log: LogLine[];
  fx: FxEvent[];
  fxc: number;
  pend: Record<number, Pending>;
  nonce: number;
  phase: Phase;
  revealed: boolean;
  over: boolean;
  winner: number | null;
  result: Result | null;
  lastStand: boolean;
  monsters: Monster[];
  mused: Monster[];
  monster: Monster | null;
  monster2: Monster | null;
  monMod: number;
  mutant: number;
  mutantCard?: number | null;
  ideck: ItemKey[];
  idisc: ItemKey[];
  cdeck: ChaosKey[];
  cdisc: ChaosKey[];
  chaos: ChaosKey | null;
  nextChaos: ChaosKey | null;
  curse: number;
  nextCurse: number;
  duel: number[] | null;
  leaders: number[];
  openPlays: boolean;
  grave: Gob[][];
  rd: Round[];
  // aparecem durante a partida
  last?: Record<number, LastPlay> | null;
  act?: { pid: number; text: string } | null;
  ready?: Record<number, number>;
  win?: boolean;
  lastWinSum?: number | null;
  banq?: number;
  pressa?: number[]; // perderam jogando 3+ goblins (Pressa não Compensa)
  underdog?: number[]; // menor mão no início da rodada (Cravada do Azarão)
  necro?: Record<number, Gob[]> | null; // Necromante: a mão guardada de quem joga com o cemitério
  // mesa online
  code?: string;
  hostUid?: string;
  seats?: Seat[];
  ckpt?: string | null;
  uids?: string[];
  updatedAt?: number;
}
