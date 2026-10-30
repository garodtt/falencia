# 🧌 Falência: Goblins — v7

## Arquivos desta versão

- **Jogar agora (online, com mesas):** [https://claude.ai/artifact/N3gHyzasaT6imcWKicjB2E](https://claude.ai/artifact/N3gHyzasaT6imcWKicjB2E)
- **Código do projeto:** [https://github.com/garodtt/falencia](https://github.com/garodtt/falencia) (versão online gratuita pelo GitHub Pages do repositório)
- **Manual completo (PDF, 10 páginas)** e **jogo em um arquivo só** (HTML no zip, funciona offline contra bots): na página da v7 no Notion.

## Simulação da v7 final

12.000 partidas com o código atual (1.000 por mesa de 2, 3 e 4 jogadores, com bots lógicos e com bots humanos), sem erros. Comparação com a versão anterior do mesmo dia, em que a Vingança do Cemitério acontecia em toda rodada e a Maldição era Caos.

| Bots lógicos, 4 jogadores                            | Vingança em toda rodada + Maldição no Caos | Vingança e passivas nos monstros |
| ---------------------------------------------------- | ------------------------------------------ | -------------------------------- |
| Duração mediana                                      | 21 rodadas                                 | 21 rodadas                       |
| Vitórias por clã (Vermelho / Verde / Azul / Amarelo) | 25 / 23 / 26 / 26%                         | 27 / 23 / 26 / 24%               |
| Líder da rodada 10 vence                             | 37%                                        | 34%                              |
| Virada (quem esteve em último vence)                 | 62%                                        | 65%                              |
| Itens usados por partida                             | 36                                         | 27                               |
| Armadilhas valendo por partida                       | 0,9                                        | 0,7                              |

- O jogo continua equilibrado e com a mesma duração (2p 17, 3p 19, 4p 21 rodadas com bots lógicos; 13, 14 e 14 com bots humanos).
- Sem a Vingança em toda rodada, entram bem menos itens: a mesa usa cerca de 25% menos itens por partida (27 contra 36 com 4 jogadores; 21 contra 26 com bots humanos).
- Com os bots humanos, a virada ficou um pouco mais rara (2p 71→67%, 3p 69→64%, 4p 62→60%), porque a Vingança era uma regra de virada que acontecia sempre. Com os bots lógicos, ficou igual.
- Passivas: 6 dos 31 monstros, então cerca de 1 rodada em cada 5 tem uma característica zerada (com a Maldição era 1 em 25).

Uso por cópia, por partida (4 jogadores, bots lógicos):

| Item                            | Uso por cópia |
| ------------------------------- | ------------- |
| Ajuste Fino (±3, sem condição)  | 0,68          |
| Porrete (+2)                    | 0,53          |
| Nariz de Ferro (até +3)         | 0,38          |
| Chapéu Pontudo (até +2)         | 0,36          |
| Pé de Cabra (−2)                | 0,35          |
| Monóculo Polido (+1 por goblin) | 0,27          |
| Machucado (até −3)              | 0,21          |
| Pomada de Pereba (até −2)       | 0,21          |
| Fuga Fedorenta                  | 0,21          |
| Poção Maluca (−1 por goblin)    | 0,16          |

> Documento de referência das regras atuais do jogo.
> Base: versão **v6.2** (limite de 3 itens, regras de virada, monstros com efeito, Mapa do Tesouro, Profecia do Caos, Necromante).
> **Novidade deste documento:** as 6 características dos goblins foram trocadas por **Pereba, Monóculo, Chapéu, Maluco, Fedorento e Cicatriz**, e todas as cartas (goblins, itens, Caos, reis e rainhas) já usam os nomes novos.
> Todas as regras foram conferidas com o código. Onde o código e o texto antigo não batiam, vale o que o jogo faz; o que ainda falta mudar no código está na seção 18.

## 1. Visão geral

- **Jogadores:** 2 a 4.
- **Tema:** cada jogador comanda um território (Vermelho, Verde, Azul ou Amarelo) com 20 goblins e um rei ou rainha.
- **Objetivo:** ser o **último jogador com cartas na mão**.
- **Ideia central:** a cada rodada um monstro de 10 a 40 aparece dormindo (virado para baixo). Cada jogador joga em segredo de 1 a 3 goblins tentando chegar o mais perto do valor do monstro, **para cima ou para baixo**. Não existe estouro.
  - **Cravou** (acertou em cheio): rouba cartas dos rivais.
  - **Chegou mais perto:** elimina uma carta de um rival.
  - **Perdeu:** as cartas jogadas vão para o cemitério.
- Todo fim de rodada uma carta de **Caos** é revelada e muda a regra da rodada seguinte para todos.

### Conceitos-chave

Quase toda regra do jogo usa estes seis conceitos. Vale entender bem antes de jogar.

| Conceito        | O que é                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| **Soma**        | O valor dos goblins jogados, mais os itens de soma (Porrete, Pé de Cabra etc.). É o seu palpite.        |
| **Alvo**        | O valor do monstro, ajustado pelo Caos (Gigante, Anão, Mutante) e pelo Grito de Guerra.                 |
| **Distância**   | Quanto a sua soma ficou longe do alvo, para cima ou para baixo. Ex.: soma 27 e alvo 30 dão distância 3. |
| **Margem (±)**  | Um desconto na distância, ganho pelo território (seção 8). **Nunca muda a soma.**                       |
| **Cravar**      | Terminar com distância 0, já contando a margem. Rouba cartas.                                           |
| **Aproximação** | Ninguém cravou: vence a menor distância, já contando a margem. Elimina 1 carta.                         |

**Regra de ouro:**

- Regras que olham a **distância** usam a margem: cravar, aproximação, Monstros Opostos, Caça ao Líder, Ímã (os +5 entram depois da margem).
- Regras que olham a **soma** ignoram a margem: Corrida dos Pequenos, Corrida dos Grandes, Zona Proibida, Somas Iguais se Anulam, Soma do Vizinho.
- O **Mundo Invertido** olha a distância, mas sem margem.

## 2. Componentes

| Componente             | Quantidade  | Descrição                                                                                                                                                                                |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Goblins                | 4 × 20 = 80 | Uma cor por território, valores 1 a 20, cada um com 2 características.                                                                                                                   |
| Monstros               | 31          | Valores 10 a 40. Cada monstro é de 1 ou 2 territórios; alguns têm efeito impresso (Amigo dos Fracos, Vingança do Cemitério e Cravada do Azarão) ou passiva de característica (seção 13). |
| Itens                  | 62          | Cada um marcado ☾ **Monstro Dormindo** (antes da revelação), ☀ **Monstro Acordado** (depois) ou ⚡ **Reação** (na hora em que algo acontece).                                            |
| Caos                   | 50          | Um revelado no fim de cada rodada; muda a regra da rodada seguinte para todos.                                                                                                           |
| Reis e rainhas         | 4           | Um por território: habilidade, 1 característica herdada por 5 goblins.                                                                                                                   |
| Marcador Chefe da Toca | 1           | Define quem começa e quem decide o Duelo. Passa para a esquerda a cada rodada.                                                                                                           |

## 3. Características dos goblins

Cada goblin tem **2 de 6 características** impressas. Os goblins _n_ e _21 − n_ (1 e 20, 2 e 19 … 10 e 11) têm as mesmas características. Assim, cada característica tem a mesma quantidade de goblins baixos e altos.

Além disso, **5 goblins de cada cor herdam a característica do seu rei ou rainha**. Ela vem impressa na carta com uma coroa e é **fixa no goblin**: vale em qualquer mão, inclusive quando o goblin é roubado. Cada cor tem, então, **15 goblins com 2 características e 5 com 3**.

| Território | Rei ou rainha        | Característica herdada | Goblins que herdam |
| ---------- | -------------------- | ---------------------- | ------------------ |
| Vermelho   | Rei Quebra-Crânio    | Cicatriz               | 1 a 5              |
| Azul       | Rei Olho-de-Vidro    | Monóculo               | 6 a 10             |
| Verde      | Rainha Musgo-Podre   | Maluco                 | 11 a 15            |
| Amarelo    | Rainha Dente-de-Ouro | Pereba                 | 16 a 20            |

Exemplo: o 8 Azul tem Fedorento · Pereba impressos e herda Monóculo. Ele joga com as 3 características em qualquer mão, mesmo na do jogador Vermelho.

- A característica herdada conta como as outras para tudo: itens, passiva dos monstros, Disfarce e Cicatrizes Compartilhadas.
- A **Coroa Trocada** troca só o rei ou a rainha e a habilidade. As características herdadas continuam nos goblins.
- A **passiva do monstro** desliga a habilidade do rei ou da rainha que tiver a característica, mas não tira a característica herdada dos goblins. Se a passiva for dessa característica, os goblins que a herdaram valem 0, como qualquer goblin com ela.

| Característica | Ícone sugerido             | Onde importa                                                                                              |
| -------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Chapéu**     | chapéu pontudo             | Chapéu Pontudo (até +2). Nenhum rei ou rainha passa essa característica.                                  |
| **Cicatriz**   | risco cruzado no rosto     | Machucado (até −3), Cicatrizes Compartilhadas. Herdada pelos goblins 1 a 5 Vermelhos (Rei Quebra-Crânio). |
| **Monóculo**   | lente redonda com corrente | Monóculo Polido (+1 por goblin). Herdada pelos goblins 6 a 10 Azuis (Rei Olho-de-Vidro).                  |
| **Fedorento**  | três ondinhas de cheiro    | Fuga Fedorenta, Nariz de Ferro (até +3). Nenhum rei ou rainha passa essa característica.                  |
| **Maluco**     | espiral                    | Poção Maluca (−1 por goblin). Herdada pelos goblins 11 a 15 Verdes (Rainha Musgo-Podre).                  |
| **Pereba**     | manchinhas na pele         | Pomada de Pereba (até −2). Herdada pelos goblins 16 a 20 Amarelos (Rainha Dente-de-Ouro).                 |

Todas também podem ser zeradas pela **passiva de um monstro** (seção 13) e copiadas pelo **Disfarce**.

### Tabela dos goblins (vale para as 4 cores)

| Goblin | Características      | Goblin | Características      |
| ------ | -------------------- | ------ | -------------------- |
| 1      | Fedorento · Maluco   | 20     | Fedorento · Maluco   |
| 2      | Monóculo · Maluco    | 19     | Monóculo · Maluco    |
| 3      | Chapéu · Monóculo    | 18     | Chapéu · Monóculo    |
| 4      | Monóculo · Fedorento | 17     | Monóculo · Fedorento |
| 5      | Chapéu · Maluco      | 16     | Chapéu · Maluco      |
| 6      | Cicatriz · Pereba    | 15     | Cicatriz · Pereba    |
| 7      | Chapéu · Cicatriz    | 14     | Chapéu · Cicatriz    |
| 8      | Fedorento · Pereba   | 13     | Fedorento · Pereba   |
| 9      | Cicatriz · Fedorento | 12     | Cicatriz · Fedorento |
| 10     | Chapéu · Pereba      | 11     | Chapéu · Pereba      |

#### 🔴 Vermelho — herdam 👑 Cicatriz

| Nº  | Características                     |
| --- | ----------------------------------- |
| 1   | Fedorento · Maluco · **Cicatriz**   |
| 2   | Monóculo · Maluco · **Cicatriz**    |
| 3   | Chapéu · Monóculo · **Cicatriz**    |
| 4   | Monóculo · Fedorento · **Cicatriz** |
| 5   | Chapéu · Maluco · **Cicatriz**      |

#### 🔵 Azul — herdam 👑 Monóculo

| Nº  | Características                     |
| --- | ----------------------------------- |
| 6   | Cicatriz · Pereba · **Monóculo**    |
| 7   | Chapéu · Cicatriz · **Monóculo**    |
| 8   | Fedorento · Pereba · **Monóculo**   |
| 9   | Cicatriz · Fedorento · **Monóculo** |
| 10  | Chapéu · Pereba · **Monóculo**      |

#### 🟢 Verde — herdam 👑 Maluco

| Nº  | Características                   |
| --- | --------------------------------- |
| 11  | Chapéu · Pereba · **Maluco**      |
| 12  | Cicatriz · Fedorento · **Maluco** |
| 13  | Fedorento · Pereba · **Maluco**   |
| 14  | Chapéu · Cicatriz · **Maluco**    |
| 15  | Cicatriz · Pereba · **Maluco**    |

#### 🟡 Amarelo — herdam 👑 Pereba

| Nº  | Características                   |
| --- | --------------------------------- |
| 16  | Chapéu · Maluco · **Pereba**      |
| 17  | Monóculo · Fedorento · **Pereba** |
| 18  | Chapéu · Monóculo · **Pereba**    |
| 19  | Monóculo · Maluco · **Pereba**    |
| 20  | Fedorento · Maluco · **Pereba**   |

> **Atenção:** a habilidade do Rei Azul se chamava "Monóculo" e passou a se chamar **Lente de Vidro**, para não confundir com a característica.

Nenhum goblin herda uma característica que já tem impressa, então os 5 de cada grupo sempre ficam com 3.

**Quantos goblins de cada cor têm cada característica:**

- **Chapéu e Fedorento:** 8 goblins em todas as cores.
- **Cicatriz, Monóculo, Maluco e Pereba:** 6 goblins, e 11 na cor que herda essa característica (Cicatriz no Vermelho, Monóculo no Azul, Maluco no Verde, Pereba no Amarelo).

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
4. **Necromante:** quem tem cemitério troca a mão pelo cemitério nesta rodada.

### ☾ Monstro Dormindo

5. Puxe o monstro da rodada virado para baixo.
   - Com **Monstros Opostos**, puxe 2 monstros do topo do monte, virados para baixo.
   - Se o monte acabou, embaralhe os monstros usados e forme um novo monte.
6. Resolva os Caos que acontecem antes da escolha:
   - **Pedágio:** cada um dá 1 carta à sua escolha para o jogador da esquerda.
   - **Duelo:** o Chefe da Toca escolhe dois jogadores; só eles jogam.
7. Use itens ☾, se quiser.
8. Escolha em segredo de **1 a 3 goblins**.
   - **Tambor de Guerra:** até 4.
   - **Corrida dos Pequenos:** pelo menos 2.
   - **Palpite Aberto:** cada um joga na ordem, a partir do Chefe da Toca, vendo os palpites anteriores.
9. Resolva os Caos que mexem nas jogadas:
   - **Às Cegas:** o jogador à sua direita troca, às cegas, 1 goblin seu jogado por 1 carta da sua mão.
   - **Roleta:** cada um puxa às cegas 1 carta do jogador à direita e soma ao palpite.

### ☀ Monstro Acordado

10. Revele o monstro e todas as jogadas.
    - **Monstros Opostos:** revela os dois monstros.
    - **Monstro Mutante:** vire a carta do topo do monte de monstros. Se o número dela for par, o monstro da rodada vale +5; se for ímpar, −5. O efeito, a passiva e o território dessa carta não valem.
    - Se o monstro tiver efeito ou passiva impressos (seção 13), leia em voz alta. Com Monstros Opostos, valem os dos dois monstros.
    - **Vingança do Cemitério** (efeito dos monstros 17, 26, 31 e 38): quem tem o maior cemitério (pelo menos 1 carta) compra 1 item. Se houver empate, todos os empatados compram.
    - **Passiva** (monstros 11, 16, 22, 27, 33 e 37): a partir de agora, goblins com a característica do monstro valem 0 e reis e rainhas com ela ficam desligados.
11. **Janela de itens, sem ordem:**
    - Todos que jogaram podem usar itens ☀ a qualquer momento.
    - Quando alguém usa um item, qualquer jogador pode cancelá-lo com **NÃO!**, e outro NÃO! pode responder. Vale o último NÃO!.
    - A janela reabre depois de cada item e só fecha quando **todos passarem**.
12. Calcule o resultado (seção 6).

### Fim da rodada

13. **Perdedores** descartam as cartas jogadas no próprio cemitério (veja Amuleto, Fuga Fedorenta, Banquete e a regra da última carta).
14. **Necromante:** devolva as mãos (seção 12).
15. **Vencedores** roubam ou eliminam cartas e compram item (seção 7).
16. **Pressa não Compensa:** quem perdeu tendo jogado 3 goblins ou mais compra 1 item.
17. **Feira dos Goblins** (se ativa): todos compram 1 item.
18. Quem ficou sem cartas na mão está **falido** e sai.
19. **Monstro Mutante** (se ativo): devolva a carta virada ao monte de monstros e embaralhe.
20. O Chefe da Toca passa para a esquerda.
21. Revele a carta de **Caos** da próxima rodada.

## 6. Como calcular o resultado

1. **Soma:** some o valor dos goblins jogados, mais os itens de soma (Porrete, Pé de Cabra etc.).
   - **Passiva do monstro:** goblins com a característica da passiva valem 0 (contando a herdada e a do Disfarce).
   - **Mínimo Máximo:** cada goblin vale 21 − número impresso.
   - **Soma do Vizinho:** soma metade da soma do jogador à esquerda, arredondando para baixo.
2. **Alvo:** o valor do monstro, ajustado pelo Caos (Gigante +10, Anão −6, Mutante ±5) e pelo Grito de Guerra.
3. **Distância** = |soma − alvo| − margem de território (seção 8), nunca abaixo de 0. A margem só desconta a distância: a soma não muda.
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

| Resultado      | O que acontece                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Cravou**     | Rouba **2 cartas às cegas** (1 de cada oponente ou 2 do mesmo) e compra 1 item.                 |
| **Mais perto** | Elimina **1 carta às cegas** da mão de um oponente (vai para o cemitério dele) e compra 1 item. |
| **Perdeu**     | Descarta as cartas jogadas no próprio cemitério.                                                |
| **Vencedor**   | As cartas jogadas voltam para a mão.                                                            |

- **Duelo:** só os dois escolhidos jogam. O vencedor rouba 1 carta do perdedor (mesmo se cravar) e compra 1 item. Se empatarem, os dois vencem e valem as regras normais, só entre eles. Com só 2 jogadores na mesa, o Duelo é entre eles.
- **Pressa não Compensa:** a carta puxada na Roleta não conta para os 3 goblins. Vale mesmo para quem não descartou (Amuleto, última carta).
- **Última carta:** se restam 2 jogadores com 1 carta cada, quem perde não descarta, e quem vence por aproximação só compra o item. Cravar ainda rouba.
- **Escudo de Panela:** ninguém rouba nem elimina cartas de quem preparou o Escudo nesta rodada.
- **Armadilha:** para cada carta que alguém tira da sua mão, você pode revelar uma Armadilha e o atacante perde 1 carta (seção 11).
- **Amigo dos Fracos** (efeito do monstro): o item de quem venceu vai para quem tem **menos itens na mão** (empate: todos os empatados). O roubo e a eliminação continuam iguais.

## 8. Território (margem ±)

- Se pelo menos um goblin jogado for de um território do monstro, você ganha margem de **±1, uma vez só**.
- **A margem só diminui a sua distância até o monstro. Ela não muda a sua soma.**
  - **Para cravar:** se a sua soma ficar a 1 do monstro, a distância vira 0 e você crava.
  - **Para a aproximação:** a sua distância conta 1 a menos na comparação com os outros jogadores. Ex.: monstro 30; você soma 27 com margem (distância 2) e o rival soma 28 sem margem (distância 2). Empatam, e os dois vencem.
- **Onde a margem não vale**, porque a regra olha a soma e não a distância:
  - **Corrida dos Pequenos e Corrida dos Grandes:** vence a menor ou a maior soma.
  - **Mundo Invertido:** vence quem ficar mais longe, sem margem.
  - **Zona Proibida:** quem soma de 20 a 30 perde, mesmo que a margem o deixasse a 0 do monstro.
  - **Ímã:** quem soma de 20 a 30 ganha +5 de distância, calculado em cima da distância já com a margem.
  - **Somas Iguais se Anulam:** a comparação é entre as somas.
  - **Soma do Vizinho:** você ganha metade da soma do vizinho, e a margem dele não entra.
- A cor que conta é a do **goblin**, então goblins roubados de outras cores ajudam com outros monstros.
- **Bandeira:** para você, o monstro também é do território escolhido.
- **Lente de Vidro (Rei Azul):** margem de **±1 sempre**, com qualquer goblin, e de **±2** quando o monstro for do território Azul (inclusive pela Bandeira). Ela substitui a margem normal: as duas não somam.
- **Monstros Opostos:** a margem vale separadamente para cada monstro, conforme o território de cada um.

## 9. Cemitério

- Cada jogador tem o seu, aberto na mesa. Recebe as cartas descartadas e eliminadas.
- Cartas saem de lá com:
  - **Pá de Coveiro:** do seu, à sua escolha.
  - **Cicatrizes Compartilhadas:** de qualquer cemitério (inclusive o seu e o de quem já faliu), à sua escolha, 1 goblin com Cicatriz, em troca de 1 goblin com Cicatriz da sua mão.
  - **Ladrão de Túmulos:** do de outro jogador, às cegas.
  - **Brotar:** do seu, escolhida pelo jogador à direita.
  - **Necromante:** joga com o cemitério e fica com as cartas se vencer.
- O tamanho do cemitério conta para a **Vingança do Cemitério** (efeito de alguns monstros).

## 10. Reis e rainhas

| Território | Carta                    | Característica herdada → goblins que herdam | Habilidade                                                                                                                                                       |
| ---------- | ------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vermelho   | **Rei Quebra-Crânio**    | Cicatriz → goblins 1 a 5                    | **Fúria:** ao vencer por aproximação, elimina 2 cartas em vez de 1; ao cravar, além de roubar, elimina 1 carta.                                                  |
| Azul       | **Rei Olho-de-Vidro**    | Monóculo → goblins 6 a 10                   | **Lente de Vidro:** quando o monstro for do território Azul, sua margem é ±2, e independente do território tem margem ±1                                         |
| Verde      | **Rainha Musgo-Podre**   | Maluco → goblins 11 a 15                    | **Brotar:** no início da rodada, se tiver menos cartas que todos os rivais, o jogador à sua direita escolhe 1 carta do seu cemitério e ela volta para a sua mão. |
| Amarelo    | **Rainha Dente-de-Ouro** | Pereba → goblins 16 a 20                    | **Mercadora:** sempre que compra um item, compra 2 e fica com o melhor.                                                                                          |

- Cada rei ou rainha tem **1 característica**, herdada por 5 goblins da sua cor (seção 3). Ela é fixa na carta do goblin e vale em qualquer mão.
- **Passiva do monstro:** se a característica da passiva for uma das do rei ou da rainha, ele fica desligado a partir da revelação: sem habilidade. Uma característica ganha pelo Disfarce também conta para a passiva.
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
| 2      | **Ajuste Fino**               | ☀ Acordado | De −3 a +3 na sua soma, à sua escolha.                                                                                                                 |
| 2      | **Amuleto**                   | ☀ Acordado | Se você perder nesta rodada, não descarta nada.                                                                                                        |
| 2      | **Armadilha**                 | ⚡ Reação  | Quando alguém roubar ou eliminar uma carta da sua mão, revele esta carta: quem atacou perde 1 carta (o jogador à direita dele escolhe qual, às cegas). |
| 2      | **Bandeira**                  | ☾ Dormindo | Escolha um território: para você, o monstro também é desse território nesta rodada.                                                                    |
| 2      | **Chapéu Pontudo**            | ☀ Acordado | Se jogou goblin de Chapéu: até +2 na sua soma.                                                                                                         |
| 2      | **Cicatrizes Compartilhadas** | ☾ Dormindo | Mande 1 goblin com Cicatriz da sua mão para o seu cemitério. Depois pegue, à sua escolha, 1 goblin com Cicatriz de qualquer cemitério.                 |
| 2      | **Coroa Trocada**             | ☾ Dormindo | Troque o seu rei ou rainha com o de outro jogador.                                                                                                     |
| 2      | **Disfarce**                  | ☾ Dormindo | Escolha uma característica: todos os goblins que você jogar nesta rodada a têm.                                                                        |
| 2      | **Escudo de Panela**          | ☀ Acordado | Nesta rodada ninguém rouba nem elimina cartas suas.                                                                                                    |
| 2      | **Fuga Fedorenta**            | ☀ Acordado | Se você perder nesta rodada, um goblin Fedorento jogado, à sua escolha, volta para a mão.                                                              |
| 2      | **Grito de Guerra**           | ☀ Acordado | O monstro vale +2 ou −2 para todos, à sua escolha.                                                                                                     |
| 2      | **Isca de Monstro**           | ☀ Acordado | Depois que o monstro acorda, troque-o pelo próximo do monte. O Caos da rodada continua valendo para o novo monstro.                                    |
| 2      | **Ladrão de Túmulos**         | ☾ Dormindo | Embaralhe o cemitério de outro jogador virado para baixo e puxe 1 carta às cegas.                                                                      |
| 2      | **Luneta**                    | ☾ Dormindo | Espie o valor do monstro.                                                                                                                              |
| 2      | **Machucado**                 | ☀ Acordado | Se jogou goblin com Cicatriz: até −3 na sua soma.                                                                                                      |
| 2      | **Mão Leve**                  | ☾ Dormindo | Roube, às cegas, 1 item da mão de um oponente.                                                                                                         |
| 2      | **Mapa do Tesouro**           | ☾ Dormindo | Olhe o monte de itens, escolha 1 carta e fique com ela. Depois embaralhe o monte.                                                                      |
| 2      | **Monóculo Polido**           | ☀ Acordado | +1 na sua soma para cada goblin de Monóculo jogado.                                                                                                    |
| 4      | **NÃO!**                      | ⚡ Reação  | Cancele um item de Monstro Acordado ou uma Armadilha de qualquer jogador. Pode ser respondido com outro NÃO!.                                          |
| 2      | **Nariz de Ferro**            | ☀ Acordado | Se jogou goblin Fedorento: até +3 na sua soma.                                                                                                         |
| 2      | **Pá de Coveiro**             | ☾ Dormindo | Puxe 1 carta à sua escolha do seu cemitério.                                                                                                           |
| 3      | **Pé de Cabra**               | ☀ Acordado | −2 na sua soma.                                                                                                                                        |
| 2      | **Poção Maluca**              | ☀ Acordado | −1 na sua soma para cada goblin Maluco jogado.                                                                                                         |
| 2      | **Pomada de Pereba**          | ☀ Acordado | Se jogou goblin com Pereba: até −2 na sua soma.                                                                                                        |
| 3      | **Porrete**                   | ☀ Acordado | +2 na sua soma.                                                                                                                                        |
| 2      | **Profecia do Caos**          | ☾ Dormindo | Olhe o monte de Caos e escolha a carta da próxima rodada. Embaralhe o resto e coloque a escolhida no topo.                                             |
| 2      | **Saco de Moedas**            | Na hora    | Compre 2 itens agora. É usado assim que entra na sua mão.                                                                                              |
| 2      | **Sacrifício**                | ☾ Dormindo | Mande 1 goblin seu para o seu cemitério e pegue, às cegas, 1 carta da mão de um oponente.                                                              |
| 2      | **Tambor de Guerra**          | ☾ Dormindo | Nesta rodada você pode jogar até 4 goblins.                                                                                                            |

**Total: 62 cartas** (60 + 2 Cicatrizes Compartilhadas).

- **Itens de característica** (todos ☀): três somam e três subtraem. Chapéu Pontudo, Nariz de Ferro, Pomada de Pereba e Machucado valem **até** o número da carta, à sua escolha (Chapéu Pontudo +1 ou +2; Nariz de Ferro +1 a +3; Pomada de Pereba −1 ou −2; Machucado −1 a −3); valem uma vez e basta 1 goblin com a característica. Monóculo Polido (+1 por goblin de Monóculo) e Poção Maluca (−1 por goblin Maluco) são fixos, sem escolha. Conta a característica do goblin jogado, inclusive a herdada e a do Disfarce (ex.: Monóculo Polido com Tambor de Guerra e 4 goblins de Monóculo dá +4). Sem goblin com a característica, o item não pode ser usado.
- **Luneta:** mostra o valor do monstro **e a passiva** dele (seção 13).
- **Isca de Monstro:** usada depois de ver o monstro; o Caos da rodada continua valendo para o novo monstro. Com Monstros Opostos, troca um dos dois, à escolha de quem usa. Valem o efeito e a passiva do monstro novo.
- **Profecia do Caos:** escolhe o Caos da **próxima** rodada, porque o da rodada atual já foi revelado.
- **Disfarce:** a característica escolhida pode ser qualquer uma das 6 (Chapéu, Cicatriz, Monóculo, Fedorento, Maluco, Pereba).
- **Cicatrizes Compartilhadas:** vale a Cicatriz da carta, **inclusive a herdada** (goblins 1 a 5 Vermelhos). O Disfarce não conta, porque vale só para goblins jogados. O goblin pego tem que ser outro, não o que você acabou de mandar, e mantém a cor original. A escolha é à vista, porque os cemitérios são abertos. Não é roubo da mão de ninguém, então não dispara a Armadilha. Precisa de pelo menos 2 cartas na mão e fica bloqueado na rodada do Necromante. Sua mão fica do mesmo tamanho e seu cemitério ganha 1 carta.
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
- **Luneta com Monstros Opostos:** mostra só um dos dois, à escolha de quem usa.
- **Grito de Guerra com Monstros Opostos:** vale para os dois monstros.
- **Fuga Fedorenta:** continua como era; a carta puxada na Roleta não pode ser salva. O Fedorento agora tem dois itens: Fuga Fedorenta e Nariz de Ferro.

## 12. Caos (50 cartas)

O Caos muda o jeito de jogar da mesa em três frentes:

- **Tira o meio:** acabar com a vantagem de mirar sempre no meio.
- **Aleatoriedade:** deixar a rodada imprevisível.
- **Interação:** obrigar os jogadores a reagir uns aos outros.

| Cópias | Caos                                     | Grupo         | Efeito na rodada seguinte, para todos                                                                                                                                                                                                                                                                          |
| ------ | ---------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3      | **Às Cegas**                             | Aleatoriedade | Depois que todos jogam, o jogador à sua direita escolhe, às cegas, 1 dos seus goblins jogados e troca por 1 carta da sua mão.                                                                                                                                                                                  |
| 2      | **Banquete**                             | Interação     | As cartas que os perdedores descartariam vão para a mão dos vencedores.                                                                                                                                                                                                                                        |
| 2      | **Caça ao Líder**                        | Interação     | Quem tem mais cartas no início da rodada não pode vencer por aproximação; só se cravar.                                                                                                                                                                                                                        |
| 2      | **Corrida dos Grandes**                  | Tira o meio   | O monstro é ignorado: vence a maior soma. Ninguém crava.                                                                                                                                                                                                                                                       |
| 2      | **Corrida dos Pequenos**                 | Tira o meio   | O monstro é ignorado: vence a menor soma. Todos jogam pelo menos 2 goblins (se tiverem). Ninguém crava.                                                                                                                                                                                                        |
| 2      | **Duelo**                                | Interação     | O Chefe da Toca escolhe dois jogadores para disputar; os outros não jogam. O vencedor rouba 1 carta do perdedor e compra 1 item.                                                                                                                                                                               |
| 2      | **Feira dos Goblins**                    | Interação     | No fim desta rodada, todos os jogadores compram 1 item.                                                                                                                                                                                                                                                        |
| 3      | **Ímã**                                  | Tira o meio   | Somas de 20 a 30 contam como se estivessem 5 mais longe do monstro.                                                                                                                                                                                                                                            |
| 3      | **Mínimo Máximo**                        | Aleatoriedade | Os valores dos goblins se invertem: 1 vale 20, 2 vale 19, 3 vale 18 … 20 vale 1.                                                                                                                                                                                                                               |
| 2      | **Monstro Anão**                         | Tira o meio   | O monstro vale −6 (mínimo 1).                                                                                                                                                                                                                                                                                  |
| 2      | **Monstro Gigante**                      | Tira o meio   | O monstro vale +10.                                                                                                                                                                                                                                                                                            |
| 3      | **Monstro Mutante**                      | Aleatoriedade | Na revelação, vire a carta do topo do monte de monstros. Se o número dela for **par**, o monstro da rodada vale **+5**; se for **ímpar**, vale **−5**. A carta virada serve só para isso: o efeito, a passiva e o território dela **não valem**. No fim da rodada, devolva-a ao monte de monstros e embaralhe. |
| 3      | **Monstros Opostos**                     | Tira o meio   | Puxe 2 monstros do topo do monte, virados para baixo. Na revelação, vale o mais perto da sua soma. Acertar em cheio rouba 1 carta (em vez de 2) e compra 1 item.                                                                                                                                               |
| 2      | **Mundo Invertido**                      | Tira o meio   | Vence quem ficar mais longe do monstro. Ninguém crava.                                                                                                                                                                                                                                                         |
| 2      | **Necromante** (arte: goblin necromante) | Aleatoriedade | Coloque seu cemitério na sua mão: nesta rodada você joga só com essas cartas. Quem vencer fica com as cartas que jogou; o resto volta para o cemitério. Quem não tem cemitério joga com a própria mão.                                                                                                         |
| 2      | **Palpite Aberto**                       | Interação     | Cada um joga na ordem, a partir do Chefe da Toca, vendo os palpites de quem jogou antes.                                                                                                                                                                                                                       |
| 2      | **Pedágio**                              | Interação     | Antes de jogar, cada um escolhe 1 carta da mão para dar ao jogador da esquerda.                                                                                                                                                                                                                                |
| 2      | **Roleta**                               | Interação     | Depois que todos jogam, cada um puxa às cegas 1 carta da mão do jogador à sua direita e soma ao seu palpite. No fim da rodada a carta volta para o dono.                                                                                                                                                       |
| 2      | **Soma do Vizinho**                      | Interação     | Sua soma ganha metade da soma do jogador à sua esquerda (arredondando para baixo).                                                                                                                                                                                                                             |
| 3      | **Somas Iguais se Anulam**               | Interação     | Jogadores com a mesma soma perdem todos.                                                                                                                                                                                                                                                                       |
| 2      | **Troca-Troca**                          | Aleatoriedade | No início da rodada, todos passam a mão inteira para o jogador da esquerda.                                                                                                                                                                                                                                    |
| 2      | **Zona Proibida**                        | Tira o meio   | Somas de 20 a 30 perdem automaticamente.                                                                                                                                                                                                                                                                       |

**Total: 50 cartas.** A Maldição saiu do Caos e virou passiva de monstro (seção 13); no lugar das 2 cópias dela entraram +1 Monstro Mutante e +1 Mínimo Máximo.

- **Roleta:** a carta puxada conta no seu palpite (valor, território e características), mas não é sua. Se você perder, ela não vai para o seu cemitério; volta para a mão do dono no fim da rodada.
- **Mínimo Máximo:** só o valor muda. As características, inclusive as herdadas, seguem o número impresso.
- **Necromante:**
  - Quem tem cemitério joga só com as cartas dele nesta rodada. Quem não tem joga com a própria mão.
  - **Quem vence** fica com as cartas do cemitério que jogou; o resto do cemitério volta para lá.
  - **Quem perde** não perde nada da mão de verdade: as cartas jogadas voltam para o cemitério.
  - Os vencedores ainda roubam ou eliminam das mãos normais dos rivais.

## 13. Monstros (31 cartas)

- Valores de 10 a 40, um de cada.
- **Território principal:** segue o rodízio Vermelho → Verde → Azul → Amarelo a partir do 10.
- **Segundo território:** 11 monstros têm também um segundo (10, 13, 16 … 40, de 3 em 3).
- **Efeito impresso:** os monstros 10, 15, 20, 25, 30, 35 e 40 têm o efeito **Amigo dos Fracos**; os monstros 17, 26, 31 e 38 têm o efeito **Vingança do Cemitério**; os monstros 13, 18, 21 e 32 têm o efeito **Cravada do Azarão**.
- **Passiva:** 6 monstros têm uma passiva de característica, uma para cada: 11 Chapéu, 16 Cicatriz, 22 Monóculo, 27 Fedorento, 33 Maluco e 37 Pereba.
- Efeito e passiva são **surpresa**: só aparecem quando o monstro acorda. A exceção é a **Luneta**: quem a usa vê o valor do monstro **e a passiva** dele.

| Monstro | Território(s)    | Efeito                    | Passiva       |
| ------- | ---------------- | ------------------------- | ------------- |
| 10      | Vermelho e Verde | **Amigo dos Fracos**      | —             |
| 11      | Verde            | —                         | **Chapéu**    |
| 12      | Azul             | —                         | —             |
| 13      | Amarelo e Verde  | **Cravada do Azarão**     | —             |
| 14      | Vermelho         | —                         | —             |
| 15      | Verde            | **Amigo dos Fracos**      | —             |
| 16      | Azul e Amarelo   | —                         | **Cicatriz**  |
| 17      | Amarelo          | **Vingança do Cemitério** | —             |
| 18      | Vermelho         | **Cravada do Azarão**     | —             |
| 19      | Verde e Amarelo  | —                         | —             |
| 20      | Azul             | **Amigo dos Fracos**      | —             |
| 21      | Amarelo          | **Cravada do Azarão**     | —             |
| 22      | Vermelho e Verde | —                         | **Monóculo**  |
| 23      | Verde            | —                         | —             |
| 24      | Azul             | —                         | —             |
| 25      | Amarelo e Verde  | **Amigo dos Fracos**      | —             |
| 26      | Vermelho         | **Vingança do Cemitério** | —             |
| 27      | Verde            | —                         | **Fedorento** |
| 28      | Azul e Amarelo   | —                         | —             |
| 29      | Amarelo          | —                         | —             |
| 30      | Vermelho         | **Amigo dos Fracos**      | —             |
| 31      | Verde e Amarelo  | **Vingança do Cemitério** | —             |
| 32      | Azul             | **Cravada do Azarão**     | —             |
| 33      | Amarelo          | —                         | **Maluco**    |
| 34      | Vermelho e Verde | —                         | —             |
| 35      | Verde            | **Amigo dos Fracos**      | —             |
| 36      | Azul             | —                         | —             |
| 37      | Amarelo e Verde  | —                         | **Pereba**    |
| 38      | Vermelho         | **Vingança do Cemitério** | —             |
| 39      | Verde            | —                         | —             |
| 40      | Azul e Amarelo   | **Amigo dos Fracos**      | —             |

- **Amigo dos Fracos:** "Quando derrotado, quem compra o item é o jogador com menos itens na mão (empate: todos os empatados compram)." Com Monstros Opostos, vale se qualquer um dos dois monstros tiver o efeito.
- **Cravada do Azarão:** "Quem cravar tendo a menor mão da mesa (no início da rodada) rouba 4 cartas em vez de 2. Não vale se todos tinham o mesmo número de cartas." Com **Monstros Opostos**, se um dos dois monstros tiver esse efeito, ele vence a regra do Caos: o azarão que acertar em cheio rouba 4 cartas, e não 1.
- **Vingança do Cemitério:** "Quando acorda, quem tem o maior cemitério compra 1 item (empate: todos os empatados compram)." Acontece na revelação (ou quando a Isca de Monstro traz um monstro com o efeito). Com Monstros Opostos, cada monstro com o efeito faz a sua.
- **Passiva:** "Goblins com [característica] valem 0. Reis e rainhas com [característica] ficam desligados (sem habilidade)." Vale a partir da revelação: entra no resultado e nos itens da janela. A característica herdada e a do Disfarce também contam.
- **Isca de Monstro:** se o monstro for trocado, valem o efeito e a passiva (ou a falta deles) do monstro novo.
- **Monstros Opostos:** valem os efeitos e as passivas dos dois monstros.

## 14. Regras de virada

Existem para que quem está perdendo continue com chance de voltar ao jogo.

| Regra                     | Quando                | Efeito                                                                                                                                     |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Limite de 3 itens**     | Sempre                | Quem está na frente não acumula itens sem fim.                                                                                             |
| **Vingança do Cemitério** | Monstros com o efeito | Quem tem o maior cemitério compra 1 item (empate: todos os empatados).                                                                     |
| **Cravada do Azarão**     | Monstros com o efeito | Quem cravar tendo a menor mão da mesa (no início da rodada) rouba 4 cartas em vez de 2. Não vale se todos tinham o mesmo número de cartas. |
| **Pressa não Compensa**   | Fim da rodada         | Quem perde tendo jogado 3 goblins ou mais compra 1 item.                                                                                   |
| **Amigo dos Fracos**      | Monstros com o efeito | O item vai para quem tem menos itens.                                                                                                      |
| **Feira dos Goblins**     | Caos                  | Todos compram 1 item no fim da rodada.                                                                                                     |
| **Necromante**            | Caos                  | Todos jogam com o cemitério; quem vence recupera as cartas jogadas.                                                                        |

## 15. Jogo físico: sem sorteio automático

- **Efeito "aleatório" na sua própria mão ou cemitério:** quem escolhe é o **jogador à sua direita** (Brotar, Às Cegas, Armadilha).
- **Pegar algo de outro jogador:** é **às cegas**, com as cartas viradas para baixo (roubar, eliminar, Sacrifício, Mão Leve, Roleta). No Ladrão de Túmulos, o cemitério é embaralhado virado para baixo antes.

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
- **Coroa Trocada:** o novo dono passa a usar a habilidade na hora.
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

**Conferido no código (bate com este documento):** `TNAME`, `TICO`, a tabela `TR` dos goblins, os 4 reis e rainhas (características, grupos e o nome Lente de Vidro), as cópias e os nomes dos 62 itens e dos 50 Caos, os 31 monstros (territórios, efeitos e passivas), a tela de regras e todas as regras das seções 5 a 17.

- As chaves internas dos itens continuam `CHAPEU`, `OCULOS`, `CHINELO`, `POMADA` e `POCAO`. Itens novos: `NARIZ` (Nariz de Ferro) e `MACHUCADO` (Machucado), ambos em `NUMERIC`.
- **Itens de característica:** `TRAIT_D` (`rules.ts`) dá a característica e o ajuste de cada um; `itemOptions` devolve `[]` sem a característica; senão, uma opção para cada valor de 1 até o limite (com o sinal do item) ou, no Monóculo e na Poção, uma única opção (`d = ±n`), contando com `traitsOf`. `TRAIT_ITEM` (`data.ts`) é uma lista por característica, usada pela dica do goblin.
- **Cicatrizes Compartilhadas:** chave `CICATRIZ`. `scarred()` e `scarGraves()` (`rules.ts`) olham só a Cicatriz impressa (`TR[gv(g)] & BA`), nunca `traitsOf`. Os argumentos são `g` (goblin da mão), `g2` (goblin pego) e `target` (dono do cemitério).
- **Monstros:** `Monster.fx` guarda o efeito (`MFX`: `FRACOS` e `VINGANCA`) e `Monster.curse` o bit da passiva; as tabelas são `MON_FX` e `MON_CURSE` (`data.ts`). `monFx()` devolve a lista de efeitos dos monstros da mesa (os dois com Monstros Opostos). `monCurse()` (`rules.ts`) junta as passivas e só vale com `G.revealed`; `seenCurse(p)` é a passiva que o jogador conhece (a Luneta mostra antes da hora) e é o que os bots usam para escolher os goblins.
- `monsterAwake()` (`engine.ts`) anuncia efeito e passiva e roda `vinganca()`; é chamada na revelação e quando a Isca traz um monstro novo. A Vingança não acontece mais no início da rodada.
- A Maldição (`MALDICAO`) saiu de `CHAOS`, e `G.curse`/`G.nextCurse` não existem mais.
- **Reações:** `REACT` (`data.ts`) lista NÃO! e Armadilha. Elas não têm botão e não entram em `canUse(..., 'window')`.
- **Armadilha:** `trap()` (`engine.ts`) roda depois de cada `takeCard` e do Sacrifício. Ela pergunta à vítima e roda `naoChain`. Os bots sempre revelam.
- **Tela de regras** (`src/app/overlays/Rules.tsx`): três abas (Regras, Itens e Caos); as tabelas são montadas direto de `ITEMS` e `CHAOS`.
- **Totais:** 62 itens, 50 Caos, 31 monstros, 80 goblins.

## 19. Histórico de versões

| Versão    | Resumo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1–v4     | Jogo com baralho comum (naipes 1–10); evolução das regras de erro, empate e ações.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| v5 / v5.1 | Tema goblins, estilo 21 (estouro), cartas de ação dupla face; versão visual com tutorial.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| v6        | Monstros 10–40, sem estouro, cravar rouba, reis e rainhas, Itens e Caos separados.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| v6.1      | Caos contra o meio, janela de itens livre com NÃO! em cadeia, Monóculo do Rei Azul, bots com personalidade, sem sorteio automático.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| v6.2      | Limite de 3 itens, regras de virada, monstros com efeito, Mapa do Tesouro, Profecia do Caos, Mínimo Máximo, Feira dos Goblins e Necromante.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **v7**    | Pereba, Monóculo, Chapéu, Maluco, Fedorento e Cicatriz; itens renomeados; habilidade do Rei Azul passa a se chamar Lente de Vidro; tela de regras com abas de Itens e Caos; Vingança do Cemitério vira efeito dos monstros 17, 26, 31 e 38; Maldição sai do Caos (entram +1 Mutante e +1 Mínimo Máximo) e vira passiva de 6 monstros (11 Chapéu, 16 Cicatriz, 22 Monóculo, 27 Fedorento, 33 Maluco, 37 Pereba); Armadilha vira reação (cancelável com NÃO!); item novo Cicatrizes Compartilhadas; itens de característica padronizados (Chapéu até +2, Monóculo +1/goblin, Nariz de Ferro até +3, Pomada até −2, Poção −1/goblin, Machucado até −3); monte de itens com 62 cartas. |
