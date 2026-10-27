import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { CHAOS, ITEMS } from '../../game/data.ts';
import { Rules } from './Rules.tsx';

describe('tela de regras', () => {
  it('tem abas com a tabela de itens e a de Caos', async () => {
    render(<Rules />);
    expect(screen.getByRole('tab', { name: 'Regras' }).getAttribute('aria-selected')).toBe('true');
    await act(() => fireEvent.click(screen.getByRole('tab', { name: 'Itens' })));
    expect(document.body.textContent).toContain('62 cartas no monte de itens');
    for (const [name] of Object.values(ITEMS)) expect(document.body.textContent).toContain(name);
    expect(document.body.textContent).toContain('Se jogou goblin Fedorento: +3 na sua soma.');
    await act(() => fireEvent.click(screen.getByRole('tab', { name: 'Caos' })));
    expect(document.body.textContent).toContain('50 cartas no monte de Caos');
    for (const [name] of Object.values(CHAOS)) expect(document.body.textContent).toContain(name);
  });
});
