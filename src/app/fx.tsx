// Efeitos visuais: o motor publica eventos; aqui cada um vira estado da tela (overlays/FxLayer.tsx
// desenha as cartas voando, os balõezinhos e o confete).
import type { ReactNode } from 'react';
import { chaosDesc, chaosTitle, pick } from '../game/data.ts';
import { G, ME, SPEED, fmt, nameOf, wait } from '../game/state.ts';
import type { FxCard, FxEvent } from '../game/types.ts';
import { BackCard } from './components/cards/BackCard.tsx';
import { ChaosBack } from './components/cards/ChaosBack.tsx';
import { ChaosCard } from './components/cards/ChaosCard.tsx';
import { GobCard } from './components/cards/GobCard.tsx';
import { ItemBack } from './components/cards/ItemBack.tsx';
import { ItemCard } from './components/cards/ItemCard.tsx';
import { MonsterBack } from './components/cards/MonsterBack.tsx';
import { render } from './render.ts';
import { useUi } from './store.ts';

type Target = Element | DOMRect | string | null;

let toastT: ReturnType<typeof setTimeout> | undefined,
  seq = 0;
export function toast(msg: string) {
  useUi.setState({ toast: { id: ++seq, msg } });
  clearTimeout(toastT);
  toastT = setTimeout(() => useUi.setState({ toast: null }), 2800);
}
// 'hand:2', 'seat:1', 'play:0', 'tray:3' ou o id de um elemento
export function anchorEl(a: string | undefined) {
  if (!a) return null;
  const [t, id] = String(a).split(':'),
    pid = +id;
  const seat = (sel?: string) =>
    document.querySelector(`[data-seat][data-id="${pid}"]${sel ? ' ' + sel : ''}`);
  const byId = (id: string) => document.getElementById(id);
  const mine = pid === ME;
  switch (t) {
    case 'hand':
      return mine ? byId('hand') : seat();
    case 'seat':
    case 'grave':
      return mine ? byId('meBox') : seat();
    case 'play':
      return mine ? byId('myPlay') : seat('[data-oplay]') || seat();
    case 'tray':
      return mine ? byId('trayBox') : seat();
    default:
      return byId(t);
  }
}
// a carta que voa: a frente só se esta tela pode vê-la
export function fxCard(c: FxCard | undefined): ReactNode {
  if (!c) return <BackCard />;
  if (c.g !== undefined)
    return c.pub || (c.vis || []).includes(ME) ? <GobCard g={c.g} sm={!!c.sm} /> : <BackCard />;
  if (c.item) return (c.vis || []).includes(ME) ? <ItemCard k={c.item} /> : <ItemBack />;
  if (c.chaos) return <ChaosCard k={c.chaos} />;
  if (c.t === 'item') return <ItemBack />;
  if (c.t === 'chaos') return <ChaosBack />;
  if (c.t === 'mon') return <MonsterBack />;
  return <BackCard />;
}
export async function playFx(ev: FxEvent) {
  if (useUi.getState().screen !== 'game') return;
  const forMe = ev.to === undefined || ev.to === ME || (Array.isArray(ev.to) && ev.to.includes(ME));
  switch (ev.type) {
    case 'fly':
      render();
      await fly(anchorEl(ev.from), anchorEl(ev.to2), fxCard(ev.card), {
        dur:
          (ev.dur || 480) *
          ([ev.from, ev.to2].some(
            (a) => /^(hand|seat|play|tray):/.test(a || '') && +String(a).split(':')[1] !== ME,
          )
            ? 1.7
            : 1),
        rot: ev.rot || 0,
        delay: ev.delay || 0,
      });
      break;
    case 'toast':
      if (forMe) toast(fmt(ev.text));
      break;
    case 'pop':
      render();
      popAt(anchorEl('seat:' + ev.pid), fmt(ev.text), ev.good);
      break;
    case 'banner':
      if (forMe) await banner(fmt(ev.text), fmt(ev.sub || ''), ev.kind || '');
      break;
    case 'result': {
      render();
      const meP = G.players[ME],
        iWon = ev.w.includes(ME),
        played = ev.played.includes(ME);
      if (meP && played && !meP.bot) {
        if (iWon)
          await banner(
            ev.kind === 'exact' ? 'Cravou!' : 'Venceu a rodada',
            ev.kind === 'exact' ? 'Você rouba cartas e compra um item' : 'Você chegou mais perto',
          );
        else {
          useUi.setState({ shake: true });
          setTimeout(() => useUi.setState({ shake: false }), 500);
          await banner(
            'Perdeu',
            `${ev.w.map(nameOf).join(' e ')} ${ev.w.length > 1 ? 'venceram' : 'venceu'} a rodada`,
            'bad',
          );
        }
      } else if (ev.w.length)
        await banner(
          ev.w.map((i) => nameOf(i)).join(' + '),
          ev.kind === 'exact' ? 'cravou' : 'venceu a rodada',
          'cool',
        );
      break;
    }
    case 'chaosShow':
      render();
      void fly(anchorEl('chaosDeck'), anchorEl('chaosSlot'), <ChaosBack />, { dur: 380 });
      await banner(chaosTitle(ev.k), 'Próxima rodada: ' + chaosDesc(ev.k), 'pink');
      break;
    case 'end':
      render();
      if (G.winner === ME && !G.players[ME].bot) {
        confetti();
        await banner('Você venceu!', 'O último goblin em pé');
      } else
        await banner(
          G.winner !== null && G.winner !== undefined ? `${nameOf(G.winner)} venceu` : 'Empate',
          'Fim de jogo',
          'cool',
        );
      break;
  }
}
const rectOf = (t: Target) =>
  t instanceof DOMRect
    ? t
    : (typeof t === 'string' ? document.querySelector(t) : t)?.getBoundingClientRect() || null;

