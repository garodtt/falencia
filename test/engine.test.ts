// Golden master: partidas só de bots, com sorteio fixo, têm que terminar exatamente no mesmo estado.
// O gabarito (test/golden.json) foi gerado pela versão original, de um arquivo só, e conferido contra ela.
// Mudou uma regra DE PROPÓSITO? Regenere com: UPDATE_GOLDEN=1 npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import * as S from '../src/game/state.ts';
import { gameLoop, newState } from '../src/game/engine.ts';
import type { Player } from '../src/game/types.ts';

const FILE = new URL('./golden.json', import.meta.url);
const UPDATE = !!process.env.UPDATE_GOLDEN;
const golden: Record<string, string> = UPDATE ? {} : JSON.parse(readFileSync(FILE, 'utf8'));
const seeded = (s: number) => () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

async function play(seed: number, n: number, strat: Player['strat']) {
  globalThis.SIMQ = true;
  S.setSPEED(0);
  const r0 = Math.random;
  Math.random = seeded(seed);
  try {
    S.setG(
      newState(
        n,
        Array.from({ length: n }, (_, i) => ({ color: i, bot: true })),
      ),
    );
    S.G.players.forEach((p) => (p.strat = strat));
    await gameLoop();
    return S.G;
  } finally {
    Math.random = r0;
  }
}

for (const strat of [undefined, 'human', 'noitems'] as const)
  for (const n of [2, 3, 4]) {
    void test(`mesmo jogo do gabarito: ${n} jogadores, bots ${strat || 'estrategistas'}`, async () => {
      for (let seed = 1; seed <= 6; seed++) {
        const key = `${strat || 'smart'}-${n}-${seed}`,
          G = await play(seed * 7919 + n, n, strat);
        assert.ok(G.over && G.round > 1, 'a partida terminou');
        const h = createHash('sha256').update(JSON.stringify(G)).digest('hex');
        if (UPDATE) golden[key] = h;
        else assert.equal(h, golden[key], `${key}: estado final diferente do gabarito`);
      }
    });
  }
if (UPDATE) process.on('exit', () => writeFileSync(FILE, JSON.stringify(golden, null, 1) + '\n'));
