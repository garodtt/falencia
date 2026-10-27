# 🃏 v4 — Uma ação por carta jogada

| Campo | Valor |
| --- | --- |
| Status | Substituída |
| Data | 2026-10-16 |
| Partidas simuladas | 360.000 |
| Jogadores testados | 2, 3, 4 |
| Duração mediana (rodadas) | 2p: 8 · 3p: 11 · 4p: 13 |
| Empates | 0,6–2,6% |
| Mudanças vs anterior | O vencedor da rodada faz uma ação para cada carta usada no palpite (vale para acerto exato e para o mais próximo por baixo). Ações podem ser misturadas e em oponentes diferentes; cemitério vazio → ações restantes viram eliminação; vencedores simultâneos recuperam só 1 carta cada. |
| Principais achados | Some o domínio do 'perto de 7' com 2 jogadores, mas a nova regra de ouro vira 'jogar o máximo de cartas pequenas'. Partidas mais curtas e explosivas: 23% das partidas de 2 jogadores acabam em até 5 rodadas. Melhor combinação testada: ação por carta + mais próximo só se errou por até 3 + desempate quando todos falem. |

Página no Notion: https://app.notion.com/p/3fcd6cd7562b81fcb270eb6a11ce3388

---

> 📌 Versão atual. Testada em 360 mil partidas (6 variantes, 10 estratégias, 2/3/4 jogadores), comparando com a v3 rodando no mesmo simulador.

## Mudanças vs v3

- **Novo:** o vencedor da rodada faz **uma ação por carta jogada** (ex.: venceu com 1+2+3 → 3 ações).
- Vale para o acerto exato e para quem venceu por chegar mais perto por baixo.
- As ações podem ser misturadas (recuperar e eliminar) e cada eliminação pode ser em um oponente diferente.
- Se o cemitério esvaziar no meio das ações, as restantes só podem eliminar cartas de oponentes.
- Vencedores simultâneos: cada um recupera apenas 1 carta.

## Resultados vs v3 (estratégia mais forte em todos os assentos)

|  | v3 | v4 |
| --- | --- | --- |
| Duração mediana (2/3/4 jogadores) | 13 / 15 / 15 | 8 / 11 / 13 |
| Partidas de 2 jogadores com até 5 rodadas | 0,2% | 23% |
| Cartas por jogada | ≈1 a 1,5 | ≈2,3 |
| Mirar perto de 7 contra a melhor estratégia (2 jogadores) | 67% (dominante) | 49% (justo) |
| Empates | 1,2–1,7% | 0,6–2,6% |

- **Nova regra de ouro: jogar o máximo de cartas pequenas** (jogadas mais comuns: 1+2+3 e 1+2+3+4). Com 2 jogadores, quem joga com o mínimo de cartas vence só 13-19%. Cartas baixas passam a valer muito mais que as altas.
- **Viradas bruscas:** uma vitória com 4 cartas pode tirar 4 cartas de um oponente de uma vez.
- **Com 4 jogadores**, jogar 1 carta só vira contra-ataque (edge 1,39), porque os outros estouram juntos.
- Recuperar ainda vale mais que atacar com 3-4 jogadores (edge 1,14-1,33).

## Variações testadas

- **Melhor combinação:** ação por carta + mais próximo só vence se errou por até 3 + desempate quando todos falem juntos. Mais equilibrada de todas as baterias (nenhuma estratégia simples supera a jogada esperta). Ainda tem partidas curtas com 2 jogadores (17% em até 5 rodadas).
- Limite de 2 ações por rodada: o “perto de 7” volta a dominar com 2 jogadores (edge 1,18).
- Bônus só no acerto exato: com 4 jogadores, jogar 1 carta domina (edge 1,5).
- Empate dando 1 recuperação por carta jogada: praticamente igual à versão principal.

## Lacunas ainda abertas

- Todos falindo juntos; empate no descarte ao passar; vencedor com cemitério vazio no empate; recuperar > atacar com 3-4 jogadores.

## Regras completas (v4)

**FALENCIA (provisório)**

