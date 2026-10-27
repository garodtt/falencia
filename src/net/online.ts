// Mesas online: o anfitrião roda o motor e grava o estado; os outros enviam ações.
import { rnd, shuffle } from '../game/data.ts';
import { gameLoop, newState, resolvePrompt } from '../game/engine.ts';
import { G, LOCAL, ME, MENU, MODE, NET, log, setG, setME, setMODE, sync } from '../game/state.ts';
import { playFx, toast } from '../ui/effects.ts';
import { $ } from '../ui/html.ts';
import { renderMenu } from '../ui/menu.ts';
import { askLocal, render, showGame, showLobby } from '../ui/render.ts';
import { TIPS, tipFor } from '../ui/tips.ts';
import { fb } from './firebase.ts';
import type { GameState, Reply } from '../game/types.ts';

// o que os jogadores (não anfitriões) mandam para a mesa
type ActBody =
  | { kind: 'join'; color: number }
  | { kind: 'leave' }
  | { kind: 'color'; color: number }
  | { kind: 'resp'; nonce: number; value: Reply };
type Act = ActBody & { seq: number };

// resposta de quem está nesta tela
export async function respond(value: Reply) {
  const pe = G.pend[ME];
  if (!pe) return;
  if (MODE === 'local' || NET.isHost) {
    resolvePrompt(ME, pe.nonce, value);
    return;
  }
  if (LOCAL.answered[pe.nonce]) return;
  LOCAL.answered[pe.nonce] = 1;
  render();
  await sendAct({ kind: 'resp', nonce: pe.nonce, value });
}
export const gameRef = (code: string) => NET.db!.doc('games/' + code);
export const actsCol = (code: string) => NET.db!.collection('games/' + code + '/acts');
export let actSeq = 0,
  actChain = Promise.resolve();
