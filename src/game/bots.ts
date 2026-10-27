// IA dos bots.
import { CN, NUMERIC, PRIO, gc, gv, pick, shuffle } from './data.ts';
import { execUse } from './engine.ts';
import {
  armed,
  canUse,
  inZone,
  itemOptions,
  itemsBlocked,
  margin,
  monOf,
  noTarget,
  playLimit,
  rawSum,
  scarGraves,
  scarred,
  standing,
  traitsOf,
  val,
} from './rules.ts';
import { G, P, SPEED, alivePl, chaosIs, wait } from './state.ts';
import type { Gob, ItemKey, Monster } from './data.ts';
import type { Standing } from './rules.ts';
import type { Hint, ItemArgs, Player, PromptData, PromptKind, Reply } from './types.ts';

// ligado pelas simulações e pelos testes: bots jogam sem pausas e com a estratégia "de cálculo"
declare global {
  var SIMQ: boolean | undefined;
}
// um monstro possível (e, com Monstros Opostos, o segundo)
interface Outcome {
  m: Monster;
  M: number;
  m2?: Monster | null;
}
interface WindowPick {
  k: ItemKey;
  args: ItemArgs;
  gain?: number;
}

export function monsterOutcomes(p: Player, info: Hint): Outcome[] {
  let mons = G.monsters.concat([G.monster!]);
  if (info.value >= 0) mons = [G.monster!];
  else if (info.t1 !== undefined && info.t1 !== null) {
    const f = mons.filter((m) => m.ts[0] === info.t1);
    if (f.length) mons = f;
  }
  if (chaosIs('OPOSTOS') && info.value < 0) {
    const lo = mons.filter((m) => m.v <= 24);
    if (lo.length) mons = lo;
  }
  if (info.par && info.value < 0) {
    const f = mons.filter((m) => (monOf(m) % 2 === 0 ? 1 : 2) === info.par);
    if (f.length) mons = f;
  }
  return mons.map((m) => ({ m, M: monOf(m) }));
}
interface Persona {
  name: string;
  k: number[];
  bias: number;
  sd: number;
  whim: number;
}
export const PERSONAS = {
  ousado: { name: 'Ousado', k: [0.1, 0.35, 0.55], bias: 3, sd: 3.5, whim: 0.1 },
  cauteloso: { name: 'Cauteloso', k: [0.45, 0.4, 0.15], bias: -3, sd: 3, whim: 0.08 },
  caotico: { name: 'Caótico', k: [0.34, 0.33, 0.33], bias: 0, sd: 7, whim: 0.3 },
  imitador: { name: 'Imitador', k: [0.25, 0.45, 0.3], bias: 0, sd: 3, whim: 0.12 },
  leitor: { name: 'Leitor', k: [0.2, 0.45, 0.35], bias: 0, sd: 2.5, whim: 0.06 },
} satisfies Record<string, Persona>;
export type PersonaKey = keyof typeof PERSONAS;
export const gauss = () => {
  let u = 0,
    v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
// escolhe como uma pessoa: um alvo com lógica, um pouco de erro e, às vezes, um palpite no impulso
export function humanChoose(p: Player, info: Hint): Gob[] {
  const P0: Persona = PERSONAS[p.persona!] || PERSONAS.leitor,
    pool = p.hand,
    [kmin, kmax] = playLimit(p);
  if (!pool.length) return [];
  const vals = pool.map((g) => val(p, g));
  let k: number;
  {
    const r = Math.random();
    k = r < P0.k[0] ? 1 : r < P0.k[0] + P0.k[1] ? 2 : 3;
    if (G.rd[p.id].tambor && Math.random() < 0.5) k = 4;
  }
  k = Math.max(kmin, Math.min(kmax, k, pool.length));
  if (Math.random() < P0.whim) return shuffle(pool.slice()).slice(0, k);
  const outs = monsterOutcomes(p, info),
    E = outs.reduce((a, o) => a + o.M, 0) / outs.length;
  let T = E + P0.bias + gauss() * P0.sd;
  if (p.persona === 'imitador' && G.lastWinSum) T = G.lastWinSum + gauss() * 3;
  if (chaosIs('OPOSTOS') && Math.random() < 0.5) T = 32 + gauss() * 4;
  if (chaosIs('MENOR')) T = 0;
  if (chaosIs('MAIOR')) T = 99;
  if (chaosIs('INVERSO')) T = E < 25 ? 45 : 0;
  const dodge =
    (chaosIs('ZONA') && Math.random() < 0.85) || (chaosIs('IMA') && Math.random() < 0.6);
  if (dodge && T >= 20 && T <= 30) T = T < 25 ? 17 - Math.random() * 4 : 33 + Math.random() * 4;
  const seen = G.openPlays
    ? alivePl()
        .filter((o) => o !== p && G.rd[o.id].gs.length)
        .map((o) => rawSum(o))
    : [];
  const cands: { ch: number[]; sc: number }[] = [];
  const rec = (st: number, ch: number[], sm: number) => {
    if (ch.length === k) {
      let sc = Math.abs(sm - T);
      if (dodge && inZone(sm)) sc += 20;
      if (chaosIs('IGUAIS') && seen.includes(sm)) sc += 15;
      cands.push({ ch: ch.slice(), sc });
      return;
    }
    for (let i = st; i < pool.length; i++) {
      ch.push(i);
      rec(i + 1, ch, sm + vals[i]);
      ch.pop();
    }
  };
  rec(0, [], 0);
  if (!cands.length) return pool.slice(0, k);
  cands.sort((a, b) => a.sc - b.sc);
  const r = Math.random(),
    pickI = r < 0.6 ? 0 : r < 0.85 ? 1 : 2;
  return cands[Math.min(pickI, cands.length - 1)].ch.map((i) => pool[i]);
}
export function botChoose(p: Player, info: Hint): Gob[] {
  if (!IS_SIM() || p.strat === 'human') return humanChoose(p, info);
  const pool = p.hand,
    [kmin, kmax] = playLimit(p),
    vals = pool.map((g) => val(p, g)),
    n = pool.length;
  if (!n) return [];
  const byVal = pool.map((g, i) => i).sort((a, b) => vals[a] - vals[b]);
  if (chaosIs('MENOR')) return byVal.slice(0, kmin).map((i) => pool[i]);
  if (chaosIs('MAIOR')) return byVal.slice(-kmax).map((i) => pool[i]);
  let outs = monsterOutcomes(p, info);
  if (chaosIs('OPOSTOS')) {
    const all = G.monsters.concat([G.monster!]),
      hi = all.filter((m) => m.v >= 26);
    outs = outs.flatMap((o) =>
      [0, 1, 2].map(() => ({ m: o.m, M: o.M, m2: hi.length ? pick(hi) : null })),
    );
  }
  if (chaosIs('MUTANTE'))
    outs = outs.flatMap((o) => [5, -5].map((sh) => ({ m: o.m, M: o.M + sh, m2: o.m2 })));
  const others = G.duel ? 1 : alivePl().filter((o) => o !== p && o.hand.length).length,
    q = (x: number) => 1 - Math.exp(-x / 3),
    inv = chaosIs('INVERSO');
  const leader = chaosIs('CACA') && (G.leaders || []).includes(p.id),
    shift = chaosIs('VIZINHO') ? 7 : 0;
  const cands = new Map<number, number[]>();
  const rec = (start: number, chosen: number[]) => {
    if (chosen.length >= kmin) {
      const sm = chosen.reduce((a, i) => a + vals[i], 0);
      let mask = 0;
      chosen.forEach((i) => (mask |= 1 << gc(pool[i])));
      const key = sm * 64 + mask * 4 + chosen.length;
      if (!cands.has(key)) cands.set(key, chosen.slice());
    }
    if (chosen.length === kmax) return;
    for (let i = start; i < n; i++) {
      chosen.push(i);
      rec(i + 1, chosen);
      chosen.pop();
    }
  };
  rec(0, []);
  let best: Gob[] | null = null,
    bv = -1e9;
  for (const idx of cands.values()) {
    const gs = idx.map((i) => pool[i]),
      S = idx.reduce((a, i) => a + vals[i], 0) + shift,
      k = idx.length;
    let pe = 0,
      pw = 0;
    if (!(chaosIs('ZONA') && inZone(S)))
      for (const o of outs) {
        let d = Math.max(0, Math.abs(S - o.M) - margin(p, gs, o.m));
        if (o.m2) d = Math.min(d, Math.max(0, Math.abs(S - monOf(o.m2)) - margin(p, gs, o.m2)));
        if (chaosIs('IMA') && inZone(S)) d += 5;
        if (inv) pw += Math.min(1, Math.abs(S - o.M) / 25);
        else if (d === 0 && !chaosIs('OPOSTOS')) pe++;
        else if (!leader) pw += Math.pow(1 - q(d), others);
      }
    pe /= outs.length;
    pw /= outs.length;
    const pl = Math.max(0, 1 - pe - pw),
      lossCost = k + (k >= p.hand.length ? 6 : 0);
    const v = pe * 3.2 + pw * 1.7 - pl * lossCost * 0.9 + (Math.random() - 0.5) * 0.05;
    if (v > bv) {
      bv = v;
      best = gs;
    }
  }
  return best || [pool[0]];
}
export function botTarget(p: Player, T: Player[], kind: string) {
  if (kind === 'elim') {
    const one = T.filter((o) => o.hand.length === 1);
    if (one.length) return pick(one);
  }
  const m = Math.max(...T.map((o) => o.hand.length));
  return pick(T.filter((o) => o.hand.length === m));
}
export async function botDormindo(p: Player) {
  if (itemsBlocked()) return;
  const A = alivePl();
  if (p.items.includes('LUNETA')) await execUse(p, 'LUNETA', {});
  if (p.items.includes('PA') && G.grave[p.id].length && p.hand.length <= 12)
    await execUse(p, 'PA', { g: G.grave[p.id].reduce((a, x) => (gv(x) > gv(a) ? x : a)) });
  if (p.items.includes('LADRAO') && p.hand.length <= 14) {
    const os = G.players.filter((o) => o !== p && G.grave[o.id].length);
    if (os.length) await execUse(p, 'LADRAO', { target: pick(os).id });
  }
  if (p.items.includes('SACRIFICIO') && p.hand.length >= 3) {
    const T = A.filter((o) => o !== p && o.hand.length);
    if (T.length)
      await execUse(p, 'SACRIFICIO', {
        g: p.hand.reduce((a, x) => (gv(x) < gv(a) ? x : a)),
        target: botTarget(p, T, 'steal').id,
      });
  }
  // Cicatrizes Compartilhadas: troca o goblin com Cicatriz mais baixo da mão pelo mais alto
  // dos cemitérios, se ganhar pelo menos 5 (o monstro ainda está virado: território não conta)
  if (p.items.includes('CICATRIZ') && p.hand.length >= 3 && canUse(p, 'CICATRIZ', 'select')) {
    const g = p.hand.filter(scarred).reduce((a, x) => (gv(x) < gv(a) ? x : a));
    const [target, g2] = scarGraves().reduce((a, x) => (gv(x[1]) > gv(a[1]) ? x : a));
    if (gv(g2) - gv(g) >= 5) await execUse(p, 'CICATRIZ', { g, g2, target });
  }
  if (p.items.includes('MAO_LEVE')) {
    const os = A.filter((o) => o !== p && o.items.length);
    if (os.length) await execUse(p, 'MAO_LEVE', { target: pick(os).id });
  }
  if (p.items.includes('COROA') && Math.random() < 0.35) {
    const os = A.filter((o) => o !== p);
    if (os.length) await execUse(p, 'COROA', { target: pick(os).id });
  }
  if (p.items.includes('TAMBOR') && p.hand.length >= 8 && Math.random() < 0.5)
    await execUse(p, 'TAMBOR', {});
  if (p.items.includes('BANDEIRA') && Math.random() < 0.5) {
    const cnt = [0, 0, 0, 0];
    p.hand.forEach((g) => cnt[gc(g)]++);
    await execUse(p, 'BANDEIRA', { c: cnt.indexOf(Math.max(...cnt)) });
  }
  if (p.items.includes('SACO')) await execUse(p, 'SACO', {});
  if (p.items.includes('MAPA') && canUse(p, 'MAPA', 'select')) {
    if (!G.ideck.length) {
      G.ideck = shuffle(G.idisc);
      G.idisc = [];
    }
    const best = G.ideck
      .filter((x) => x !== 'SACO')
      .reduce((a, x) => (PRIO[x] > PRIO[a] ? x : a), G.ideck[0]);
    if (best) await execUse(p, 'MAPA', { k: best });
  }
  if (p.items.includes('PROFECIA') && canUse(p, 'PROFECIA', 'select') && Math.random() < 0.5) {
    if (!G.cdeck.length) {
      G.cdeck = shuffle(G.cdisc);
      G.cdisc = [];
    }
    const A2 = alivePl(),
      few = A2.every((o) => o === p || p.items.length <= o.items.length),
      lead = A2.every((o) => o === p || p.hand.length >= o.hand.length);
    const want =
      few && G.cdeck.includes('FEIRA')
        ? 'FEIRA'
        : !lead && G.cdeck.includes('CACA')
          ? 'CACA'
          : pick(G.cdeck);
    await execUse(p, 'PROFECIA', { k: want });
  }
}
export const IS_SIM = () => typeof SIMQ !== 'undefined' && SIMQ;
export const BOT_PAUSE = () => (IS_SIM() ? 0 : 1500 * SPEED);
export function botScore(q: Player, w: Standing) {
  return (
    (w.w.length === 1 && w.w[0] === q ? 2 : w.w.includes(q) ? 1 : 0) +
    (w.kind === 'exact' && w.w.includes(q) ? 2 : 0)
  );
}
export function botWindowPick(p: Player): WindowPick | null {
  const rd = G.rd[p.id];
  if (!rd.gs.length || !p.alive || p.strat === 'noitems') return null;
  const cur = standing(),
    winning = cur.w.includes(p),
    sole = winning && cur.w.length === 1;
  if (!(sole && cur.kind === 'exact')) {
    const base = botScore(p, cur);
    let bestO: WindowPick | null = null;
    for (const k of NUMERIC.filter((k) => p.items.includes(k)))
      for (const o of itemOptions(p, k)) {
        rd.delta += o.d;
        const g = botScore(p, standing());
        rd.delta -= o.d;
        if (g > base && (!bestO || g > bestO.gain!)) bestO = { k, args: { d: o.d }, gain: g };
      }
    if (p.items.includes('GRITO'))
      for (const d of [2, -2]) {
        G.monMod += d;
        const g = botScore(p, standing());
        G.monMod -= d;
        if (g > base && (!bestO || g > bestO.gain!)) bestO = { k: 'GRITO', args: { d }, gain: g };
      }
    if (bestO) return bestO;
  }
  if (!winning) {
    for (const k of ['AMULETO', 'ESCUDO'] as const)
      if (
        p.items.includes(k) &&
        !armed(p, k) &&
        (k !== 'AMULETO' || rd.gs.length >= 2 || p.hand.length <= 3)
      )
        return { k, args: {} };
    if (
      p.items.includes('CHINELO') &&
      !armed(p, 'CHINELO') &&
      rd.gs.length > 1 &&
      rd.gs.some((g) => traitsOf(p, g) & CN)
    )
      return { k: 'CHINELO', args: {} };
    if (p.items.includes('ISCA') && canUse(p, 'ISCA', 'window') && !noTarget()) {
      const me = cur.F.find((x) => x.p === p);
      if (me && (me.d >= 4 || me.out)) return { k: 'ISCA', args: {} };
    }
  }
  return null;
}
// quem quer que o item valha? true = quer, false = não quer, null = tanto faz
export function itemPrefs(p: Player, k: ItemKey, args: ItemArgs) {
  const W0 = standing();
  let W1 = W0;
  const d = +args.d!;
  if (k === 'GRITO') {
    G.monMod += d;
    W1 = standing();
    G.monMod -= d;
  } else if (NUMERIC.includes(k)) {
    G.rd[p.id].delta += d;
    W1 = standing();
    G.rd[p.id].delta -= d;
  }
  return (q: Player) => {
    if (q === p) return true;
    const a = botScore(q, W1),
      b = botScore(q, W0);
    return a > b ? true : a < b ? false : null;
  };
}
export async function botWindow(p: Player) {
  if (itemsBlocked()) return false;
  const rd = G.rd[p.id];
  if (!rd.gs.length) return false;
  const cur = standing(),
    winning = cur.w.includes(p),
    sole = winning && cur.w.length === 1;
  const score = (w: Standing) =>
    (w.w.length === 1 && w.w[0] === p ? 2 : w.w.includes(p) ? 1 : 0) +
    (w.kind === 'exact' && w.w.includes(p) ? 2 : 0);
  if (!(sole && cur.kind === 'exact')) {
    const base = score(cur);
    let bestO: { k: ItemKey; d: number; gain: number } | null = null;
    for (const k of NUMERIC.filter((k) => p.items.includes(k)))
      for (const o of itemOptions(p, k)) {
        rd.delta += o.d;
        const g = score(standing());
        rd.delta -= o.d;
        if (g > base && (!bestO || g > bestO.gain)) bestO = { k, d: o.d, gain: g };
      }
    if (p.items.includes('GRITO'))
      for (const d of [2, -2]) {
        G.monMod += d;
        const g = score(standing());
        G.monMod -= d;
        if (g > base && (!bestO || g > bestO.gain)) bestO = { k: 'GRITO', d, gain: g };
      }
    if (bestO) {
      await execUse(p, bestO.k, { d: bestO.d });
      await wait(300);
      return true;
    }
  }
  if (!winning) {
    for (const k of ['AMULETO', 'ESCUDO'] as const)
      if (
        p.items.includes(k) &&
        !armed(p, k) &&
        (k !== 'AMULETO' || rd.gs.length >= 2 || p.hand.length <= 3)
      ) {
        await execUse(p, k, {});
        return true;
      }
    if (
      p.items.includes('CHINELO') &&
      !armed(p, 'CHINELO') &&
      rd.gs.length > 1 &&
      rd.gs.some((g) => traitsOf(p, g) & CN)
    ) {
      await execUse(p, 'CHINELO', {});
      return true;
    }
  }
  return false;
}
export function botDecide(pid: number, kind: PromptKind, data: PromptData): Reply {
  const p = P(pid);
  if (kind === 'select') return { play: botChoose(p, G.rd[pid].hint) };
  if (kind === 'window') return { pass: 1 };
  if (kind === 'steal' || kind === 'elim') return { target: botTarget(p, data.T!.map(P), kind).id };
  if (kind === 'ask')
    return { value: data.botValue !== undefined ? data.botValue : data.options![0].value };
  return { ok: 1 };
}
