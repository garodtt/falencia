# 🧌 v7 — Regras completas com as características novas

| Campo                | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status               | Atual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Data                 | 2026-10-27                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Partidas simuladas   | 900 com a Armadilha nova (300 por mesa de 2, 3 e 4), sem erros. Vitórias por clã: 2p 47/53%, 3p 33/36/32%, 4p 27/25/24/24% (antes: 46/54, 34/35/31, 27/27/23/23). Rodadas (mediana): 17 / 20 / 21, iguais a antes. Armadilhas valendo: 0,4 a 0,5 por partida                                                                                                                                                                                                                                                                                                                                 |     |
| Mudanças vs anterior | Características renomeadas (Barba → Cicatriz, Óculos → Monóculo, Chinelo → Fedorento, Verruga → Pereba). Itens renomeados: Monóculo Polido, Fuga Fedorenta, Pomada de Pereba. A habilidade do Rei Azul passa a se chamar Lente de Vidro. A Armadilha vira reação, como o NÃO!: fica escondida na mão e é revelada quando tiram uma carta sua (e o NÃO! pode cancelá-la). Itens novos: Cicatrizes Compartilhadas, Nariz de Ferro e Machucado; itens de característica padronizados como ajustes fixos; monte de itens com 62 cartas. Documento completo, conferido com o código (`src/game`). |

> Documento de referência das regras atuais do jogo.
> Base: versão **v6.2** (limite de 3 itens, regras de virada, monstros com efeito, Mapa do Tesouro, Profecia do Caos, Necromante).
> **Novidade deste documento:** as 6 características dos goblins foram trocadas por **Pereba, Monóculo, Chapéu, Maluco, Fedorento e Cicatriz**, e todas as cartas (goblins, itens, Caos, reis e rainhas) já usam os nomes novos.
> Todas as regras foram conferidas com o código. Onde o código e o texto antigo não batiam, vale o que o jogo faz; o que ainda falta mudar no código está na seção 18.

## Sumário

1. Visão geral
2. Componentes
3. Características dos goblins
4. Preparação
5. A rodada, passo a passo
6. Como calcular o resultado
7. Ganhar e perder
8. Território
9. Cemitério
10. Reis e rainhas
11. Itens (62 cartas)
12. Caos (50 cartas)
13. Monstros (31 cartas)
14. Regras de virada
15. Jogo físico: sem sorteio automático
16. Fim de jogo
17. Casos especiais
18. Referência para implementação
19. Histórico de versões

---

## 1. Visão geral

- **Jogadores:** 2 a 4.
- **Tema:** cada jogador comanda um território (Vermelho, Verde, Azul ou Amarelo) com 20 goblins e um rei ou rainha.
- **Objetivo:** ser o **último jogador com cartas na mão**.
- **Ideia central:** a cada rodada um monstro de 10 a 40 aparece dormindo (virado para baixo). Cada jogador joga em segredo de 1 a 3 goblins tentando chegar o mais perto do valor do monstro, **para cima ou para baixo**. Não existe estouro.
  - **Cravou** (acertou em cheio): rouba cartas dos rivais.
  - **Chegou mais perto:** elimina uma carta de um rival.
  - **Perdeu:** as cartas jogadas vão para o cemitério.
- Todo fim de rodada uma carta de **Caos** é revelada e muda a regra da rodada seguinte para todos.

## 2. Componentes

| Componente             | Quantidade  | Descrição                                                                                                                                     |
| ---------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Goblins                | 4 × 20 = 80 | Uma cor por território, valores 1 a 20, cada um com 3 características.                                                                        |
| Monstros               | 31          | Valores 10 a 40. Cada monstro é de 1 ou 2 territórios; 7 têm um efeito impresso.                                                              |
| Itens                  | 50          | Cada um marcado ☾ **Monstro Dormindo** (antes da revelação), ☀ **Monstro Acordado** (depois) ou ⚡ **Reação** (na hora em que algo acontece). |
| Caos                   | 50          | Um revelado no fim de cada rodada; muda a regra da rodada seguinte para todos.                                                                |
| Reis e rainhas         | 4           | Um por território: habilidade, 2 características e o grupo de goblins que recebe essas características.                                       |
| Marcador Chefe da Toca | 1           | Define quem começa e quem decide o Duelo. Passa para a esquerda a cada rodada.                                                                |

## 3. Características dos goblins

Cada goblin tem **3 de 6 características**. Cada característica aparece em **10 dos 20 goblins** de cada cor, e os goblins _n_ e _21 − n_ têm as mesmas características.

| Característica | Ícone sugerido             | Onde importa                                                                          |
| -------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| **Chapéu**     | chapéu pontudo             | Chapéu Pontudo (+2); emprestada pelo Rei Quebra-Crânio e pela Rainha Dente-de-Ouro    |
| **Cicatriz**   | risco cruzado no rosto     | Machucado (−3), Cicatrizes Compartilhadas; emprestada pelo Rei Quebra-Crânio          |
| **Monóculo**   | lente redonda com corrente | Monóculo Polido (+1 por goblin); emprestada pelo Rei Olho-de-Vidro                    |
| **Fedorento**  | três ondinhas de cheiro    | Fuga Fedorenta, Nariz de Ferro (+3); emprestada pelo Rei Olho-de-Vidro                |
| **Maluco**     | espiral                    | Poção Maluca (−1 por goblin); emprestada pela Rainha Musgo-Podre                      |
| **Pereba**     | manchinhas na pele         | Pomada de Pereba (−2); emprestada pela Rainha Musgo-Podre e pela Rainha Dente-de-Ouro |

