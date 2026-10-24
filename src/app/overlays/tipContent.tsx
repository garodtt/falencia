// O texto de cada dica e para onde ela aponta.
import type { ReactNode } from 'react';

// target: seletor do que destacar (null = bolha no meio da tela)
export const TIP: Record<string, { target: string | null; title: string; text: ReactNode }> = {
  start: {
    target: null,
    title: 'Bem-vindo à toca',
    text: (
      <>
        Você começa com seus 20 goblins. A cada rodada aparece um monstro de 10 a 40. Jogue até 3
        goblins: <b>quem cravar o valor rouba 2 cartas</b>; se ninguém cravar,{' '}
        <b>quem chegar mais perto (para cima ou para baixo) elimina 1 carta</b> de um rival. Quem
        perde descarta as cartas jogadas. O último com cartas vence.
      </>
    ),
  },
  king: {
    target: '#myKing',
    title: 'Seu rei ou rainha',
    text: 'Cada território tem um rei ou rainha com uma habilidade. Ele empresta as características dele a um grupo de goblins (marcados com uma coroa). Toque no cartão para ler a habilidade.',
  },
  select: {
    target: '#hand',
    title: 'Monstro dormindo',
    text: (
      <>
        Clique em até 3 goblins: a soma é o seu palpite. Se algum goblin for do território do
        monstro (bolinhas coloridas na carta do monstro), você ganha margem de ±1. Itens com a lua
        podem ser usados agora. Depois clique em <b>Jogar</b>.
      </>
    ),
  },
  window: {
    target: '#trayBox',
    title: 'Monstro acordado',
    text: 'O monstro acordou. Agora valem os itens com o sol, para todos ao mesmo tempo e sem ordem. Se alguém usar um item, quem tiver NÃO! pode cancelar, e o outro pode responder com outro NÃO!. A janela só fecha quando todos passarem.',
  },
  steal: {
    target: '#actionBar',
    title: 'Cravou',
    text: 'Clique nos rivais para roubar cartas às cegas: pode ser 1 de cada ou 2 do mesmo.',
  },
  elim: {
    target: '#actionBar',
    title: 'Venceu por aproximação',
    text: 'Clique num rival para eliminar, às cegas, 1 carta da mão dele. Ela vai para o cemitério dele.',
  },
  draw: {
    target: '#itemDeck',
    title: 'Compre seu item',
    text: 'Todo vencedor compra 1 item. Clique no monte de itens.',
  },
  chaos: {
    target: '#chaosDeck',
    title: 'Carta de Caos',
    text: 'No fim de toda rodada, uma carta de Caos é revelada e muda a regra da próxima rodada para todos. Clique no monte de Caos.',
  },
};
