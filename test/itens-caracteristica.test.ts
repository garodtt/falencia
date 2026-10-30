// Itens de característica: ajuste fixo na soma, só com goblin jogado que tenha a característica.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../src/game/state.ts';
import { execUse, newState } from '../src/game/engine.ts';
import { canUse, itemOptions, traitsOf } from '../src/game/rules.ts';
import { BA, CH, CN, ITEMS, MA, OC, TR, VE, mk } from '../src/game/data.ts';
import type { Gob, ItemKey } from '../src/game/data.ts';

// mesa com 3 bots já na janela de itens; cada um começa com os 20 goblins da sua cor
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
// goblins da mão de pid que têm (ou não têm) a característica para ele, já contando o rei
function gobs(pid: number, t: number, has = true): Gob[] {
  const p = S.G.players[pid];
  return p.hand.filter((g) => !!(traitsOf(p, g) & t) === has);
}
function play(pid: number, gs: Gob[]) {
  S.G.rd[pid].gs = gs;
}

// de 1 até o limite, com o sinal do item (Chapéu: +1, +2; Machucado: −1, −2, −3)
const upTo = (d: number) => Array.from({ length: Math.abs(d) }, (_, i) => Math.sign(d) * (i + 1));
const FIXED: [ItemKey, number, number][] = [
  ['CHAPEU', CH, 2],
  ['NARIZ', CN, 3],
  ['POMADA', VE, -2],
  ['MACHUCADO', BA, -3],
];

for (const [k, t, d] of FIXED) {
  void test(`${ITEMS[k][0]}: até ${d > 0 ? '+' : ''}${d} uma vez, basta 1 goblin`, async () => {
    const G = table([[k], [], []]);
    const p = G.players[1]; // Rainha Musgo-Podre
    p.items = [k];
    play(1, gobs(1, t).slice(0, 1));
    assert.deepEqual(
      itemOptions(p, k).map((o) => o.d),
      upTo(d),
    );
    play(1, gobs(1, t).slice(0, 3)); // mais goblins não aumentam o limite
    assert.deepEqual(
      itemOptions(p, k).map((o) => o.d),
      upTo(d),
    );
    assert.equal(canUse(p, k, 'window'), true);
    await execUse(p, k, { d: d + Math.sign(d) }); // passar do limite não vale
    assert.equal(G.rd[1].delta, 0);
    await execUse(p, k, { d: Math.sign(d) }); // dá para usar menos que o limite
    assert.equal(G.rd[1].delta, Math.sign(d));
    assert.deepEqual(p.items, []);
  });
  void test(`${ITEMS[k][0]}: sem a característica não pode ser usado`, async () => {
    const G = table([[], [k], []]);
    const p = G.players[1];
    play(1, gobs(1, t, false).slice(0, 3));
    assert.deepEqual(itemOptions(p, k), []);
    assert.equal(canUse(p, k, 'window'), false);
    await execUse(p, k, { d }); // não vale nem forçando
    assert.equal(G.rd[1].delta, 0);
    assert.deepEqual(p.items, [k]);
  });
}

for (const [k, t, d] of [
  ['OCULOS', OC, 1],
  ['POCAO', MA, -1],
] as [ItemKey, number, number][]) {
  void test(`${ITEMS[k][0]}: ${d > 0 ? '+' : ''}${d} por goblin, com 1, 2 e 3`, async () => {
    const G = table([[k], [], []]);
    const p = G.players[0]; // Rei Quebra-Crânio não empresta Monóculo nem Maluco
    for (const n of [1, 2, 3]) {
      play(0, [...gobs(0, t).slice(0, n), ...gobs(0, t, false).slice(0, 3 - n)]);
      assert.deepEqual(
        itemOptions(p, k).map((o) => o.d),
        [d * n],
      );
    }
    await execUse(p, k, { d: d * 3 });
    assert.equal(G.rd[0].delta, d * 3);
  });
  void test(`${ITEMS[k][0]}: sem a característica não pode ser usado`, () => {
    const G = table([[k], [], []]);
    play(0, gobs(0, t, false).slice(0, 3));
    assert.deepEqual(itemOptions(G.players[0], k), []);
    assert.equal(canUse(G.players[0], k, 'window'), false);
  });
}

void test('Monóculo Polido com Tambor de Guerra e 4 goblins de Monóculo: +4', () => {
  const G = table([['OCULOS'], [], []]);
  G.rd[0].tambor = true;
  const g4 = [0, 1, 2]
    .flatMap((c) => Array.from({ length: 20 }, (_, i) => mk(c, i + 1)))
    .filter((g) => TR[g & 31] & OC)
    .slice(0, 4);
  assert.equal(g4.length, 4);
  play(0, g4);
  assert.deepEqual(itemOptions(G.players[0], 'OCULOS'), [{ d: 4, label: '+4' }]);
});

void test('a Poção Maluca não tem mais dobro nem metade', () => {
  const G = table([['POCAO'], [], []]);
  play(0, gobs(0, MA).slice(0, 1));
  assert.deepEqual(itemOptions(G.players[0], 'POCAO'), [{ d: -1, label: '−1' }]);
});

void test('característica herdada vale em qualquer mão (Machucado com o 2 Vermelho)', () => {
  const G = table([[], ['MACHUCADO'], []]);
  const p = G.players[1]; // Verde, com a Rainha Musgo-Podre
  assert.equal(TR[2] & BA, 0); // o 2 não tem Cicatriz impressa
  play(1, [mk(1, 2)]); // o 2 Verde não herda Cicatriz
  assert.deepEqual(itemOptions(p, 'MACHUCADO'), []);
  play(1, [mk(0, 2)]); // o 2 Vermelho herda Cicatriz do Rei Quebra-Crânio
  assert.deepEqual(
    itemOptions(p, 'MACHUCADO').map((o) => o.d),
    [-1, -2, -3],
  );
  p.king = 0; // a Coroa Trocada não muda as características herdadas
  play(1, [mk(1, 2)]);
  assert.deepEqual(itemOptions(p, 'MACHUCADO'), []);
});

void test('característica do Disfarce vale (Nariz de Ferro)', () => {
  const G = table([['NARIZ'], [], []]);
  play(0, gobs(0, CN, false).slice(0, 2));
  assert.deepEqual(itemOptions(G.players[0], 'NARIZ'), []);
  G.rd[0].disg = CN;
  assert.deepEqual(
    itemOptions(G.players[0], 'NARIZ').map((o) => o.d),
    [1, 2, 3],
  );
});

void test('o monte de itens tem 62 cartas (60 + Cicatrizes Compartilhadas)', () => {
  const total = Object.values(ITEMS).reduce((a, v) => a + v[3], 0);
  assert.equal(total, 62);
  assert.equal(ITEMS.NAO[3], 4);
  assert.equal(ITEMS.PORRETE[3], 3);
  assert.equal(ITEMS.PE_CABRA[3], 3);
  assert.equal(ITEMS.CICATRIZ[3], 2);
  for (const k of ['AJUSTE', 'CHINELO', 'GRITO', 'OCULOS', 'NARIZ', 'POCAO', 'MACHUCADO'] as const)
    assert.equal(ITEMS[k][3], 2, k);
  assert.equal(table([[], [], []]).ideck.length, 62);
});