Todas também podem ser zeradas pela **Maldição** e copiadas pelo **Disfarce**.

### Tabela dos goblins (vale para as 4 cores)

| Goblin | Características               | Goblin | Características               |
| ------ | ----------------------------- | ------ | ----------------------------- |
| 1      | Chapéu · Fedorento · Pereba   | 20     | Chapéu · Fedorento · Pereba   |
| 2      | Monóculo · Fedorento · Maluco | 19     | Monóculo · Fedorento · Maluco |
| 3      | Chapéu · Cicatriz · Monóculo  | 18     | Chapéu · Cicatriz · Monóculo  |
| 4      | Monóculo · Fedorento · Pereba | 17     | Monóculo · Fedorento · Pereba |
| 5      | Chapéu · Cicatriz · Fedorento | 16     | Chapéu · Cicatriz · Fedorento |
| 6      | Cicatriz · Maluco · Pereba    | 15     | Cicatriz · Maluco · Pereba    |
| 7      | Chapéu · Monóculo · Maluco    | 14     | Chapéu · Monóculo · Maluco    |
| 8      | Cicatriz · Monóculo · Pereba  | 13     | Cicatriz · Monóculo · Pereba  |
| 9      | Cicatriz · Fedorento · Maluco | 12     | Cicatriz · Fedorento · Maluco |
| 10     | Chapéu · Maluco · Pereba      | 11     | Chapéu · Maluco · Pereba      |

### De onde veio cada característica (troca em relação à v6.2)

| Antes (v6.2) | Agora         | Item ligado                                                       |
| ------------ | ------------- | ----------------------------------------------------------------- |
| Chapéu       | **Chapéu**    | Chapéu Pontudo (sem mudança)                                      |
| Barba        | **Cicatriz**  | **Cicatrizes Compartilhadas** (item novo; a Barba não tinha item) |
| Óculos       | **Monóculo**  | Óculos de Grau → **Monóculo Polido**                              |
| Chinelo      | **Fedorento** | Chinelo Veloz → **Fuga Fedorenta**                                |
| Maluco       | **Maluco**    | Poção Maluca (sem mudança)                                        |
| Verruga      | **Pereba**    | Pomada de Verruga → **Pomada de Pereba**                          |

A posição de cada característica nos goblins não mudou, só o nome. Por isso o equilíbrio testado na v6.2 continua valendo.

> **Atenção:** a habilidade do Rei Azul se chamava "Monóculo" e passou a se chamar **Lente de Vidro**, para não confundir com a característica.

## 4. Preparação

1. Cada jogador escolhe um território, pega os **20 goblins** dessa cor (a mão inicial) e o rei ou a rainha do território.
2. Os cemitérios começam vazios.
3. Embaralhe separadamente os montes de **monstros**, **itens** e **Caos**, virados para baixo.
4. Sorteie o **Chefe da Toca**.
5. Na primeira rodada não há Caos ativo.

## 5. A rodada, passo a passo

### Início da rodada

1. O Caos revelado no fim da rodada anterior passa a valer.
   - **Troca-Troca:** todos passam a mão inteira para a esquerda.
2. **Brotar** (Rainha Musgo-Podre), se a condição valer.
3. Anote quem tem a **menor mão** (Cravada do Azarão) e quem tem a **maior mão** (Caça ao Líder).
4. **Vingança do Cemitério:** quem tem o maior cemitério (pelo menos 1 carta) compra 1 item. Se houver empate, todos os empatados compram.
5. **Necromante:** quem tem cemitério troca a mão pelo cemitério nesta rodada.

### ☾ Monstro Dormindo

6. Puxe o monstro da rodada virado para baixo.
   - Com **Monstros Opostos**, puxe um monstro baixo (até 24) agora; o alto vem na revelação.
   - Se o monte acabou, embaralhe os monstros usados e forme um novo monte.
7. Resolva os Caos que acontecem antes da escolha:
   - **Pedágio:** cada um dá 1 carta à sua escolha para o jogador da esquerda.
   - **Duelo:** o Chefe da Toca escolhe dois jogadores; só eles jogam.
8. Use itens ☾, se quiser.
9. Escolha em segredo de **1 a 3 goblins**.
   - **Tambor de Guerra:** até 4.
   - **Corrida dos Pequenos:** pelo menos 2.
   - **Palpite Aberto:** cada um joga na ordem, a partir do Chefe da Toca, vendo os palpites anteriores.
10. Resolva os Caos que mexem nas jogadas:
    - **Às Cegas:** o jogador à sua direita troca, às cegas, 1 goblin seu jogado por 1 carta da sua mão.
    - **Roleta:** cada um puxa às cegas 1 carta do jogador à direita e soma ao palpite.

### ☀ Monstro Acordado

11. Revele o monstro e todas as jogadas.
    - **Monstros Opostos:** revela também o monstro alto.
    - **Monstro Mutante:** vira um segundo monstro; se for par, o monstro vale +5, se for ímpar, −5.
    - Se o monstro tiver efeito impresso (seção 13), leia em voz alta.
12. **Janela de itens, sem ordem:**
    - Todos que jogaram podem usar itens ☀ a qualquer momento.
    - Quando alguém usa um item, qualquer jogador pode cancelá-lo com **NÃO!**, e outro NÃO! pode responder. Vale o último NÃO!.
    - A janela reabre depois de cada item e só fecha quando **todos passarem**.
