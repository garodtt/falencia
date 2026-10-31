// Cenários da mesa: uma partida de verdade (motor, bots e regras reais) com sorteio fixo, avançada
// rápido e sem animação até chegar no momento pedido. Ali ela para e continua jogável normalmente.
import { CHAOS, CLAN, KINGS } from '../game/data.ts';
import type { ChaosKey } from '../game/data.ts';
import { botDecide } from '../game/bots.ts';
import { gameLoop, newState, resolvePrompt } from '../game/engine.ts';
import { G, ME, alivePl, hooks, log, setG, setME, setMODE, setSPEED } from '../game/state.ts';
import type { PromptKind } from '../game/types.ts';
import { render, show } from '../app/render.ts';
import { TIPS } from '../app/tips.ts';

export interface Cena {
  id: string;
  nome: string;
  desc: string;
  chegou: () => boolean; // a partida já está no momento que a cena quer mostrar?
}

const me = () => G.players[ME];
const asking = (k: PromptKind) => G.pend[ME]?.kind === k;

export const CENAS: Cena[] = [
  {
    id: 'escolher',
    nome: 'Escolhendo goblins',
    desc: 'Início: mão cheia, monstro dormindo, sua vez de jogar.',
    chegou: () => asking('select'),
  },
  {
    id: 'meio',
    nome: 'Meio de jogo',
    desc: 'Rodada 6+: cemitérios, itens na mão e mãos de tamanhos diferentes.',
    chegou: () => asking('select') && G.round >= 6,
  },
  {
    id: 'janela',
    nome: 'Janela de itens',
    desc: 'Monstro acordado, você tem item na mão e pode usar ou passar.',
    chegou: () => asking('window') && me().items.length > 0,
  },
  {
    id: 'roubar',
    nome: 'Cravou: de quem roubar',
    desc: 'Você acertou em cheio e escolhe o alvo do roubo.',
    chegou: () => asking('steal'),
  },
  {
    id: 'eliminar',
    nome: 'Mais perto: quem eliminar',
    desc: 'Você venceu por aproximação e escolhe quem perde uma carta.',
    chegou: () => asking('elim'),
  },
  {
    id: 'comprar',
    nome: 'Comprar item',
    desc: 'Você venceu e precisa clicar no monte de itens.',
    chegou: () => asking('draw'),
  },
  {
    id: 'pergunta',
    nome: 'Pergunta do jogo',
    desc: 'Um modal do motor (Mercadora, NÃO!, Armadilha, limite de itens...).',
    chegou: () => asking('ask'),
  },
  {
    id: 'revelar-caos',
    nome: 'Revelar o Caos',
    desc: 'Fim da rodada: você vira a carta de Caos da próxima.',
    chegou: () => asking('chaos'),
  },
  {
    id: 'resultado',
    nome: 'Resultado da rodada',
    desc: 'Todas as jogadas abertas, quem venceu e o botão de próxima rodada.',
    chegou: () => asking('next'),
  },
  {
    id: 'falido',
    nome: 'Você faliu',
    desc: 'Sem cartas na mão; os bots continuam jogando.',
    chegou: () => !me().alive && alivePl().filter((p) => p.hand.length).length >= 2,
  },
  { id: 'fim', nome: 'Fim de jogo', desc: 'A partida acabou.', chegou: () => !!G.over },
];

export const CAOS = Object.keys(CHAOS) as ChaosKey[];

// o mesmo sorteio dos testes de partida (test/engine.test.ts): mesma semente, mesma partida
const seeded = (s: number) => () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export interface Pedido {
  cena: Cena;
  n: number; // jogadores
  caos?: ChaosKey; // Caos em todas as rodadas a partir da 2ª
  seed: number;
}

// roda partidas (semente seed, seed+1...) até uma chegar no momento da cena; devolve a semente
// que deu certo, ou null se nenhuma chegou
export async function montar({ cena, n, caos, seed }: Pedido, tentativas = 25) {
  const r0 = Math.random,
    real = { ...hooks };
  globalThis.SIMQ = true; // sem as pausas dos bots
  setSPEED(0);
  TIPS.on = false;
  hooks.playFx = async () => {};
  hooks.tip = () => {};
  try {
    for (let s = seed; s < seed + tentativas; s++) {
      const ok = await partida(s);
      if (ok) return s;
    }
    return null;
  } finally {
    Math.random = r0;
    globalThis.SIMQ = false;
    setSPEED(1);
    Object.assign(hooks, real);
  }

  // uma partida com a semente s; resolve true quando chegou na cena, false se acabou antes
  function partida(s: number) {
    Math.random = seeded(s);
    setMODE('local');
    setME(0);
    setG(
      newState(
        n,
        Array.from({ length: n }, (_, i) => ({ color: i, bot: i > 0 })),
      ),
    );
    if (caos) G.cdeck = Array.from({ length: 50 }, () => caos);
    log(`Sandbox: cena "${cena.nome}", semente ${s}.`, 'rh');
    log(`Você é o território ${CLAN[0]}, com ${KINGS[0].name}.`);
    const quer = () => cena.chegou() && (!caos || G.chaos === caos);
    return new Promise<boolean>((done) => {
      let chegou = false;
      // a cada mudança o motor chama sync: ou paramos aqui, ou respondemos como um bot
      hooks.sync = () => {
        if (chegou) return;
        if (quer()) {
          chegou = true;
          done(true);
          return;
        }
        const pe = G.pend[ME];
        if (pe) queueMicrotask(() => resolvePrompt(ME, pe.nonce, botDecide(ME, pe.kind, pe.data)));
      };
      void gameLoop().then(() => {
        if (!chegou) done(quer());
      });
    });
  }
}

// liga a partida montada na tela, com animações e dicas como no jogo normal
export function mostrar() {
  show('game');
  render();
}
