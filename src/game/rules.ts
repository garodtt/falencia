// Regras: valores, margens, quem está ganhando, o que pode ser usado agora.
import { ARMS, CH, ITEMS, KINGS, LEND, MA, OC, TR, VE, gc, gv, shuffle } from './data.ts';
import { G, alivePl, chaosIs, log, nm, ord } from './state.ts';
import type { ChaosKey, Gob, ItemKey, Monster } from './data.ts';
import type { Player, UsedItem } from './types.ts';

// como cada jogador está na rodada: soma, distância até o alvo, margem e se caiu fora (Zona, Somas Iguais)
export interface Row {
  p: Player;
  S: number;
  d: number;
  mg: number;
  add: number;
  out: string;
}
export interface Standing {
  w: Player[];
  kind: 'none' | 'closest' | 'exact';
  F: Row[];
  M: number;
}

export function kingActive(p: Player) {
  return !(chaosIs('MALDICAO') && G.curse && KINGS[p.king].tr & G.curse);
}
export const hasKing = (p: Player, k: number) => p.king === k && kingActive(p);
export const lendsTo = (p: Player, g: Gob) => kingActive(p) && LEND[KINGS[p.king].lend][1](gv(g));
export function traitsOf(p: Player, g: Gob) {
  let t = TR[gv(g)];
  if (lendsTo(p, g)) t |= KINGS[p.king].tr;
  const d = G.rd[p.id].disg;
  if (d) t |= d;
  return t;
}
export function val(p: Player, g: Gob) {
  if (chaosIs('MALDICAO') && G.curse && traitsOf(p, g) & G.curse) return 0;
  return gv(g);
}
export const monOf = (m: Monster) =>
  (chaosIs('GIGANTE') ? m.v + 10 : chaosIs('ANAO') ? Math.max(1, m.v - 6) : m.v) +
  (chaosIs('MUTANTE') ? G.mutant || 0 : 0) +
  G.monMod;