13. Calcule o resultado (seção 6).

### Fim da rodada

14. **Perdedores** descartam as cartas jogadas no próprio cemitério (veja Amuleto, Fuga Fedorenta, Banquete e a regra da última carta).
15. **Necromante:** devolva as mãos (seção 12).
16. **Vencedores** roubam ou eliminam cartas e compram item (seção 7).
17. **Pressa não Compensa:** quem perdeu tendo jogado 3 goblins ou mais compra 1 item.
18. **Feira dos Goblins** (se ativa): todos compram 1 item.
19. Quem ficou sem cartas na mão está **falido** e sai.
20. O Chefe da Toca passa para a esquerda.
21. Revele a carta de **Caos** da próxima rodada.

## 6. Como calcular o resultado

1. **Soma:** some o valor dos goblins jogados, mais os itens de soma (Porrete, Pé de Cabra etc.).
   - **Maldição:** goblins com a característica sorteada valem 0.
   - **Mínimo Máximo:** cada goblin vale 21 − número impresso.
   - **Soma do Vizinho:** soma metade da soma do jogador à esquerda, arredondando para baixo.
2. **Alvo:** o valor do monstro, ajustado pelo Caos (Gigante +10, Anão −6, Mutante ±5) e pelo Grito de Guerra.
3. **Distância** = |soma − alvo| − margem de território (seção 8), nunca abaixo de 0.
   - **Monstros Opostos:** vale o monstro mais perto da sua soma.
   - **Ímã:** somas de 20 a 30 contam 5 mais longe.
4. **Quem sai antes de comparar:**
   - **Zona Proibida:** somas de 20 a 30 perdem.
   - **Somas Iguais se Anulam:** quem tem a mesma soma que outro jogador perde.
5. **Vencedor:**
   - **Mundo Invertido:** vence quem ficar mais longe (sem margem).
   - **Corrida dos Pequenos / dos Grandes:** vence a menor ou a maior soma (sem margem, ninguém crava).
   - **Caso normal:** quem tem distância 0 **cravou**. Se alguém cravou, só quem cravou ganha.
   - Se ninguém cravou, vence quem tem a **menor distância** (aproximação).
   - **Caça ao Líder:** quem tinha a maior mão no início da rodada só vence se cravar.
   - **Monstros Opostos:** acertar um dos monstros conta como aproximação, não como cravada.
6. **Empates:** todos os empatados vencem.

## 7. Ganhar e perder

| Resultado             | O que acontece                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cravou**            | Rouba **2 cartas às cegas** (1 de cada oponente ou 2 do mesmo) e compra 1 item.                                                             |
| **Cravada do Azarão** | Se você cravou tendo a menor mão da mesa (no início da rodada), rouba **3** em vez de 2. Não vale se todos tinham o mesmo número de cartas. |
| **Mais perto**        | Elimina **1 carta às cegas** da mão de um oponente (vai para o cemitério dele) e compra 1 item.                                             |
| **Perdeu**            | Descarta as cartas jogadas no próprio cemitério.                                                                                            |
| **Vencedor**          | As cartas jogadas voltam para a mão.                                                                                                        |

- **Duelo:** só os dois escolhidos jogam. O vencedor rouba 1 carta do perdedor (mesmo se cravar) e compra 1 item. Se empatarem, os dois vencem e valem as regras normais, só entre eles. Com só 2 jogadores na mesa, o Duelo é entre eles.
- **Pressa não Compensa:** a carta puxada na Roleta não conta para os 3 goblins. Vale mesmo para quem não descartou (Amuleto, última carta).
- **Última carta:** se restam 2 jogadores com 1 carta cada, quem perde não descarta, e quem vence por aproximação só compra o item. Cravar ainda rouba.
- **Escudo de Panela:** ninguém rouba nem elimina cartas de quem preparou o Escudo nesta rodada.
- **Armadilha:** para cada carta que alguém tira da sua mão, você pode revelar uma Armadilha e o atacante perde 1 carta (seção 11).
- **Amigo dos Fracos** (efeito do monstro): o item de quem venceu vai para quem tem **menos itens na mão** (empate: todos os empatados). O roubo e a eliminação continuam iguais.

## 8. Território

- Se pelo menos um goblin jogado for de um território do monstro, você tem margem de **±1, uma vez só**.
- A cor que conta é a do **goblin**, então goblins roubados de outras cores ajudam com outros monstros.
- **Bandeira:** para você, o monstro também é do território escolhido.
- **Lente de Vidro** (Rei Azul): margem **±2** quando o monstro for do território Azul, com qualquer goblin. Vale também quando a Bandeira escolhida é Azul.
- Com Mundo Invertido e as Corridas não há margem.

## 9. Cemitério

- Cada jogador tem o seu, aberto na mesa. Recebe as cartas descartadas e eliminadas.
- Cartas saem de lá com:
  - **Pá de Coveiro:** do seu, à sua escolha.
  - **Cicatrizes Compartilhadas:** de qualquer cemitério (inclusive o seu e o de quem já faliu), à sua escolha, 1 goblin com Cicatriz, em troca de 1 goblin com Cicatriz da sua mão.
  - **Ladrão de Túmulos:** do de outro jogador, às cegas.
  - **Brotar:** do seu, escolhida pelo jogador à direita.
  - **Necromante:** joga com o cemitério e fica com as cartas se vencer.
