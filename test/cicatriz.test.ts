// Cicatrizes Compartilhadas: troca um goblin com Cicatriz da mão por um com Cicatriz de qualquer cemitério.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../src/game/state.ts';
import { execUse, newState } from '../src/game/engine.ts';
import { canUse } from '../src/game/rules.ts';
import { BA, ITEMS, cardTraits, mk } from '../src/game/data.ts';
import type { ItemKey } from '../src/game/data.ts';

// mesa com 3 bots já no meio de uma rodada; cada um começa com os 20 goblins da sua cor
function table(items: ItemKey[][]) {
  globalThis.SIMQ = true;
  S.setSPEED(0);
  S.setG(
    newState(
      3,
      [0, 1, 2].map((i) => ({ color: i, bot: true })),
    ),
  );
  const G = S.G;
  G.rd = G.players.map(() => ({
    gs: [],
    delta: 0,
    armed: [],
    band: -1,
    disg: 0,
    tambor: false,
    hint: { value: -1, par: 0, t1: null },
    note: '',
  }));
  G.players.forEach((p, i) => (p.items = items[i].slice()));
  return G;
}
// manda um goblin da mão de alguém para o cemitério dele
function bury(pid: number, g: number) {
  const p = S.G.players[pid];
  p.hand.splice(p.hand.indexOf(g), 1);
  S.G.grave[pid].push(g);
}

void test('troca básica com o próprio cemitério', async () => {
  const G = table([['CICATRIZ'], [], []]);
  const p = G.players[0];
  bury(0, mk(0, 14));
  await execUse(p, 'CICATRIZ', { g: mk(0, 3), g2: mk(0, 14), target: 0 });
  assert.ok(p.hand.includes(mk(0, 14)) && !p.hand.includes(mk(0, 3)));
  assert.deepEqual(G.grave[0], [mk(0, 3)]);
  assert.equal(p.hand.length, 19); // 20 − 1 enterrado antes; a troca não muda o tamanho
  assert.deepEqual(p.items, []);
  assert.ok(G.idisc.includes('CICATRIZ'));
});

void test('troca com o cemitério de outro jogador: o goblin mantém a cor', async () => {
  const G = table([['CICATRIZ'], [], []]);
  const p = G.players[0];
  bury(1, mk(1, 15));
  await execUse(p, 'CICATRIZ', { g: mk(0, 5), g2: mk(1, 15), target: 1 });
  assert.ok(p.hand.includes(mk(1, 15)));
  assert.deepEqual(G.grave[1], []);
  assert.deepEqual(G.grave[0], [mk(0, 5)]);
  assert.equal(p.hand.length, 20);
});

void test('vale o cemitério de quem já faliu', async () => {
  const G = table([['CICATRIZ'], [], []]);
  bury(2, mk(2, 12));
  G.players[2].alive = false;
  await execUse(G.players[0], 'CICATRIZ', { g: mk(0, 6), g2: mk(2, 12), target: 2 });
  assert.ok(G.players[0].hand.includes(mk(2, 12)));
});

void test('não deixa pegar de volta o goblin que acabou de ir para o cemitério', async () => {
  const G = table([['CICATRIZ'], [], []]);
  const p = G.players[0];
  bury(1, mk(1, 9));
  await execUse(p, 'CICATRIZ', { g: mk(0, 3), g2: mk(0, 3), target: 0 });
  assert.ok(p.hand.includes(mk(0, 3)));
  assert.deepEqual(G.grave[0], []);
  assert.deepEqual(p.items, ['CICATRIZ']);
});

void test('canUse é falso sem Cicatriz na mão', () => {
  const G = table([['CICATRIZ'], [], []]);
  const p = G.players[0];
  bury(1, mk(1, 9));
  assert.equal(canUse(p, 'CICATRIZ', 'select'), true);
  p.hand = p.hand.filter((g) => !(cardTraits(g) & BA));
  assert.equal(canUse(p, 'CICATRIZ', 'select'), false);
});

void test('canUse é falso sem Cicatriz em nenhum cemitério', () => {
  const G = table([['CICATRIZ'], [], []]);
  bury(1, mk(1, 2)); // o 2 não tem Cicatriz
  assert.equal(canUse(G.players[0], 'CICATRIZ', 'select'), false);
});

void test('canUse é falso com menos de 2 cartas na mão e no Necromante', () => {
  const G = table([['CICATRIZ'], [], []]);
  const p = G.players[0];
  bury(1, mk(1, 9));
  p.hand = [mk(0, 3)];
  assert.equal(canUse(p, 'CICATRIZ', 'select'), false);
  p.hand = [mk(0, 3), mk(0, 4)];
  assert.equal(canUse(p, 'CICATRIZ', 'select'), true);
  G.chaos = 'NECRO';
  assert.equal(canUse(p, 'CICATRIZ', 'select'), false);
});

void test('a Cicatriz herdada conta (1 a 5 Vermelhos, em qualquer mão); o Disfarce não', async () => {
  const G = table([['CICATRIZ'], ['CICATRIZ'], []]);
  const [p, o] = G.players;
  bury(2, mk(2, 2)); // o 2 Azul não tem Cicatriz (os Azuis herdam Monóculo)
  bury(2, mk(2, 9));
  await execUse(p, 'CICATRIZ', { g: mk(0, 8), g2: mk(2, 9), target: 2 }); // o 8 não tem Cicatriz
  assert.deepEqual(p.items, ['CICATRIZ']);
  G.rd[0].disg = BA; // o Disfarce vale só para goblins jogados
  await execUse(p, 'CICATRIZ', { g: mk(0, 8), g2: mk(2, 9), target: 2 });
  assert.deepEqual(p.items, ['CICATRIZ']);
  await execUse(p, 'CICATRIZ', { g: mk(0, 2), g2: mk(2, 2), target: 2 });
  assert.deepEqual(p.items, ['CICATRIZ']); // o 2 Azul não serve
  // o 4 Vermelho herda Cicatriz do Rei Quebra-Crânio
  await execUse(p, 'CICATRIZ', { g: mk(0, 4), g2: mk(2, 9), target: 2 });
  assert.ok(!p.hand.includes(mk(0, 4)) && p.hand.includes(mk(2, 9)));
  // na mão do Verde, o 4 Vermelho continua com Cicatriz
  o.hand.push(mk(0, 4));
  G.grave[0].splice(G.grave[0].indexOf(mk(0, 4)), 1);
  bury(2, mk(2, 12));
  await execUse(o, 'CICATRIZ', { g: mk(0, 4), g2: mk(2, 12), target: 2 });
  assert.ok(o.hand.includes(mk(2, 12)));
});

void test('não dispara a Armadilha de quem perdeu o goblin do cemitério', async () => {
  const G = table([['CICATRIZ'], ['ARMADILHA'], []]);
  const [p, o] = G.players;
  bury(1, mk(1, 15));
  await execUse(p, 'CICATRIZ', { g: mk(0, 3), g2: mk(1, 15), target: 1 });
  assert.deepEqual(o.items, ['ARMADILHA']);
  assert.equal(p.hand.length, 20);
  assert.deepEqual(G.grave[0], [mk(0, 3)]);
});

void test('Cicatrizes Compartilhadas tem 2 cópias no monte', () => {
  assert.equal(ITEMS.CICATRIZ[3], 2);
  assert.equal(table([[], [], []]).ideck.filter((k) => k === 'CICATRIZ').length, 2);
});
