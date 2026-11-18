// Regras da v7: características herdadas, Lente de Vidro, Monstros Opostos e Monstro Mutante.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../src/game/state.ts';
import { execUse, gameLoop, newState } from '../src/game/engine.ts';
import {
  drawMonster,
  margin,
  monCurse,
  seenCurse,
  standing,
  topMonster,
} from '../src/game/rules.ts';
import {
  BA,
  CLAN,
  CH,
  CN,
  KINGS,
  MA,
  MFX,
  OC,
  TERR,
  TR,
  TRAITS,
  VE,
  cardTraits,
  crownOf,
  makeMonsters,
  mk,
} from '../src/game/data.ts';
import type { ItemKey } from '../src/game/data.ts';

// mesa com 3 bots já no meio de uma rodada; cada um começa com os 20 goblins da sua cor
function table(items: ItemKey[][] = [[], [], []]) {
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
const MON = makeMonsters();
const mon = (v: number) => MON.find((m) => m.v === v)!;

void test('goblins: 2 características impressas, iguais em n e 21 − n', () => {
  for (let v = 1; v <= 20; v++) {
    assert.equal([1, 2, 4, 8, 16, 32].filter((t) => TR[v] & t).length, 2, `goblin ${v}`);
    assert.equal(TR[v], TR[21 - v]);
  }
  assert.equal(TR[8], MA | VE); // Maluco · Pereba
});

void test('5 goblins de cada cor herdam a característica do rei ou rainha', () => {
  // [cor, característica, de, até]: Vermelho Cicatriz 1–5, Verde Fedorento 11–15, Azul Monóculo
  // 6–10, Amarelo Maluco 16–20
  const want = [
    [0, BA, 1, 5],
    [1, CN, 11, 15],
    [2, OC, 6, 10],
    [3, MA, 16, 20],
  ];
  for (const [c, t, lo, hi] of want) {
    assert.equal(KINGS[c].tr, t);
    for (let v = 1; v <= 20; v++) {
      const g = mk(c, v),
        heir = v >= lo && v <= hi;
      assert.equal(crownOf(g), heir ? t : 0, `${c}/${v}`);
      if (heir) assert.equal(TR[v] & t, 0, 'nunca herda uma característica que já tem impressa');
      assert.equal(cardTraits(g), TR[v] | (heir ? t : 0));
    }
  }
  assert.equal(cardTraits(mk(2, 8)), OC | MA | VE); // o 8 Azul: Maluco · Pereba e herda Monóculo
});

void test('organização dos goblins: vale nas 4 cores e nos 20 goblins', () => {
  for (const [c, k] of KINGS.entries()) {
    const gobs = Array.from({ length: 20 }, (_, i) => mk(c, i + 1));
    for (const g of gobs) {
      const v = g & 31,
        heir = v >= k.heirs[0] && v <= k.heirs[1],
        total = TRAITS.filter((t) => cardTraits(g) & t).length;
      assert.equal(TRAITS.filter((t) => TR[v] & t).length, 2, `${c}/${v}: 2 impressas`);
      if (heir) assert.equal(TR[v] & k.tr, 0, `${c}/${v}: a herdada não vem impressa`);
      assert.equal(total, heir ? 3 : 2, `${c}/${v}`);
    }
    for (const t of TRAITS) {
      const base = t === CH || t === VE ? 8 : 6;
      assert.equal(
        gobs.filter((g) => cardTraits(g) & t).length,
        t === k.tr ? base + 5 : base,
        `cor ${c}, característica ${t}`,
      );
    }
  }
});

void test('Lente de Vidro: margem ±1 sempre, ±2 com monstro Azul', () => {
  const G = table();
  const p = G.players[0];
  p.king = 2; // Rei Zoio de Vidro
  const red = [mk(0, 5)];
  G.monster = mon(11); // Verde: nenhum goblin jogado é desse território
  assert.equal(margin(p, red), 1);
  G.monster = mon(12); // Azul
  assert.equal(margin(p, red), 2);
  p.king = 0;
  G.monster = mon(11);
  assert.equal(margin(p, red), 0);
  G.chaos = 'INVERSO'; // sem margem no Mundo Invertido
  p.king = 2;
  assert.equal(margin(p, red), 0);
});

void test('Monstros Opostos: acertar um dos dois em cheio é cravada', () => {
  const G = table();
  G.chaos = 'OPOSTOS';
  G.order = [0, 1, 2];
  G.monster = mon(14);
  G.monster2 = mon(36);
  G.revealed = true;
  G.rd[0].gs = [mk(1, 20), mk(1, 16)]; // 36, o 2º monstro (sem margem de território)
  G.rd[1].gs = [mk(1, 13)];
  const R = standing();
  assert.equal(R.kind, 'exact');
  assert.deepEqual(
    R.w.map((p) => p.id),
    [0],
  );
});

void test('Monstros Opostos: os dois saem do topo do monte; a Luneta e a Isca escolhem um', async () => {
  const G = table([['LUNETA', 'ISCA'], [], []]);
  G.chaos = 'OPOSTOS';
  G.monsters = [mon(40), mon(39), mon(12), mon(33)];
  G.mused = [];
  G.monster = drawMonster();
  G.monster2 = drawMonster();
  assert.deepEqual([G.monster.v, G.monster2.v], [33, 12]);
  await execUse(G.players[0], 'LUNETA', { m: 1 });
  assert.equal(G.rd[0].hint.value, 12);
  assert.equal(seenCurse(G.players[0]), 0);
  G.rd[0].hint = { value: -1, par: 0, t1: null };
  G.players[0].items.push('LUNETA');
  await execUse(G.players[0], 'LUNETA', { m: 0 });
  assert.equal(seenCurse(G.players[0]), MA); // o 33 tem passiva Maluco
  G.revealed = true;
  assert.equal(monCurse(), MA);
  await execUse(G.players[0], 'ISCA', { m: 0 }); // troca o 33, o 12 fica
  assert.equal(G.monster2.v, 12);
  assert.equal(G.monster.v, 39);
  assert.equal(monCurse(), 0);
});

void test('Monstro Mutante: vira a carta do topo sem tirar do monte', () => {
  const G = table();
  G.monsters = [mon(10), mon(21)];
  G.mused = [];
  assert.equal(topMonster().v, 21);
  assert.equal(G.monsters.length, 2);
});

void test('cravada rouba sempre 2 cartas (1 com Monstros Opostos), sem exceção pela mão menor', async () => {
  for (let i = 0; i < 40; i++) {
    table();
    S.G.players.forEach((p) => (p.strat = 'noitems'));
    await gameLoop();
    for (const { msg } of S.G.log) assert.doesNotMatch(msg, /rouba 4 cartas/);
  }
  assert.deepEqual(Object.keys(MFX).sort(), ['FRACOS', 'VINGANCA']);
});

void test('todo goblin tem 2 impressas e os herdeiros nunca têm a herdada impressa', () => {
  const bits = (t: number) => TRAITS.filter((x) => t & x).length;
  for (let c = 0; c < 4; c++)
    for (let v = 1; v <= 20; v++) {
      const g = mk(c, v),
        k = KINGS[c];
      assert.equal(bits(TR[v]), 2, `goblin ${v} ${CLAN[c]} com 2 impressas`);
      if (v >= k.heirs[0] && v <= k.heirs[1]) {
        assert.equal(TR[v] & k.tr, 0, `goblin ${v} ${CLAN[c]} não tem a herdada impressa`);
        assert.equal(bits(cardTraits(g)), 3, `goblin ${v} ${CLAN[c]} fica com 3`);
      } else assert.equal(cardTraits(g), TR[v]);
    }
});

void test('reis, rainhas e territórios da v7', () => {
  assert.deepEqual(
    KINGS.map((k) => [k.name, k.tr, k.heirs]),
    [
      ['Rei Quebra Kranio', BA, [1, 5]],
      ['Rainha Bruxa Fidida', CN, [11, 15]],
      ['Rei Zoio de Vidro', OC, [6, 10]],
      ["Rainha Den' de Oro", MA, [16, 20]],
    ],
  );
  assert.deepEqual(TERR, [
    'Zangadolandia',
    'Cemitério Fedorento',
    'Terras da Tramoia',
    'Porto Inseguro',
  ]);
});