- O tamanho do cemitério ativa a **Vingança do Cemitério**.

## 10. Reis e rainhas

| Território | Carta                    | Características emprestadas → quem recebe  | Habilidade                                                                                                                                                       |
| ---------- | ------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vermelho   | **Rei Quebra-Crânio**    | Chapéu · Cicatriz → goblins **pares**      | **Fúria:** ao vencer por aproximação, elimina 2 cartas em vez de 1; ao cravar, além de roubar, elimina 1 carta.                                                  |
| Verde      | **Rainha Musgo-Podre**   | Pereba · Maluco → goblins **de 1 a 10**    | **Brotar:** no início da rodada, se tiver menos cartas que todos os rivais, o jogador à sua direita escolhe 1 carta do seu cemitério e ela volta para a sua mão. |
| Azul       | **Rei Olho-de-Vidro**    | Monóculo · Fedorento → goblins **ímpares** | **Lente de Vidro:** quando o monstro for do território Azul, sua margem é ±2, jogando qualquer goblin.                                                           |
| Amarelo    | **Rainha Dente-de-Ouro** | Chapéu · Pereba → goblins **de 11 a 20**   | **Mercadora:** sempre que compra um item, compra 2 e fica com o melhor.                                                                                          |

- O rei ou a rainha **empresta as 2 características** ao grupo de goblins da carta (de qualquer cor) que o dono jogar.
- **Maldição:** se a característica sorteada for uma das do rei ou da rainha, ele fica desligado nesta rodada: sem habilidade e sem empréstimo. Uma característica ganha pelo Disfarce também conta para a Maldição.
- **Fúria** só vale fora do Duelo de um vencedor só.
- Reis e rainhas só mudam de dono com o item **Coroa Trocada**. A habilidade vai junto com a carta.

## 11. Itens (62 cartas)

- **Limite de 3 itens na mão.** Se você tem 3 e compra outro (vencendo, na Feira, pelo Saco de Moedas, com a Mão Leve, com o Mapa do Tesouro…), escolha 1 dos 4 para mandar para o **fundo do monte de itens**.
- Item usado vai para o descarte de itens. Quando o monte acaba, embaralhe o descarte.
- Itens não são secretos depois de usados: todos veem quem usou o quê.
- **Preparados:** Escudo de Panela, Amuleto e Fuga Fedorenta são usados na janela ☀ e valem até o fim da rodada.
- **Reações:** NÃO! e Armadilha ficam escondidas na mão e não são usadas na janela. Você as revela na hora em que acontece o que elas respondem (no digital, o jogo pergunta).
- **NÃO!:** cancela um item ☀ ou uma Armadilha de qualquer jogador e pode ser respondido com outro NÃO!.

| Cópias | Item                          | Quando     | Texto da carta                                                                                                                                         |
| ------ | ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2      | **Bandeira**                  | ☾ Dormindo | Escolha um território: para você, o monstro também é desse território nesta rodada.                                                                    |
| 2      | **Coroa Trocada**             | ☾ Dormindo | Troque o seu rei ou rainha com o de outro jogador.                                                                                                     |
| 2      | **Disfarce**                  | ☾ Dormindo | Escolha uma característica: todos os goblins que você jogar nesta rodada a têm.                                                                        |
| 2      | **Ladrão de Túmulos**         | ☾ Dormindo | Embaralhe o cemitério de outro jogador virado para baixo e puxe 1 carta às cegas.                                                                      |
| 2      | **Luneta**                    | ☾ Dormindo | Espie o valor do monstro.                                                                                                                              |
| 2      | **Mapa do Tesouro**           | ☾ Dormindo | Olhe o monte de itens, escolha 1 carta e fique com ela. Depois embaralhe o monte.                                                                      |
| 2      | **Mão Leve**                  | ☾ Dormindo | Roube, às cegas, 1 item da mão de um oponente.                                                                                                         |
| 2      | **Profecia do Caos**          | ☾ Dormindo | Olhe o monte de Caos e escolha a carta da próxima rodada. Embaralhe o resto e coloque a escolhida no topo.                                             |
| 2      | **Cicatrizes Compartilhadas** | ☾ Dormindo | Mande 1 goblin com Cicatriz da sua mão para o seu cemitério. Depois pegue, à sua escolha, 1 goblin com Cicatriz de qualquer cemitério.                 |
| 2      | **Pá de Coveiro**             | ☾ Dormindo | Puxe 1 carta à sua escolha do seu cemitério.                                                                                                           |
| 2      | **Saco de Moedas**            | Na hora    | Compre 2 itens agora. É usado assim que entra na sua mão.                                                                                              |
| 2      | **Sacrifício**                | ☾ Dormindo | Mande 1 goblin seu para o seu cemitério e pegue, às cegas, 1 carta da mão de um oponente.                                                              |
| 2      | **Tambor de Guerra**          | ☾ Dormindo | Nesta rodada você pode jogar até 4 goblins.                                                                                                            |
| 2      | **Ajuste Fino**               | ☀ Acordado | De −3 a +3 na sua soma, à sua escolha.                                                                                                                 |
| 2      | **Amuleto**                   | ☀ Acordado | Se você perder nesta rodada, não descarta nada.                                                                                                        |
| 2      | **Chapéu Pontudo**            | ☀ Acordado | Se jogou goblin de Chapéu: +2 na sua soma.                                                                                                             |
| 2      | **Escudo de Panela**          | ☀ Acordado | Nesta rodada ninguém rouba nem elimina cartas suas.                                                                                                    |
| 2      | **Fuga Fedorenta**            | ☀ Acordado | Se você perder nesta rodada, um goblin Fedorento jogado, à sua escolha, volta para a mão.                                                              |
| 2      | **Grito de Guerra**           | ☀ Acordado | O monstro vale +2 ou −2 para todos, à sua escolha.                                                                                                     |
| 2      | **Isca de Monstro**           | ☀ Acordado | Depois que o monstro acorda, troque-o pelo próximo do monte. O Caos da rodada continua valendo para o novo monstro.                                    |
| 2      | **Machucado**                 | ☀ Acordado | Se jogou goblin com Cicatriz: −3 na sua soma.                                                                                                          |
| 2      | **Monóculo Polido**           | ☀ Acordado | +1 na sua soma para cada goblin de Monóculo jogado.                                                                                                    |
| 2      | **Nariz de Ferro**            | ☀ Acordado | Se jogou goblin Fedorento: +3 na sua soma.                                                                                                             |
| 2      | **Pomada de Pereba**          | ☀ Acordado | Se jogou goblin com Pereba: −2 na sua soma.                                                                                                            |
| 3      | **Porrete**                   | ☀ Acordado | +2 na sua soma.                                                                                                                                        |
| 2      | **Poção Maluca**              | ☀ Acordado | −1 na sua soma para cada goblin Maluco jogado.                                                                                                         |
| 3      | **Pé de Cabra**               | ☀ Acordado | −2 na sua soma.                                                                                                                                        |
| 2      | **Armadilha**                 | ⚡ Reação  | Quando alguém roubar ou eliminar uma carta da sua mão, revele esta carta: quem atacou perde 1 carta (o jogador à direita dele escolhe qual, às cegas). |
| 4      | **NÃO!**                      | ⚡ Reação  | Cancele um item de Monstro Acordado ou uma Armadilha de qualquer jogador. Pode ser respondido com outro NÃO!.                                          |

