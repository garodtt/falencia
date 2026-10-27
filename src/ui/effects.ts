// Efeitos visuais: o motor publica eventos; cada tela toca o seu.
import { chaosDesc, chaosTitle, pick } from '../game/data.ts';
import { G, ME, SPEED, nameOf, wait } from '../game/state.ts';
import {
  $,
  backCard,
  chaosBack,
  chaosCard,
  fmt,
  gobCard,
  itemBack,
  itemCard,
  monBack,
} from './html.ts';
import { render } from './render.ts';
import { useUi } from '../app/store.ts';
import type { FxCard, FxEvent } from '../game/types.ts';

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
  const mine = pid === ME;
  switch (t) {
    case 'hand':
      return mine ? $('hand') : seat();
    case 'seat':
    case 'grave':
      return mine ? $('meBox') : seat();
    case 'play':
      return mine ? $('myPlay') : seat('[data-oplay]') || seat();
    case 'tray':
      return mine ? $('trayBox') : seat();
    default:
      return $(t);
  }
}
export function cardHTML(c: FxCard | undefined) {
  if (!c) return backCard();
  if (c.g !== undefined) {
    const vis = c.pub || (c.vis || []).includes(ME);
    return vis ? gobCard(c.g, !!c.sm) : backCard();
  }
  if (c.item) return (c.vis || []).includes(ME) ? itemCard(c.item) : itemBack();
  if (c.chaos) return chaosCard(c.chaos, c.curse);
  return (
    { back: backCard(), item: itemBack(), chaos: chaosBack(), mon: monBack() }[c.t!] || backCard()
  );
}
export async function playFx(ev: FxEvent) {
  if (!$('game') || $('game').classList.contains('!hidden')) return;
  const forMe = ev.to === undefined || ev.to === ME || (Array.isArray(ev.to) && ev.to.includes(ME));
  switch (ev.type) {
    case 'fly':
      render();
      await fly(anchorEl(ev.from), anchorEl(ev.to2), cardHTML(ev.card), {
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
          $('game').classList.add('animate-shake');
          setTimeout(() => $('game').classList.remove('animate-shake'), 500);
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
      void fly(anchorEl('chaosDeck'), anchorEl('chaosSlot'), chaosBack(), { dur: 380 });
      await banner(
        chaosTitle(ev.k, ev.curse),
        'Próxima rodada: ' + chaosDesc(ev.k, ev.curse),
        'pink',
      );
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
export function rectOf(el: Element | string | null) {
  if (typeof el === 'string') el = document.querySelector(el);
  return el ? el.getBoundingClientRect() : null;
}
export async function fly(
  from: Target,
  to: Target,
  html: string,
  { dur = 480, rot = 0, delay = 0 }: { dur?: number; rot?: number; delay?: number } = {},
) {
  if (SPEED < 0.05) return;
  const a = from instanceof DOMRect ? from : rectOf(from),
    b = to instanceof DOMRect ? to : rectOf(to);
  if (!a || !b || !a.width || !b.width) return;
  const d = document.createElement('div');
  d.className = 'fixed top-0 left-0 z-30 pointer-events-none';
  d.innerHTML = html;
  document.body.appendChild(d);
  const c = d.firstElementChild as HTMLElement,
    w = c.offsetWidth || 60,
    h = c.offsetHeight || 87;
  const x0 = a.left + a.width / 2 - w / 2,
    y0 = a.top + a.height / 2 - h / 2,
    x1 = b.left + b.width / 2 - w / 2,
    y1 = b.top + b.height / 2 - h / 2;
  try {
    await d.animate(
      [
        { transform: `translate(${x0}px,${y0}px) rotate(${-rot}deg) scale(.85)` },
        {
          transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 40}px) scale(1.1)`,
          offset: 0.5,
        },
        { transform: `translate(${x1}px,${y1}px) rotate(${rot}deg) scale(1)` },
      ],
      { duration: dur * SPEED, delay: delay * SPEED, easing: 'ease-in-out', fill: 'forwards' },
    ).finished;
  } catch (e) {}
  d.remove();
}
export async function banner(text: string, sub = '', kind = '') {
  if (SPEED < 0.05) return;
  useUi.setState({ banner: { id: ++seq, text, sub, kind } });
  await wait(1300);
  useUi.setState({ banner: null });
}
export function confetti() {
  const cols = ['#e5484d', '#30a46c', '#3e63dd', '#f5b300', '#eceef2'];
  for (let i = 0; i < 110; i++) {
    const d = document.createElement('div');
    d.className = 'fixed top-[-20px] z-50 h-3 w-2 animate-fall pointer-events-none';
    d.style.left = Math.random() * 100 + 'vw';
    d.style.background = pick(cols);
    d.style.animationDuration = 2 + Math.random() * 2.5 + 's';
    d.style.animationDelay = Math.random() * 0.8 + 's';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 6000);
  }
}
export function popAt(el: Element | null, text: string, good?: boolean) {
  if (!el) return;
  const p = document.createElement('div');
  p.className =
    'pointer-events-none absolute top-[-8px] left-1/2 z-[6] -translate-x-1/2 -translate-y-full animate-fade-up rounded-lg border border-line bg-surface-3 px-2.5 py-[5px] text-xs font-bold whitespace-nowrap text-text' +
    (good ? ' text-good' : '');
  p.textContent = text;
  el.appendChild(p);
  setTimeout(() => p.remove(), 2300);
}