export const monVal = () => monOf(G.monster!);
export const noTarget = () => chaosIs('INVERSO') || chaosIs('MENOR') || chaosIs('MAIOR');
export function terrOf(p: Player, m: Monster) {
  const s = m.ts.slice();
  const b = G.rd[p.id].band;
  if (b >= 0 && !s.includes(b)) s.push(b);
  return s;
}
export function margin(p: Player, gs: Gob[], m?: Monster | null) {
  if (noTarget()) return 0;
  const ts = terrOf(p, m || G.monster!);
  if (hasKing(p, 2) && ts.includes(2)) return 2;
  return gs.some((g) => ts.includes(gc(g))) ? 1 : 0;
}
export const monocle = (_p?: Player, _gs?: Gob[]) => false; // habilidade antiga, desligada
export const playable = (p: Player) => p.hand;
// [mínimo, máximo] de goblins que o jogador pode jogar
export function playLimit(p: Player): [number, number] {
  const n = p.hand.length;
  return [
    chaosIs('MENOR') ? Math.min(2, n) : 1,
    Math.max(1, Math.min(n, G.rd[p.id].tambor ? 4 : 3)),
  ];
}
export const inZone = (S: number) => S >= 20 && S <= 30;
export const inDuel = (p: Player) => !G.duel || G.duel.includes(p.id);
export const itemsBlocked = () => false;
export function drawFrom(deck: 'ideck', disc: 'idisc'): ItemKey | undefined;
export function drawFrom(deck: 'cdeck', disc: 'cdisc'): ChaosKey | undefined;
export function drawFrom(deck: 'ideck' | 'cdeck', disc: 'idisc' | 'cdisc') {
  const D = G as unknown as Record<string, string[]>;
  if (!D[deck].length) {
    D[deck] = shuffle(D[disc]);
    D[disc] = [];
  }
  return D[deck].pop();
}
export function addItem(p: Player, key: ItemKey) {
  if (key === 'SACO') {
    G.idisc.push('SACO');
    log(`${nm(p)}: Saco de Moedas — compra 2 itens.`, 'it');
    for (let k = 0; k < 2; k++) {
      const x = drawFrom('ideck', 'idisc');
      if (x) addItem(p, x);
    }
    return;
  }
  p.items.push(key);
}
export const spendItem = (p: Player, k: ItemKey) => {
  const i = p.items.indexOf(k);
  if (i < 0) return false;
  p.items.splice(i, 1);
  G.idisc.push(k);
  const rd = G.rd && G.rd[p.id];
  if (rd) (rd.used || (rd.used = [])).push({ k });
  return true;
};
export const lastUse = (p: Player): Partial<UsedItem> => {
  const u = G.rd && G.rd[p.id] && G.rd[p.id].used;
  return u && u.length ? u[u.length - 1] : {};
};
export function toGrave(p: Player, g: Gob) {
  const i = p.hand.indexOf(g);
  if (i >= 0) p.hand.splice(i, 1);
  G.grave[p.id].push(g);
}
export const armed = (p: Player, k: ItemKey) => G.rd[p.id].armed.includes(k);
export function targetsFor(p: Player) {
  return alivePl().filter((o) => o !== p && o.hand.length && !armed(o, 'ESCUDO'));
}
export function rawSum(p: Player) {
  const rd = G.rd[p.id];
  return rd.gs.reduce((a, g) => a + val(p, g), 0) + rd.delta;
}
export function leftPlayer(p: Player) {
  for (let k = 1; k < G.n; k++) {
    const q = G.players[(p.id + k) % G.n];
    if (q.alive && G.rd[q.id].gs.length && q !== p) return q;
  }
  return null;
}
export function standing(): Standing {
  const M = monVal(),
    M2 = G.monster2 ? monOf(G.monster2) : null;
  const pls = ord().filter((p) => G.rd[p.id].gs.length),
    base = new Map(pls.map((p) => [p.id, rawSum(p)]));
  const F = pls.map((p) => {
    let S = base.get(p.id)!,
      add = 0;
    if (chaosIs('VIZINHO')) {
      const l = leftPlayer(p);
      if (l) add = Math.floor(base.get(l.id)! / 2);
      S += add;
    }
    let mg = margin(p, G.rd[p.id].gs),
      d = Math.max(0, Math.abs(S - M) - mg);
    if (M2 !== null) {
      const mg2 = margin(p, G.rd[p.id].gs, G.monster2),
        d2 = Math.max(0, Math.abs(S - M2) - mg2);
      if (d2 < d) {
        d = d2;
        mg = mg2;
      }
    }
    if (chaosIs('IMA') && inZone(S)) d += 5;
    if (chaosIs('INVERSO')) d = Math.abs(S - M);
    const out: string = chaosIs('ZONA') && inZone(S) ? 'zona' : '';
    return { p, S, d, mg, add, out };
  });
  if (chaosIs('IGUAIS')) {
    const cnt: Record<number, number> = {};
    F.forEach((x) => (cnt[x.S] = (cnt[x.S] || 0) + 1));
    F.forEach((x) => {
      if (cnt[x.S] > 1) x.out = 'iguais';
    });
  }
  const E = F.filter((x) => !x.out);
  if (!E.length) return { w: [], kind: 'none', F, M };
  if (chaosIs('INVERSO')) {
    const m = Math.max(...E.map((x) => x.d));
    return { w: E.filter((x) => x.d === m).map((x) => x.p), kind: 'closest', F, M };
  }
  if (chaosIs('MENOR')) {
    const m = Math.min(...E.map((x) => x.S));
    return { w: E.filter((x) => x.S === m).map((x) => x.p), kind: 'closest', F, M };
  }
  if (chaosIs('MAIOR')) {
    const m = Math.max(...E.map((x) => x.S));
    return { w: E.filter((x) => x.S === m).map((x) => x.p), kind: 'closest', F, M };
  }
  const ex = chaosIs('OPOSTOS') ? [] : E.filter((x) => x.d === 0);
  if (ex.length) return { w: ex.map((x) => x.p), kind: 'exact', F, M };
  const pool = chaosIs('CACA') ? E.filter((x) => !(G.leaders || []).includes(x.p.id)) : E;
  if (!pool.length) return { w: [], kind: 'none', F, M };
  const m = Math.min(...pool.map((x) => x.d));
  return { w: pool.filter((x) => x.d === m).map((x) => x.p), kind: 'closest', F, M };
}
export function itemOptions(p: Player, k: ItemKey) {
  const rd = G.rd[p.id],
    gs = rd.gs,
    sg = (x: number) => (x > 0 ? '+' : '') + x,
    rng = (n: number) =>
      Array.from({ length: 2 * n + 1 }, (_, i) => i - n)
        .filter((x) => x)
        .map((x) => ({ d: x, label: sg(x) }));
  switch (k) {
    case 'PORRETE':
      return [{ d: 2, label: '+2' }];
    case 'PE_CABRA':
      return [{ d: -2, label: '−2' }];
    case 'AJUSTE':
      return rng(3);
    case 'OCULOS': {
      const n = gs.filter((g) => traitsOf(p, g) & OC).length;
      return Array.from({ length: 2 * n }, (_, i) => ({ d: i + 1, label: '+' + (i + 1) }));
    }
    case 'CHAPEU': {
      const n = gs.filter((g) => traitsOf(p, g) & CH).length;
      return n ? rng(2 * n) : [];
    }
    case 'POCAO': {
      const o: { d: number; label: string }[] = [];
      gs.forEach((g) => {
        const v = val(p, g);
        if (traitsOf(p, g) & MA && v > 0) {
          o.push({ d: v, label: `${gv(g)} vale o dobro (+${v})` });
          o.push({ d: -Math.ceil(v / 2), label: `${gv(g)} vale a metade (−${Math.ceil(v / 2)})` });
        }
      });
      return o;
    }
    case 'POMADA':
      return gs.some((g) => traitsOf(p, g) & VE) ? rng(3) : [];
  }
  return [];
}
// pode usar o item agora? (motor e tela usam a mesma regra)
export function canUse(p: Player | null | undefined, k: ItemKey, phase: string) {
  if (!p || !p.alive || !p.items.includes(k) || itemsBlocked()) return false;
  const w = ITEMS[k][2],
    A = alivePl(),
    rd = G.rd[p.id];
  if (phase === 'select' && w === 'D') {
    switch (k) {
      case 'SACRIFICIO':
        return p.hand.length >= 2 && A.some((o) => o !== p && o.hand.length);
      case 'PA':
        return G.grave[p.id].length > 0;
      case 'LADRAO':
        return G.players.some((o) => o !== p && G.grave[o.id].length);
      case 'MAO_LEVE':
        return A.some((o) => o !== p && o.items.length);
      case 'ISCA':
        return G.monsters.length > 0;
      case 'TAMBOR':
        return !rd.tambor;
      case 'BANDEIRA':
        return rd.band < 0;
      case 'DISFARCE':
        return !rd.disg;
    }
    return true;
  }
  if (phase === 'window' && w === 'A') {
    if (k === 'NAO') return false;
    if (ARMS.includes(k)) return !armed(p, k);
    if (k === 'GRITO') return true;
    if (k === 'ISCA') return G.monsters.length + G.mused.length > 2;
    return itemOptions(p, k).length > 0;
  }
  return false;
}
export function drawMonster(pred: (m: Monster) => boolean) {
  let i = G.monsters.findIndex(pred);
  if (i < 0) {
    const j = G.mused.findIndex((m) => pred(m) && m !== G.monster);
    if (j >= 0) {
      const m = G.mused.splice(j, 1)[0];
      G.mused.push(m);
      return m;
    }
    i = G.monsters.length - 1;
  }
  if (!G.monsters.length) {
    G.monsters = shuffle(G.mused.filter((m) => m !== G.monster));
    G.mused = G.monster ? [G.monster] : [];
    i = Math.max(0, G.monsters.findIndex(pred));
  }
  const m = G.monsters.splice(i, 1)[0];
  G.mused.push(m);
  return m;
}