**Total: 62 cartas** (60 + 2 Cicatrizes Compartilhadas).

- **Itens de característica** (todos ☀): ajuste fixo na soma, sem escolha de valor, como o Porrete e o Pé de Cabra. Três somam (Chapéu Pontudo +2, Monóculo Polido +1 por goblin de Monóculo, Nariz de Ferro +3) e três subtraem (Pomada de Pereba −2, Poção Maluca −1 por goblin Maluco, Machucado −3). Os de valor fixo valem uma vez, basta 1 goblin com a característica. Conta a característica do goblin jogado com o empréstimo do rei ou rainha e com o Disfarce (ex.: Monóculo Polido com Tambor de Guerra e 4 goblins de Monóculo dá +4). Sem goblin com a característica, o item não pode ser usado.
- **Isca de Monstro:** usada depois de ver o monstro; o Caos da rodada continua valendo para o novo monstro. Com Monstros Opostos, troca o monstro baixo por outro baixo.
- **Profecia do Caos:** escolhe o Caos da **próxima** rodada, porque o da rodada atual já foi revelado.
- **Disfarce:** a característica escolhida pode ser qualquer uma das 6 (Chapéu, Cicatriz, Monóculo, Fedorento, Maluco, Pereba).
- **Cicatrizes Compartilhadas:** só vale a Cicatriz **impressa** na carta (o empréstimo do rei e o Disfarce valem só para goblins jogados). O goblin pego tem que ser outro, não o que você acabou de mandar, e mantém a cor original. A escolha é à vista, porque os cemitérios são abertos. Não é roubo da mão de ninguém, então não dispara a Armadilha. Precisa de pelo menos 2 cartas na mão e fica bloqueado na rodada do Necromante. Sua mão fica do mesmo tamanho e seu cemitério ganha 1 carta (conta para a Vingança).
- **Saco de Moedas:** não fica na mão. Quando você o compra (ou pega com Mão Leve ou Mapa do Tesouro), ele vai para o descarte e você compra 2 itens.
- **Armadilha:**
  - Fica escondida na sua mão de itens e continua ocupando espaço no limite de 3.
  - Dispara quando outro jogador tira uma carta da sua **mão**: roubo ou eliminação de quem vence a rodada (cravada, aproximação, Fúria, Cravada do Azarão), roubo do Duelo e Sacrifício.
  - **Não** dispara no Ladrão de Túmulos (pega do cemitério) nem na Mão Leve (pega item).
  - O roubo ou a eliminação acontece normalmente. A Armadilha só faz o atacante perder 1 carta da mão dele, que vai para o cemitério do atacante. Se ele não tiver mais cartas na mão, não acontece nada.
  - Uma Armadilha por carta tirada: se o vencedor tirar 2 ou 3 cartas suas, você pode usar uma Armadilha em cada (se tiver mais de uma).
  - Com Escudo de Panela ninguém tira cartas suas, então a Armadilha não dispara.
  - Ao revelar, qualquer outro jogador pode cancelá-la com NÃO! (com a cadeia normal de NÃO!). Valendo ou cancelada, ela vai para o descarte e aparece como item usado no seu assento (riscada se foi cancelada).
- **Poção Maluca:** não tem mais dobro nem metade; é −1 por goblin Maluco jogado.
- **Luneta com Monstros Opostos:** mostra só o monstro baixo.
- **Grito de Guerra com Monstros Opostos:** vale para os dois monstros.
- **Fuga Fedorenta:** continua como era; a carta puxada na Roleta não pode ser salva. O Fedorento agora tem dois itens: Fuga Fedorenta e Nariz de Ferro.

