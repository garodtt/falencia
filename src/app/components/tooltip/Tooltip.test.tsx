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

// partida de 2: eu sou o Vermelho, com o Rei Quebra-Crânio (os goblins 1 a 5 Vermelhos herdam Cicatriz)
beforeEach(() => {
  setG(newState(2, [{ color: 0 }, { color: 1, bot: true }]));
});

describe('balões de informação', () => {
  it('a carta de goblin mostra território e características, sem lista de itens', async () => {
    render(<GobCard g={mk(2, 3)} tabIndex={0} />); // 3 azul, fora de partida: Chapéu, Monóculo
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(tip.textContent).toContain('Goblin 3');
    expect(tip.textContent).toContain('Território Azul');
    expect(within(tip).getByText('Chapéu')).toBeTruthy();
    expect(tip.textContent).not.toContain('Chapéu Pontudo');
  });

  it('explica o item que você tem para aproveitar a característica', async () => {
    const me = G.players[0];
    me.items = ['CHAPEU'];
    render(<GobCard g={mk(0, 3)} owner={me} tabIndex={0} />); // o 3 tem Chapéu
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

  it('mostra a característica herdada do rei ou rainha da cor do goblin', async () => {
    // o 2 tem Monóculo e Maluco impressos; por ser um dos 1 a 5 Vermelhos, herda Cicatriz
    render(<GobCard g={mk(0, 2)} owner={G.players[1]} tabIndex={0} />); // vale em qualquer mão
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(within(tip).getAllByText('herdada de Rei Quebra-Crânio')).toHaveLength(1);
  });

  it('avisa quando a passiva do monstro zera o goblin', async () => {
    Object.assign(G, { monster: { v: 22, ts: [0], fx: null, curse: OC }, revealed: true });
    render(<GobCard g={mk(0, 2)} owner={G.players[0]} tabIndex={0} />); // o 2 tem Monóculo
    const tip = await openTip(document.querySelector('[data-card]')!);
    expect(tip.textContent).toContain('Vale 0 nesta rodada: a passiva do monstro anula Monóculo.');
  });

  it('item usado mostra o que foi escolhido e se levou NÃO!', async () => {
    render(<Chip u={{ k: 'AJUSTE', d: -3, x: 1 }} />);
    const tip = await openTip(document.querySelector('[data-chip]')!);
    expect(tip.textContent).toContain('Usado: -3');
    expect(tip.textContent).toContain('Cancelado com NÃO!');
  });
});
