// Armadilha como reação: dispara quando tiram uma carta da sua mão, e o NÃO! pode cancelar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../src/game/state.ts';
import { execUse, newState, prompt, resolvePrompt, takeCard } from '../src/game/engine.ts';
import { canUse, targetsFor } from '../src/game/rules.ts';
import type { ItemKey } from '../src/game/data.ts';

// mesa com 3 bots já no meio de uma rodada; quem joga é o 0, a vítima é o 1
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
const sizes = () => S.G.players.map((p) => p.hand.length);

void test('a Armadilha vale: quem roubou perde 1 carta para o próprio cemitério', async () => {
  const G = table([[], ['ARMADILHA'], []]);
  const [a, v] = G.players;
  await takeCard(a, v, 'steal');
  assert.deepEqual(sizes(), [20, 19, 20]); // +1 do roubo, −1 da Armadilha
  assert.equal(G.grave[a.id].length, 1);
  assert.equal(G.grave[v.id].length, 0);
  assert.deepEqual(v.items, []);
  assert.deepEqual(G.rd[v.id].used, [{ k: 'ARMADILHA' }]);
  assert.ok(G.idisc.includes('ARMADILHA'));
});

void test('na eliminação também dispara', async () => {
  const G = table([[], ['ARMADILHA'], []]);
  const [a, v] = G.players;
  await takeCard(a, v, 'elim');
  assert.deepEqual(sizes(), [19, 19, 20]);
  assert.equal(G.grave[a.id].length, 1);
  assert.equal(G.grave[v.id].length, 1);
});

void test('o NÃO! de quem atacou cancela a Armadilha (e ela vai para o descarte)', async () => {
  const G = table([['NAO'], ['ARMADILHA'], []]);
  const [a, v] = G.players;
  await takeCard(a, v, 'steal');
  assert.deepEqual(sizes(), [21, 19, 20]);
  assert.equal(G.grave[a.id].length, 0);
  assert.deepEqual(v.items, []);
  assert.deepEqual(a.items, []);
  assert.deepEqual(G.rd[v.id].used, [{ k: 'ARMADILHA', x: 1 }]);
  assert.ok(G.idisc.includes('ARMADILHA') && G.idisc.includes('NAO'));
});

void test('NÃO! respondido com NÃO!: a Armadilha vale', async () => {
  const G = table([['NAO'], ['ARMADILHA', 'NAO'], []]);
  const [a, v] = G.players;
  await takeCard(a, v, 'steal');
  assert.deepEqual(sizes(), [20, 19, 20]);
  assert.deepEqual(a.items, []);
  assert.deepEqual(v.items, []);
  assert.deepEqual(G.rd[v.id].used, [{ k: 'NAO' }, { k: 'ARMADILHA' }]);
});

void test('quem não está na briga não gasta NÃO! na Armadilha', async () => {
  const G = table([[], ['ARMADILHA'], ['NAO']]);
  const [a, v, o] = G.players;
  await takeCard(a, v, 'steal');
  assert.deepEqual(o.items, ['NAO']);
  assert.equal(G.grave[a.id].length, 1);
});

void test('uma Armadilha por carta tirada', async () => {
  const G = table([[], ['ARMADILHA', 'ARMADILHA'], []]);
  const [a, v] = G.players;
  for (let i = 0; i < 3; i++) await takeCard(a, v, 'steal');
  assert.deepEqual(sizes(), [21, 17, 20]); // +3 roubadas, −2 das Armadilhas
  assert.equal(G.grave[a.id].length, 2);
  assert.deepEqual(v.items, []);
});

void test('o Sacrifício dispara a Armadilha', async () => {
  const G = table([['SACRIFICIO'], ['ARMADILHA'], []]);
  const [a, v] = G.players;
  await execUse(a, 'SACRIFICIO', { target: v.id, g: a.hand[0] });
  assert.deepEqual(sizes(), [19, 19, 20]); // −1 do Sacrifício, +1 pego, −1 da Armadilha
  assert.equal(G.grave[a.id].length, 2);
  assert.deepEqual(v.items, []);
});

void test('Ladrão de Túmulos e Mão Leve não disparam a Armadilha', async () => {
  const G = table([['LADRAO', 'MAO_LEVE'], ['ARMADILHA', 'PORRETE'], []]);
  const [a, v] = G.players;
  G.grave[v.id].push(v.hand.pop()!);
  await execUse(a, 'LADRAO', { target: v.id });
  v.items = ['PORRETE', 'ARMADILHA'];
  await execUse(a, 'MAO_LEVE', { target: v.id });
  assert.equal(G.grave[a.id].length, 0);
  assert.equal(a.hand.length, 21);
  assert.equal(v.items.length, 1);
});

void test('com Escudo de Panela ninguém é alvo, então a Armadilha não dispara', () => {
  const G = table([[], ['ARMADILHA'], []]);
  const [a, v] = G.players;
  G.rd[v.id].armed.push('ESCUDO');
  assert.ok(!targetsFor(a).includes(v));
});

void test('a Armadilha não tem botão na janela de itens', () => {
  const G = table([[], ['ARMADILHA'], []]);
  G.rd[1].gs = [G.players[1].hand[0]];
  assert.equal(canUse(G.players[1], 'ARMADILHA', 'window'), false);
});

void test('a pergunta da Armadilha entra na frente da escolha de goblins, que volta depois', async () => {
  const G = table([[], ['ARMADILHA'], []]);
  const [a, v] = G.players;
  v.bot = false;
  const sel = prompt(v.id, 'select');
  const selNonce = G.pend[v.id].nonce;
  const tk = takeCard(a, v, 'steal');
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(G.pend[v.id].kind, 'ask');
  assert.equal(G.pend[v.id].data.title, 'Usar Armadilha?');
  resolvePrompt(v.id, G.pend[v.id].nonce, { value: 1 });
  await tk;
  assert.equal(G.pend[v.id].kind, 'select');
  assert.equal(G.pend[v.id].nonce, selNonce);
  assert.equal(G.grave[a.id].length, 1);
  resolvePrompt(v.id, selNonce, { pass: 1 });
  assert.deepEqual(await sel, { pass: 1 });
});