## 12. Caos (50 cartas)

O Caos muda o jeito de jogar da mesa em três frentes:

- **Tira o meio:** acabar com a vantagem de mirar sempre no meio.
- **Aleatoriedade:** deixar a rodada imprevisível.
- **Interação:** obrigar os jogadores a reagir uns aos outros.

| Cópias | Caos                                     | Grupo         | Efeito na rodada seguinte, para todos                                                                                                                                                                  |
| ------ | ---------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2      | **Corrida dos Grandes**                  | Tira o meio   | O monstro é ignorado: vence a maior soma. Ninguém crava.                                                                                                                                               |
| 2      | **Corrida dos Pequenos**                 | Tira o meio   | O monstro é ignorado: vence a menor soma. Todos jogam pelo menos 2 goblins (se tiverem). Ninguém crava.                                                                                                |
| 2      | **Monstro Anão**                         | Tira o meio   | O monstro vale −6 (mínimo 1).                                                                                                                                                                          |
| 2      | **Monstro Gigante**                      | Tira o meio   | O monstro vale +10.                                                                                                                                                                                    |
| 3      | **Monstros Opostos**                     | Tira o meio   | Dois monstros: um baixo (até 24) e um alto (26 ou mais). Vale o mais perto da sua soma. Acertar um deles conta como aproximação: elimina 1 carta, não rouba.                                           |
| 2      | **Mundo Invertido**                      | Tira o meio   | Vence quem ficar mais longe do monstro. Ninguém crava.                                                                                                                                                 |
| 2      | **Zona Proibida**                        | Tira o meio   | Somas de 20 a 30 perdem automaticamente.                                                                                                                                                               |
| 3      | **Ímã**                                  | Tira o meio   | Somas de 20 a 30 contam como se estivessem 5 mais longe do monstro.                                                                                                                                    |
| 2      | **Maldição**                             | Aleatoriedade | Sorteie 1 das 6 características (Chapéu, Cicatriz, Monóculo, Fedorento, Maluco, Pereba): goblins com ela valem 0. Reis e rainhas com ela ficam desligados.                                             |
| 2      | **Monstro Mutante**                      | Aleatoriedade | Na revelação vira um segundo monstro: se for par, o monstro vale +5; se for ímpar, −5.                                                                                                                 |
| 2      | **Mínimo Máximo**                        | Aleatoriedade | Os valores dos goblins se invertem: 1 vale 20, 2 vale 19, 3 vale 18 … 20 vale 1.                                                                                                                       |
| 2      | **Necromante** (arte: goblin necromante) | Aleatoriedade | Coloque seu cemitério na sua mão: nesta rodada você joga só com essas cartas. Quem vencer fica com as cartas que jogou; o resto volta para o cemitério. Quem não tem cemitério joga com a própria mão. |
| 2      | **Troca-Troca**                          | Aleatoriedade | No início da rodada, todos passam a mão inteira para o jogador da esquerda.                                                                                                                            |
| 3      | **Às Cegas**                             | Aleatoriedade | Depois que todos jogam, o jogador à sua direita escolhe, às cegas, 1 dos seus goblins jogados e troca por 1 carta da sua mão.                                                                          |
| 2      | **Banquete**                             | Interação     | As cartas que os perdedores descartariam vão para a mão dos vencedores.                                                                                                                                |
| 2      | **Caça ao Líder**                        | Interação     | Quem tem mais cartas no início da rodada não pode vencer por aproximação; só se cravar.                                                                                                                |
| 2      | **Duelo**                                | Interação     | O Chefe da Toca escolhe dois jogadores para disputar; os outros não jogam. O vencedor rouba 1 carta do perdedor e compra 1 item.                                                                       |
| 2      | **Feira dos Goblins**                    | Interação     | No fim desta rodada, todos os jogadores compram 1 item.                                                                                                                                                |
| 2      | **Palpite Aberto**                       | Interação     | Cada um joga na ordem, a partir do Chefe da Toca, vendo os palpites de quem jogou antes.                                                                                                               |
| 2      | **Pedágio**                              | Interação     | Antes de jogar, cada um escolhe 1 carta da mão para dar ao jogador da esquerda.                                                                                                                        |
| 2      | **Roleta**                               | Interação     | Depois que todos jogam, cada um puxa às cegas 1 carta da mão do jogador à sua direita e soma ao seu palpite. No fim da rodada a carta volta para o dono.                                               |
| 2      | **Soma do Vizinho**                      | Interação     | Sua soma ganha metade da soma do jogador à sua esquerda (arredondando para baixo).                                                                                                                     |
| 3      | **Somas Iguais se Anulam**               | Interação     | Jogadores com a mesma soma perdem todos.                                                                                                                                                               |

**Total: 50 cartas.**

- **Roleta:** a carta puxada conta no seu palpite (valor, território e características), mas não é sua. Se você perder, ela não vai para o seu cemitério; volta para a mão do dono no fim da rodada.
- **Mínimo Máximo:** só o valor muda. As características e o grupo que recebe o empréstimo do rei seguem o número impresso.
- **Necromante:**
  - Quem tem cemitério joga só com as cartas dele nesta rodada. Quem não tem joga com a própria mão.
  - **Quem vence** fica com as cartas do cemitério que jogou; o resto do cemitério volta para lá.
  - **Quem perde** não perde nada da mão de verdade: as cartas jogadas voltam para o cemitério.
  - Os vencedores ainda roubam ou eliminam das mãos normais dos rivais.
