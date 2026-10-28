// Motor da partida: pedidos aos jogadores, janela de itens, rodada e loop do jogo.
// Não toca no DOM: avisa a tela pelos hooks de state.js.
import {
  BOT_PAUSE,
  IS_SIM,
  PERSONAS,
  botChoose,
  botDecide,
  botDormindo,
  botTarget,
  botWindowPick,
  itemPrefs,
} from './bots.ts';
import {
  CHAOS,
  CLAN,
  CN,
  ITEMS,
  MFX,
  PRIO,
  TNAME,
  TRAITS,
  chaosDesc,
  chaosTitle,
  curseTxt,
  gc,
  gv,
  makeMonsters,
  mk,
  pick,
  rnd,
  shuffle,
} from './data.ts';
import {
  addItem,
  armed,
  canUse,
  drawFrom,
  drawMonster,
  hasKing,
  inDuel,
  itemOptions,
  lastUse,
  monFx,
  monVal,
  playLimit,
  playable,
  scarred,
  standing,
  targetsFor,
  toGrave,
  traitsOf,
  spendItem,
} from './rules.ts';
import {
  G,
  LOCAL,
  ME,
  MODE,
  NET,
  P,
  PENDRES,
  SPEED,
  alivePl,
  chaosIs,
  gobTxt,
  hooks,
  isHuman,
  leftOf,
  log,
  nameOf,
  nm,
  ord,
  rightOf,
  sync,
  wait,
} from './state.ts';
import type { PersonaKey } from './bots.ts';
import type { ChaosKey, Gob, ItemKey, Monster } from './data.ts';
import type {
  FxEvent,
  GameState,
  ItemArgs,
  Player,
  PromptData,
  PromptKind,
  Reply,
  Seat,
} from './types.ts';

// um item que alguém decidiu usar na janela de itens
interface WindowAct {
  p: Player;
  k: ItemKey;
  args: ItemArgs;
}
type Timer = ReturnType<typeof setTimeout>;

