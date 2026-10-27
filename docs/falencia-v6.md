# 👑 v6 — Goblins: reis, rainhas e Caos para todos

| Campo                     | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Substituída                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Data                      | 2026-10-22                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Partidas simuladas        | 4.700                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Jogadores testados        | 2, 3, 4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Duração mediana (rodadas) | 2p: 13 · 3p: 18 · 4p: 18                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Empates                   | 0%                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Mudanças vs anterior      | Monstros de 10 a 40 (31 cartas, 1 ou 2 territórios; o monte é reembaralhado quando acaba). Mão inicial com os 20 goblins. Sem estouro: quem crava rouba 2 cartas às cegas + 1 item; se ninguém cravar, o mais próximo (para cima ou para baixo) elimina 1 carta às cegas + 1 item. Perdedor descarta as cartas jogadas. Itens (50, 🌙 Dormindo ou ☀️ Acordado, sem limite na mão) e Caos (50, um por rodada, regras bruscas para todos). 4 reis e rainhas com habilidade, 2 características e um grupo de goblins que recebe as características. Regra da última carta. |
| Principais achados        | Depois do ajuste das habilidades: partidas de 13/18/18 rodadas, cravada em 24–30% das rodadas, vitórias com 4 jogadores entre 22% e 29% (Vermelho 22, Verde 23, Azul 26, Amarelo 29). Amarelo um pouco forte com 3 jogadores (39% contra 33% justo). Sem habilidades os clãs ficam em 25% cada, então o equilíbrio depende só dos reis. Habilidades que dão cartas (roubar, puxar do cemitério) atraem ataques dos rivais e acabam fracas.                                                                                                                              |

Página no Notion: https://app.notion.com/p/401d6cd7562b814ab047f212c5ce461c

---

## Arquivos desta versão

