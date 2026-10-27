# 🃏 v6.1 — Caos contra o meio e visual novo

| Campo                     | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Substituída                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Data                      | 2026-10-22                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Partidas simuladas        | 98.000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Jogadores testados        | 2, 3, 4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Duração mediana (rodadas) | 2p: 14 · 3p: 18 · 4p: 19                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Empates                   | 0%                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Mudanças vs anterior      | Baralho de Caos refeito (50 cartas, 20 tipos em 3 grupos: Tira o meio, Aleatoriedade, Interação) para acabar com a estratégia de mirar sempre no meio. Gigante +10, Anão −6. Opostos não rouba; Corrida dos Pequenos exige 2 goblins; Sacrifício 2 cópias, Grito de Guerra 2. Janela de itens sem ordem, NÃO! em cadeia. Rei Azul: Monóculo (margem ±2 quando o monstro é do território Azul, com qualquer goblin). Isca de Monstro no Monstro Acordado; Chinelo Fedorento à escolha; Roleta puxa 1 carta do jogador à direita. Bots com personalidade. Opção de sair ao falir. Visual novo em grafite com ícones e legenda. |
| Principais achados        | Com as regras atuais (bots lógicos): clãs equilibrados (4p: 23/26/27/25%; 3p: 32/35/34/32%; 2p: 50/53/47/51%), cravada em 20% das rodadas, partidas de 14/18/19 rodadas. Contra os bots com personalidade, mirar na média rende 0,82× a parcela justa. Itens seguem o fator mais decisivo.                                                                                                                                                                                                                                                                                                                                   |

Página no Notion: https://app.notion.com/p/401d6cd7562b81ca9131f65cc3fb41a1

---

## Arquivos desta versão

