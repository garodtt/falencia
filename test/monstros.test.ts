// Monstros com efeito (Amigo dos Fracos, Vingança do Cemitério) e com passiva de característica.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../src/game/state.ts';
import { execUse, gameLoop, monsterAwake, newState, rewardItems } from '../src/game/engine.ts';
import { kingActive, monCurse, monFx, seenCurse, traitsOf, val } from '../src/game/rules.ts';
import {
  BA,
  CH,
  CHAOS,
  CN,
  MA,
  OC,
  TR,
  VE,
  cardTraits,
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
  G.ideck = Array(20).fill('LUNETA'); // sem Saco de Moedas: cada compra dá exatamente 1 item
  return G;
}
const MON = makeMonsters();
const mon = (v: number) => MON.find((m) => m.v === v)!;
// manda as n primeiras cartas da mão de alguém para o cemitério dele
function bury(pid: number, n: number) {
  S.G.grave[pid].push(...S.G.players[pid].hand.splice(0, n));
}
// um goblin da mão do jogador 0 cujo valor passa no teste
const find0 = (ok: (v: number) => boolean) =>
  mk(0, S.G.players[0].hand.map((g) => g & 31).find(ok)!);

void test('monstros com efeito e com passiva', () => {
  const fx = (k: string) => MON.filter((m) => m.fx === k).map((m) => m.v);
  assert.deepEqual(fx('VINGANCA'), [17, 26, 31, 38]);
  assert.deepEqual(fx('AZARAO'), [13, 18, 21, 32]);
  assert.deepEqual(fx('FRACOS'), [10, 15, 20, 25, 30, 35, 40]);
  assert.deepEqual(
    MON.filter((m) => m.curse).map((m) => [m.v, m.curse]),
    [
      [11, CH],
      [16, BA],
      [22, OC],
      [27, CN],
      [33, MA],
      [37, VE],
    ],
  );
  assert.equal(MON.length, 31);
});

void test('Vingança do Cemitério: na revelação, quem tem o maior cemitério compra 1 item', async () => {
  const G = table();
  bury(0, 2);
  bury(1, 2);
  bury(2, 1);
  G.monster = mon(17);
  G.revealed = true;
  await monsterAwake([G.monster]);
  assert.deepEqual(
    G.players.map((p) => p.items.length),
    [1, 1, 0],
  );
});

void test('monstro sem Vingança não dá item, mesmo com cemitério', async () => {
  const G = table();
  bury(0, 3);
  G.monster = mon(18);
  G.revealed = true;
  await monsterAwake([G.monster]);
  assert.deepEqual(
    G.players.map((p) => p.items.length),
    [0, 0, 0],
  );
});

void test('nas partidas, a Vingança só vem logo depois de um monstro com Vingança acordar', async () => {
  globalThis.SIMQ = true;
  S.setSPEED(0);
  let seen = 0;
  for (let i = 0; i < 8; i++) {
    S.setG(
      newState(
        4,
        [0, 1, 2, 3].map((c) => ({ color: c, bot: true })),
      ),
    );
    await gameLoop();
    const L = S.G.log.map((l) => l.msg);
    L.forEach((msg, j) => {
      if (!msg.startsWith('Vingança do Cemitério:') || j === 0) return;
      seen++;
      assert.match(L[j - 1], /^Efeito do monstro (17|26|31|38): Vingança do Cemitério/);
    });
  }
  assert.ok(seen > 0, 'alguma Vingança aconteceu');
});

void test('a passiva zera os goblins e desliga o rei, só depois que o monstro acorda', () => {
  const G = table();
  const p = G.players[0]; // Rei Quebra-Crânio: Cicatriz, herdada pelos goblins 1 a 5 Vermelhos
  const scar = find0((v) => !!(TR[v] & BA));
  const heir = mk(0, 2); // sem Cicatriz impressa, mas herdada
  const plain = find0((v) => !(cardTraits(mk(0, v)) & BA));
  G.monster = mon(16); // passiva Cicatriz
  G.revealed = false;
  assert.equal(monCurse(), 0);
  assert.equal(val(p, scar), scar & 31);
  assert.equal(kingActive(p), true);
  G.revealed = true;
  assert.equal(monCurse(), BA);
  assert.equal(val(p, scar), 0);
  assert.equal(val(p, plain), plain & 31);
  assert.equal(kingActive(p), false); // o rei tem Cicatriz: desligado
  // a característica herdada continua no goblin: ele vale 0
  assert.equal(traitsOf(p, heir) & BA, BA);
  assert.equal(val(p, heir), 0);
  // a característica do Disfarce conta
  G.rd[0].disg = BA;
  assert.equal(val(p, plain), 0);
});

