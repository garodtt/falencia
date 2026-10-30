// O que os cliques na mesa fazem. Cada ação confere se é mesmo a vez de quem está nesta tela.
import { CLAN, ITEMS, KINGS, NUMERIC, TNAME, TRAITS, chaosTitle, gc, gv } from '../../game/data.ts';
import type { Gob, ItemKey } from '../../game/data.ts';
import { botTakeover } from '../../game/engine.ts';
import { canUse, itemOptions, monOf, playLimit, scarGraves, scarred } from '../../game/rules.ts';
import { G, LOCAL, ME, MODE, NET, alivePl, gobTxt, nameOf } from '../../game/state.ts';
import type { AskValue, ItemArgs, PromptKind } from '../../game/types.ts';
import { leaveGame, leaveTable, respond } from '../../net/online.ts';
import { fly, toast } from '../../ui/effects.ts';
import { $, gobCard } from '../../ui/html.ts';
import { render } from '../../ui/render.ts';
import { askLocal } from '../overlays/modal.ts';
import { useUi } from '../store.ts';
import type { Opt } from '../store.ts';
import { selection } from './view.ts';

// o pedido em aberto, se esta tela pode responder agora (e é do tipo esperado)
function turn(kind?: PromptKind) {
  if (!G || !G.players) return null;
  const pe = G.pend[ME];
  if (LOCAL.spec || !pe || LOCAL.answered[pe.nonce] || LOCAL.busy) return null;
  return !kind || pe.kind === kind ? pe : null;
}

export function toggleCard(g: Gob) {
  if (!turn('select')) return;
  const [, kmax] = playLimit(G.players[ME]),
    sel = selection();
  if (sel.includes(g)) useUi.setState({ sel: sel.filter((x) => x !== g) });
  else if (sel.length < kmax) useUi.setState({ sel: [...sel, g] });
  else return toast(`No máximo ${kmax} goblin(s) nesta rodada.`);
  render();
}

export function clearCards() {
  if (!turn('select')) return;
  useUi.setState({ sel: [] });
  render();
}

export async function playCards() {
  if (!turn('select')) return;
  const [kmin, kmax] = playLimit(G.players[ME]),
    gs = selection();
  if (gs.length < kmin || gs.length > kmax) return;
  // as cartas saem da mão voando até a mesa; até a resposta chegar, ficam escondidas da mão
  const rects = gs.map((g) => {
    const el = document.querySelector(`#hand [data-g="${g}"]`);
    return el && el.getBoundingClientRect();
  });
  useUi.setState({ sel: [] });
  LOCAL.hide = new Set(gs);
  const p = respond({ play: gs });
  render();
  await Promise.all(
    gs.map((g, i) =>
      rects[i]
        ? fly(rects[i], $('myPlay'), gobCard(g), { dur: 440, delay: i * 80 })
        : Promise.resolve(),
    ),
  );
  await p;
  if (MODE !== 'online' || NET.isHost) LOCAL.hide = new Set();
  render();
}

export const pass = () => turn('window') && void respond({ pass: 1 });
export function pickTarget(pid: number) {
  const pe = turn();
  if (pe && (pe.kind === 'steal' || pe.kind === 'elim')) void respond({ target: pid });
}
export const drawItem = () => turn('draw') && void respond({ ok: 1 });
export const revealChaos = () => turn('chaos') && void respond({ ok: 1 });
export const nextRound = () => turn('next') && void respond({ ok: 1 });

export async function activateItem(k: ItemKey) {
  const pe = turn();
  if (!pe || !canUse(G.players[ME], k, pe.kind)) return;
  LOCAL.busy = true;
  const nonce = pe.nonce;
  LOCAL.modalNonce = nonce;
  try {
    const args = await gatherArgs(k);
    if (args && G.pend[ME] && G.pend[ME].nonce === nonce) await respond({ use: k, args });
  } finally {
    LOCAL.busy = false;
  }
}

export const kick = (pid: number) => botTakeover(pid);

export function toggleKing() {
  useUi.setState((s) => ({ kingOpen: !s.kingOpen }));
  render();
}

// "Sair da partida" de quem faliu: confirma e sai (contra bots, recomeça do menu)
export const leaveAfterBust = () => leaveGame();

// "Menu" (barra do topo) e "Voltar ao menu" (fim de jogo)
export async function goMenu() {
  if (G && G.players && !G.over && (MODE === 'local' || NET.isHost)) return leaveGame();
  if (MODE === 'online' && NET.isHost && G && G.status === 'playing' && !G.over) {
    const ok = await askLocal(
      'Sair da mesa?',
      'Você é o anfitrião: se sair, a partida fica parada até você voltar.',
      [
        { label: 'Sair', value: 1, cls: 'red' },
        { label: 'Ficar', value: 0, cls: 'ghost' },
      ],
    );
    if (!ok) return;
  }
  return leaveTable();
}

