import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { MENU, NET } from '../../game/state.ts';
import { joinTable } from '../../net/online.ts';
import { startLocal } from '../../ui/menu.ts';
import { TIPS } from '../../ui/tips.ts';
import { useUi } from '../store.ts';
import { Menu } from './Menu.tsx';

// nada de banco nem de partida de verdade nos testes de tela
vi.mock('../../net/firebase.ts', () => ({ fb: null }));
vi.mock('../../net/online.ts', () => ({ createTable: vi.fn(), joinTable: vi.fn() }));
vi.mock('../../ui/menu.ts', () => ({ startLocal: vi.fn() }));

beforeEach(() => {
  Object.assign(MENU, { n: 4, color: 0 });
  NET.db = null;
  useUi.setState({ tipsOn: true });
  vi.clearAllMocks();
});

const clans = () => [...document.querySelectorAll<HTMLElement>('.clanPick')];

describe('Menu', () => {
  it('escolhe o território com clique e com Enter', () => {
    render(<Menu />);
    fireEvent.click(clans()[1]);
    expect(MENU.color).toBe(1);
    expect(clans()[1].getAttribute('aria-pressed')).toBe('true');

    fireEvent.keyDown(clans()[3], { key: 'Enter' });
    expect(MENU.color).toBe(3);
    expect(clans()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('escolhe o número de jogadores', () => {
    render(<Menu />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(MENU.n).toBe(2);
    expect(screen.getByRole('button', { name: '2' }).className).toBe('on');
    expect(screen.getByRole('button', { name: '4' }).className).toBe('');
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
    expect(document.getElementById('nameRow')!.classList.contains('hidden')).toBe(true);
  });

  it('com Firebase, entra numa mesa pelo código digitado', () => {
    NET.db = {} as typeof NET.db;
    render(<Menu />);
    fireEvent.change(screen.getByLabelText('Código da mesa'), { target: { value: 'ABCDE' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(joinTable).toHaveBeenCalledWith('ABCDE');
  });
});
