import { describe, expect, it, vi } from 'vite-plus/test';
import { G, ME } from '../game/state.ts';
import { CENAS, montar } from './scenes.ts';

vi.mock('../net/firebase.ts', () => ({ fb: null }));

// se uma regra mudar e uma cena deixar de acontecer, o sandbox mostraria "nenhuma partida chegou"
describe('cenários do sandbox', () => {
  for (const cena of CENAS)
    it(`chega em "${cena.nome}"`, async () => {
      const seed = await montar({ cena, n: 4, seed: 1 });
      expect(seed).not.toBeNull();
      expect(cena.chegou()).toBe(true);
    });

  it('com Caos forçado, a cena acontece numa rodada com esse Caos', async () => {
    await montar({ cena: CENAS[0], n: 4, caos: 'NECRO', seed: 1 });
    expect(G.chaos).toBe('NECRO');
    expect(G.pend[ME]?.kind).toBe('select');
  });
});