Necessário: 2x Baralhos (Sendo um sem valete dama e rei)

Jogadores: 2 - 4

**Instruções para começo:**

- Separe o baralho sem as cartas especiais por naipes (ficará números de 1 a 10 para cada)
- Embaralhe o baralho comum e deixe no centro da mesa.
- Cada jogador escolhe um naipe e segura em mãos.
- Valete, Dama e Rei valem respectivamente 11, 12 e 13, enquanto Ás vale 1.

**O Jogo:**

O objetivo do jogo é ser o último jogador com cartas na mão, para isso, toda rodada uma carta do baralho central será puxada virada para baixo

Então os jogadores tem de usar as cartas de 1 a 10 em sua mão para adivinhar o número da carta do centro, revelando seus palpites todos ao mesmo tempo

**Caso de ganho exato:**

Ex: O jogador 1 joga 3 e 6, enquanto o jogador 2 escolhe 1, 2 e 3, ao revelar a carta, veem que o resultado era 6, o jogador 2 foi o vencedor porquê sua soma acertou o resultado

Caso dois jogadores acertem o número o ambos recuperam uma carta

**Errando:**

Quando erra por mais (ou seja, seu número ficou maior do que a carta do centro), é necessário que se tire a carta que deixa o resultado mais próximo da carta do centro, então voltando ao exemplo anterior, se o jogador 1 jogou 3 e 6, e o resultado era 6, ele precisa descartar o 3, pois 6 está mais próximo do resultado.

Caso erre para baixo, se descarta a menor carta, em prol de evitar o ciclo de jogar apenas cartas baixas, quando os dois jogadores erraram para menos o que chegar mais perto do resultado ganha, exemplo anterior a resposta era 6 o jogador 1 somou 5 e o jogador 2 somou 4 o jogador 1 é o vitorioso e usa a regra da vitória

O jogador que descartar deve guardar todas as cartas em uma pilha de descarte, pois ele pode recuperar cartas ao acertar

Caso o baralho central acabe, ganha quem tiver mais cartas, se houver empate, ganhar aquele com a carta mais próxima do resultado final.

**Acertando:**

Caso o jogador acerte o número, é considerado um acerto, e ele tem a opção de escolher uma das ações a seguir:

- Comprar carta do cemitério: O jogador embaralha suas cartas no cemitério e compra uma aleatoriamente, ganhando mais uma vida e chance para o jogo
- Eliminar carta de oponente: O jogador pode escolher aleatoriamente uma carta de um de seus oponentes para ser descartado, ficando mais próximo da vitória

**Uma ação por carta jogada:**

O vencedor da rodada faz uma ação para cada carta que usou no seu palpite. Isso vale tanto para quem acertou o número exato quanto para quem venceu por chegar mais perto por baixo.

Ex: O jogador 2 jogou 1, 2 e 3 e acertou o 6. Como usou 3 cartas, ele faz 3 ações.

- As ações podem ser misturadas. Ex: comprar 1 carta do cemitério e eliminar 2 cartas de oponentes.
- Cada eliminação pode ser em um oponente diferente.
- Se o cemitério ficar vazio no meio das ações, as ações que sobrarem só podem ser usadas para eliminar cartas de oponentes.
- Se dois ou mais jogadores vencerem a rodada ao mesmo tempo, a regra de empate continua valendo: cada um recupera apenas uma carta, não importa quantas cartas jogou.

**Efeitos Especiais (Territórios):**

Quando uma carta é puxada, existe a chance de ela possuir 1 dos 4 naipes na mão dos jogadores, se a carta quando revelada for do território de algum jogador, ele ganha um efeito bônus, que permite que ele adicione +1 ou -1 ao resultado final

Ex: O jogador de Espadas jogou 7 e 3, quando se revela a carta central, vê que é um 9 de espadas, ele normalmente teria errado, e teria de descartar uma de suas cartas, mas por estar em seu “território”, ele pode subtrair em 1 o valor final, indo de 10 para 9, e considerando um acerto, assim seguindo com as regras tradicionais do jogo.