**Jogar online:** [Falência: Goblins v6](https://claude.ai/artifact/N3gHyzasaT6imcWKicjB2E) — mesas online para jogar com amigos (quem cria a mesa passa um código de 5 letras; vagas vazias viram bots) e modo contra bots. Cada jogador precisa ter acesso de edição à página, e quem cria a mesa precisa ficar com a página aberta até o fim.
Jogo para abrir no navegador (zip com o HTML) e manual de regras (PDF).

📎 **Jogo — Falência: Goblins v6 (HTML)** — anexo no Notion: `falencia-goblins-v6-jogo.zip`

📎 **Manual de regras — v6 (proposta)** — anexo no Notion: `falencia-goblins-v6-manual.pdf`

---

> 👑 **v6 em teste.** Regras novas do autor, com as decisões tiradas nas perguntas e as habilidades dos reis ajustadas por simulação.

## 1. Visão geral

Jogo de 2 a 4 jogadores. Cada jogador comanda um território (uma cor) com seus 20 goblins e o rei ou a rainha desse território. A cada rodada um **monstro** de 10 a 40 aparece dormindo, e cada jogador joga até 3 goblins tentando chegar o mais perto do valor dele, **para cima ou para baixo**. Não existe mais estouro.
**Objetivo:** ser o último jogador com cartas na mão.

## 2. Componentes

| Componente             | Quantidade   | Descrição                                                                                                   |
| ---------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| Goblins                | 4 × 20 = 80  | Uma cor por território, valores 1 a 20, cada um com 3 características (as mesmas da v5).                    |
| Monstros               | 31 (10 a 40) | Cada monstro é de 1 ou 2 territórios, marcados na carta.                                                    |
| Itens                  | 50           | Cada um marcado 🌙 Monstro Dormindo ou ☀️ Monstro Acordado.                                                 |
| Caos                   | 50           | Um revelado por rodada; muda a regra da rodada seguinte para todos.                                         |
| Reis e rainhas         | 4            | Um por território, com habilidade, 2 características e o grupo de goblins que recebe essas características. |
| Marcador Chefe da Toca | 1            | Define a ordem. Passa para a esquerda a cada rodada.                                                        |

## 3. Preparação

1. Cada jogador escolhe um território, pega os 20 goblins dessa cor e o rei ou a rainha do território.
2. Os cemitérios começam vazios.
3. Embaralhe os montes de monstros, itens e Caos.
4. Sorteie o Chefe da Toca. Não há Caos ativo na primeira rodada.

## 4. A rodada

### 1. Monstro Dormindo

1. Aplique os Caos de “início da rodada” (Troca-Troca, Golpe de Estado) e a habilidade Brotar.
2. Puxe o monstro da rodada virado para baixo. Se o monte acabou, embaralhe os monstros usados e forme um novo monte.
3. Use itens 🌙, se quiser.
4. Escolha de 1 a 3 goblins em segredo (Tambor de Guerra: até 4; Espelho Rachado: só 1; Horda: exatamente 3; Só Ímpares e Só Pares limitam quais podem ser jogados).

### 2. Monstro Acordado

1. Revele o monstro e os palpites.
2. Começando pelo Chefe da Toca, cada um pode usar itens ☀️. A janela termina quando todos passarem.
3. Calcule vencedores e perdedores e aplique Ganhar e Perder.
4. Revele a carta de Caos: ela vale para a próxima rodada, para todos.

## 5. Ganhar e perder

| Resultado                       | O que acontece                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Cravou** (diferença 0)        | Rouba 2 cartas às cegas: 1 de cada oponente ou 2 do mesmo. Compra 1 item. Se alguém cravou, só quem cravou ganha. |
| **Mais perto** (ninguém cravou) | Elimina 1 carta às cegas da mão de um oponente (vai para o cemitério dele). Compra 1 item.                        |
| **Perdeu**                      | Descarta as cartas jogadas no próprio cemitério.                                                                  |
| **Vencedor**                    | As cartas jogadas voltam para a mão.                                                                              |

- **Mais de um jogador pode ganhar:** empates na diferença 0 ou na menor diferença fazem todos vencerem.
- **Última carta:** se restam 2 jogadores com 1 carta cada, quem perde por aproximação não descarta, e o vencedor só compra o item. Cravar ainda rouba.
- Quem fica sem cartas na mão está fora.

## 6. Território

Se pelo menos um goblin jogado for de um território do monstro, você tem margem de **±1, uma vez só**. A cor que conta é a do goblin, então goblins roubados de outros territórios ajudam com outros monstros.

## 7. Cemitério

- Guarda as cartas descartadas e eliminadas de cada jogador.
- Itens tiram cartas de lá: **Pá de Coveiro** (do seu) e **Ladrão de Túmulos** (do de outro jogador). A habilidade **Brotar** também.

## 8. Reis e rainhas

| Território  | Carta                | Características → quem recebe         | Habilidade                                                                                                               |
| ----------- | -------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 🔴 Vermelho | Rei Quebra-Crânio    | Chapéu · Barba → goblins pares        | **Fúria:** ao vencer por aproximação, elimina 2 cartas em vez de 1; ao cravar, além de roubar, elimina 1 carta.          |
| 🟢 Verde    | Rainha Musgo-Podre   | Verruga · Maluco → goblins de 1 a 10  | **Brotar:** no início da rodada, se tiver menos cartas que todos os rivais, puxa 1 carta aleatória do próprio cemitério. |
| 🔵 Azul     | Rei Olho-de-Vidro    | Óculos · Chinelo → goblins ímpares    | **Faro:** no Monstro Dormindo, sabe se o monstro é par ou ímpar e qual é o território principal dele.                    |
| 🟡 Amarelo  | Rainha Dente-de-Ouro | Chapéu · Verruga → goblins de 11 a 20 | **Mercadora:** sempre que compra um item, compra 2 e fica com o melhor.                                                  |

- O rei ou a rainha **empresta as características** ao grupo de goblins escrito na carta (de qualquer cor) que o dono jogar.
- Se o Caos ativo atinge uma característica do rei (ex.: Barba Molhada com o Rei Quebra-Crânio), a habilidade e o empréstimo ficam **desligados** naquela rodada.
- Reis mudam de dono com **Coroa Trocada** (item) e **Golpe de Estado** (Caos).

## 9. Itens (50)

| Cópias | Item                  | Quando      | Efeito                                                                                                |
| ------ | --------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| 2      | **Luneta**            | 🌙 Dormindo | Espie o valor do monstro.                                                                             |
| 3      | **Sacrifício**        | 🌙 Dormindo | Mande 1 goblin seu para o seu cemitério e pegue 1 carta aleatória da mão de um oponente.              |
| 2      | **Coroa Trocada**     | 🌙 Dormindo | Troque o seu rei ou rainha com o de outro jogador.                                                    |
| 2      | **Pá de Coveiro**     | 🌙 Dormindo | Puxe 1 carta à sua escolha do seu cemitério.                                                          |
| 2      | **Ladrão de Túmulos** | 🌙 Dormindo | Pegue 1 carta aleatória do cemitério de outro jogador.                                                |
| 2      | **Mão Leve**          | 🌙 Dormindo | Roube 1 item aleatório de um oponente.                                                                |
| 2      | **Isca de Monstro**   | 🌙 Dormindo | Troque o monstro dormindo pelo próximo do monte.                                                      |
| 2      | **Bandeira**          | 🌙 Dormindo | Escolha um território: para você, o monstro também é desse território nesta rodada.                   |
| 2      | **Disfarce**          | 🌙 Dormindo | Escolha uma característica: todos os goblins que você jogar nesta rodada a têm.                       |
| 2      | **Tambor de Guerra**  | 🌙 Dormindo | Nesta rodada você pode jogar até 4 goblins.                                                           |
| 2      | **Saco de Moedas**    | 🌙 Dormindo | Compre 2 itens agora.                                                                                 |
| 3      | **Porrete**           | ☀️ Acordado | +2 na sua soma.                                                                                       |
| 3      | **Pé de Cabra**       | ☀️ Acordado | −2 na sua soma.                                                                                       |
| 1      | **Ajuste Fino**       | ☀️ Acordado | De −3 a +3 na sua soma, à sua escolha.                                                                |
| 2      | **Escudo de Panela**  | ☀️ Acordado | Nesta rodada ninguém rouba nem elimina cartas suas.                                                   |
| 2      | **Amuleto**           | ☀️ Acordado | Se você perder nesta rodada, não descarta nada.                                                       |
| 2      | **Óculos de Grau**    | ☀️ Acordado | Cada goblin de Óculos jogado vale até +2.                                                             |
| 2      | **Chapéu Pontudo**    | ☀️ Acordado | Cada goblin de Chapéu jogado vale até ±2.                                                             |
| 2      | **Poção Maluca**      | ☀️ Acordado | Um goblin Maluco jogado vale o dobro ou a metade.                                                     |
| 2      | **Pomada de Verruga** | ☀️ Acordado | Se jogou goblin de Verruga: de −3 a +3 na sua soma.                                                   |
| 2      | **Chinelo Veloz**     | ☀️ Acordado | Se você perder nesta rodada, um goblin de Chinelo jogado volta para a mão.                            |
| 3      | **NÃO!**              | ☀️ Acordado | Cancele um item de Monstro Acordado que outro jogador usou para passar você. O jogo pergunta na hora. |
| 2      | **Armadilha**         | ☀️ Acordado | Nesta rodada, quem roubar ou eliminar uma carta sua perde 1 carta aleatória.                          |
| 1      | **Grito de Guerra**   | ☀️ Acordado | O monstro vale +2 ou −2 para todos, à sua escolha.                                                    |

- **Sem limite de itens** na mão. Item usado vai para o descarte.
- Escudo, Amuleto, Chinelo Veloz e Armadilha são “preparados” na janela ☀️ e valem até o fim da rodada.

## 10. Caos (50)

Todo Caos muda a regra da rodada seguinte de forma brusca, para todos.

| Cópias | Caos                     | Efeito na próxima rodada, para todos                                             |
| ------ | ------------------------ | -------------------------------------------------------------------------------- |
| 2      | **Só Ímpares**           | Só podem ser jogados goblins de valor ímpar.                                     |
| 2      | **Só Pares**             | Só podem ser jogados goblins de valor par.                                       |
| 2      | **Mundo Invertido**      | Vence quem ficar MAIS LONGE do monstro. Ninguém crava.                           |
| 2      | **Corrida dos Pequenos** | O monstro é ignorado: vence a MENOR soma. Ninguém crava.                         |
| 2      | **Monstros Gêmeos**      | Dois monstros acordam; cada jogador mira no que estiver mais perto da soma dele. |
| 2      | **Monstro Gigante**      | O monstro vale o dobro.                                                          |
| 2      | **Monstro Anão**         | O monstro vale a metade (arredondando para cima).                                |
| 2      | **Espelho Rachado**      | Todos jogam só 1 goblin.                                                         |
| 2      | **Horda**                | Todos jogam exatamente 3 goblins (ou todos os que tiverem).                      |
| 2      | **Barba Molhada**        | Goblins com Barba valem 0.                                                       |
| 2      | **Chapéu Furado**        | Goblins com Chapéu valem 0.                                                      |
| 2      | **Óculos Embaçados**     | Goblins com Óculos valem 0.                                                      |
| 2      | **Maldição da Verruga**  | Goblins com Verruga valem 0.                                                     |
| 2      | **Chinelo Perdido**      | Goblins com Chinelo valem 0.                                                     |
| 2      | **Surto Maluco**         | Goblins Malucos valem o dobro.                                                   |
| 2      | **Troca-Troca**          | No início da rodada, todos passam a mão inteira para o jogador da esquerda.      |
| 2      | **Mãos Atadas**          | Ninguém pode usar itens.                                                         |
| 2      | **Golpe de Estado**      | No início da rodada, os reis e rainhas passam para o jogador da esquerda.        |
| 2      | **Rebelião**             | As habilidades de todos os reis e rainhas ficam desligadas.                      |
| 2      | **Fronteiras Abertas**   | O monstro é de todos os territórios.                                             |
| 2      | **Fronteira Larga**      | A margem de território vale ±3.                                                  |
| 2      | **Cravada de Ouro**      | Quem cravar rouba 3 cartas em vez de 2.                                          |
| 2      | **Banquete**             | As cartas que os perdedores descartariam vão para a mão dos vencedores.          |
| 2      | **Peste**                | Quem perder também perde 1 carta aleatória extra da mão.                         |
| 2      | **Sem Volta**            | Os vencedores também descartam as cartas que jogaram.                            |

## 11. Monstros e territórios

31 monstros de 10 a 40. O território principal segue um rodízio Vermelho → Verde → Azul → Amarelo, e 10 monstros têm também um segundo território. Quando o monte acaba, os monstros usados são embaralhados e formam um novo monte.

## 12. Fim de jogo

Vence o último jogador com cartas na mão.

---

## Decisões tomadas

- Monstros de 10 a 40 (31 cartas).
- Se alguém crava, só quem cravou ganha.
- Margem de território ±1, uma vez só.
- Vencedor pega as cartas jogadas de volta.
- Roubo e eliminação às cegas.
- Cemitério acessível por itens (o seu e o dos outros).
- Reis emprestam características a um grupo de goblins escrito na carta e são desligados pelo Caos que atinge essas características.
- Na última carta ninguém perde e o jogo segue.
- Habilidades dos reis recriadas e ajustadas por simulação.
- Caos com mudanças bruscas de regra.
- Itens sem limite na mão.
- Monte de monstros reembaralhado quando acaba.

## Resultados dos testes

Cerca de 4.700 partidas simuladas só com bots, incluindo testes de várias versões das habilidades dos reis.

| Jogadores | Duração mediana | Rodadas com cravada | Vitórias: Vermelho / Verde / Azul / Amarelo |
| --------- | --------------- | ------------------- | ------------------------------------------- |
| 2         | 13 rodadas      | 24%                 | 48% / 51% / 48% / 52%                       |
| 3         | 18 rodadas      | 27%                 | 30% / 31% / 33% / 39%                       |
| 4         | 18 rodadas      | 30%                 | 22% / 23% / 26% / 29%                       |

Parcela justa: 50% com 2 jogadores, 33% com 3 e 25% com 4.

## O que os testes mostraram

- **Sem habilidades, os quatro clãs ficam em 25%.** O equilíbrio depende só dos reis e rainhas.
- **Habilidades que dão cartas atraem ataques.** Roubar em vez de eliminar e puxar a melhor carta do cemitério deixaram o dono com mais cartas, e os rivais passaram a mirar nele. Essas versões ficaram fracas ou fortes demais e foram trocadas.
- **Saber os territórios do monstro é muito forte** (Azul chegou a 35%). O Faro mostra só o território principal.
- **Amarelo ainda um pouco forte com 3 jogadores** (39%). Se continuar assim na mesa, a Mercadora pode passar a valer só quando cravar.
- O primeiro desenho das habilidades (Fúria só na aproximação, Necromante, Faro par/ímpar, Sortuda ±2) deu Vermelho 15% e Verde 34% com 4 jogadores.

## O que mudou no jogo (HTML)

- Fases 🌙 Monstro Dormindo e ☀️ Monstro Acordado na mesa.
- Montes separados de itens e de Caos; o Caos da próxima rodada fica à mostra.
- Rei ou rainha na sua área, com o estado (ligado ou desligado). Goblins que recebem as características do rei aparecem com 👑.
- Ao cravar, você clica nos rivais para roubar; ao vencer por aproximação, para eliminar.
- Monstros Gêmeos aparecem lado a lado; com Só Ímpares/Só Pares, as cartas que não podem ser jogadas ficam apagadas.
- Dicas de como jogar na primeira vez de cada momento, e o botão **Regras** com o resumo.