// a carta voa de `from` até `to`; a promise termina quando ela pousa
export function fly(
  from: Target,
  to: Target,
  card: ReactNode,
  { dur = 480, rot = 0, delay = 0 }: { dur?: number; rot?: number; delay?: number } = {},
) {
  if (SPEED < 0.05) return Promise.resolve();
  const a = rectOf(from),
    b = rectOf(to);
  if (!a || !b || !a.width || !b.width) return Promise.resolve();
  return new Promise<void>((done) => {
    const f = { id: ++seq, card, from: a, to: b, dur, rot, delay, done };
    useUi.setState((s) => ({ flights: [...s.flights, f] }));
  });
}
export function landFlight(id: number) {
  const f = useUi.getState().flights.find((x) => x.id === id);
  if (!f) return;
  useUi.setState((s) => ({ flights: s.flights.filter((x) => x !== f) }));
  f.done();
}
export async function banner(text: string, sub = '', kind = '') {
  if (SPEED < 0.05) return;
  useUi.setState({ banner: { id: ++seq, text, sub, kind } });
  await wait(1300);
  useUi.setState({ banner: null });
}
// as cores do confete são as dos territórios e a do texto (tokens do @theme em styles.css)
const CONFETTI = ['red', 'green', 'blue', 'yellow', 'text'].map((c) => `var(--color-${c})`);
export function confetti() {
  const pieces = Array.from({ length: 110 }, () => ({
    id: ++seq,
    left: Math.random() * 100,
    color: pick(CONFETTI),
    dur: 2 + Math.random() * 2.5,
    delay: Math.random() * 0.8,
  }));
  useUi.setState({ confetti: pieces });
  setTimeout(() => useUi.setState({ confetti: [] }), 6000);
}
export function popAt(el: Element | null, text: string, good?: boolean) {
  if (!el) return;
  const r = el.getBoundingClientRect(),
    p = { id: ++seq, x: r.left + r.width / 2, y: r.top - 8, text, good };
  useUi.setState((s) => ({ pops: [...s.pops, p] }));
  setTimeout(() => useUi.setState((s) => ({ pops: s.pops.filter((x) => x !== p) })), 2300);
}
