import { act, fireEvent, render, screen } from '../../test-utils.tsx';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { mk } from '../../game/data.ts';
import { newState } from '../../game/engine.ts';
import { G, LOCAL, setG, setME, setMODE, setSPEED } from '../../game/state.ts';
import type { PromptKind, PromptData } from '../../game/types.ts';
import { leaveGame, leaveTable, respond } from '../../net/online.ts';
import { askLocal, closeStaleModal } from '../overlays/modal.ts';
import { Modal } from '../overlays/Modal.tsx';
import { useUi } from '../store.ts';
import { Table } from './Table.tsx';

// nada de banco: as respostas do jogador são só registradas
vi.mock('../../net/firebase.ts', () => ({ fb: null }));
vi.mock('../../net/online.ts', () => ({
  respond: vi.fn(() => Promise.resolve()),
  leaveGame: vi.fn(),
  leaveTable: vi.fn(),
  resolveNames: vi.fn(),
}));

// uma partida de 4 (eu = Vermelho, assento 0) parada na rodada 1, esperando `kind` de mim
function game(kind?: PromptKind, data: PromptData = {}) {
  setMODE('local');
  setME(0);
  setG(
    newState(4, [
      { color: 0 },
      { color: 1, bot: true },
      { color: 2, bot: true },
      { color: 3, bot: true },
    ]),
  );
  Object.assign(G, { round: 1, phase: 'dormindo', order: [0, 1, 2, 3], monster: G.monsters[0] });
  if (kind) G.pend[0] = { kind, data, nonce: 1 };
}
const handCard = (v: number) =>
  document.querySelector<HTMLElement>(`#hand [data-g="${mk(0, v)}"]`)!;

beforeEach(() => {
  setSPEED(0); // sem animações
  LOCAL.answered = {};
  LOCAL.hide = new Set();
  useUi.setState({ screen: 'game', sel: [], modal: null, toast: null });
  vi.clearAllMocks();
});

describe('mesa', () => {
  it('escolhe goblins na mão, mostra a soma e joga', async () => {
    game('select');
    render(<Table />);
    expect(screen.getByRole('button', { name: /Jogar/ })).toHaveProperty('disabled', true);

    fireEvent.click(handCard(7));
    fireEvent.click(handCard(5));
    expect(document.querySelector('#actionBar [data-sum]')!.textContent).toBe('12');
    expect(handCard(7).hasAttribute('data-selected')).toBe(true);

    await act(() => fireEvent.click(screen.getByRole('button', { name: 'Jogar 2' })));
    expect(respond).toHaveBeenCalledWith({ play: [mk(0, 7), mk(0, 5)] });
  });

  it('não deixa escolher mais goblins que o permitido', () => {
    game('select');
    render(<Table />);
    for (const v of [1, 2, 3, 4]) fireEvent.click(handCard(v));
    expect(document.querySelectorAll('#hand [data-selected]')).toHaveLength(3);
    expect(useUi.getState().toast!.msg).toMatch(/No máximo 3/);
  });

  it('avisa quando a soma cai na Zona Proibida', () => {
    game('select');
    G.chaos = 'ZONA';
    render(<Table />);
    fireEvent.click(handCard(19));
    expect(document.querySelector('[data-warn]')).toBeNull();
    fireEvent.click(handCard(4));
    expect(document.querySelector('[data-warn]')!.textContent).toBe(
      'Zona Proibida: 23 perde nesta rodada',
    );
  });

  it('ao cravar, os rivais que podem ser alvo ficam clicáveis', () => {
    game('steal', { left: 2, T: [1, 3], exact: true });
    render(<Table />);
    const seat = (id: number) =>
      document.querySelector<HTMLElement>(`[data-seat][data-id="${id}"]`)!;
    expect(seat(1).dataset.target).toBe('steal');
    expect(seat(2).dataset.target).toBeUndefined();
    fireEvent.click(seat(3));
    expect(respond).toHaveBeenCalledWith({ target: 3 });
  });

  it('quem faliu pode sair da partida (pela confirmação do leaveGame)', () => {
    game();
    G.players[0].alive = false;
    G.players[0].hand = [];
    render(<Table />);
    fireEvent.click(screen.getByRole('button', { name: 'Sair da partida' }));
    expect(leaveGame).toHaveBeenCalledOnce();
    expect(leaveTable).not.toHaveBeenCalled();
  });

  it('no fim de jogo mostra quem venceu', () => {
    game();
    Object.assign(G, { over: true, status: 'over', winner: 0 });
    render(<Table />);
    expect(screen.getByText('Você é o último goblin em pé!')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Voltar ao menu' })).toBeTruthy();
  });
});

describe('modal de escolha', () => {
  it('devolve a opção clicada', async () => {
    render(<Modal />);
    const answer = askLocal('Pedágio', 'Escolha 1 carta.', [
      { label: '3 vermelho', value: 3 },
      { label: '9 vermelho', value: 9 },
    ]);
    fireEvent.click(await screen.findByRole('button', { name: '9 vermelho' }));
    await expect(answer).resolves.toBe(9);
    expect(useUi.getState().modal).toBeNull();
  });

  it('fecha sozinho (com null) quando o pedido já foi respondido por outro caminho', async () => {
    game('ask', { title: 'x', options: [] });
    render(<Modal />);
    LOCAL.modalNonce = 1;
    const answer = askLocal('Mercadora', '', [{ label: 'Luneta', value: 'LUNETA' }]);
    delete G.pend[0];
    act(() => closeStaleModal());
    await expect(answer).resolves.toBeNull();
  });

  it('abre a pergunta que chegou enquanto as Regras estavam abertas, ao fechá-las', async () => {
    await import('../render.ts'); // registra o "tentar de novo" ao fechar modal
    game();
    render(<Modal />);
    void askLocal('Regras', '', [{ label: 'Fechar', value: 1 }]);
    G.pend[0] = {
      kind: 'ask',
      data: { title: 'Pedágio', text: 'Escolha 1 carta.', options: [{ label: '3', value: 3 }] },
      nonce: 1,
    };
    fireEvent.click(await screen.findByRole('button', { name: 'Fechar' }));
    expect(await screen.findByRole('button', { name: '3' })).toBeTruthy();
  });
});
