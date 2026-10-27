# 🔄 v6.2 — Viradas: limite de itens, Feira e monstros com efeito

| Campo                     | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Atual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Data                      | 2026-10-25                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Partidas simuladas        | 22.000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Jogadores testados        | 2, 3, 4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Duração mediana (rodadas) | 2p: 17 · 3p: 20 · 4p: 21                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Empates                   | 0%                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Mudanças vs anterior      | Máximo de 3 itens na mão (o 4º vai para o fundo do monte). Regras de virada: Vingança do Cemitério, Cravada do Azarão (rouba 3), Pressa não Compensa. Itens novos: Mapa do Tesouro e Profecia do Caos (saíram 1 cópia de Monóculo, Poção, Chinelo e Grito). Caos novos: Mínimo Máximo, Feira dos Goblins e Necromante (saíram 1 cópia de Às Cegas, Palpite Aberto, Somas Iguais, Caça ao Líder, Zona Proibida e Roleta). Monstros com efeito: Amigo dos Fracos (10, 15, 20, 25, 30, 35, 40). |
| Principais achados        | Mais viradas: quem lidera na rodada 10 vence 34% das partidas com 4 jogadores (v6.1: 51%); em 65% o vencedor esteve sozinho em último (v6.1: 45%); 5,9 trocas de liderança. Clãs equilibrados (4p: 24/25/25/26%). Partidas 2 a 3 rodadas mais longas; 43 itens usados por partida.                                                                                                                                                                                                           |

Página no Notion: https://app.notion.com/p/404d6cd7562b81f68bc4e04df2d4465e

---

## Arquivos desta versão