- **Maldição no jogo físico:** para sortear a característica, use um dado de 6 faces (1 Chapéu, 2 Cicatriz, 3 Monóculo, 4 Fedorento, 5 Maluco, 6 Pereba) ou deixe o jogador à direita do Chefe da Toca escolher.

## 13. Monstros (31 cartas)

- Valores de 10 a 40, um de cada.
- **Território principal:** segue o rodízio Vermelho → Verde → Azul → Amarelo a partir do 10.
- **Segundo território:** 11 monstros têm também um segundo (10, 13, 16 … 40, de 3 em 3).
- **Efeito impresso:** os monstros 10, 15, 20, 25, 30, 35 e 40 têm o efeito **Amigo dos Fracos**, revelado só quando o monstro acorda.

| Monstro | Território(s)    | Efeito               |
| ------- | ---------------- | -------------------- |
| 10      | Vermelho e Verde | **Amigo dos Fracos** |
| 11      | Verde            | —                    |
| 12      | Azul             | —                    |
| 13      | Amarelo e Verde  | —                    |
| 14      | Vermelho         | —                    |
| 15      | Verde            | **Amigo dos Fracos** |
| 16      | Azul e Amarelo   | —                    |
| 17      | Amarelo          | —                    |
| 18      | Vermelho         | —                    |
| 19      | Verde e Amarelo  | —                    |
| 20      | Azul             | **Amigo dos Fracos** |
| 21      | Amarelo          | —                    |
| 22      | Vermelho e Verde | —                    |
| 23      | Verde            | —                    |
| 24      | Azul             | —                    |
| 25      | Amarelo e Verde  | **Amigo dos Fracos** |
| 26      | Vermelho         | —                    |
| 27      | Verde            | —                    |
| 28      | Azul e Amarelo   | —                    |
| 29      | Amarelo          | —                    |
| 30      | Vermelho         | **Amigo dos Fracos** |
| 31      | Verde e Amarelo  | —                    |
| 32      | Azul             | —                    |
| 33      | Amarelo          | —                    |
| 34      | Vermelho e Verde | —                    |
| 35      | Verde            | **Amigo dos Fracos** |
| 36      | Azul             | —                    |
| 37      | Amarelo e Verde  | —                    |
| 38      | Vermelho         | —                    |
| 39      | Verde            | —                    |
| 40      | Azul e Amarelo   | **Amigo dos Fracos** |

- **Amigo dos Fracos:** "Quando derrotado, quem compra o item é o jogador com menos itens na mão (empate: todos os empatados compram)." Com Monstros Opostos, vale se qualquer um dos dois monstros tiver o efeito.

## 14. Regras de virada

Existem para que quem está perdendo continue com chance de voltar ao jogo.

| Regra                     | Quando                | Efeito                                                                 |
| ------------------------- | --------------------- | ---------------------------------------------------------------------- |
| **Limite de 3 itens**     | Sempre                | Quem está na frente não acumula itens sem fim.                         |
| **Vingança do Cemitério** | Início da rodada      | Quem tem o maior cemitério compra 1 item (empate: todos os empatados). |
| **Cravada do Azarão**     | Ao cravar             | Quem tinha a menor mão da mesa rouba 3 cartas em vez de 2.             |
| **Pressa não Compensa**   | Fim da rodada         | Quem perde tendo jogado 3 goblins ou mais compra 1 item.               |
| **Amigo dos Fracos**      | Monstros com o efeito | O item vai para quem tem menos itens.                                  |
| **Feira dos Goblins**     | Caos                  | Todos compram 1 item no fim da rodada.                                 |
| **Necromante**            | Caos                  | Todos jogam com o cemitério; quem vence recupera as cartas jogadas.    |

## 15. Jogo físico: sem sorteio automático

- **Efeito "aleatório" na sua própria mão ou cemitério:** quem escolhe é o **jogador à sua direita** (Brotar, Às Cegas, Armadilha).
- **Pegar algo de outro jogador:** é **às cegas**, com as cartas viradas para baixo (roubar, eliminar, Sacrifício, Mão Leve, Roleta). No Ladrão de Túmulos, o cemitério é embaralhado virado para baixo antes.
- **Sorteio da Maldição:** dado de 6 faces ou escolha do jogador à direita do Chefe da Toca (seção 12).

## 16. Fim de jogo

- Vence o **último jogador com cartas na mão**.
- Quem falir pode continuar assistindo ou sair da partida.
- Se os últimos jogadores falirem todos na mesma rodada, a partida termina **empatada** entre eles.
- Na versão digital existe um limite de segurança de 300 rodadas: se for atingido, vence quem tiver mais cartas na mão (empate se mais de um tiver o máximo).

## 17. Casos especiais

- **Jogador com menos cartas do que o mínimo pedido** (ex.: Corrida dos Pequenos): joga todas as que tiver.
- **Monte de monstros acabou:** embaralhe os usados (menos o da mesa) e continue.
- **Itens e Caos acabaram:** embaralhe o descarte correspondente.
- **NÃO! em cadeia:** cada NÃO! inverte o anterior. Se o número de NÃO! usados for ímpar, o item (ou a Armadilha) foi cancelado; o item cancelado também vai para o descarte.
- **Vários vencedores e Banquete:** as cartas dos perdedores são distribuídas entre os vencedores, uma de cada vez, na ordem da mesa.
- **Coroa Trocada:** o novo dono passa a usar a habilidade e o empréstimo na hora.
- **Roubo de goblin de outra cor:** a carta mantém a cor original. Ela conta para o território daquela cor e, se for descartada, vai para o cemitério de quem a tinha na mão.

