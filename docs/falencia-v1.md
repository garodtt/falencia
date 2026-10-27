# 🃏 v1 — Regras originais

| Campo                     | Valor                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Substituída                                                                                                                                                                                                                      |
| Data                      | 2026-10-15                                                                                                                                                                                                                       |
| Partidas simuladas        | 900.000                                                                                                                                                                                                                          |
| Jogadores testados        | 2, 3, 4                                                                                                                                                                                                                          |
| Duração mediana (rodadas) | 2p: 49 · 3p: 57 · 4p: 76                                                                                                                                                                                                         |
| Empates                   | 0,6–1,3%                                                                                                                                                                                                                         |
| Mudanças vs anterior      | Primeira versão escrita (sem versão anterior).                                                                                                                                                                                   |
| Principais achados        | Sem penalidade ao errar para menos, a melhor jogada é jogar o Ás (64% das jogadas). Recuperar carta domina em 3-4 jogadores (59-61% de vitória vs 25%). Assento 1 vence 42% com 3 jogadores. Permitir passar a vez trava o jogo. |

Página no Notion: https://app.notion.com/p/3fcd6cd7562b81f68c03c588d18f1aee

---

> 📌 Versão inicial escrita pelo autor. Testada em 750 mil partidas (5 variantes de regra × 10 estratégias × 2/3/4 jogadores) + cerca de 150 mil em experimentos de correção.

## Mudanças vs versão anterior

- Primeira versão — não há anterior.

## Resultados dos testes

- **Errar para menos não custa nada** → a estratégia ótima é jogar o Ás: 64% das jogadas são 1, 82% das jogadas ficam abaixo do valor. Mirar na média ou tentar acertar vence 0% das partidas com 3-4 jogadores.
- **Recuperar carta é melhor que eliminar com 3-4 jogadores**: quem sempre recupera vence 59-61% com 4 jogadores (esperado 25%). Se todos recuperam, 55% das partidas passam de 500 rodadas.
- **Vantagem de assento**: com 3 jogadores o assento 1 vence 42% (esperado 33%), porque age primeiro quando vários acertam. Girar a ordem ou escolher ações em segredo corrige.
- **Permitir passar a vez** trava 100% das partidas se todos passarem.
- Naipes equilibrados (≈25% cada). Território responde por 22-33% dos acertos.

## Correções testadas

- Eliminar tira 1 carta de CADA oponente: equilibra recuperar × eliminar e remove o viés de assento.
- Errar para menos descarta (sempre ou com diferença ≥3 a ≥6): partidas curtíssimas e 10-24% de empates.

## Lacunas no texto

- Quantas cartas no mínimo por rodada; o que acontece ao errar para menos; empate no descarte ao passar; valor de J/Q/K/Ás; baralho central acabando; ordem de vários acertos; destino da carta eliminada; ataque aleatório ou escolhido; revelação simultânea; uso opcional do território; empate final; jogo com 1 jogador.

## Regras completas (v1)

**FALENCIA (provisório)**

Necessário: 2x Baralhos (Sendo um sem valete dama e rei)

Jogadores: 1 - 4

**Instruções para começo:**

- Separe o baralho sem as cartas especiais por naipes (ficará números de 1 a 10 para cada)
- Embaralhe o baralho comum e deixe no centro da mesa
- Cada jogador escolhe um naipe e segura em mãos

**O Jogo:**

O objetivo do jogo é ser o último jogador com cartas na mão, para isso, toda rodada uma carta do baralho central será puxada virada para baixo

Então os jogadores tem de usar as cartas de 1 a 10 em sua mão para adivinhar o número da carta do centro

Ex: O jogador 1 joga 3 e 6, enquanto o jogador 2 escolhe 1, 2 e 3, ao revelar a carta, veem que o resultado era 5, o jogador 2 foi o vencedor porquê sua soma acertou o resultado

**Errando:**

Quando erra por mais (ou seja, seu número ficou maior do que a carta do centro), é necessário que se tire a carta que deixa o resultado mais próximo do resultado, então voltando ao exemplo anterior, se o jogador 1 jogou 3 e 6, e o resultado era 5, ele precisa descartar o 3, pois 6 está mais próximo do resultado.

O jogador que descartar deve guardar todas as cartas em uma pilha de descarte, pois ele pode recuperar cartas ao acertar

**Acertando:**

Caso o jogador acerte o número, é considerado um acerto, e ele tem a opção de escolher uma das ações a seguir:

- Comprar carta do cemitério: O jogador embaralha suas cartas no cemitério e compra uma aleatoriamente, ganhando mais uma vida e chance para o jogo
- Eliminar carta de oponente: O jogador pode escolher aleatoriamente uma carta de um de seus oponentes para ser descartado, ficando mais próximo da vitória

**Efeitos Especiais (Territórios):**

Quando uma carta é puxada, existe a chance de ela possuir 1 dos 4 naipes na mão dos jogadores, se a carta quando revelada for do território de algum jogador, ele ganha um efeito bônus, que permite que ele adicione +1 ou -1 ao resultado final

Ex: O jogador de Espadas jogou 7 e 3, quando se revela a carta central, vê que é um 9 de espadas, ele normalmente teria errado, e teria de descartar uma de suas cartas, mas por estar em seu “território”, ele pode subtrair em 1 o valor final, indo de 10 para 9, e considerando um acerto, assim seguindo com as regras tradicionais do jogo.