export async function fx(ev: FxEvent, awaitIt = true) {
  G.fxc = (G.fxc || 0) + 1;
  ev.id = G.fxc;
  G.fx.push(ev);
  if (G.fx.length > 40) G.fx.splice(0, G.fx.length - 40);
  LOCAL.seenFx = ev.id;
  sync();
  const pr = hooks.playFx(ev);
  if (awaitIt) await pr;
}
// ---------- janela de itens (sem ordem) ----------
// Todos que jogaram podem usar itens de Monstro Acordado a qualquer momento.
// Quando alguém usa um item, todos podem responder com NÃO! (em cadeia) e depois a janela reabre para todos.
// A janela fecha quando ninguém mais quer usar nada.
export function setAct(pid: number | null, text?: string) {
  G.act = pid === null ? null : { pid, text: text! };
  sync();
}
// abre a janela para todos; devolve a primeira ação ou null quando todos passam
export function openWindow(list: Player[]) {
  return new Promise<WindowAct | null>((resolve) => {
    let done = false,
      waiting = 0,
      tm: Timer | null = null;
    const finish = (v: WindowAct | null) => {
      if (done) return;
      done = true;
      clearTimeout(tm!);
      for (const p of list) {
        const pe = G.pend[p.id];
        if (pe && pe.kind === 'window') resolvePrompt(p.id, pe.nonce, { pass: 1, stale: 1 });
      }
      resolve(v);
    };
    const humans = list.filter((p) => !p.bot && p.items.some((k) => canUse(p, k, 'window')));
    const bots = list
      .filter((p) => p.bot)
      .map((p) => ({ p, c: botWindowPick(p) }))
      .filter((x) => x.c);
    waiting = humans.length;
    if (!humans.length && !bots.length) return finish(null);
    if (bots.length) {
      const x = pick(bots);
      const go = async () => {
        if (done) return;
        finish({ p: x.p, k: x.c!.k, args: x.c!.args });
      };
      if (IS_SIM()) return go();
      setAct(x.p.id, 'pensando num item…');
      tm = setTimeout(go, humans.length ? BOT_PAUSE() + 800 * SPEED : BOT_PAUSE());
    }
    for (const p of humans)
      void prompt(p.id, 'window').then((r) => {
        if (done) return;
        if (r && r.use && canUse(p, r.use, 'window'))
          return finish({ p, k: r.use, args: r.args || {} });
        if (--waiting <= 0 && !bots.length) finish(null);
      });
  });
}
// pergunta a vários jogadores ao mesmo tempo; devolve quem disse sim primeiro (ou null)
export function raceAsk(
  cands: Player[],
  title: string,
  text: string,
  botWants: (q: Player) => boolean,
) {
  return new Promise<Player | null>((resolve) => {
    let done = false,
      waiting = 0,
      tm: Timer | null = null;
    const humans = cands.filter((q) => !q.bot),
      bots = cands.filter((q) => q.bot && botWants(q));
    const finish = (v: Player | null) => {
      if (done) return;
      done = true;
      clearTimeout(tm!);
      for (const q of humans) {
        const pe = G.pend[q.id];
        if (pe && pe.kind === 'ask' && pe.data.race)
          resolvePrompt(q.id, pe.nonce, { value: 0, stale: 1 });
      }
      resolve(v);
    };
    waiting = humans.length;
    if (!humans.length && !bots.length) return finish(null);
    if (bots.length) {
      const q = pick(bots);
      if (IS_SIM()) return finish(q);
      setAct(q.id, 'vai responder…');
      tm = setTimeout(() => finish(q), humans.length ? BOT_PAUSE() + 600 * SPEED : 700 * SPEED);
    }
    for (const q of humans)
      void prompt(q.id, 'ask', {
        race: 1,
        title,
        text,
        options: [
          { label: 'Usar NÃO!', value: 1, cls: 'red' },
          { label: 'Deixar', value: 0, cls: 'ghost' },
        ],
        botValue: 0,
      }).then((r) => {
        if (done) return;
        if (r && r.value && q.items.includes('NAO')) return finish(q);
        if (--waiting <= 0 && !bots.length) finish(null);
      });
  });
}
// `want` diz se cada bot quer que o item valha (true), não valha (false) ou tanto faz (null)
export async function naoChain(
  p: Player,
  k: ItemKey,
  args: ItemArgs,
  want: (q: Player) => boolean | null = itemPrefs(p, k, args),
) {
  const item = ITEMS[k][0];
  let cancelled = false,
    last = p;
  for (let g = 0; g < 12; g++) {
    const cands = alivePl().filter((q) => q !== last && q.items.includes('NAO'));
    if (!cands.length) break;
    const text = cancelled
      ? `${nm(last)} usou NÃO! contra o ${item} de ${nm(p)}. Responder com outro NÃO! para o ${item} valer?`
      : `${nm(p)} vai usar ${item}${args.d ? ` (${args.d > 0 ? '+' : ''}${args.d})` : ''}. Usar NÃO! para cancelar?`;
    const q = await raceAsk(cands, cancelled ? 'Responder com NÃO!?' : 'Usar NÃO!?', text, (q) => {
      const w = want(q);
      return w !== null && w === cancelled;
    });
    setAct(null);
    if (!q) break;
    spendItem(q, 'NAO');
    cancelled = !cancelled;
    last = q;
    log(`${nm(q)} usou NÃO!${cancelled ? '' : ' de volta'}.`, 'it');
    void fx({ type: 'pop', pid: q.id, text: 'NÃO!' }, false);
    await wait(600);
  }
  return cancelled;
}
export async function itemWindow() {
  G.win = true;
  for (let guard = 0; guard < 40; guard++) {
    const list = ord().filter((p) => p.alive && G.rd[p.id].gs.length);
    const act = await openWindow(list);
    setAct(null);
    if (!act) break;
    const { p, k, args } = act;
    if (!canUse(p, k, 'window')) continue;
    void fx({ type: 'pop', pid: p.id, text: ITEMS[k][0], good: true }, false);
    void fx(
      {
        type: 'toast',
        to: G.players.filter((q) => q !== p).map((q) => q.id),
        text: `${nm(p)} usou ${ITEMS[k][0]}${args && args.d ? ` (${args.d > 0 ? '+' : ''}${args.d})` : ''}.`,
      },
      false,
    );
    if (await naoChain(p, k, args)) {
      spendItem(p, k);
      lastUse(p).x = 1;
      log(`${ITEMS[k][0]} de ${nm(p)} foi cancelado pelo NÃO!.`, 'it');
      void fx({ type: 'toast', text: `${ITEMS[k][0]} de ${nm(p)} foi cancelado.` }, false);
      sync();
      continue;
    }
    await execUse(p, k, args);
    if (!IS_SIM()) await wait(350);
  }
  G.win = false;
  sync();
}
// pedidos que ficaram embaixo de outro (ex.: a Armadilha pergunta enquanto a vítima escolhe goblins)
const UNDER: Record<number, GameState['pend'][number][]> = {};
export function prompt(pid: number, kind: PromptKind, data: PromptData = {}): Promise<Reply> {
  const p = P(pid);
  if (p.bot) return Promise.resolve(botDecide(pid, kind, data));
  G.nonce = (G.nonce || 0) + 1;
  const nonce = G.nonce;
  if (G.pend[pid]) (UNDER[pid] ||= []).push(G.pend[pid]);
  G.pend[pid] = { kind, data, nonce };
  NET.waitSince[pid] = Date.now();
  return new Promise<Reply>((res) => {
    PENDRES[nonce] = { pid, res };
    sync();
    if (pid === ME) hooks.tip(kind);
  });
}
export function resolvePrompt(pid: number, nonce: number, value?: Reply | null) {
  const pe = G.pend[pid];
  if (!pe || pe.nonce !== nonce || !PENDRES[nonce]) return false;
  const r = PENDRES[nonce];
  delete PENDRES[nonce];
  delete G.pend[pid];
  delete NET.waitSince[pid];
  // volta o pedido que estava embaixo, se ainda estiver esperando resposta
  const st = UNDER[pid];
  while (st && st.length) {
    const prev = st.pop()!;
    if (!PENDRES[prev.nonce]) continue;
    if (P(pid).bot) {
      queueMicrotask(() => resolvePrompt(pid, prev.nonce, botDecide(pid, prev.kind, prev.data)));
    }
    G.pend[pid] = prev;
    NET.waitSince[pid] = Date.now();
    break;
  }
  sync();
  r.res(value || {});
  return true;
}
export function botTakeover(pid: number) {
  const p = P(pid);
  if (!p || p.bot) return;
  p.bot = true;
  log(`${nm(p)} saiu; um bot assumiu o lugar.`, 'rh');
  const pe = G.pend[pid];
  if (pe) resolvePrompt(pid, pe.nonce, botDecide(pid, pe.kind, pe.data));
  else sync();
}
export async function naoDuel(attacker: Player, defender: Player, what: string) {
  let cancelled = false,
    turn = defender;
  while (turn.items.includes('NAO')) {
    const other = turn === defender ? attacker : defender;
    const r = await prompt(turn.id, 'ask', {
      title: 'Usar NÃO!?',
      text: cancelled
        ? `${nm(other)} respondeu com NÃO!. Usar outro?`
        : `${what}. Usar NÃO! para cancelar?`,
      options: [
        { label: 'Usar NÃO!', value: 1, cls: 'red' },
        { label: 'Deixar', value: 0, cls: 'ghost' },
      ],
      botValue: 1,
    });
    if (!r.value) break;
    spendItem(turn, 'NAO');
    cancelled = !cancelled;
    log(`${nm(turn)} usou NÃO!`, 'it');
    void fx({ type: 'pop', pid: turn.id, text: 'NÃO!' }, false);
    await wait(400);
    turn = other;
  }
  return cancelled;
}
// executa um item (args já escolhidos por quem usou)
export async function execUse(p: Player, k: ItemKey, a: ItemArgs) {
  const rd = G.rd[p.id];
  const okTarget = (id: number | undefined) => {
    const o = G.players[id!];
    return o && o !== p ? o : null;
  };
  switch (k) {
    case 'LUNETA':
      spendItem(p, k);
      rd.hint.value = G.monster!.v;
      log(`${nm(p)} espiou o monstro com a Luneta.`, 'it');
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: `Luneta: o monstro é ${G.monster!.v}!${G.monster!.curse ? ` Passiva: ${TNAME[G.monster!.curse]} — ${curseTxt(G.monster!.curse)}` : ''}`,
        },
        false,
      );
      void fx({ type: 'pop', pid: p.id, text: 'Luneta', good: true }, false);
      break;
    case 'SACRIFICIO': {
      const o = okTarget(a.target);
      if (!o || !o.hand.length || !p.hand.includes(a.g!)) return;
      spendItem(p, k);
      toGrave(p, a.g!);
      const got = o.hand.splice(rnd(o.hand.length), 1)[0];
      p.hand.push(got);
      log(
        `${nm(p)} usou Sacrifício: mandou o ${gobTxt(a.g!)} ao cemitério e pegou uma carta de ${nm(o)}.`,
        'it',
      );
      void fx({ type: 'toast', to: p.id, text: `Você pegou o ${gobTxt(got)} de ${nm(o)}!` }, false);
      void fx(
        { type: 'toast', to: o.id, text: `${nm(p)} usou Sacrifício e pegou o seu ${gv(got)}!` },
        false,
      );
      await fx({
        type: 'fly',
        from: 'hand:' + o.id,
        to2: 'hand:' + p.id,
        card: { g: got, vis: [p.id, o.id] },
        dur: 560,
      });
      await trap(p, o);
      break;
    }
    case 'COROA': {
      const o = okTarget(a.target);
      if (!o) return;
      spendItem(p, k);
      [p.king, o.king] = [o.king, p.king];
      log(`${nm(p)} usou Coroa Trocada com ${nm(o)}.`, 'it');
      void fx({ type: 'pop', pid: p.id, text: 'Coroa Trocada!', good: true }, false);
      void fx(
        { type: 'toast', to: [p.id, o.id], text: 'Coroa Trocada! Os reis mudaram de dono.' },
        false,
      );
      break;
    }
    case 'PA': {
      const gr = G.grave[p.id],
        i = gr.indexOf(a.g!);
      if (i < 0) return;
      spendItem(p, k);
      gr.splice(i, 1);
      p.hand.push(a.g!);
      log(`${nm(p)} usou Pá de Coveiro.`, 'it');
      await fx({
        type: 'fly',
        from: 'seat:' + p.id,
        to2: 'hand:' + p.id,
        card: { g: a.g, vis: [p.id] },
      });
      break;
    }
    case 'CICATRIZ': {
      const o = G.players[a.target!],
        g = a.g!,
        g2 = a.g2!;
      if (!o || !canUse(p, k, 'select')) return;
      if (!p.hand.includes(g) || !scarred(g)) return;
      const gr = G.grave[o.id];
      if (!gr.includes(g2) || !scarred(g2) || g2 === g) return;
      spendItem(p, k);
      toGrave(p, g);
      gr.splice(gr.indexOf(g2), 1);
      p.hand.push(g2);
      const de = o === p ? 'do próprio cemitério' : `do cemitério de ${nm(o)}`;
      log(
        `${nm(p)} usou Cicatrizes Compartilhadas: mandou o ${gobTxt(g)} ao cemitério e pegou o ${gobTxt(g2)} ${de}.`,
        'it',
      );
      void fx(
        { type: 'toast', to: p.id, text: `Você trocou o ${gobTxt(g)} pelo ${gobTxt(g2)}.` },
        false,
      );
      if (o !== p)
        void fx(
          {
            type: 'toast',
            to: o.id,
            text: `${nm(p)} pegou o ${gobTxt(g2)} do seu cemitério (Cicatrizes Compartilhadas).`,
          },
          false,
        );
      await fx({
        type: 'fly',
        from: 'hand:' + p.id,
        to2: 'seat:' + p.id,
        card: { g, pub: 1, sm: 1 },
        dur: 500,
        rot: 15,
      });
      await fx({
        type: 'fly',
        from: 'seat:' + o.id,
        to2: 'hand:' + p.id,
        card: { g: g2, pub: 1 },
      });
      break;
    }
    case 'LADRAO': {
      const o = G.players[a.target!];
      if (!o || o === p || !G.grave[o.id].length) return;
      spendItem(p, k);
      const g = G.grave[o.id].splice(rnd(G.grave[o.id].length), 1)[0];
      p.hand.push(g);
      log(`${nm(p)} usou Ladrão de Túmulos no cemitério de ${nm(o)}.`, 'it');
      void fx({ type: 'toast', to: p.id, text: `Você pegou o ${gobTxt(g)}!` }, false);
      await fx({
        type: 'fly',
        from: 'seat:' + o.id,
        to2: 'hand:' + p.id,
        card: { g, vis: [p.id] },
      });
      break;
    }
    case 'MAO_LEVE': {
      const o = okTarget(a.target);
      if (!o || !o.items.length) return;
      spendItem(p, k);
      const it = o.items.splice(rnd(o.items.length), 1)[0];
      addItem(p, it);
      log(`${nm(p)} roubou um item de ${nm(o)}.`, 'it');
      void fx({ type: 'toast', to: p.id, text: `Você roubou: ${ITEMS[it][0]}` }, false);
      void fx({ type: 'toast', to: o.id, text: `${nm(p)} roubou seu ${ITEMS[it][0]}!` }, false);
      break;
    }
    case 'ISCA': {
      if (G.monsters.length + G.mused.length <= 2) return;
      spendItem(p, k);
      const old = G.monster!,
        oi = G.mused.indexOf(old);
      if (oi >= 0) G.mused.splice(oi, 1);
      G.monster = chaosIs('OPOSTOS')
        ? drawMonster((m) => m.v <= 24 && m !== old)
        : drawMonster((m) => m !== old && m !== G.monster2);
      G.monsters.unshift(old);
      shuffle(G.monsters);
      for (const q of G.players) G.rd[q.id].hint.value = -1;
      log(
        `${nm(p)} usou Isca de Monstro: o ${old.v} foi embora e chegou o ${G.monster.v}${monVal() !== G.monster.v ? ` (vale ${monVal()})` : ''}.`,
        'it',
      );
      void fx({ type: 'pop', pid: p.id, text: 'Isca de Monstro', good: true }, false);
      void fx(
        {
          type: 'toast',
          text: `Isca de Monstro: o monstro ${old.v} trocou pelo ${G.monster.v}. O Caos continua valendo.`,
        },
        false,
      );
      await monsterAwake([G.monster]);
      break;
    }
    case 'BANDEIRA': {
      const c = +a.c!;
      if (!(c >= 0 && c < 4)) return;
      spendItem(p, k);
      rd.band = c;
      lastUse(p).c = c;
      log(`${nm(p)} fincou a Bandeira ${CLAN[c]}.`, 'it');
      void fx({ type: 'pop', pid: p.id, text: 'Bandeira ' + CLAN[c], good: true }, false);
      break;
    }
    case 'DISFARCE': {
      const t = +a.t!;
      if (!TRAITS.includes(t)) return;
      spendItem(p, k);
      rd.disg = t;
      lastUse(p).t = t;
      log(`${nm(p)} usou Disfarce (${TNAME[t]}).`, 'it');
      break;
    }
    case 'MAPA': {
      if (!G.ideck.length) {
        G.ideck = shuffle(G.idisc);
        G.idisc = [];
      }
      const i = G.ideck.indexOf(a.k as ItemKey);
      if (i < 0) return;
      spendItem(p, k);
      G.ideck.splice(i, 1);
      shuffle(G.ideck);
      log(`${nm(p)} usou Mapa do Tesouro e escolheu um item do monte.`, 'it');
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: `Mapa do Tesouro: você pegou ${ITEMS[a.k as ItemKey][0]}.`,
        },
        false,
      );
      addItem(p, a.k as ItemKey);
      break;
    }
    case 'PROFECIA': {
      if (!G.cdeck.length) {
        G.cdeck = shuffle(G.cdisc);
        G.cdisc = [];
      }
      const i = G.cdeck.indexOf(a.k as ChaosKey);
      if (i < 0) return;
      spendItem(p, k);
      G.cdeck.splice(i, 1);
      shuffle(G.cdeck);
      G.cdeck.push(a.k as ChaosKey);
      log(`${nm(p)} usou Profecia do Caos e escolheu o Caos da próxima rodada.`, 'it');
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: `Profecia do Caos: a próxima rodada terá ${CHAOS[a.k as ChaosKey][0]}.`,
        },
        false,
      );
      break;
    }
    case 'TAMBOR':
      spendItem(p, k);
      rd.tambor = true;
      log(`${nm(p)} tocou o Tambor de Guerra.`, 'it');
      void fx({ type: 'pop', pid: p.id, text: 'Tambor de Guerra', good: true }, false);
      break;
    case 'SACO':
      spendItem(p, k);
      addItem(p, 'SACO');
      void fx({ type: 'toast', to: p.id, text: 'Saco de Moedas: +2 itens' }, false);
      break;
    case 'GRITO':
    case 'PORRETE':
    case 'PE_CABRA':
    case 'AJUSTE':
    case 'CHAPEU':
    case 'OCULOS':
    case 'NARIZ':
    case 'POMADA':
    case 'POCAO':
    case 'MACHUCADO': {
      const d = +a.d!;
      if (k === 'GRITO' ? ![2, -2].includes(d) : !itemOptions(p, k).some((o) => o.d === d)) return;
      spendItem(p, k);
      lastUse(p).d = d;
      if (k === 'GRITO') {
        G.monMod += d;
        log(`${nm(p)} usou Grito de Guerra: monstro ${d > 0 ? '+' : ''}${d}.`, 'it');
      } else {
        rd.delta += d;
        log(`${nm(p)} usou ${ITEMS[k][0]}: ${d > 0 ? '+' : ''}${d}.`, 'it');
      }
      void fx(
        { type: 'pop', pid: p.id, text: `${ITEMS[k][0]}: ${d > 0 ? '+' : ''}${d}`, good: true },
        false,
      );
      break;
    }
    case 'ESCUDO':
    case 'AMULETO':
    case 'CHINELO':
      if (armed(p, k)) return;
      spendItem(p, k);
      rd.armed.push(k);
      log(`${nm(p)} preparou ${ITEMS[k][0]}.`, 'it');
      void fx({ type: 'pop', pid: p.id, text: ITEMS[k][0], good: true }, false);
      break;
  }
  await enforceCap(p);
  sync();
}
// ---------- compras e roubos ----------
export const ITEM_CAP = 3;
export async function enforceCap(p: Player) {
  while (p.items.length > ITEM_CAP) {
    let k: ItemKey;
    if (isHuman(p)) {
      const opts = [...new Set(p.items)].map((x) => ({ label: ITEMS[x][0], value: x }));
      const r = await prompt(p.id, 'ask', {
        title: 'Limite de 3 itens',
        text: `Você ficou com ${p.items.length} itens. Escolha 1 para mandar para o fundo do monte de itens:`,
        options: opts,
        cards: opts.map((o) => o.value),
        botValue: opts[0].value,
      });
      k = p.items.includes(r.value as ItemKey) ? (r.value as ItemKey) : p.items[p.items.length - 1];
    } else k = p.items.reduce((a, x) => (PRIO[x] < PRIO[a] ? x : a));
    p.items.splice(p.items.indexOf(k), 1);
    G.ideck.unshift(k);
    log(
      `${nm(p)} mandou ${isHuman(p) ? ITEMS[k][0] : 'um item'} para o fundo do monte (limite de 3).`,
      'it',
    );
    sync();
  }
}
// o monstro acabou de acordar (na revelação ou trocado pela Isca): anuncia o efeito e a passiva
// e roda a Vingança do Cemitério. Com Monstros Opostos, vale para cada um dos dois
export async function monsterAwake(ms: (Monster | null)[]) {
  for (const m of ms) {
    if (!m) continue;
    if (m.fx && MFX[m.fx]) {
      log(`Efeito do monstro ${m.v}: ${MFX[m.fx][0]} — ${MFX[m.fx][1]}`, 'ch');
      void fx({ type: 'toast', text: `Monstro ${MFX[m.fx][0]}: ${MFX[m.fx][1]}` }, false);
    }
    if (m.curse) {
      log(`Passiva do monstro ${m.v}: ${TNAME[m.curse]} — ${curseTxt(m.curse)}`, 'ch');
      void fx(
        { type: 'toast', text: `Passiva do monstro: ${TNAME[m.curse]} — ${curseTxt(m.curse)}` },
        false,
      );
    }
    if (m.fx === 'VINGANCA') await vinganca();
  }
}
// Vingança do Cemitério: quem tem o maior cemitério compra 1 item (empate: todos os empatados)
export async function vinganca() {
  const A = alivePl(),
    gm = Math.max(0, ...A.map((p) => G.grave[p.id].length));
  if (gm <= 0) return;
  const V = A.filter((p) => G.grave[p.id].length === gm && p.hand.length);
  if (!V.length) return;
  const txt = `${V.map(nm).join(', ')} ${V.length > 1 ? 'compram' : 'compra'} 1 item`;
  log(`Vingança do Cemitério: ${txt} (maior cemitério: ${gm}).`, 'it');
  void fx({ type: 'toast', text: `Vingança do Cemitério: ${txt}.` }, false);
  for (const p of V) await drawItems(p, 1);
}
// quem compra o item quando alguém vence a rodada (o monstro pode mudar isso)
export async function rewardItems(W: Player[]) {
  if (!W.length) return;
  if (monFx().includes('FRACOS')) {
    const A = alivePl().filter((q) => q.hand.length);
    if (!A.length) return;
    const mn = Math.min(...A.map((q) => q.items.length)),
      B = A.filter((q) => q.items.length === mn),
      txt = `${B.map(nm).join(', ')} ${B.length > 1 ? 'compram' : 'compra'} o item`;
    log(`Amigo dos Fracos: ${txt} (menos itens na mão).`, 'ch');
    void fx({ type: 'toast', text: `Amigo dos Fracos: ${txt}.` }, false);
    for (const q of B) await drawItems(q, 1);
    return;
  }
  for (const p of W) await drawItems(p, 1);
}
export async function drawItems(p: Player, n: number) {
  for (let i = 0; i < n; i++) {
    if (isHuman(p) && p.alive) await prompt(p.id, 'draw', { left: n - i });
    let k = drawFrom('ideck', 'idisc');
    if (!k) break;
    if (hasKing(p, 3)) {
      let k2 = drawFrom('ideck', 'idisc');
      if (k2) {
        if (isHuman(p)) {
          const r = await prompt(p.id, 'ask', {
            title: 'Mercadora',
            text: 'Você comprou 2 itens. Fique com um:',
            options: [
              { label: ITEMS[k][0], value: k },
              { label: ITEMS[k2][0], value: k2 },
            ],
            cards: [k, k2],
          });
          if (r.value === k2) [k, k2] = [k2, k];
        } else if (PRIO[k2] > PRIO[k]) [k, k2] = [k2, k];
        G.idisc.push(k2);
      }
    }
    addItem(p, k);
    void fx({ type: 'toast', to: p.id, text: `Novo item: ${ITEMS[k][0]}` }, false);
    await fx({
      type: 'fly',
      from: 'itemDeck',
      to2: 'tray:' + p.id,
      card: { item: k, vis: [p.id] },
      dur: 520,
    });
    await enforceCap(p);
  }
}
export async function takeCard(p: Player, o: Player, kind: string) {
  if (!o.hand.length) return;
  const g = o.hand.splice(rnd(o.hand.length), 1)[0];
  if (kind === 'steal') {
    p.hand.push(g);
    log(`${nm(p)} roubou uma carta de ${nm(o)}.`);
    void fx({ type: 'toast', to: p.id, text: `Você roubou o ${gobTxt(g)}!` }, false);
    void fx({ type: 'toast', to: o.id, text: `${nm(p)} roubou seu ${gv(g)}!` }, false);
    await fx({
      type: 'fly',
      from: 'hand:' + o.id,
      to2: 'hand:' + p.id,
      card: { g, vis: [p.id, o.id] },
      dur: 560,
    });
  } else {
    G.grave[o.id].push(g);
    log(`${nm(p)} eliminou o ${gobTxt(g)} de ${nm(o)}.`);
    void fx({ type: 'pop', pid: o.id, text: `−1 carta (${gv(g)})` }, false);
    await fx({
      type: 'fly',
      from: 'hand:' + o.id,
      to2: 'seat:' + o.id,
      card: { g, pub: 1, sm: 1 },
      dur: 560,
      rot: 18,
    });
  }
  sync();
  await trap(p, o);
}
// Armadilha (reação): `p` acabou de tirar uma carta da mão de `o`; `o` pode revelar a Armadilha
export async function trap(p: Player, o: Player) {
  if (!o.items.includes('ARMADILHA') || !p.hand.length) return;
  const r = await prompt(o.id, 'ask', {
    title: 'Usar Armadilha?',
    text: `${nm(p)} tirou uma carta da sua mão. Revelar a Armadilha? ${nm(p)} perde 1 carta.`,
    options: [
      { label: 'Usar Armadilha', value: 1, cls: 'red' },
      { label: 'Deixar', value: 0, cls: 'ghost' },
    ],
    cards: ['ARMADILHA'],
    botValue: 1,
  });
  if (!r.value || !o.items.includes('ARMADILHA')) return;
  void fx({ type: 'pop', pid: o.id, text: 'Armadilha!', good: true }, false);
  void fx(
    {
      type: 'toast',
      to: G.players.filter((q) => q !== o).map((q) => q.id),
      text: `${nm(o)} revelou uma Armadilha contra ${nm(p)}.`,
    },
    false,
  );
  // quem caiu na Armadilha quer cancelar; o dono quer que valha; os outros não se metem
  const cancelled = await naoChain(o, 'ARMADILHA', {}, (q) =>
    q === o ? true : q === p ? false : null,
  );
  spendItem(o, 'ARMADILHA');
  if (cancelled) {
    lastUse(o).x = 1;
    log(`A Armadilha de ${nm(o)} foi cancelada pelo NÃO!.`, 'it');
    void fx({ type: 'toast', text: `A Armadilha de ${nm(o)} foi cancelada pelo NÃO!.` }, false);
    sync();
    return;
  }
  if (!p.hand.length) return sync();
  const x = p.hand.splice(rnd(p.hand.length), 1)[0];
  G.grave[p.id].push(x);
  const q = rightOf(p);
  log(
    `Armadilha de ${nm(o)}: ${q ? nm(q) + ' escolheu às cegas e ' : ''}${nm(p)} perdeu o ${gobTxt(x)}.`,
    'it',
  );
  void fx({ type: 'toast', text: `Armadilha de ${nm(o)}: ${nm(p)} perdeu uma carta.` }, false);
  void fx({ type: 'pop', pid: p.id, text: `−1 carta (${gv(x)})` }, false);
  await fx({
    type: 'fly',
    from: 'hand:' + p.id,
    to2: 'seat:' + p.id,
    card: { g: x, pub: 1, sm: 1 },
    dur: 560,
    rot: 18,
  });
  sync();
}
export async function chaosStart() {
  const A = alivePl(),
    k = G.chaos;
  if (k) {
    log(`Caos ativo: ${chaosTitle(k)} — ${chaosDesc(k)}`, 'ch');
    if (k === 'TROCA') {
      const hs = A.map((p) => p.hand);
      A.forEach((p, i) => (p.hand = hs[(i - 1 + A.length) % A.length]));
      log('Todos passaram a mão inteira para a esquerda!', 'ch');
      void fx(
        {
          type: 'banner',
          text: 'Troca-Troca',
          sub: 'Todos passaram a mão para a esquerda',
          kind: 'pink',
        },
        false,
      );
    }
  }
  for (const p of A)
    if (
      hasKing(p, 1) &&
      G.grave[p.id].length &&
      A.every((o) => o === p || p.hand.length < o.hand.length)
    ) {
      const gr = G.grave[p.id],
        q = rightOf(p);
      let g: Gob;
      if (q && isHuman(q)) {
        const opts = gr
          .slice()
          .sort((x, y) => gv(x) - gv(y))
          .map((x) => ({ label: gobTxt(x), value: x }));
        const r = await prompt(q.id, 'ask', {
          title: 'Brotar',
          text: `${nm(p)} ativou o Brotar da Rainha Musgo-Podre. Você está à direita: escolha qual carta do cemitério volta para a mão dele.`,
          options: opts,
          botValue: opts[0].value,
        });
        g = gr.includes(+r.value!) ? +r.value! : opts[0].value;
      } else g = Math.random() < 0.7 ? gr.reduce((x, y) => (gv(y) < gv(x) ? y : x)) : pick(gr);
      gr.splice(gr.indexOf(g), 1);
      p.hand.push(g);
      log(
        `Brotar: ${q ? nm(q) + ' escolheu o ' + gobTxt(g) + ' e ele voltou' : 'o ' + gobTxt(g) + ' voltou'} do cemitério para ${nm(p)}.`,
        'it',
      );
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: `Brotar: ${q ? nm(q) + ' escolheu o' : 'o'} ${gobTxt(g)}, que voltou do seu cemitério para a mão.`,
        },
        false,
      );
      void fx({ type: 'pop', pid: p.id, text: 'Brotar', good: true }, false);
    }
  sync();
}
export function checkOuts() {
  for (const p of alivePl())
    if (!p.hand.length && !G.necro?.[p.id]) {
      p.alive = false;
      p.out = G.round;
      log(`${nm(p)} faliu!`, 'rh');
      void fx({ type: 'pop', pid: p.id, text: 'Faliu' }, false);
    }
  if (alivePl().length <= 1) {
    G.over = true;
    G.winner = alivePl()[0] ? alivePl()[0].id : null;
  }
}

