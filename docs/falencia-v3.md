# 🃏 v3 — Mais próximo por baixo vence + acerto duplo

| Campo | Valor |
| --- | --- |
| Status | Substituída |
| Data | 2026-10-16 |
| Partidas simuladas | 670.000 |
| Jogadores testados | 2, 3, 4 |
| Duração mediana (rodadas) | 2p: 13 · 3p: 15 · 4p: 15 |
| Empates | 1,3–2,0% (0,3% com desempate) |
| Mudanças vs anterior | 2 a 4 jogadores (sem solo). Se dois acertam, ambos recuperam uma carta. Quando todos erram para menos, o mais próximo vence e usa a regra da vitória. |
| Principais achados | Empates caíram para ~2%, partidas de 13-15 rodadas, habilidade importa. Problema: com 2 jogadores, mirar perto de 7 vence todas as estratégias (65-81%). Correção testada: mais próximo só vence se errou por até 3. |

Página no Notion: https://app.notion.com/p/3fcd6cd7562b8167a813ee41f649710c

---

> 📌 Testada em cerca de 670 mil partidas (6 leituras da regra, 9 estratégias, confronto direto com 2 jogadores, misturas de oponentes).

## Mudanças vs v2

- Jogadores: **2 a 4** (modo solo removido).
- **Novo:** se dois jogadores acertam o número, ambos recuperam uma carta.
- **Novo:** quando os jogadores erram para menos, o que chegar mais perto vence e usa a regra da vitória.

## Resultados dos testes

- **Empates de ~24% para ~2%** (0,3% com desempate pelo palpite mais próximo quando todos falem juntos).
- Partidas mais longas: mediana 13-15 rodadas. Há vencedor em 72-86% das rodadas.
- **Habilidade importa:** jogar aleatório vence só 3-7%. Assentos e naipes equilibrados.
- **Problema com 2 jogadores:** mirar perto de 7 vence todas as outras estratégias (65% contra a IA, 81% contra jogar baixo). Motivo: errar para mais e para menos custam igual, mas errar para menos tem grande chance de vencer.
- **Correção testada:** o mais próximo por baixo só vence se errou por até 3 → nenhuma estratégia passa de 62%.
- Recuperar ainda vale um pouco mais que atacar com 3-4 jogadores (edge 1,08 a 1,26).

## Lacunas no texto (e impacto de cada leitura)

- **Com 3-4 jogadores, o mais próximo vale se alguém passou?** Grande impacto. Se só valer quando todos erram para menos, 50% das rodadas ficam sem vencedor. Recomendado: vale sempre.
- **Empate entre os mais próximos por baixo:** se ninguém vencer, jogar baixo domina (edge 1,7-2,0). Recomendado: ambos recuperam.
- **Território pode ser usado para chegar mais perto?** Se não puder, partidas dobram de duração. Recomendado: pode.
- Vencedor por “mais próximo” não descarta (assumido); acerto exato tem prioridade; vencedor com cemitério vazio; 3+ acertos; todos falindo juntos; empate no descarte ao passar.
- Digitação: “o jogador 2 foi o vencedor” → “vencedor da rodada”; “o ambos” → “ambos”.

## Regras completas (v3)

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

**Efeitos Especiais (Territórios):**

Quando uma carta é puxada, existe a chance de ela possuir 1 dos 4 naipes na mão dos jogadores, se a carta quando revelada for do território de algum jogador, ele ganha um efeito bônus, que permite que ele adicione +1 ou -1 ao resultado final

Ex: O jogador de Espadas jogou 7 e 3, quando se revela a carta central, vê que é um 9 de espadas, ele normalmente teria errado, e teria de descartar uma de suas cartas, mas por estar em seu “território”, ele pode subtrair em 1 o valor final, indo de 10 para 9, e considerando um acerto, assim seguindo com as regras tradicionais do jogo.
