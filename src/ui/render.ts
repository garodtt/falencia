// Ponte entre o motor/rede e as telas. render() redesenha a mesa (React) na hora — as animações
// medem a posição dos elementos logo depois — e cuida do que acontece "ao redesenhar":
// fechar um modal velho, abrir o modal de um pedido, avisar quem faliu.
import { Fragment, createElement } from 'react';
import { flushSync } from 'react-dom';
import { CLAN, KINGS } from '../game/data.ts';
import { G, LOCAL, ME, MODE, NET, nameOf } from '../game/state.ts';
import { leaveGame, resolveNames, respond } from '../net/online.ts';
import { ItemCard } from '../app/components/cards/ItemCard.tsx';
import { askLocal, closeStaleModal } from '../app/overlays/modal.ts';
import { bump, useUi } from '../app/store.ts';
import { myPending } from '../app/table/view.ts';
import { $, CCSS, esc, fmt } from './html.ts';
import { tipPlace } from './tips.ts';

export { askLocal };

export function showGame() {
  LOCAL.deadShown = false;
  $('menu').classList.add('!hidden');
  $('lobby').classList.add('!hidden');
  $('game').classList.remove('!hidden');
}

// sala de espera das mesas online (fica como estava até mexermos no online)
export function showLobby() {
  $('menu').classList.add('!hidden');
  $('game').classList.add('!hidden');
  $('lobby').classList.remove('!hidden');
  const S = G,
    seats = S.seats || [];
  void resolveNames(seats.map((s) => s.uid).filter(Boolean));
  const mine = seats.find((s) => s.uid === NET.uid);
  const ghost =
    'bg-transparent text-text shadow-[inset_0_0_0_1px_var(--color-line)] hover:enabled:bg-surface-2';
  const dot = 'inline-block size-3 flex-none rounded-full';
  const rows = Array.from({ length: S.n }, (_, i) => {
    const s = seats[i];
    if (!s)
      return `<div class="flex items-center gap-2.5 rounded-[10px] bg-surface-2 px-3.5 py-3 text-muted"><span class="${dot}" style="background:var(--color-surface-3)"></span>Vaga livre <span class="text-muted">· vira bot se ninguém entrar</span></div>`;
    return `<div class="flex items-center gap-2.5 rounded-[10px] bg-surface-2 px-3.5 py-3"><span class="${dot}" style="background:${CCSS[s.color]}"></span><b>${esc(s.uid === NET.uid ? 'Você' : NET.names[s.uid!] || 'Jogador')}</b><span class="text-muted">${CLAN[s.color]} · ${KINGS[s.color].name}</span>${s.uid === S.hostUid ? '<span class="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] font-bold text-muted">anfitrião</span>' : ''}</div>`;
  }).join('');
  const free = [0, 1, 2, 3].filter((c) => !seats.some((s) => s.color === c));
  const code = 'font-display text-lg font-extrabold tracking-[2px] text-accent';
  const row = 'flex flex-wrap items-center gap-2.5';
  $('lobby').innerHTML = `<div class="grid w-[min(640px,100%)] gap-3.5">
    <h2 class="m-0 font-display text-4xl font-extrabold">Mesa <span class="${code}">${esc(S.code)}</span></h2>
    <p class="text-muted">Peça para os outros abrirem esta mesma página e entrarem com o código <b class="${code}">${esc(S.code)}</b>.</p>
    <div style="display:grid;gap:8px">${rows}</div>
    ${mine && free.length && !NET.isHost ? `<div class="${row}"><span class="text-muted">Trocar de território:</span>${free.map((c) => `<button class="${ghost}" data-color="${c}"><span class="${dot}" style="background:${CCSS[c]}"></span>${CLAN[c]}</button>`).join('')}</div>` : ''}
    <div class="${row}">${NET.isHost ? `<button id="btnStartOnline">Começar partida</button>` : `<span class="text-muted">${mine ? 'Aguardando o anfitrião começar…' : 'Entrando na mesa…'}</span>`}<button class="${ghost}" id="btnLeave">Sair da mesa</button></div>
  </div>`;
}

let dealT: ReturnType<typeof setTimeout> | undefined;

// deal: a mão acabou de ser distribuída (as cartas entram animadas)
export function render(deal?: boolean) {
  if (!G || !G.players || $('game').classList.contains('!hidden')) return;
  closeStaleModal();
  // a barra do topo fica fora do React: a rede limpa #barInfo direto ao sair da mesa
  $('barInfo').innerHTML = G.round
    ? `<span>Rodada <b>${esc(G.round)}</b></span><span>Chefe da Toca <b>${esc(nameOf(G.chief))}</b></span>${MODE === 'online' ? `<span>Mesa <b>${esc(G.code)}</b></span>` : ''}`
    : '';
  if (deal) {
    useUi.setState({ dealing: true });
    clearTimeout(dealT);
    dealT = setTimeout(() => useUi.setState({ dealing: false }), 1500);
  }
  bustNotice();
  askIfPending();
  flushSync(bump);
  tipPlace();
}

// quem acabou de falir é perguntado (uma vez) se quer assistir ou sair
function bustNotice() {
  const me = G.players[ME],
    pendMine = LOCAL.spec ? null : G.pend[ME];
  if (!me || me.alive || LOCAL.spec || LOCAL.deadShown) return;
  if (G.over || G.status === 'over' || (pendMine && !LOCAL.answered[pendMine.nonce])) return;
  LOCAL.deadShown = true;
  setTimeout(async () => {
    if (!G || !G.players || G.over) return;
    const v = await askLocal(
      'Você faliu!',
      'Ficou sem cartas na mão. Quer assistir até o fim ou sair da partida?',
      [
        { label: 'Assistir', value: 0, cls: 'ghost' },
        { label: 'Sair da partida', value: 1, cls: 'red' },
      ],
    );
    if (v) void leaveGame(true);
  }, 1800);
}

// fechou um modal que não era pergunta do motor (Regras, confirmação de saída): a pergunta que
// chegou enquanto ele estava aberto foi pulada, então tenta de novo. Na resposta de uma pergunta,
// LOCAL.modalNonce ainda está preenchido aqui, e ela não reabre.
useUi.subscribe((s, prev) => {
  if (prev.modal && !s.modal && !LOCAL.modalNonce && G && G.players) askIfPending();
});

// o motor fez uma pergunta a este jogador (Pedágio, Mercadora, NÃO!...): abre o modal
function askIfPending() {
  const pe = myPending();
  if (!pe || pe.kind !== 'ask' || useUi.getState().modal) return;
  const d = pe.data,
    nonce = pe.nonce;
  LOCAL.modalNonce = nonce;
  void askLocal(
    fmt(d.title),
    fmt(d.text),
    d.options!.map((o) => ({ label: fmt(o.label), value: o.value, cls: o.cls })),
    d.cards
      ? createElement(
          Fragment,
          null,
          d.cards.map((k, i) => createElement(ItemCard, { key: i, k })),
        )
      : undefined,
  ).then((v) => {
    if (G.pend[ME] && G.pend[ME].nonce === nonce) void respond({ value: v });
  });
}