// ---------- seleção e janela dos humanos ----------
export async function humanSelect(p: Player) {
  if (!inDuel(p)) return;
  for (let guard = 0; guard < 40; guard++) {
    if (!p.alive || !p.hand.length) return;
    const r = await prompt(p.id, 'select');
    if (p.bot) {
      G.rd[p.id].gs = botChoose(p, G.rd[p.id].hint);
      return;
    }
    if (r.use) {
      if (canUse(p, r.use, 'select')) await execUse(p, r.use, r.args || {});
      continue;
    }
    const gs = Array.isArray(r.play) ? r.play.map(Number) : [];
    const [kmin, kmax] = playLimit(p),
      pool = playable(p);
    if (
      gs.length >= kmin &&
      gs.length <= kmax &&
      new Set(gs).size === gs.length &&
      gs.every((g) => pool.includes(g))
    ) {
      G.rd[p.id].gs = gs;
      log(`${nm(p)} escolheu as cartas.`);
      sync();
      return;
    }
    void fx(
      { type: 'toast', to: p.id, text: 'Jogada inválida (sua mão mudou?). Escolha de novo.' },
      false,
    );
  }
  G.rd[p.id].gs = botChoose(p, G.rd[p.id].hint);
}
export async function humanWindow(p: Player) {
  let used = false;
  for (let guard = 0; guard < 20; guard++) {
    if (!p.items.some((k) => canUse(p, k, 'window'))) return used;
    const r = await prompt(p.id, 'window');
    if (!r.use || p.bot) return used;
    if (canUse(p, r.use, 'window')) {
      await execUse(p, r.use, r.args || {});
      used = true;
    }
  }
  return used;
}

