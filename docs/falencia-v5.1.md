# 🃏 v5.1 — Goblins: versão visual + tutorial

| Campo | Valor |
| --- | --- |
| Status | Substituída |
| Data | 2026-10-17 |
| Partidas simuladas | 9 |
| Jogadores testados | 2, 3, 4 |
| Duração mediana (rodadas) | Igual à v5: 2p: 10 · 3p: 14 · 4p: 17 |
| Empates | 0% |
| Mudanças vs anterior | Regras iguais à v5 definitiva. Nova interface do jogo em HTML: cartas no estilo de jogo de cartas online, animações (distribuição, cartas voando, monstro virando em 3D, banners de CRAVOU/ESTOUROU, confete), clique no monte para comprar itens e Caos, clique no rival ou no cemitério para a ação, e tutorial guiado de 3 rodadas. |
| Principais achados | Teste de interface: tutorial completo de ponta a ponta e 9 partidas automáticas (3 conjuntos de regras × 2, 3 e 4 jogadores) sem erros. Layout conferido em tela de computador (1440×900) e de celular (390 px). |

Página no Notion: https://app.notion.com/p/3fcd6cd7562b81bdaefde25f79936e9a

---

## Arquivos desta versão

Jogo para abrir no navegador (zip com o HTML) e manual de regras completo (PDF, igual ao da v5).

📎 **Jogo — Falência: Goblins v5.1 (visual + tutorial)** — anexo no Notion: `falencia-goblins-v5.1-jogo-visual.zip`

📎 **Manual de regras — v5 definitiva** — anexo no Notion: `falencia-goblins-v5.1-manual.pdf`

---

> 🃏 **v5.1 = regras da v5 definitiva + jogo novo na tela.** Nada mudou nas regras; o texto completo está em [página no Notion](https://app.notion.com/p/3fcd6cd7562b8168b4a8d010c8b24c01).

## Como abrir

1. Baixe o zip e descompacte.
2. Abra o arquivo **falencia-goblins.html** no navegador (Chrome, Edge, Firefox ou Safari).
3. No menu, clique em **Aprender jogando (tutorial)** na primeira vez, ou escolha o clã e o número de jogadores e clique em **Jogar**.

## O que mudou na interface

### Visual das cartas e da mesa

- Mesa de feltro azul com os rivais em volta e a sua mão em leque. A carta sobe quando você passa o mouse.
- **Goblins** coloridos pelo clã, com o número grande e as características em ícones (🎩 Chapéu, 🧔 Barba, 👓 Óculos, 🩴 Chinelo, 🤪 Maluco, 🟤 Verruga).
- **Monstro** virado, com efeito de virar em 3D na revelação.
- **Cartas de ação** com as duas metades: Item em verde em cima e Caos em roxo embaixo. A metade usada fica em destaque.
- Coroa 👑 em quem é o Chefe da Toca.

### Animações e efeitos

- Distribuição da mão no começo da partida.
- Cartas voando para a mesa, para o cemitério e para a bandeja de itens.
- Letreiros grandes de **CRAVOU!**, **ESTOUROU!**, **VENCEU!** e **FALIU!**.
- A tela treme quando você estoura, e cai confete quando você vence a partida.
- Avisos flutuantes sobre os rivais (item usado, Caos sofrido, goblin perdido).
- Botão de velocidade (normal ou rápida).

### Clicar para jogar

- **Palpite:** clique nos goblins da mão (até 3). A soma aparece embaixo; depois clique em **Jogar**.
- **Comprar cartas:** quando você ganha um item ou estoura, o monte de ação brilha com um contador. Clique nele para comprar cada carta.
- **Ação do vencedor:** os rivais que podem ser atacados piscam em vermelho, e o seu cemitério pisca em verde. Clique em um deles.
- **Itens:** ficam na bandeja à direita com o botão **Usar**, que só acende no momento certo (antes do palpite ou depois da revelação). Itens de reação (NÃO!, Escudo, Armadilha, Amuleto, Chinelo Veloz) são oferecidos pelo jogo na hora certa.
- **Efeitos de Caos** em você aparecem na sua área, e os dos rivais aparecem nos cartões deles.
- **Histórico** lateral com tudo o que aconteceu.

### Tutorial guiado

Uma partida preparada de 3 rodadas contra Vermelho e Azul. A tela escurece, o ponto certo fica em destaque e um balão explica o que fazer.

1. **Rodada 1:** você joga 5 + 7 contra um monstro 12, crava, escolhe a ação (eliminar ou recuperar) e compra 2 itens clicando no monte.
2. **Rodada 2:** você joga um 9 contra um monstro 4, estoura e compra uma carta de Caos.
3. **Rodada 3:** você usa a Luneta para espiar o monstro (13), joga o 11 e usa o Porrete (+2) para cravar.

Depois disso a partida continua normal, com os rivais também usando itens. Dá para pular o tutorial a qualquer momento.

### Outras opções

- As regras anteriores (v5 pura e primeiro rascunho) continuam no menu.
- Opção “ver cartas dos bots”, para testar.
- Layout que se adapta ao celular.

## Pontos em aberto

- As fontes do jogo vêm do Google Fonts. Sem internet, o navegador usa uma fonte padrão, e o jogo funciona do mesmo jeito.
- Os pontos de equilíbrio da v5 continuam valendo (quase todos jogam 1 goblin, Vermelho forte com 2–3 jogadores, Amarelo fraco).