void test('a característica herdada conta para a passiva, em qualquer mão', () => {
  const G = table();
  const p = G.players[0]; // Vermelho, Rei Quebra-Crânio (Cicatriz)
  G.monster = mon(22); // passiva Monóculo
  G.revealed = true;
  const blue8 = mk(2, 8); // Fedorento · Pereba, herda Monóculo do Rei Olho-de-Vidro
  assert.equal(kingActive(p), true); // o Quebra-Crânio não tem Monóculo
  assert.equal(val(p, blue8), 0);
  assert.equal(val(p, mk(0, 8)), 8); // o 8 Vermelho não tem Monóculo
  p.king = 2; // com o Rei Olho-de-Vidro, desliga; as características dos goblins não mudam
  assert.equal(kingActive(p), false);
  assert.equal(val(p, mk(0, 8)), 8);
});

void test('a passiva é surpresa: só quem usou a Luneta sabe antes', async () => {
  const G = table([['LUNETA'], [], []]);
  G.monster = mon(22); // passiva Monóculo
  G.revealed = false;
  assert.equal(seenCurse(G.players[0]), 0);
  await execUse(G.players[0], 'LUNETA', {});
  assert.equal(G.rd[0].hint.value, 22);
  assert.equal(seenCurse(G.players[0]), OC);
  assert.equal(seenCurse(G.players[1]), 0); // os outros não sabem
  assert.equal(monCurse(), 0); // e ainda não vale
  const g = G.players[0].hand.find((x) => TR[x & 31] & OC)!;
  assert.equal(val(G.players[0], g, seenCurse(G.players[0])), 0);
  assert.equal(val(G.players[0], g), g & 31);
});

void test('a Isca troca a passiva pela do monstro novo', async () => {
  const G = table([['ISCA'], [], []]);
  G.monsters = [mon(12)];
  G.mused = [mon(16), mon(13)];
  G.monster = mon(16);
  G.revealed = true;
  assert.equal(monCurse(), BA);
  await execUse(G.players[0], 'ISCA', {});
  assert.equal(G.monster.v, 12);
  assert.equal(monCurse(), 0);
  // e o contrário: o monstro novo tem passiva
  const G2 = table([['ISCA'], [], []]);
  G2.monsters = [mon(33)];
  G2.mused = [mon(12), mon(13)];
  G2.monster = mon(12);
  G2.revealed = true;
  await execUse(G2.players[0], 'ISCA', {});
  assert.equal(G2.monster.v, 33);
  assert.equal(monCurse(), MA);
});

void test('Monstros Opostos: valem os efeitos e as passivas dos dois', async () => {
  const G = table();
  G.chaos = 'OPOSTOS';
  G.monster = mon(16); // Cicatriz
  G.monster2 = mon(37); // Pereba
  G.revealed = true;
  assert.equal(monCurse(), BA | VE);
  G.monster = mon(17); // Vingança
  G.monster2 = mon(30); // Amigo dos Fracos
  assert.deepEqual(monFx(), ['VINGANCA', 'FRACOS']);
  bury(2, 1);
  await monsterAwake([G.monster, G.monster2]);
  assert.equal(G.players[2].items.length, 1); // a Vingança do 17
  G.players[0].items = ['NAO', 'NAO'];
  await rewardItems([G.players[0]]); // Amigo dos Fracos do 30: compra quem tem menos itens (o 1)
  assert.deepEqual(
    G.players.map((p) => p.items.length),
    [2, 1, 1],
  );
});

void test('o monte de Caos tem 50 cartas e não tem Maldição', () => {
  assert.equal(
    Object.values(CHAOS).reduce((a, c) => a + c[2], 0),
    50,
  );
  assert.ok(!('MALDICAO' in CHAOS));
  assert.equal(CHAOS.MUTANTE[2], 3);
  assert.equal(CHAOS.MINMAX[2], 3);
  const G = table();
  assert.equal(G.cdeck.length + G.cdisc.length + (G.nextChaos ? 1 : 0), 50);
  assert.ok(!(G.cdeck as string[]).includes('MALDICAO'));
});
