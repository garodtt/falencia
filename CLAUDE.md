# Falência: Goblins

Jogo de cartas (2 a 4 jogadores, contra bots ou online pelo Firebase). TypeScript + React 19 +
Zustand + Tailwind v4, ferramentas do Vite+ (`vp`). Tudo em pt-BR: textos do jogo, comentários,
nomes de teste e mensagens de commit.

## Antes de dizer que terminou

```bash
npm run check   # formatação + lint + tipos
npm test        # motor (gabarito), regras, guarda-corpo do padrão e testes de tela
npm run build
```

Os três têm que passar. O CI roda os mesmos comandos e **não publica** se algum falhar.
Mexeu na tela? Confira no **sandbox** (`npm run dev` e abra `#/sandbox`), inclusive a mesa nos
tamanhos de celular em pé e deitado.

## Sandbox (`#/sandbox`)

Página com tudo que o jogo tem de visual, usando os componentes de verdade: a mesa em cada momento
da partida (seção Mesa), todas as cartas, animações, janelas, peças e tokens. Com `npm run dev`
aberto, o que você editar aparece lá na hora. Também vai para o ar, em `.../#/sandbox`.

- Componente, carta, animação ou janela **nova entra no sandbox** na seção certa
  (`src/sandbox/sections/`). Token novo entra na seção Tokens.
- Os cenários da mesa (`src/sandbox/scenes.ts`) são partidas reais com sorteio fixo, avançadas até
  o momento pedido. Momento novo = uma entrada em `CENAS` com a condição `chegou`. O teste
  `scenes.test.ts` garante que todas continuam acontecendo.
- O sandbox só é baixado quando alguém abre `#/sandbox` (import sob demanda em `app/mount.tsx`):
  não importe nada de `src/sandbox/` no jogo.

## Regras do jogo

- A fonte da verdade é `docs/V7 gostosa arrumada com regras boas demais.md`. As outras versões
  em `docs/` são só histórico: não mexa nelas.
- Regra mudou? Mude **juntos**: o doc v7 (incluindo a seção 18, que liga regra ↔ código), o
  código em `src/game/`, um teste em `test/` e o gabarito (`UPDATE_GOLDEN=1 npm test`).
- Só regenere o gabarito quando a mudança de regra for de propósito. Se `npm test` acusar
  diferença no gabarito sem você ter mudado regra, é bug: conserte, não regenere.
- A tela de regras (`app/overlays/Rules.tsx`) monta as tabelas de `ITEMS` e `CHAOS`: não copie
  texto de carta à mão.

## Arquitetura

```
src/game/   motor: regras, bots, rodada. NUNCA importa nada de app/ nem toca no DOM.
src/net/    mesas online (o anfitrião roda o motor; os outros mandam ações).
src/app/    a tela inteira, em React. index.html só tem <div id="root">.
src/sandbox/ a página #/sandbox (vitrine de tudo que é visual). O jogo não importa nada daqui.
```

- O estado da partida é o objeto mutável `G` (`game/state.ts`); ele é o JSON que vai para o banco.
  O motor muda `G` e avisa a tela pelos `hooks` (`sync`, `playFx`, `tip`).
- A tela lê `G` direto e re-renderiza assinando `useTick()`. Quem muda `G` chama `render()`
  (`app/render.ts`) ou `bump()` (`app/store.ts`).
- Estado que é só desta tela (tela atual, seleção da mão, modal, gaveta aberta, cartas voando)
  fica na store `useUi` (`app/store.ts`), nunca em `G`.
- Trocar de tela: `show('menu' | 'lobby' | 'game')`. Perguntar algo ao jogador: `askLocal()`.
- Efeitos visuais (carta voando, balãozinho, confete, banner, toast): funções de `app/fx.tsx`.
  Elas põem o efeito na store e a `FxLayer` desenha com os componentes de carta de verdade.

## Tela: só React

- **Proibido** (o `test/padrao.test.ts` falha): `innerHTML`, HTML em string,
  `document.createElement`, `appendChild`, `classList` (exceção única: `Flip.tsx`).
  Mostrar/esconder é renderização condicional (`{cond && <X/>}`), não classe `hidden` posta à mão.
- `document.getElementById`/`querySelector` só para **medir** posição (animações, dicas), nunca
  para mudar a tela.
- Cliques: `onClick` no componente. A lógica do que um clique faz na mesa fica em
  `app/table/actions.ts`; o componente só chama.
- Ícone: `<Icon name="..." />`. Ícone novo = uma entrada em `ICONS`
  (`app/components/Sprites.tsx`); ele aparece sozinho no sandbox.

### Onde cada coisa mora