export function sendAct(a: ActBody) {
  actSeq++;
  const body = Object.assign({ seq: Date.now() * 1000 + actSeq }, a);
  // mesa e uid de agora: o leaveTable() limpa NET.code antes da escrita acontecer
  const code = NET.code!,
    uid = NET.uid!;
  actChain = actChain
    .then(() => actsCol(code).doc(uid).set(body))
    .catch(() => {
      toast('Não consegui enviar sua jogada. Tentando de novo…');
      return new Promise((r) => setTimeout(r, 1200))
        .then(() => actsCol(code).doc(uid).set(body))
        .catch(() => toast('Sem conexão com a mesa.'));
    });
  return actChain;
}
export function serialize() {
  const o = Object.assign({}, G);
  o.uids = (
    G.players
      ? G.players.filter((p) => p.uid).map((p) => p.uid)
      : (G.seats || []).filter((s) => s.uid).map((s) => s.uid)
  ) as string[];
  o.updatedAt = Date.now();
  return o;
}
// o anfitrião grava o estado; escritas em sequência, sem acumular
export function netSync() {
  if (MODE === 'online' && NET.isHost && G) {
    NET.dirty = true;
    if (!NET.writing) void flush();
  }
  render();
}
export async function flush() {
  NET.writing = true;
  while (NET.dirty) {
    NET.dirty = false;
    try {
      await gameRef(NET.code!).set(serialize());
    } catch (e) {
      if (e && (e as { code?: string }).code === 'quota_exceeded') {
        toast('A mesa encheu o limite de dados. Crie uma nova mesa.');
        break;
      }
      NET.dirty = true;
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  NET.writing = false;
}
export async function initNet() {
  if (!fb) return;
  try {
    const { db, user } = fb;
    const uid = await user.id();
    if (!uid) return;
    NET.db = db;
    NET.user = user;
    NET.uid = uid;
    {
      const n0 = fb.getName();
      if (n0) {
        NET.names[uid] = fb.setName(n0);
      }
      const ni = $<HTMLInputElement>('nameIn');
      if (ni) ni.value = n0;
    }
    const can = await user.can('data.write');
    NET.canWrite = can !== false;
    renderMenu();
    NET.unLobby = db
      .collection('games')
      .where('status', '==', 'lobby')
      .onSnapshot(
        (s) => {
          NET.lobbies = s.docs
            .map((d) => d.data())
            .filter((d) => Date.now() - (d.updatedAt || 0) < 6 * 3600e3);
          void resolveNames(
            NET.lobbies.flatMap((l) => (l.seats || []).map((x) => x.uid).filter(Boolean)),
          );
          renderMenu();
        },
        () => {},
      );
    NET.unMine = db
      .collection('games')
      .where('uids', 'array-contains', uid)
      .onSnapshot(
        (s) => {
          NET.mine = s.docs
            .map((d) => d.data())
            .filter((d) => d.status !== 'over' && Date.now() - (d.updatedAt || 0) < 48 * 3600e3);
          renderMenu();
        },
        () => {},
      );
  } catch (e) {}
}
export async function resolveNames(ids: (string | null | undefined)[]) {
  // chega já sem vazios (filter(Boolean))
  if (!NET.user || !ids.length) return;
  const ps = await NET.user.profiles([...new Set(ids)] as string[]);
  let changed = false;
  for (const id of Object.keys(ps))
    if (ps[id].name && NET.names[id] !== ps[id].name) {
      NET.names[id] = ps[id].name;
      changed = true;
    }
  if (changed) {
    if (G) render();
    renderMenu();
  }
}
export function newCode() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 5 }, () => a[rnd(a.length)]).join('');
}
export async function createTable() {
  if (!NET.db) return;
  const code = newCode();
  // no lobby G é só a mesa: os campos da partida chegam no startOnline
  setG({
    code,
    status: 'lobby',
    n: MENU.n,
    hostUid: NET.uid!,
    seats: [{ uid: NET.uid!, color: MENU.color }],
    log: [],
    fx: [],
    pend: {},
  } as Partial<GameState> as GameState);
  setMODE('online');
  NET.code = code;
  NET.isHost = true;
  setME(0);
  try {
    await gameRef(code).set(serialize());
  } catch (e) {
    toast('Não consegui criar a mesa. Confira a conexão e as regras do Firebase.');
    setMODE('local');
    setG(null);
    return;
  }
  listenActs();
  showLobby();
}
export async function joinTable(code: string) {
  if (!NET.db) return;
  code = String(code || '')
    .trim()
    .toUpperCase();
  if (!/^[A-Z]{5}$/.test(code)) return toast('Código inválido.');
  const snap = await gameRef(code).get();
  if (!snap.exists) return toast('Mesa não encontrada.');
  const S: GameState = snap.data();
  setMODE('online');
  NET.code = code;
  NET.isHost = S.hostUid === NET.uid;
  if (NET.isHost) return resumeHost(S);
  if (S.status === 'lobby' && !(S.seats || []).some((s) => s.uid === NET.uid))
    await sendAct({ kind: 'join', color: MENU.color });
  subscribeGame();
}
export function subscribeGame() {
  if (NET.unGame) NET.unGame();
  let first = true;
  NET.unGame = gameRef(NET.code!).onSnapshot(
    (s) => {
      if (!s.exists) return;
      const S: GameState = JSON.parse(JSON.stringify(s.data()));
      setG(S);
      if (S.status === 'lobby') {
        showLobby();
        return;
      }
      setME(S.players.findIndex((p) => p.uid === NET.uid));
      LOCAL.spec = ME < 0;
      if (ME < 0) setME(0);
      if ($('game').classList.contains('!hidden')) {
        showGame();
        first = true;
      }
      void resolveNames(S.players.map((p) => p.uid).filter(Boolean));
      if (first) {
        LOCAL.seenFx = S.fxc || 0;
        first = false;
        render(true);
        tipFor('start');
      }
      if (
        LOCAL.hide.size &&
        (!S.rd ||
          !S.rd[ME] ||
          S.rd[ME].gs.length ||
          S.phase !== 'dormindo' ||
          (S.pend[ME] && !LOCAL.answered[S.pend[ME].nonce]))
      )
        LOCAL.hide = new Set();
      const fresh = (S.fx || []).filter((e) => e.id! > LOCAL.seenFx);
      if (fresh.length) LOCAL.seenFx = fresh[fresh.length - 1].id!;
      render();
      fresh.forEach((e) => {
        if (['fly', 'pop', 'toast', 'banner', 'result', 'chaosShow', 'end'].includes(e.type))
          void playFx(e);
      });
      const pe = S.pend && S.pend[ME];
      if (pe) tipFor(pe.kind);
    },
    () => toast('A conexão com a mesa caiu. Recarregue a página.'),
  );
}
export function listenActs() {
  if (NET.unActs) NET.unActs();
  NET.unActs = actsCol(NET.code!).onSnapshot(
    (s) => {
      for (const d of s.docs) {
        const a: Act = d.data(),
          uid = d.id!;
        if (!a || NET.actSeen[uid] >= a.seq) continue;
        NET.actSeen[uid] = a.seq;
        handleAct(uid, a);
      }
    },
    () => {},
  );
}
export function handleAct(uid: string, a: Act) {
  if (!G) return;
  if (G.status === 'lobby') {
    if (a.kind === 'join' && !G.seats!.some((s) => s.uid === uid) && G.seats!.length < G.n) {
      const used = G.seats!.map((s) => s.color);
      const c = used.includes(a.color) ? [0, 1, 2, 3].find((x) => !used.includes(x)) : a.color;
      G.seats!.push({ uid, color: c! });
      void resolveNames([uid]);
      sync();
      showLobby();
    }
    if (a.kind === 'leave') {
      G.seats = G.seats!.filter((s) => s.uid !== uid || s.uid === G.hostUid);
      sync();
      showLobby();
    }
    if (
      a.kind === 'color' &&
      G.seats!.some((s) => s.uid === uid) &&
      !G.seats!.some((s) => s.color === a.color)
    ) {
      G.seats!.find((s) => s.uid === uid)!.color = a.color;
      sync();
      showLobby();
    }
    return;
  }
  if (a.kind === 'resp' && G.players) {
    const pid = G.players.findIndex((p) => p.uid === uid);
    if (pid >= 0) resolvePrompt(pid, a.nonce, a.value);
  }
}
export async function startOnline() {
  if (!NET.isHost || G.status !== 'lobby') return;
  const seats = G.seats!.slice(),
    used = seats.map((s) => s.color);
  for (const c of shuffle([0, 1, 2, 3].filter((c) => !used.includes(c)))) {
    if (seats.length >= G.n) break;
    seats.push({ color: c, bot: true });
  }
  shuffle(seats);
  const code = G.code,
    host = G.hostUid;
  setG(Object.assign(newState(G.n, seats), { code, hostUid: host }));
  setME(G.players.findIndex((p) => p.uid === NET.uid));
  log('A partida começou!', 'rh');
  showGame();
  render(true);
  sync();
  tipFor('start');
  void gameLoop();
}
export function resumeHost(S: GameState) {
  NET.isHost = true;
  setMODE('online');
  if (S.status === 'lobby') {
    setG(S);
    listenActs();
    showLobby();
    return;
  }
  if (!S.ckpt) {
    setG(S);
    setME(S.players.findIndex((p) => p.uid === NET.uid));
    showGame();
    render();
    return;
  }
  setG(JSON.parse(S.ckpt));
  G.ckpt = null;
  G.pend = {};
  G.nonce = (S.nonce || 0) + 1000;
  G.fx = S.fx || [];
  G.fxc = S.fxc || 0;
  G.log = S.log || [];
  G.code = S.code;
  G.hostUid = S.hostUid;
  log('O anfitrião voltou: a rodada recomeça.', 'rh');
  setME(G.players.findIndex((p) => p.uid === NET.uid));
  listenActs();
  showGame();
  render(true);
  sync();
  void gameLoop();
}
// sair no meio da partida: no modo contra bots (ou sendo o anfitrião) a página recomeça do menu
export async function leaveGame(sure?: boolean) {
  const me = G && G.players && G.players[ME],
    out = me && !me.alive;
  const msg =
    MODE === 'online' && NET.isHost
      ? 'Você é o anfitrião: se sair, a partida fica parada para os outros até você voltar.'
      : out
        ? 'Você faliu. Sair agora encerra a partida contra os bots.'
        : 'A partida atual será encerrada.';
  if (!sure || (MODE === 'online' && NET.isHost)) {
    const ok = await askLocal('Sair da partida?', msg, [
      { label: 'Sair', value: 1, cls: 'red' },
      { label: 'Ficar', value: 0, cls: 'ghost' },
    ]);
    if (!ok) return;
  }
  if (MODE === 'local' || NET.isHost) {
    try {
      location.reload();
    } catch (e) {
      leaveTable();
    }
    return;
  }
  leaveTable();
}
export function leaveTable() {
  if (MODE === 'online' && G && G.status === 'lobby' && !NET.isHost)
    void sendAct({ kind: 'leave' });
  if (NET.unGame) NET.unGame();
  if (NET.unActs) NET.unActs();
  NET.unGame = NET.unActs = null;
  setMODE('local');
  NET.code = null;
  NET.isHost = false;
  setG(null);
  setME(0);
  LOCAL.spec = false;
  LOCAL.answered = {};
  $('lobby').classList.add('!hidden');
  $('game').classList.add('!hidden');
  $('menu').classList.remove('!hidden');
  $('tut').classList.add('!hidden');
  TIPS.cur = null;
  $('barInfo').innerHTML = '';
  renderMenu();
}