// ---------- uma rodada ----------
export async function pedagio() {
  const A = alivePl().filter((p) => p.hand.length);
  const picks = await Promise.all(
    A.map(async (p) => {
      if (p.bot) return p.hand.reduce((a, g) => (gv(g) < gv(a) ? g : a));
      const opts = p.hand
        .slice()
        .sort((a, b) => gc(a) - gc(b) || gv(a) - gv(b))
        .map((g) => ({ label: gobTxt(g), value: g }));
      const r = await prompt(p.id, 'ask', {
        title: 'Pedágio',
        text: `Escolha 1 carta para dar a ${nm(leftOf(p) || p)}.`,
        options: opts,
        botValue: opts[0].value,
      });
      return p.hand.includes(+r.value!) ? +r.value! : p.hand[0];
    }),
  );
  A.forEach((p, i) => {
    const g = picks[i],
      l = leftOf(p);
    if (!l || !p.hand.includes(g)) return;
    p.hand.splice(p.hand.indexOf(g), 1);
    l.hand.push(g);
    void fx({ type: 'toast', to: l.id, text: `Pedágio: ${nm(p)} te deu o ${gobTxt(g)}.` }, false);
  });
  log('Pedágio: cada um deu 1 carta ao jogador da esquerda.', 'ch');
  sync();
}
export async function chooseDuel() {
  const A = alivePl().filter((p) => p.hand.length);
  if (A.length <= 2) {
    G.duel = A.map((p) => p.id);
    return;
  }
  const chooser = ord()[0];
  let a: Player, b: Player;
  if (chooser.bot) {
    const s = A.slice().sort((x, y) => y.hand.length - x.hand.length);
    a = s[0];
    b = s[1];
  } else {
    const o1 = A.map((p) => ({ label: p === chooser ? 'Eu mesmo' : nameOf(p.id), value: p.id }));
    const r1 = await prompt(chooser.id, 'ask', {
      title: 'Duelo',
      text: 'Você é o Chefe da Toca. Escolha o primeiro duelista:',
      options: o1.map((o) => ({ ...o, label: `[[p${o.value}]]` })),
    });
    a = A.find((p) => p.id === +r1.value!) || A[0];
    const rest = A.filter((p) => p !== a);
    const r2 = await prompt(chooser.id, 'ask', {
      title: 'Duelo',
      text: 'Agora o segundo duelista:',
      options: rest.map((p) => ({ label: `[[p${p.id}]]`, value: p.id })),
    });
    b = rest.find((p) => p.id === +r2.value!) || rest[0];
  }
  G.duel = [a.id, b.id];
  log(`Duelo: ${nm(a)} contra ${nm(b)}.`, 'ch');
  void fx({ type: 'banner', text: 'Duelo', sub: `${nm(a)} contra ${nm(b)}`, kind: 'pink' }, false);
  sync();
}
export async function playRound() {
  G.round++;
  G.pressa = [];
  G.last = null;
  G.act = null;
  G.ready = {};
  G.monMod = 0;
  G.mutant = 0;
  G.mutantCard = null;
  G.duel = null as GameState['duel'];
  G.openPlays = false; // (o cast impede o TS de achar que duel continua null depois do chooseDuel)
  G.chaos = G.nextChaos;
  G.nextChaos = null;
  G.rd = G.players.map(() => ({
    gs: [],
    delta: 0,
    armed: [],
    band: -1,
    disg: 0,
    tambor: false,
    hint: { value: -1, par: 0, t1: null },
    note: '',
  }));
  G.order = [];
  for (let k = 0; k < G.n; k++) {
    const p = G.players[(G.chief + k) % G.n];
    if (p.alive) G.order.push(p.id);
  }
  log(`Rodada ${G.round} — Chefe da Toca: ${nm(P(G.chief))}`, 'rh');
  if (G.round > 300) return endByDeck();
  G.phase = 'dormindo';
  G.revealed = false;
  G.monster = null;
  G.monster2 = null;
  G.result = null;
  sync();
  await chaosStart();
  checkOuts();
  if (G.over) return;
  const A0 = alivePl(),
    mx = Math.max(...A0.map((p) => p.hand.length));
  {
    const mn = Math.min(...A0.map((p) => p.hand.length));
    G.underdog = mn < mx ? A0.filter((p) => p.hand.length === mn).map((p) => p.id) : [];
  }
  G.leaders = A0.every((p) => p.hand.length === mx)
    ? []
    : A0.filter((p) => p.hand.length === mx).map((p) => p.id);
  G.lastStand = A0.length === 2 && A0.every((p) => p.hand.length === 1);
  if (G.lastStand)
    log('Última carta: quem perder por aproximação não descarta nesta rodada.', 'rh');
  G.necro = null;
  if (chaosIs('NECRO')) {
    G.necro = {};
    for (const p of alivePl())
      if (G.grave[p.id].length) {
        G.necro[p.id] = p.hand;
        p.hand = G.grave[p.id];
        G.grave[p.id] = [];
      }
    log('Necromante: quem tem cemitério joga só com as cartas dele nesta rodada.', 'ch');
    void fx(
      {
        type: 'banner',
        text: 'Necromante',
        sub: 'Nesta rodada, cada um joga com as cartas do próprio cemitério',
        kind: 'pink',
      },
      false,
    );
    for (const id of Object.keys(G.necro))
      void fx(
        {
          type: 'toast',
          to: +id,
          text: 'Necromante: sua mão agora são as cartas do seu cemitério. Se vencer, fica com as que jogar.',
        },
        false,
      );
  }
  if (!G.monsters.length) {
    G.monsters = shuffle(G.mused);
    G.mused = [];
    log('O monte de monstros acabou: os usados foram embaralhados de volta.', 'rh');
  }
  if (chaosIs('OPOSTOS')) {
    G.monster = drawMonster((m) => m.v <= 24);
  } else {
    G.monster = G.monsters.pop()!;
    G.mused.push(G.monster);
  }
  await fx({ type: 'fly', from: 'monsterDeck', to2: 'monsterSlot', card: { t: 'mon' }, dur: 460 });
  sync();
  if (chaosIs('PEDAGIO')) await pedagio();
  if (chaosIs('DUELO')) await chooseDuel();
  const players = ord().filter((p) => p.hand.length && inDuel(p));
  for (const p of players) if (p.bot) await botDormindo(p);
  checkOuts();
  if (G.over) return;
  if (chaosIs('ABERTO')) {
    G.openPlays = true;
    sync();
    for (const p of players) {
      if (!p.alive || !p.hand.length) continue;
      if (isHuman(p)) await humanSelect(p);
      else {
        G.rd[p.id].gs = botChoose(p, G.rd[p.id].hint);
        await wait(500);
      }
      log(`${nm(p)} jogou ${G.rd[p.id].gs.map(gv).join(' + ')} (palpite aberto).`);
      sync();
    }
  } else {
    const hum = players.filter((p) => isHuman(p));
    const bt = players.filter((p) => p.bot);
    const botsReady = Promise.all(
      bt.map(
        (p, i) =>
          new Promise<void>((res) => {
            const t = IS_SIM() ? 0 : (hum.length ? 900 + rnd(2200) : 500 + i * 450) * SPEED;
            const fin = () => {
              if (!G.rd[p.id].gs.length) G.rd[p.id].gs = botChoose(p, G.rd[p.id].hint);
              G.ready![p.id] = 1;
              sync();
              res();
            };
            if (IS_SIM()) fin();
            else setTimeout(fin, t);
          }),
      ),
    );
    await Promise.all((hum.map((p) => humanSelect(p)) as Promise<unknown>[]).concat([botsReady]));
  }
  for (const p of players) {
    if (!p.hand.length) continue;
    if (p.bot && !G.rd[p.id].gs.length) G.rd[p.id].gs = botChoose(p, G.rd[p.id].hint);
    G.rd[p.id].gs = G.rd[p.id].gs.filter((g) => p.hand.includes(g));
    if (!G.rd[p.id].gs.length) G.rd[p.id].gs = botChoose(p, G.rd[p.id].hint);
  }
  // cartas que mudam depois da escolha
  if (chaosIs('CEGAS'))
    for (const p of players) {
      const rd = G.rd[p.id],
        rest = p.hand.filter((g) => !rd.gs.includes(g));
      if (!rest.length || !rd.gs.length) continue;
      const i = rnd(rd.gs.length),
        out = rd.gs[i],
        inn = pick(rest);
      rd.gs[i] = inn;
      const q = rightOf(p);
      rd.note = `Às Cegas: ${gobTxt(out)} virou ${gobTxt(inn)}`;
      log(`Às Cegas: ${q ? nm(q) + ' trocou' : 'trocou'} um goblin de ${nm(p)}.`, 'ch');
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: `Às Cegas: ${q ? nm(q) + ' (à sua direita) trocou' : 'trocou'} seu ${gobTxt(out)} pelo ${gobTxt(inn)}.`,
        },
        false,
      );
    }
  if (chaosIs('ROLETA'))
    for (const p of players) {
      const rd = G.rd[p.id];
      if (!rd.gs.length) continue;
      let q: Player | null = null;
      for (let k = 1; k < G.n; k++) {
        const c = G.players[(p.id - k + G.n) % G.n];
        if (
          c.alive &&
          c !== p &&
          c.hand.some(
            (g) => !G.rd[c.id].gs.includes(g) && !Object.values(G.rd).some((r) => r.borrow === g),
          )
        ) {
          q = c;
          break;
        }
      }
      if (!q) continue;
      const rest = q.hand.filter(
          (g) => !G.rd[q.id].gs.includes(g) && !Object.values(G.rd).some((r) => r.borrow === g),
        ),
        inn = pick(rest);
      rd.gs.push(inn);
      rd.borrow = inn;
      rd.note = `Roleta: +${gobTxt(inn)} de ${nm(q)}`;
      log(`Roleta: ${nm(p)} puxou o ${gobTxt(inn)} de ${nm(q)}.`, 'ch');
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: `Roleta: você puxou o ${gobTxt(inn)} de ${nm(q)}. Ele volta para o dono no fim da rodada.`,
        },
        false,
      );
    }
  sync();
  await wait(350);
  // Monstro Acordado
  G.phase = 'acordado';
  if (chaosIs('OPOSTOS')) G.monster2 = drawMonster((m) => m.v >= 26);
  if (chaosIs('MUTANTE')) {
    const m2 = drawMonster(() => true);
    G.mutantCard = m2.v;
    G.mutant = m2.v % 2 === 0 ? 5 : -5;
  }
  G.revealed = true;
  sync();
  await monsterAwake([G.monster!, G.monster2]);
  await wait(1700 + 350 * G.n);
  log(
    `Monstro acordou: ${G.monster.v}${monVal() !== G.monster.v ? ` (vale ${monVal()})` : ''} — território ${G.monster.ts.map((c) => CLAN[c]).join(' e ')}${G.monster2 ? ` · segundo monstro: ${G.monster2.v}` : ''}${G.mutantCard ? ` · mutante: ${G.mutantCard} (${G.mutant > 0 ? '+5' : '−5'})` : ''}`,
  );
  for (const p of ord()) {
    const rd = G.rd[p.id];
    if (rd.gs.length) log(`${nm(p)} jogou ${rd.gs.map((g) => gv(g)).join(' + ')}.`);
  }
  sync();
  await itemWindow();
  // resultado
  G.phase = 'resultado';
  const R = standing(),
    winners = new Set(R.w);
  G.result = {
    w: R.w.map((p) => p.id),
    kind: R.kind,
    out: R.F.filter((x) => x.out).map((x) => [x.p.id, x.out] as [number, string]),
  };
  for (const x of R.F)
    if (x.out)
      log(
        `${nm(x.p)} somou ${x.S}: ${x.out === 'zona' ? 'caiu na Zona Proibida' : 'soma igual a de outro jogador'} e perde.`,
        'ch',
      );
  log(
    R.kind === 'exact'
      ? `Cravou: ${R.w.map(nm).join(', ')}`
      : R.kind === 'closest'
        ? `Venceu: ${R.w.map(nm).join(', ')}`
        : 'Ninguém venceu a rodada.',
    'rh',
  );
  {
    const w0 = R.F.find((x) => R.w.includes(x.p));
    G.lastWinSum = w0 ? w0.S : null;
  }
  G.last = {};
  for (const x of R.F)
    G.last[x.p.id] = { gs: G.rd[x.p.id].gs.slice(), S: x.S, d: x.d, out: x.out || '' };
  await fx({
    type: 'result',
    w: R.w.map((p) => p.id),
    kind: R.kind,
    played: R.F.map((x) => x.p.id),
  });
  if (!IS_SIM()) await wait(1600);
  // perdedores
  for (const p of ord()) {
    const rd = G.rd[p.id];
    if (!rd.gs.length || winners.has(p)) continue;
    if (rd.gs.filter((g) => g !== rd.borrow).length >= 3) (G.pressa ||= []).push(p.id);
    if (G.lastStand) {
      log(`${nm(p)} perdeu, mas é a última carta: não descarta.`);
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: 'Regra da última carta: você perdeu, mas não descarta nesta rodada.',
        },
        false,
      );
      continue;
    }
    if (armed(p, 'AMULETO')) {
      log(`${nm(p)} perdeu, mas o Amuleto salvou as cartas.`, 'it');
      void fx(
        {
          type: 'toast',
          to: p.id,
          text: 'Você perdeu, mas o Amuleto devolveu as cartas para a sua mão.',
        },
        false,
      );
      void fx({ type: 'pop', pid: p.id, text: 'Amuleto', good: true }, false);
    } else {
      let keep: Gob | null = null;
      if (armed(p, 'CHINELO')) {
        const c = rd.gs.filter((g) => traitsOf(p, g) & CN && g !== rd.borrow);
        if (c.length > 1 && isHuman(p)) {
          const r = await prompt(p.id, 'ask', {
            title: 'Fuga Fedorenta',
            text: 'Você perdeu. Qual goblin de Fedorento volta para a sua mão?',
            options: c.map((g) => ({ label: gobTxt(g), value: g })),
            botValue: c[0],
          });
          keep = c.includes(+r.value!) ? +r.value! : c[0];
        } else if (c.length) keep = c.reduce((a, g) => (gv(g) > gv(a) ? g : a));
        if (keep) log(`Fuga Fedorenta: ${nm(p)} salvou o ${gobTxt(keep)}.`, 'it');
      }
      const gone = rd.gs.filter((g) => g !== keep && g !== rd.borrow);
      if (chaosIs('BANQUETE') && winners.size) {
        const W = ord().filter((x) => winners.has(x));
        gone.forEach((g) => {
          G.banq = (G.banq || 0) + 1;
          const w = W[G.banq % W.length];
          const k = p.hand.indexOf(g);
          if (k >= 0) p.hand.splice(k, 1);
          w.hand.push(g);
          log(`Banquete: o ${gobTxt(g)} de ${nm(p)} foi para ${nm(w)}.`, 'ch');
        });
        rd.gs = rd.gs.filter((g) => g === keep);
        void fx(
          {
            type: 'toast',
            to: p.id,
            text: `Você perdeu: no Banquete, ${gone.map(gobTxt).join(', ')} ${gone.length > 1 ? 'foram' : 'foi'} para quem venceu.`,
          },
          false,
        );
        await fx({
          type: 'fly',
          from: 'play:' + p.id,
          to2: 'hand:' + W[0].id,
          card: { g: gone[0], pub: 1, sm: 1 },
          dur: 500,
        });
      } else {
        gone.forEach((g) => toGrave(p, g));
        rd.gs = rd.gs.filter((g) => g === keep);
        log(`${nm(p)} perdeu e descartou ${gone.map(gobTxt).join(', ')}.`);
        void fx(
          {
            type: 'toast',
            to: p.id,
            text: `Você perdeu: ${gone.map(gobTxt).join(', ')} ${gone.length > 1 ? 'foram' : 'foi'} para o seu cemitério.${keep ? ` A Fuga Fedorenta salvou o ${gobTxt(keep)}.` : ''}`,
          },
          false,
        );
        await fx({
          type: 'fly',
          from: 'play:' + p.id,
          to2: 'seat:' + p.id,
          card: { g: gone[0], pub: 1, sm: 1 },
          dur: 500,
          rot: 15,
        });
      }
    }
    sync();
  }
  if (G.necro) {
    for (const id of Object.keys(G.necro)) {
      const p = P(+id),
        rd = G.rd[p.id],
        won = winners.has(p) && rd.gs.length;
      const keep = won ? rd.gs.filter((g) => g !== rd.borrow && p.hand.includes(g)) : [];
      const rest = p.hand.filter((g) => !keep.includes(g));
      G.grave[p.id] = G.grave[p.id].concat(rest);
      p.hand = G.necro[p.id].concat(keep);
      if (won && keep.length) {
        log(
          `Necromante: ${nm(p)} venceu e ficou com ${keep.map(gobTxt).join(', ')} do cemitério.`,
          'it',
        );
        void fx(
          {
            type: 'toast',
            to: p.id,
            text: `Necromante: ${keep.map(gobTxt).join(', ')} voltou do cemitério para a sua mão!`,
          },
          false,
        );
      }
    }
    G.necro = null;
    sync();
  }
  // vencedores
  if (G.duel && winners.size === 1) {
    const p = [...winners][0],
      o = P(G.duel.find((id) => id !== p.id)!); // pode vir undefined: o `o &&` abaixo cuida
    if (o && o.hand.length && !armed(o, 'ESCUDO')) await takeCard(p, o, 'steal');
    await rewardItems([p]);
  } else if (!G.duel || winners.size > 1) {
    for (const p of ord()) {
      if (!winners.has(p) || !p.alive) continue;
      const exact = R.kind === 'exact';
      const azarao = exact && (G.underdog || []).includes(p.id);
      if (azarao) {
        log(`Cravada do Azarão: ${nm(p)} tinha a menor mão da mesa e rouba 3 cartas.`, 'it');
        void fx({ type: 'toast', text: `Cravada do Azarão: ${nm(p)} rouba 3 cartas!` }, false);
      }
      const n = exact ? (azarao ? 3 : 2) : G.lastStand ? 0 : hasKing(p, 0) ? 2 : 1;
      const mode = exact ? 'steal' : 'elim';
      if (!exact && n === 0) log(`${nm(p)} venceu na última carta: só compra o item.`);
      for (let i = 0; i < n; i++) {
        const T = targetsFor(p).filter((o) => !G.duel || G.duel.includes(o.id));
        if (!T.length) {
          if (i === 0) log(`${nm(p)} não tinha de quem ${exact ? 'roubar' : 'eliminar'}.`);
          break;
        }
        const r = await prompt(p.id, mode, { left: n - i, T: T.map((o) => o.id), exact });
        const o = T.find((x) => x.id === +r.target!) || botTarget(p, T, mode);
        await takeCard(p, o, mode);
      }
      if (exact && hasKing(p, 0)) {
        const T = targetsFor(p);
        if (T.length) {
          const r = await prompt(p.id, 'elim', { left: 1, T: T.map((o) => o.id), exact: false });
          await takeCard(p, T.find((x) => x.id === +r.target!) || botTarget(p, T, 'elim'), 'elim');
        }
      }
    }
    await rewardItems(ord().filter((p) => winners.has(p) && p.alive));
  }
  {
    const Q = (G.pressa || []).map(P).filter((q) => q.alive && q.hand.length);
    if (Q.length) {
      log(
        `Pressa não Compensa: ${Q.map(nm).join(', ')} ${Q.length > 1 ? 'perderam' : 'perdeu'} com 3 goblins ou mais e ${Q.length > 1 ? 'compram' : 'compra'} 1 item.`,
        'it',
      );
      void fx(
        {
          type: 'toast',
          text: `Pressa não Compensa: ${Q.map(nm).join(', ')} ${Q.length > 1 ? 'compram' : 'compra'} 1 item.`,
        },
        false,
      );
      for (const q of Q) await drawItems(q, 1);
    }
  }
  if (chaosIs('FEIRA')) {
    log('Feira dos Goblins: todos compram 1 item.', 'ch');
    void fx({ type: 'toast', text: 'Feira dos Goblins: todos compram 1 item.' }, false);
    for (const p of ord()) if (p.alive && p.hand.length) await drawItems(p, 1);
  }
  checkOuts();
  G.chief = (G.chief + 1) % G.n;
  sync();
  if (G.over) return;
  // Caos da próxima rodada: o primeiro humano vivo na ordem revela
  const revealer = ord().find((p) => isHuman(p) && p.alive);
  if (revealer) await prompt(revealer.id, 'chaos');
  const ck = drawFrom('cdeck', 'cdisc')!;
  G.cdisc.push(ck);
  G.nextChaos = ck;
  log(`Caos para a próxima rodada: ${chaosTitle(ck)} — ${chaosDesc(ck)}`, 'ch');
  await fx({ type: 'chaosShow', k: ck });
}
export function endByDeck() {
  const A = alivePl(),
    mx = Math.max(...A.map((p) => p.hand.length)),
    top = A.filter((p) => p.hand.length === mx);
  G.over = true;
  G.winner = top.length === 1 ? top[0].id : null;
  log('Limite de rodadas: vence quem tem mais cartas.', 'rh');
}
export async function gameLoop() {
  while (!G.over) {
    if (MODE === 'online')
      G.ckpt = JSON.stringify(Object.assign({}, G, { ckpt: null, fx: [], pend: {} }));
    await playRound();
    if (G.over) break;
    const hs = alivePl().filter(isHuman);
    if (hs.length) {
      const all = Promise.all(hs.map((p) => prompt(p.id, 'next')));
      await (MODE === 'online'
        ? Promise.race([all, new Promise((r) => setTimeout(r, 25000))])
        : all);
      for (const p of hs) {
        const pe = G.pend[p.id];
        if (pe && pe.kind === 'next') resolvePrompt(p.id, pe.nonce, { ok: 1 });
      }
    }
    G.revealed = false;
    G.monster = null;
    G.monster2 = null;
    G.phase = '';
    G.result = null;
    sync();
  }
  if (G.winner === null || G.winner === undefined) {
    const out = G.players.filter((p) => p.out === G.round);
    if (out.length === 1) G.winner = out[0].id;
  }
  G.status = 'over';
  log(G.winner !== null && G.winner !== undefined ? `${nm(P(G.winner))} venceu!` : 'Empate!', 'rh');
  await fx({ type: 'end' });
}
export function newState(n: number, seats: Seat[]) {
  const S = {
    n,
    round: 0,
    log: [],
    fx: [],
    fxc: 0,
    pend: {},
    nonce: 0,
    duel: null,
    leaders: [],
    mutant: 0,
    openPlays: false,
    chief: rnd(n),
    monsters: shuffle(makeMonsters()),
    mused: [],
    monster: null,
    monster2: null,
    ideck: [],
    idisc: [],
    cdeck: [],
    cdisc: [],
    chaos: null,
    nextChaos: null,
    monMod: 0,
    over: false,
    winner: null,
    status: 'playing',
    grave: Array.from({ length: n }, () => []),
    order: [],
    phase: '',
    revealed: false,
    result: null,
    lastStand: false,
    rd: Array.from({ length: n }, () => ({
      gs: [],
      delta: 0,
      armed: [],
      band: -1,
      disg: 0,
      tambor: false,
      hint: { value: -1, par: 0, t1: null },
      note: '',
    })),
  } as Omit<GameState, 'players'> as GameState; // players entra logo abaixo
  for (const [k, v] of Object.entries(ITEMS))
    for (let i = 0; i < v[3]; i++) S.ideck.push(k as ItemKey);
  for (const [k, v] of Object.entries(CHAOS))
    for (let i = 0; i < v[2]; i++) S.cdeck.push(k as ChaosKey);
  shuffle(S.ideck);
  shuffle(S.cdeck);
  const PK = shuffle(Object.keys(PERSONAS) as PersonaKey[]);
  S.players = seats.map((s, i) => ({
    id: i,
    color: s.color,
    king: s.color,
    uid: s.uid || null,
    bot: !!s.bot,
    persona: s.bot ? PK[i % PK.length] : null,
    hand: Array.from({ length: 20 }, (_, v) => mk(s.color, v + 1)),
    items: [],
    alive: true,
    out: 0,
  }));
  return S;
}
