// Ponte entre o motor/rede e as telas. render() redesenha a mesa (React) na hora — as animações
// medem a posição dos elementos logo depois — e cuida do que acontece "ao redesenhar":
// fechar um modal velho, abrir o modal de um pedido, avisar quem faliu.
import { Fragment, createElement } from 'react';
import { flushSync } from 'react-dom';
import { G, LOCAL, ME, fmt } from '../game/state.ts';
import { leaveGame, respond } from '../net/online.ts';
import { ItemCard } from './components/cards/ItemCard.tsx';
import { askLocal, closeStaleModal } from './overlays/modal.ts';
import { bump, useUi } from './store.ts';
import type { Screen } from './store.ts';
import { myPending } from './table/view.ts';
import { tipPlace } from './tips.ts';

export { askLocal };

// troca de tela (menu, sala de espera online, mesa) e redesenha
export function show(screen: Screen) {
  if (screen === 'game') LOCAL.deadShown = false;
  useUi.setState({ screen });
  bump();
}

let dealT: ReturnType<typeof setTimeout> | undefined;

// deal: a mão acabou de ser distribuída (as cartas entram animadas)
export function render(deal?: boolean) {
  if (!G || !G.players || useUi.getState().screen !== 'game') return;
  closeStaleModal();
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