// pergunta o que o item precisa (alvo, valor...); null = o jogador cancelou
export async function gatherArgs(k: ItemKey): Promise<ItemArgs | null> {
  const me = G.players[ME],
    A = alivePl().filter((o) => o !== me);
  const choose = <T extends AskValue>(t: string, x: string, opts: Opt<T>[]) =>
    askLocal<T | null>(
      t,
      x,
      (opts as Opt<T | null>[]).concat([{ label: 'Cancelar', value: null, cls: 'ghost' }]),
    );
  switch (k) {
    case 'SACRIFICIO': {
      const g = await choose(
        'Sacrifício',
        'Qual goblin seu vai para o cemitério?',
        me.hand
          .slice()
          .sort((a, b) => gv(a) - gv(b) || gc(a) - gc(b))
          .map((g) => ({ label: gobTxt(g), value: g })),
      );
      if (g === null) return null;
      const T = A.filter((o) => o.hand.length);
      const t =
        T.length > 1
          ? await choose(
              'Sacrifício',
              'De quem você pega uma carta (às cegas)?',
              T.map((o) => ({ label: `${nameOf(o.id)} (${o.hand.length})`, value: o.id })),
            )
          : T[0].id;
      return t === null ? null : { g, target: t };
    }
    case 'COROA': {
      const t = await choose(
        'Coroa Trocada',
        'Trocar seu rei ou rainha com quem?',
        A.map((o) => ({
          label: `${nameOf(o.id)}: ${KINGS[o.king].name} (${KINGS[o.king].short})`,
          value: o.id,
        })),
      );
      return t === null ? null : { target: t };
    }
    case 'PA': {
      const g = await choose(
        'Pá de Coveiro',
        'Qual carta volta para a sua mão?',
        G.grave[ME]
          .slice()
          .sort((a, b) => gv(b) - gv(a))
          .map((g) => ({ label: gobTxt(g), value: g })),
      );
      return g === null ? null : { g };
    }
    case 'CICATRIZ': {
      const g = await choose(
        'Cicatrizes Compartilhadas',
        'Qual goblin com Cicatriz da sua mão vai para o seu cemitério?',
        me.hand
          .filter(scarred)
          .sort((a, b) => gv(a) - gv(b) || gc(a) - gc(b))
          .map((g) => ({ label: gobTxt(g), value: g })),
      );
      if (g === null) return null;
      const pool = scarGraves()
        .filter(([, x]) => x !== g)
        .sort(([, a], [, b]) => gv(b) - gv(a) || gc(a) - gc(b));
      const g2 = await choose(
        'Cicatrizes Compartilhadas',
        'Qual goblin com Cicatriz você pega?',
        pool.map(([id, x]) => ({
          label: `${gobTxt(x)} (${id === ME ? 'seu cemitério' : `cemitério de ${nameOf(id)}`})`,
          value: x,
        })),
      );
      if (g2 === null) return null;
      return { g, g2, target: pool.find(([, x]) => x === g2)![0] };
    }
    case 'LADRAO': {
      const T = G.players.filter((o) => o !== me && G.grave[o.id].length);
      const t =
        T.length > 1
          ? await choose(
              'Ladrão de Túmulos',
              'De qual cemitério?',
              T.map((o) => ({ label: `${nameOf(o.id)} (${G.grave[o.id].length})`, value: o.id })),
            )
          : T[0].id;
      return t === null ? null : { target: t };
    }
    case 'MAO_LEVE': {
      const T = A.filter((o) => o.items.length);
      const t =
        T.length > 1
          ? await choose(
              'Mão Leve',
              'Roubar de quem?',
              T.map((o) => ({ label: `${nameOf(o.id)} (${o.items.length})`, value: o.id })),
            )
          : T[0].id;
      return t === null ? null : { target: t };
    }
    case 'BANDEIRA': {
      const c = await choose(
        'Bandeira',
        'Para você, o monstro também será deste território nesta rodada:',
        CLAN.map((n, i) => ({ label: n, value: i })),
      );
      return c === null ? null : { c };
    }
    case 'DISFARCE': {
      const t = await choose(
        'Disfarce',
        'Que característica seus goblins jogados terão?',
        TRAITS.map((t) => ({ label: TNAME[t], value: t })),
      );
      return t === null ? null : { t };
    }
    case 'MAPA': {
      const pool = G.ideck.length ? G.ideck : G.idisc;
      if (!pool.length) return null;
      const k2 = await choose(
        'Mapa do Tesouro',
        'Escolha 1 item do monte para ficar com ele:',
        [...new Set(pool)].map((x) => ({
          label: `${ITEMS[x][0]} (${pool.filter((y) => y === x).length})`,
          value: x,
        })),
      );
      return k2 === null ? null : { k: k2 };
    }
    case 'PROFECIA': {
      const pool = G.cdeck.length ? G.cdeck : G.cdisc;
      if (!pool.length) return null;
      const k2 = await choose(
        'Profecia do Caos',
        'Escolha o Caos da próxima rodada:',
        [...new Set(pool)].map((x) => ({ label: chaosTitle(x), value: x })),
      );
      return k2 === null ? null : { k: k2 };
    }
    // Monstros Opostos: a Luneta espia um dos dois (virados) e a Isca troca um dos dois (acordados)
    case 'LUNETA': {
      if (!G.monster2) return {};
      const m = await choose('Luneta', 'Qual dos dois monstros você espia?', [
        { label: '1º monstro', value: 0 },
        { label: '2º monstro', value: 1 },
      ]);
      return m === null ? null : { m };
    }
    case 'ISCA': {
      if (!G.monster2) return {};
      const m = await choose('Isca de Monstro', 'Qual dos dois monstros vai embora?', [
        { label: `Monstro ${monOf(G.monster!)}`, value: 0 },
        { label: `Monstro ${monOf(G.monster2)}`, value: 1 },
      ]);
      return m === null ? null : { m };
    }
    case 'GRITO': {
      const d = await choose('Grito de Guerra', 'O monstro vale, para todos:', [
        { label: '+2', value: 2 },
        { label: '−2', value: -2 },
      ]);
      return d === null ? null : { d };
    }
  }
  if (NUMERIC.includes(k)) {
    const ds = itemOptions(me, k);
    if (!ds.length) return null;
    const d =
      ds.length === 1
        ? ds[0].d
        : await choose(
            ITEMS[k][0],
            'Escolha o efeito:',
            ds.map((x) => ({ label: x.label, value: x.d })),
          );
    return d === null ? null : { d };
  }
  return {};
}