**Jogar online:** [Falência: Goblins](https://claude.ai/artifact/N3gHyzasaT6imcWKicjB2E) — o mesmo link das versões anteriores, já na v6.2. Para o site próprio no GitHub, basta subir o index.html novo.

📎 **Jogo — Falência: Goblins v6.2 (HTML)** — anexo no Notion: `falencia-goblins-v6.2-jogo.zip`

📎 **Manual de regras — v6.2** — anexo no Notion: `falencia-goblins-v6.2-manual.pdf`

---

> 🔄 **Objetivo da v6.2:** no meio do jogo, quem começava a perder ficava sem itens, não tinha como reagir e passava a jogar qualquer carta só para acabar logo. A v6.2 dá chances de virada: limite de itens para quem está na frente, itens para quem está atrás (Feira, Amigo dos Fracos, Vingança do Cemitério, Pressa não Compensa), uma cravada mais forte para o azarão e o Necromante, que deixa todo mundo jogar com o cemitério.

## O que muda em relação à v6.1

### 1. Limite de 3 itens

- Cada jogador pode ter no máximo **3 itens** na mão.
- Se você já tem 3 e compra mais um (vencendo, na Feira, pelo Saco de Moedas, com a Mão Leve, com o Mapa do Tesouro…), escolha 1 dos 4 para mandar para o **fundo do monte de itens**.

### 2. Regras de virada

| Regra                     | Quando           | Efeito                                                                                                                                             |
| ------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vingança do Cemitério** | Início da rodada | Quem tem o maior cemitério compra 1 item (empate: todos os empatados compram).                                                                     |
| **Cravada do Azarão**     | Ao cravar        | Quem crava tendo a menor mão da mesa (contada no início da rodada) rouba 3 cartas em vez de 2. Não vale quando todos têm o mesmo número de cartas. |
| **Pressa não Compensa**   | Fim da rodada    | Quem perde tendo jogado 3 goblins ou mais compra 1 item.                                                                                           |

### 3. Itens novos

| Cópias | Item                 | Quando           | Texto da carta                                                                                             |
| ------ | -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| 2      | **Mapa do Tesouro**  | Monstro Dormindo | Olhe o monte de itens, escolha 1 carta e fique com ela. Depois embaralhe o monte.                          |
| 2      | **Profecia do Caos** | Monstro Dormindo | Olhe o monte de Caos e escolha a carta da próxima rodada. Embaralhe o resto e coloque a escolhida no topo. |

- A Profecia escolhe o Caos da **próxima** rodada, porque o da rodada atual já foi revelado e alguns Caos (Troca-Troca, Pedágio, Duelo, Necromante) acontecem logo no começo da rodada.
- Para manter o monte em 50 itens, saiu 1 cópia de cada: Monóculo de Grau, Poção Maluca, Chinelo Fedorento e Grito de Guerra (2→1).

### 4. Cartas de Caos novas

| Cópias | Caos                                     | Grupo         | Efeito na próxima rodada, para todos                                                                                                                                                                   |
| ------ | ---------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2      | **Mínimo Máximo**                        | Aleatoriedade | Os valores dos goblins se invertem: 1 vale 20, 2 vale 19, 3 vale 18 … 20 vale 1.                                                                                                                       |
| 2      | **Feira dos Goblins**                    | Interação     | No fim desta rodada, todos os jogadores compram 1 item.                                                                                                                                                |
| 2      | **Necromante** (arte: goblin necromante) | Aleatoriedade | Coloque seu cemitério na sua mão: nesta rodada você joga só com essas cartas. Quem vencer fica com as cartas que jogou; o resto volta para o cemitério. Quem não tem cemitério joga com a própria mão. |

Para manter o baralho em 50 cartas, saiu 1 cópia de: Às Cegas (4→3), Palpite Aberto (3→2), Somas Iguais se Anulam (4→3), Caça ao Líder (3→2), Zona Proibida (3→2) e Roleta (3→2).

- No Mínimo Máximo, só o valor muda. As características e o grupo que recebe o empréstimo do rei continuam seguindo o número impresso na carta.
- No Necromante, quem perde não perde nada da mão de verdade: as cartas jogadas voltam para o cemitério. Quem vence ainda rouba ou elimina das mãos normais dos rivais.

### 5. Monstros com efeito

Alguns monstros têm um efeito impresso, que só aparece quando o monstro acorda.

| Monstros                    | Efeito               | Texto da carta                                                                                                |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| 10, 15, 20, 25, 30, 35 e 40 | **Amigo dos Fracos** | Quando derrotado, quem compra o item é o jogador com menos itens na mão (empate: todos os empatados compram). |

- Quem venceu a rodada continua roubando ou eliminando cartas normalmente; só a compra do item muda de mão.
- Com Monstros Opostos, o efeito vale se qualquer um dos dois monstros o tiver.

## Regras completas (resumo)

- **Objetivo:** ser o último jogador com cartas na mão. 2 a 4 jogadores, 20 goblins (1 a 20) por território, um rei ou rainha cada.
- **Rodada:** Vingança do Cemitério → Monstro Dormindo (itens ☾, escolha de 1 a 3 goblins em segredo) → Monstro Acordado (revela; janela de itens ☀ sem ordem, NÃO! em cadeia) → resultado → Pressa não Compensa → revela o Caos da próxima rodada.
- **Cravou:** rouba 2 cartas às cegas (3 se for o azarão) + 1 item. **Mais perto:** elimina 1 carta às cegas + 1 item. **Perdeu:** cartas jogadas vão para o cemitério. Vencedores pegam as cartas de volta.
- **Território:** margem ±1 com um goblin do território do monstro; o Rei Azul (Monóculo) tem ±2 quando o monstro é do território Azul, com qualquer goblin.
- **Reis:** Fúria (Vermelho), Brotar (Verde, o jogador à direita escolhe a carta do cemitério), Monóculo (Azul), Mercadora (Amarelo).
- **Sem sorteio automático:** o que mexia aleatoriamente na sua mão é escolhido pelo jogador à direita; o que você pega dos outros é às cegas.
- As demais regras, os itens e o restante do Caos seguem a página da v6.1 e estão completos no PDF.

## Resultados dos testes

Cerca de 22 mil partidas simuladas com bots, com todas as regras da v6.2.

| Jogadores | Duração mediana | 80% das partidas | Vitórias: Vermelho / Verde / Azul / Amarelo |
| --------- | --------------- | ---------------- | ------------------------------------------- |
| 2         | 17 rodadas      | 11 a 27          | 49% / 51% / 49% / 52%                       |
| 3         | 20 rodadas      | 16 a 25          | 33% / 33% / 34% / 34%                       |
| 4         | 21 rodadas      | 18 a 25          | 24% / 25% / 25% / 26%                       |

**Viradas (4 jogadores, bots lógicos):**

| Medida                                             | v6.1 | v6.2 (limite + Feira + Amigo dos Fracos) | + regras de virada | + Mapa, Profecia e Necromante |
| -------------------------------------------------- | ---- | ---------------------------------------- | ------------------ | ----------------------------- |
| Quem lidera na rodada 10 vence                     | 51%  | 41%                                      | 35%                | 34%                           |
| Vencedor esteve sozinho em último em algum momento | 45%  | 53%                                      | 61%                | 65%                           |
| Trocas de liderança por partida                    | 3,8  | 4,5                                      | 5,5                | 5,9                           |
| Itens usados por partida                           | 16   | 22                                       | 37                 | 43                            |

- Clãs equilibrados: todos a no máximo 1 ponto da parcela justa com 4 jogadores.
- As partidas ficaram cerca de 2 a 3 rodadas mais longas que na v6.1.
- Na rodada de Necromante, 41% das rodadas têm cravada (as mãos de cemitério são pequenas e previsíveis).
- Os itens circulam muito mais (43 por partida com 4 jogadores): vale observar na mesa se não ficou item demais. Primeiro ajuste sugerido: Vingança do Cemitério só para quem tem 5 cartas ou menos.

## O que mudou no jogo (HTML)

- Quando você passa de 3 itens, o jogo pergunta qual vai para o fundo do monte.
- O monstro mostra o efeito no lugar de "Monstro" quando acorda, e aparece um aviso com o texto do efeito.
- No Mínimo Máximo, cada goblin da sua mão mostra o valor invertido num selo no canto.
- Avisos na tela para Vingança do Cemitério, Cravada do Azarão e Pressa não Compensa.
- Mapa do Tesouro e Profecia do Caos abrem a lista do monte para você escolher.
- Necromante: a sua mão vira o seu cemitério durante a rodada, com aviso; a carta e a faixa do Caos usam um ícone de caveira.
- Regras do jogo (botão Regras) e legenda de ícones atualizadas.
