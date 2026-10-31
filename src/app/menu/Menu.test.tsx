import { fireEvent, render, screen, waitFor } from '../../test-utils.tsx';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { MENU, NET } from '../../game/state.ts';
import { joinTable } from '../../net/online.ts';
import { startLocal } from './startLocal.ts';
import { TIPS } from '../tips.ts';
import { useUi } from '../store.ts';
import { Menu } from './Menu.tsx';

// nada de banco nem de partida de verdade nos testes de tela
vi.mock('../../net/firebase.ts', () => ({ fb: null }));
vi.mock('../../net/online.ts', () => ({ createTable: vi.fn(), joinTable: vi.fn() }));
vi.mock('./startLocal.ts', () => ({ startLocal: vi.fn() }));

beforeEach(() => {
  Object.assign(MENU, { n: 4, color: 0 });
  NET.db = null;
  useUi.setState({ tipsOn: true });
  vi.clearAllMocks();
});

const clans = () => [...document.querySelectorAll<HTMLElement>('[data-clan-pick]')];

describe('Menu', () => {
  // os seletores são ToggleGroup do Radix: cada opção é um <button> (Enter e Espaço funcionam
  // sozinhos), marcado com role="radio" e aria-checked, e as setas andam entre as opções
  it('escolhe o território clicando, e anda entre eles pelas setas', async () => {
    render(<Menu />);
    fireEvent.click(clans()[1]);
    expect(MENU.color).toBe(1);
    expect(clans()[1].getAttribute('aria-checked')).toBe('true');
    expect(clans()[0].getAttribute('aria-checked')).toBe('false');
    expect(clans()[1].tagName).toBe('BUTTON');

    clans()[1].focus();
    fireEvent.keyDown(clans()[1], { key: 'ArrowRight' });
    await waitFor(() => expect(document.activeElement).toBe(clans()[2]));
  });

  it('escolhe o número de jogadores', () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole('radio', { name: '2' }));
    expect(MENU.n).toBe(2);
    expect(screen.getByRole('radio', { name: '2' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: '4' }).getAttribute('aria-checked')).toBe('false');
  });

  it('começa a partida contra bots com as dicas como marcado', () => {
    TIPS.seen.add('start');
    render(<Menu />);
    fireEvent.click(screen.getByLabelText(/Mostrar dicas/));
    fireEvent.click(screen.getByRole('button', { name: /Jogar contra bots/ }));
    expect(startLocal).toHaveBeenCalledOnce();
    expect(TIPS.on).toBe(false);
    expect(TIPS.seen.size).toBe(0);
  });

  it('sem Firebase, avisa que o online está desligado', () => {
    render(<Menu />);
    expect(screen.getByText(/mesas online estão desligadas/)).toBeTruthy();
    expect(document.getElementById('nameRow')).toBeNull();
  });

  it('com Firebase, entra numa mesa pelo código digitado', () => {
    NET.db = {} as typeof NET.db;
    render(<Menu />);
    fireEvent.change(screen.getByLabelText('Código da mesa'), { target: { value: 'ABCDE' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(joinTable).toHaveBeenCalledWith('ABCDE');
  });
});
