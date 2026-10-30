import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { CHAOS, ITEMS } from '../../game/data.ts';
import { Rules } from './Rules.tsx';

describe('tela de regras', () => {
  it('abre com os conceitos-chave e a margem em destaque, antes da legenda de ícones', () => {
    render(<Rules />);
    const text = document.body.textContent!;
    for (const t of ['Soma', 'Alvo', 'Distância', 'Margem (±)', 'Cravar', 'Aproximação'])
      expect(text).toContain(t);
    expect(text).toContain('A margem só diminui a sua distância até o monstro.');
    expect(text).toContain('Onde a margem não vale');
    expect(text.indexOf('Conceitos-chave')).toBeLessThan(text.indexOf('Território (margem ±)'));
    expect(text.indexOf('Território (margem ±)')).toBeLessThan(
      text.indexOf('O que cada ícone significa'),
    );
  });

  it('tem abas com a tabela de itens e a de Caos', async () => {
    render(<Rules />);
    expect(screen.getByRole('tab', { name: 'Regras' }).getAttribute('aria-selected')).toBe('true');
    await act(() => fireEvent.click(screen.getByRole('tab', { name: 'Itens' })));
    expect(document.body.textContent).toContain('62 cartas no monte de itens');
    for (const [name] of Object.values(ITEMS)) expect(document.body.textContent).toContain(name);
    expect(document.body.textContent).toContain('Se jogou goblin Fedorento: até +3 na sua soma.');
    await act(() => fireEvent.click(screen.getByRole('tab', { name: 'Caos' })));
    expect(document.body.textContent).toContain('50 cartas no monte de Caos');
    for (const [name] of Object.values(CHAOS)) expect(document.body.textContent).toContain(name);
  });
});