## 18. Referência para implementação

Correspondência com o código atual (`src/game/data.ts`, `src/game/rules.ts`, `src/game/engine.ts`). As chaves internas continuam as mesmas; só os textos mudam.

| Bit | Chave | Nome antigo | Nome novo | Ícone (`TICO`) |
| --- | ----- | ----------- | --------- | -------------- |
| 1   | `CH`  | Chapéu      | Chapéu    | `hat`          |
| 2   | `BA`  | Barba       | Cicatriz  | `scar`         |
| 4   | `OC`  | Óculos      | Monóculo  | `monocle`      |
| 8   | `CN`  | Chinelo     | Fedorento | `stink`        |
| 16  | `MA`  | Maluco      | Maluco    | `spiral`       |
| 32  | `VE`  | Verruga     | Pereba    | `sore`         |

**Conferido no código (bate com este documento):** `TNAME`, `TICO`, a tabela `TR` dos goblins, os 4 reis e rainhas (características, grupos e o nome Lente de Vidro), as cópias e os nomes dos 62 itens (Monóculo Polido, Fuga Fedorenta, Pomada de Pereba) e dos 50 Caos, os 31 monstros (territórios e Amigo dos Fracos), a tela de regras e todas as regras das seções 5 a 17.

- As chaves internas dos itens continuam `CHAPEU`, `OCULOS`, `CHINELO`, `POMADA` e `POCAO`. Itens novos: `NARIZ` (Nariz de Ferro) e `MACHUCADO` (Machucado), ambos em `NUMERIC`.
- **Itens de característica:** `TRAIT_D` (`rules.ts`) dá a característica e o ajuste de cada um; `itemOptions` devolve uma única opção (`[{ d, label }]`) ou `[]`, contando com `traitsOf`. `TRAIT_ITEM` (`data.ts`) agora é uma lista por característica (Fedorento: Fuga Fedorenta e Nariz de Ferro; Cicatriz: Machucado e Cicatrizes Compartilhadas), usada pela dica do goblin.
- **Cicatrizes Compartilhadas:** chave `CICATRIZ` (em `TRAIT_ITEM[BA]`). `scarred()` e `scarGraves()` (`rules.ts`) olham só a Cicatriz impressa (`TR[gv(g)] & BA`), nunca `traitsOf`. Os argumentos são `g` (goblin da mão), `g2` (goblin pego) e `target` (dono do cemitério).
- **Reações:** `REACT` (`data.ts`) lista NÃO! e Armadilha. Elas não têm botão (a bandeja mostra "reação") e não entram em `canUse(..., 'window')`. Na carta continuam marcadas como ☀.
- **Armadilha:** `trap()` (`engine.ts`) roda depois de cada `takeCard` e do Sacrifício. Ela pergunta à vítima e roda `naoChain` (o atacante quer cancelar, o dono quer que valha, os outros bots não se metem). Os bots sempre revelam.
- **Pedidos empilhados:** se a vítima já tem um pedido aberto (ex.: escolher goblins no online), a pergunta entra na frente e o pedido anterior volta depois.
- `ARMS` (preparados) agora é só Escudo, Amuleto e Fuga Fedorenta.
- As cartas de item não têm ícone próprio (só ☾/☀), então o Monóculo Polido não se confunde com o ícone da característica Monóculo.

- **Totais:** 62 itens, 50 Caos, 31 monstros, 80 goblins.

## 19. Histórico de versões

| Versão    | Resumo                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1–v4     | Jogo com baralho comum (naipes 1–10); evolução das regras de erro, empate e ações.                                                                                                                                                                                                                                                                                                                                                                            |
| v5 / v5.1 | Tema goblins, estilo 21 (estouro), cartas de ação dupla face; versão visual com tutorial.                                                                                                                                                                                                                                                                                                                                                                     |
| v6        | Monstros 10–40, sem estouro, cravar rouba, reis e rainhas, Itens e Caos separados.                                                                                                                                                                                                                                                                                                                                                                            |
| v6.1      | Caos contra o meio, janela de itens livre com NÃO! em cadeia, Monóculo do Rei Azul, bots com personalidade, sem sorteio automático.                                                                                                                                                                                                                                                                                                                           |
| v6.2      | Limite de 3 itens, regras de virada, monstros com efeito, Mapa do Tesouro, Profecia do Caos, Mínimo Máximo, Feira dos Goblins e Necromante.                                                                                                                                                                                                                                                                                                                   |
| **v7**    | Pereba, Monóculo, Chapéu, Maluco, Fedorento e Cicatriz; itens renomeados; habilidade do Rei Azul passa a se chamar Lente de Vidro; Armadilha vira reação (revelada quando tiram uma carta sua, cancelável com NÃO!); item novo Cicatrizes Compartilhadas; itens de característica padronizados (Chapéu +2, Monóculo +1/goblin, Nariz de Ferro +3, Pomada −2, Poção −1/goblin, Machucado −3); monte de itens com 60 cartas (62 com Cicatrizes Compartilhadas). |