**Jogar online:** [Falência: Goblins v6.1](https://claude.ai/artifact/N3gHyzasaT6imcWKicjB2E) — o mesmo link da v6, já atualizado. Mesas online com código de 5 letras (vagas vazias viram bots) e modo contra bots. Cada jogador precisa de acesso de edição à página, e quem cria a mesa fica com a página aberta até o fim.
Jogo para abrir no navegador (zip com o HTML; offline funciona contra bots) e manual de regras (PDF).

📎 **Jogo — Falência: Goblins v6.1 (HTML)** — anexo no Notion: `falencia-goblins-v6.1-jogo.zip`

📎 **Manual de regras — v6.1** — anexo no Notion: `falencia-goblins-v6.1-manual.pdf`

---

> 🃏 **v6.1:** mesmas regras-base da v6 com um baralho de Caos novo, feito para tirar a vantagem de jogar sempre no meio, deixar as rodadas mais imprevisíveis e obrigar a mesa a interagir. Visual refeito em grafite escuro com ícones. Depois de uma simulação grande (cerca de 58 mil partidas), recebeu ajustes de equilíbrio: Monstros Opostos sem roubo, Corrida dos Pequenos com pelo menos 2 goblins, Sacrifício com 2 cópias (Grito de Guerra passou a 2) e Monstro Anão −6. Depois: janela de itens livre com NÃO! em cadeia, Rei Azul com o **Monóculo**, Isca de Monstro no Monstro Acordado, Chinelo Fedorento à escolha, Roleta puxando do vizinho, bots com personalidade, opção de sair ao falir e **nenhum efeito "aleatório" automático**: no jogo físico, quem escolhe é o jogador à direita.

## 1. Visão geral

Jogo de 2 a 4 jogadores. Cada jogador comanda um território (uma cor) com seus 20 goblins e o rei ou a rainha desse território. A cada rodada um **monstro** de 10 a 40 aparece dormindo, e cada jogador joga até 3 goblins tentando chegar o mais perto do valor dele, **para cima ou para baixo**. Não existe estouro.
**Objetivo:** ser o último jogador com cartas na mão.

## 2. Componentes

| Componente             | Quantidade   | Descrição                                                                            |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------ |
| Goblins                | 4 × 20 = 80  | Uma cor por território, valores 1 a 20, cada um com 3 características.               |
| Monstros               | 31 (10 a 40) | Cada monstro é de 1 ou 2 territórios.                                                |
| Itens                  | 50           | Cada um marcado Monstro Dormindo ou Monstro Acordado.                                |
| Caos                   | 50           | Um revelado por rodada; muda a regra da rodada seguinte para todos.                  |
| Reis e rainhas         | 4            | Habilidade, 2 características e o grupo de goblins que recebe essas características. |
| Marcador Chefe da Toca | 1            | Define quem começa e quem decide o Duelo. Passa para a esquerda a cada rodada.       |

## 3. Preparação

1. Cada jogador escolhe um território, pega os 20 goblins dessa cor e o rei ou a rainha do território.
2. Os cemitérios começam vazios.
3. Embaralhe os montes de monstros, itens e Caos.
4. Sorteie o Chefe da Toca. Não há Caos ativo na primeira rodada.

## 4. A rodada

### 1. Monstro Dormindo

1. Aplique os Caos de início da rodada (Troca-Troca, Pedágio, Duelo) e a habilidade Brotar.
2. Puxe o monstro da rodada virado para baixo (com Monstros Opostos, um baixo agora e um alto na revelação). Se o monte acabou, embaralhe os monstros usados.
3. Use itens de Monstro Dormindo, se quiser.
4. Escolha de 1 a 3 goblins em segredo (Tambor de Guerra: até 4; Corrida dos Pequenos: pelo menos 2). Com Palpite Aberto, cada um joga na ordem, vendo os anteriores.

### 2. Monstro Acordado

1. Aplique Às Cegas e Roleta, revele o monstro (e o Mutante) e os palpites.
2. **Janela de itens, sem ordem:** todos que jogaram podem usar itens de Monstro Acordado a qualquer momento. Quando alguém usa um item, qualquer jogador pode cancelá-lo com **NÃO!**, e outro NÃO! pode responder ao primeiro (em cadeia: o último NÃO! decide se o item vale). Depois disso a janela reabre para todos. Ela só termina quando todos passarem.
3. Calcule vencedores e perdedores e aplique Ganhar e Perder.
4. Revele a carta de Caos: ela vale para a próxima rodada, para todos.

## 5. Ganhar e perder

| Resultado                       | O que acontece                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Cravou** (diferença 0)        | Rouba 2 cartas às cegas: 1 de cada oponente ou 2 do mesmo. Compra 1 item. Se alguém cravou, só quem cravou ganha. |
| **Mais perto** (ninguém cravou) | Elimina, às cegas, 1 carta da mão de um oponente (vai para o cemitério dele). Compra 1 item.                      |
| **Perdeu**                      | Descarta as cartas jogadas no próprio cemitério.                                                                  |
| **Vencedor**                    | As cartas jogadas voltam para a mão.                                                                              |

- **Mais de um jogador pode ganhar:** empates na diferença 0 ou na menor diferença fazem todos vencerem (exceto com Somas Iguais se Anulam).
- **Monstros Opostos:** acertar um dos dois monstros conta como aproximação (elimina 1 carta, não rouba).
- **Última carta:** se restam 2 jogadores com 1 carta cada, quem perde por aproximação não descarta, e o vencedor só compra o item. Cravar ainda rouba.
- Quem fica sem cartas na mão está fora.

## 6. Território

Se pelo menos um goblin jogado for de um território do monstro, você tem margem de **±1, uma vez só**. Quem tem o Rei Azul tem margem **±2** sempre que o monstro for do território Azul, com qualquer goblin (Monóculo). Com Mundo Invertido e as Corridas não há margem.

## 7. Cemitério

- Guarda as cartas descartadas e eliminadas de cada jogador.
- Itens tiram cartas de lá: **Pá de Coveiro** (do seu, à sua escolha) e **Ladrão de Túmulos** (do de outro jogador, às cegas). A habilidade **Brotar** também.

## 8. Reis e rainhas

| Território | Carta                | Características → quem recebe          | Habilidade                                                                                                                                                       |
| ---------- | -------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vermelho   | Rei Quebra-Crânio    | Chapéu · Cicatriz → goblins pares      | **Fúria:** ao vencer por aproximação, elimina 2 cartas em vez de 1; ao cravar, além de roubar, elimina 1 carta.                                                  |
| Verde      | Rainha Musgo-Podre   | Pereba · Maluco → goblins de 1 a 10    | **Brotar:** no início da rodada, se tiver menos cartas que todos os rivais, o jogador à sua direita escolhe 1 carta do seu cemitério e ela volta para a sua mão. |
| Azul       | Rei Olho-de-Vidro    | Monóculo · Fedorento → goblins ímpares | **Monóculo:** quando o monstro for do território Azul, sua margem é ±2, jogando qualquer goblin.                                                                 |
| Amarelo    | Rainha Dente-de-Ouro | Chapéu · Pereba → goblins de 11 a 20   | **Mercadora:** sempre que compra um item, compra 2 e fica com o melhor.                                                                                          |

- O rei ou a rainha **empresta as características** ao grupo de goblins escrito na carta (de qualquer cor) que o dono jogar.
- A **Maldição** sorteia uma característica: os goblins com ela valem 0 e o rei ou a rainha com ela fica desligado naquela rodada.
- Reis mudam de dono só com o item **Coroa Trocada**. Quem estiver com o Rei Azul usa o Monóculo.

## 9. Itens (50)

Os mesmos da v6 (Luneta, Sacrifício, Coroa Trocada, Pá de Coveiro, Ladrão de Túmulos, Mão Leve, Isca de Monstro, Bandeira, Disfarce, Tambor de Guerra, Saco de Moedas, Porrete, Pé de Cabra, Ajuste Fino, Escudo de Panela, Amuleto, Monóculo de Grau, Chapéu Pontudo, Poção Maluca, Pomada de Pereba, Chinelo Fedorento, NÃO!, Armadilha, Grito de Guerra), com **Sacrifício em 2 cópias** e **Grito de Guerra em 2 cópias**. A tabela completa está no PDF.

| Item                  | Quando           | Texto da carta                                                                                                      |
| --------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Isca de Monstro**   | Monstro Acordado | Depois que o monstro acorda, troque-o pelo próximo do monte. O Caos da rodada continua valendo para o novo monstro. |
| **Chinelo Fedorento** | Monstro Acordado | Se você perder nesta rodada, um goblin de Fedorento jogado, à sua escolha, volta para a mão.                        |
| **Armadilha**         | Monstro Acordado | Nesta rodada, quem roubar ou eliminar uma carta sua perde 1 carta: o jogador à direita dele escolhe qual, às cegas. |
| **Sacrifício**        | Monstro Dormindo | Mande 1 goblin seu para o seu cemitério e pegue, às cegas, 1 carta da mão de um oponente.                           |
| **Ladrão de Túmulos** | Monstro Dormindo | Embaralhe o cemitério de outro jogador virado para baixo e puxe 1 carta às cegas.                                   |
| **Mão Leve**          | Monstro Dormindo | Roube, às cegas, 1 item da mão de um oponente.                                                                      |

- A Isca é usada na janela de itens, depois de ver o monstro: você decide se vale a pena trocar. Ela pode ser cancelada com NÃO!. Com Monstros Opostos, troca o monstro baixo por outro baixo.
- Sem limite de itens na mão. Item usado vai para o descarte.
- **NÃO!** cancela um item de Monstro Acordado de qualquer jogador e pode ser respondido com outro NÃO!.
- **Bandeira** também conta para o Monóculo: se o Rei Azul escolher Azul, o monstro passa a ser do território Azul para ele.
- **Itens não são secretos depois de usados:** todos veem quem usou o quê.

## 10. Caos (50)

O Caos existe para mudar o jeito de jogar da mesa: tirar a vantagem de mirar sempre no meio (**Tira o meio**), deixar a rodada imprevisível (**Aleatoriedade**) e obrigar os jogadores a reagir uns aos outros (**Interação**).

| Cópias | Caos                       | Grupo         | Efeito na próxima rodada, para todos                                                                                                                         |
| ------ | -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3      | **Zona Proibida**          | Tira o meio   | Somas de 20 a 30 perdem automaticamente.                                                                                                                     |
| 3      | **Ímã**                    | Tira o meio   | Somas de 20 a 30 contam como se estivessem 5 mais longe do monstro.                                                                                          |
| 3      | **Monstros Opostos**       | Tira o meio   | Dois monstros: um baixo (até 24) e um alto (26 ou mais). Vale o mais perto da sua soma. Acertar um deles conta como aproximação: elimina 1 carta, não rouba. |
| 2      | **Mundo Invertido**        | Tira o meio   | Vence quem ficar mais longe do monstro. Ninguém crava.                                                                                                       |
| 2      | **Corrida dos Pequenos**   | Tira o meio   | O monstro é ignorado: vence a menor soma. Todos jogam pelo menos 2 goblins (se tiverem). Ninguém crava.                                                      |
| 2      | **Corrida dos Grandes**    | Tira o meio   | O monstro é ignorado: vence a maior soma. Ninguém crava.                                                                                                     |
| 2      | **Monstro Gigante**        | Tira o meio   | O monstro vale +10.                                                                                                                                          |
| 2      | **Monstro Anão**           | Tira o meio   | O monstro vale −6 (mínimo 1).                                                                                                                                |
| 4      | **Às Cegas**               | Aleatoriedade | Depois que todos jogam, o jogador à sua direita escolhe, às cegas, 1 dos seus goblins jogados e troca por 1 carta da sua mão.                                |
| 3      | **Roleta**                 | Interação     | Depois que todos jogam, cada um puxa às cegas 1 carta da mão do jogador à sua direita e soma ao seu palpite. No fim da rodada a carta volta para o dono.     |
| 2      | **Monstro Mutante**        | Aleatoriedade | Na revelação vira um segundo monstro: se for par, o monstro vale +5; se for ímpar, −5.                                                                       |
| 2      | **Maldição**               | Aleatoriedade | Uma característica sorteada vale 0. Reis e rainhas com ela ficam desligados.                                                                                 |
| 2      | **Troca-Troca**            | Aleatoriedade | No início da rodada, todos passam a mão inteira para o jogador da esquerda.                                                                                  |
| 3      | **Palpite Aberto**         | Interação     | Cada um joga na ordem, a partir do Chefe da Toca, vendo os palpites de quem jogou antes.                                                                     |
| 4      | **Somas Iguais se Anulam** | Interação     | Jogadores com a mesma soma perdem todos.                                                                                                                     |
| 3      | **Caça ao Líder**          | Interação     | Quem tem mais cartas no início da rodada não pode vencer por aproximação; só se cravar.                                                                      |
| 2      | **Duelo**                  | Interação     | O Chefe da Toca escolhe dois jogadores para disputar; os outros não jogam. O vencedor rouba 1 carta do perdedor e compra 1 item.                             |
| 2      | **Pedágio**                | Interação     | Antes de jogar, cada um escolhe 1 carta da mão para dar ao jogador da esquerda.                                                                              |
| 2      | **Banquete**               | Interação     | As cartas que os perdedores descartariam vão para a mão dos vencedores.                                                                                      |
| 2      | **Soma do Vizinho**        | Interação     | Sua soma ganha metade da soma do jogador à sua esquerda (arredondando para baixo).                                                                           |

- **Roleta:** a carta puxada conta no seu palpite (valor, território e características), mas não é sua: se você perder, ela não vai para o seu cemitério; volta para a mão de quem estava à sua direita.

## 11. Monstros e territórios

31 monstros de 10 a 40. O território principal segue um rodízio Vermelho → Verde → Azul → Amarelo, e 10 monstros têm também um segundo território. Quando o monte acaba, os monstros usados são embaralhados.

## 12. Fim de jogo

Vence o último jogador com cartas na mão. Quem falir pode continuar assistindo ou sair da partida.

---

## Decisões desta versão

- Caos focado em quebrar o padrão de jogar no meio, mais aleatoriedade e interação na mesa.
- Monstro Arisco e Alvo Votado foram descartados; entraram Ímã e Soma do Vizinho.
- Monstro Mutante soma ou subtrai 5 (somar o valor inteiro do segundo monstro passava de 70 e quebrava a rodada).
- Visual em grafite escuro, com ícones no lugar de emojis, e legenda dos ícones no botão Regras (inclui a diferença entre Normal e Rápido).
- Ajustes depois da simulação grande: Monstros Opostos sem roubo; Corrida dos Pequenos com pelo menos 2 goblins; Sacrifício de 3 para 2 cópias e Grito de Guerra de 1 para 2; Monstro Anão de −8 para −6.
- Janela de itens sem ordem: qualquer um usa a qualquer momento, NÃO! pode ser respondido com NÃO!, e a janela só fecha quando todos passam.
- Rei Azul: o Faro (saber par ou ímpar) não funciona num jogo físico. A primeira versão do Monóculo ("a 1 do monstro conta como cravada") era igual à margem de território e deixava o Azul forte (30% com 4 jogadores, 40% com 3, 58% com 2). Versão final: **margem ±2 quando o monstro é do território Azul, com qualquer goblin**.
- Isca de Monstro passou para o Monstro Acordado: você vê o monstro e decide se troca; o Caos da rodada continua valendo.
- Chinelo Fedorento: com mais de um goblin de Fedorento jogado, você escolhe qual volta.
- Roleta: em vez de um goblin aleatório da própria mão, cada um puxa às cegas 1 carta do jogador à direita; a carta volta para o dono no fim da rodada.
- **Jogo físico, sem sorteio automático:** quando uma carta tirava algo "aleatório" da sua própria mão ou cemitério, agora quem escolhe é o **jogador à sua direita** (Brotar, Às Cegas, Armadilha). Quando você pega algo de outro jogador, é **às cegas**, com as cartas viradas para baixo (Sacrifício, Mão Leve, Ladrão de Túmulos, roubar e eliminar).
- **Bots da partida com jeito de gente** (as simulações continuam usando o bot lógico).
- Regras-base da v6 mantidas.

## Bots com personalidade

Na partida, cada bot recebe uma personalidade diferente, mostrada ao lado do nome. Todos miram no valor esperado do monstro com algum erro, sem medo de perder cartas, e às vezes jogam no impulso.

| Personalidade | Como joga                                                                 |
| ------------- | ------------------------------------------------------------------------- |
| **Ousado**    | Joga 2 ou 3 goblins quase sempre e mira um pouco acima.                   |
| **Cauteloso** | Prefere 1 ou 2 goblins e mira um pouco abaixo.                            |
| **Caótico**   | Erra bastante e joga no impulso cerca de 1 vez a cada 3 rodadas.          |
| **Imitador**  | Mira na soma que venceu a última rodada.                                  |
| **Leitor**    | O mais preciso: mira no valor esperado e evita somas iguais às já vistas. |

- Reagem ao Caos como uma pessoa reagiria: fogem da Zona Proibida e do Ímã na maioria das vezes, escolhem entre o monstro baixo e o alto nos Monstros Opostos, jogam baixo na Corrida dos Pequenos e alto na dos Grandes.
- Nos testes (12 mil partidas, 4 jogadores): "mirar na média" caiu de 1,35 para 0,82 vez a parcela justa contra esses bots; jogar aleatório rende 0,60; o bot lógico das simulações ganha 1,8 vez a parcela justa contra eles. As partidas ficaram mais curtas (mediana de 13 rodadas), porque eles arriscam mais cartas.

## Resultados dos testes

Simulações com bots lógicos, já com todas as regras atuais (18 mil partidas):

| Jogadores | Duração mediana | Rodadas com cravada | Vitórias: Vermelho / Verde / Azul / Amarelo |
| --------- | --------------- | ------------------- | ------------------------------------------- |
| 2         | 14 rodadas      | 19%                 | 52% / 51% / 47% / 50%                       |
| 3         | 18 rodadas      | 19%                 | 33% / 33% / 34% / 34%                       |
| 4         | 19 rodadas      | 19%                 | 23% / 24% / 27% / 26%                       |

Parcela justa: 50% com 2 jogadores, 33% com 3 e 25% com 4.

- **Clãs equilibrados:** todos a no máximo 3 pontos da parcela justa. O Brotar com escolha do vizinho ficou um pouco mais fraco, mas o Verde continua no justo.
- **Partidas abertas:** quem lidera na rodada 5 vence só 38% das partidas com 4 jogadores.
- **Itens** continuam o fator mais decisivo (quem nunca usa: 0,29 vez a parcela justa).

## O que mudou no jogo (HTML)

- Fundo grafite neutro, cartas mais limpas e ícones no lugar de emojis.
- Faixa no topo com a regra do Caos ativo.
- Rivais em assentos compactos; monstros duplos lado a lado; aviso quando sua soma cai na Zona Proibida ou no Ímã.
- Rei ou rainha num botão na sua área, com o estado (ligado ou desligado).
- Legenda de todos os ícones e explicação de Normal/Rápido no botão Regras.
- Avisos na tela quando o Amuleto salva, na regra da última carta e para mostrar quais cartas você perdeu.
- As cartas jogadas pelos rivais ficam na mesa por mais tempo depois do resultado, até a próxima rodada começar.
- Os bots mostram o que estão fazendo: o assento acende com "escolhendo…", "pensando num item…" ou "vai responder…".
- Janela de itens sem ordem, com pergunta de NÃO! para você quando alguém usa um item, e NÃO! de volta quando cancelam o seu.
- Com o Monóculo valendo, sua soma mostra "±2 território".
- Revelação mais lenta: as cartas de cada rival viram uma por uma, assento por assento, com a soma por último. Cartas que voam de e para os rivais ficaram cerca de 70% mais lentas.
- **Itens usados à vista:** cada assento (inclusive o seu) mostra etiquetas com os itens usados na rodada e o efeito (ex.: "Porrete +2", "Bandeira Verde"); itens cancelados aparecem riscados. Quando alguém usa um item na janela, aparece um aviso para todos ("Amarelo usou Porrete (+2)").
- Isca de Monstro aparece na janela de itens depois que o monstro acorda; o Chinelo Fedorento pergunta qual goblin volta quando há mais de um.
- A personalidade de cada bot aparece ao lado do nome dele.
- Roleta: a carta puxada do vizinho aparece na sua jogada, com aviso de quem ela veio.
- **Sair ao falir:** quando você fica sem cartas, aparece a opção de assistir até o fim ou sair da partida; o botão "Sair da partida" também fica na barra de ações. O botão Menu agora sempre deixa sair (com confirmação).
- **Brotar:** se você estiver à direita de quem tem a Rainha Musgo-Podre, o jogo pergunta qual carta do cemitério dele volta. Às Cegas e Armadilha avisam quem fez a escolha.
