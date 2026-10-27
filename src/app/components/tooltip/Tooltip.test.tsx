import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vite-plus/test';
import { OC, mk } from '../../../game/data.ts';
import { newState } from '../../../game/engine.ts';
import { G, setG } from '../../../game/state.ts';
import { GobCard } from '../cards/GobCard.tsx';
import { Chip } from '../UsedChips.tsx';

// o balão abre com o foco do teclado (no jsdom não há mouse de verdade)
async function openTip(el: Element) {
  await act(() => fireEvent.focus(el));
  return screen.findByRole('tooltip');
}

// partida de 2: eu sou o Vermelho, com o Rei Quebra-Crânio (empresta Chapéu e Barba aos pares)
beforeEach(() => {
  setG(newState(2, [{ color: 0 }, { color: 1, bot: true }]));
});

describe('balões de informação', () => {
  it('a carta de goblin mostra território e características, sem lista de itens', async () => {
    render(<GobCard g={mk(2, 3)} tabIndex={0} />); // 3 azul, fora de partida: Chapéu, Barba, Óculos
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(tip.textContent).toContain('Goblin 3');
    expect(tip.textContent).toContain('Território Azul');
    expect(within(tip).getByText('Chapéu')).toBeTruthy();
    expect(tip.textContent).not.toContain('Chapéu Pontudo');
  });

  it('explica o item que você tem para aproveitar a característica', async () => {
    const me = G.players[0];
    me.items = ['CHAPEU'];
    render(<GobCard g={mk(0, 1)} owner={me} tabIndex={0} />); // o 1 tem Chapéu
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(tip.textContent).toContain('Você tem Chapéu Pontudo');
  });

  it('a carta de um rival não revela os itens dele', async () => {
    const rival = G.players[1];
    rival.items = ['CHAPEU'];
    render(<GobCard g={mk(1, 1)} owner={rival} tabIndex={0} />);
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(tip.textContent).not.toContain('Chapéu Pontudo');
  });

  it('mostra as características que o rei emprestou', async () => {
    // o 2 tem Óculos, Chinelo e Maluco impressos; por ser par, ganha Chapéu e Barba do rei
    render(<GobCard g={mk(0, 2)} owner={G.players[0]} tabIndex={0} />);
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(within(tip).getAllByText('de Rei Quebra-Crânio')).toHaveLength(2);
  });

  it('avisa quando a Maldição zera o goblin', async () => {
    Object.assign(G, { chaos: 'MALDICAO', curse: OC });
    render(<GobCard g={mk(0, 2)} owner={G.players[0]} tabIndex={0} />); // o 2 tem Óculos
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(tip.textContent).toContain('Vale 0 nesta rodada: a Maldição anula Óculos.');
  });

  it('item usado mostra o que foi escolhido e se levou NÃO!', async () => {
    render(<Chip u={{ k: 'AJUSTE', d: -3, x: 1 }} />);
    const tip = await openTip(document.querySelector('[data-chip]')!);
    expect(tip.textContent).toContain('Usado: -3');
    expect(tip.textContent).toContain('Cancelado com NÃO!');
  });
});