| O quê                                       | Onde                                            |
| ------------------------------------------- | ----------------------------------------------- |
| Peça usada em mais de um lugar              | `app/components/` (cartas em `cards/`)          |
| Conteúdo de balão (tooltip)                 | `app/components/tips/` + `useTooltip`           |
| Parte da mesa                               | `app/table/` (`opponents/`, `center/`, `dock/`) |
| Menu / sala de espera                       | `app/menu/`, `app/lobby/`                       |
| Coisa por cima da tela (modal, aviso, dica) | `app/overlays/`, montada em `App.tsx`           |
| Leitura de `G` usada por vários componentes | `app/table/view.ts`                             |

- Um componente por arquivo, nome do arquivo = nome do componente (`PascalCase.tsx`).
- Props tipadas inline (`{ g, sm }: { g: Gob; sm?: boolean }`); `className` opcional quando o
  componente precisa ser posicionado por quem usa.
- Antes de criar um componente, procure se já existe (cartas, `Badge`, `Warn`, `ColorDot`,
  `PlayerStats`, `Icon`...). Duplicar uma carta ou um painel é o erro mais comum.
- Gancho para teste é atributo `data-*` (`data-card`, `data-seat`, `data-sum`...), não classe.

## Estilo: Tailwind só com os tokens

Os tokens ficam no `@theme` de `src/styles.css`. Use **só** eles:

| Tipo           | Use                                                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cor            | `bg-surface`, `bg-surface-2/3`, `text-muted`, `border-line`, `text-accent`, `text-good`/`bad`, `text-chaos`, `text-moon`/`sun`, `bg-red/green/blue/yellow`, `text-on-accent`            |
| Transparência  | `/NN`: `bg-bad/12`, `ring-accent/40`, `bg-scrim/72`                                                                                                                                     |
| Letra          | escala do Tailwind (`text-xs`, `text-sm`, `text-lg`...) + `text-note` (11), `text-small` (13), `text-body` (14), `text-md` (15), `text-title` (22), `text-sum` (26), `text-sum-lg` (32) |
| Canto          | `rounded-box` (10px), `rounded-panel` (14px), escala do Tailwind                                                                                                                        |
| Sombra         | `shadow-card`, `shadow-float`, `shadow-pop`, `shadow-dialog`, `shadow-dock`, `shadow-glow`; borda fina: `inset-ring inset-ring-line`                                                    |
| Camada         | `z-dock`, `z-fly`, `z-drawer`, `z-banner`, `z-tip`, `z-toast`, `z-modal`, `z-rotate`, `z-confetti`, `z-tooltip`; dentro de uma carta, `z-1`..`z-5`                                      |
| Tela pequena   | `narrow:` (≤ 960px), `pin:` (≤ 960px em pé), `land:` (≤ 960px deitado), `max-sm:`                                                                                                       |
| Margem lateral | `px-safe` (respeita o entalhe do celular)                                                                                                                                               |

- **Proibido** (o guarda-corpo falha): cor em hex ou `rgb()/rgba()` no código, `text-[13px]`,
  `color-mix(..., transparent)`, sombra com `rgba` e `z-[NN]`.
- Precisa de um valor novo que vai se repetir? Crie o token no `@theme` primeiro, com um
  comentário dizendo para que serve, e depois use a classe.
- Valor arbitrário (`w-[...]`) só para medida única de layout ou proporcional à carta
  (`text-[calc(var(--cw)*0.16)]`). As cartas escalam com `--cw`/`--ch`.
- Classes que se repetem entre componentes vão para `app/components/variants.ts`: `GHOST`, `RED`,
  `INPUT`, `PANEL`, `SCRIM`, `DIALOG`. O `<button>` sem classe já é o botão amarelo de destaque.
- Cor do território: `CLAN_BG`, `CLAN_TEXT`, `CLAN_FG`, `CLAN_TINT` (`cards/cardBase.ts`).
  `CLAN_COLOR` (a variável CSS crua) só para `style`, quando a cor é dinâmica e não cabe numa classe.
- `styles.css` fora do `@theme` é só para o que classe não resolve (keyframes, a virada da
  carta, o leque da mão). Não crie classes CSS novas para componente.

## Testes

- `test/*.test.ts` (node:test): motor, regras e gabarito. Regra nova = teste novo aqui.
- `src/**/*.test.tsx` (Vitest + Testing Library): telas. Encontre elementos por papel/rótulo ou
  `data-*`.
- `test/padrao.test.ts`: o guarda-corpo deste arquivo. Se ele falhar, ajuste o código ao padrão;
  não afrouxe a regra sem combinar com o time.

## Git

- Commits pequenos e com um assunto só, mensagem em pt-BR dizendo o que mudou e por quê.
- Mudança grande (regra nova, refatoração, tela nova): branch + pull request. O CI confere o PR.
