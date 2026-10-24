# Falência: Goblins

Jogo de cartas: chegue o mais perto do monstro, crave o valor para roubar cartas, sobreviva ao Caos.

## Rodando

Precisa de Node 24+. As ferramentas (Vite, Vitest, Oxlint, Oxfmt) vêm todas no [Vite+](https://viteplus.dev),
instalado como dependência do projeto: não precisa instalar nada global.

```bash
npm install
cp .env.example .env    # preencha com os dados do Firebase (só precisa para o online)
npm run dev             # http://localhost:5173
npm run check           # formatação + lint + tipos, tudo de uma vez
npm test                # motor igual ao gabarito + testes de tela
npm run format          # formata o código
npm run build           # gera dist/ para publicar
```

Antes de subir mudanças: `npm run check && npm test`.

## Estrutura

```
src/
  game/            motor do jogo — não toca no DOM
    types.ts       formato do estado da partida (é o JSON que vai para o banco)
    data.ts        goblins, reis e rainhas, itens, Caos, monstros
    state.ts       estado da partida (G, ME...) e os hooks que avisam a tela
    rules.ts       regras: valores, margens, quem está ganhando, itens liberados
    bots.ts        IA dos bots
    engine.ts      rodada, janela de itens, pedidos aos jogadores, loop do jogo
  net/
    firebase.ts    adaptador do Realtime Database (config vem do .env)
    online.ts      mesas online (anfitrião roda o motor, os outros mandam ações)
  app/             telas em React
    store.ts       Zustand: ponte motor → React e estado só de tela (seleção, modal, avisos)
    mount.tsx      liga cada tela React no seu lugar do index.html
    components/    peças reutilizáveis: cartas (cards/), PlayerStats, ColorDot, Badge, Warn...
                   tooltip/ = balão de informação (useTooltip, Tooltip, TipBody);
                   tips/ = o conteúdo dos balões (goblin, item, rei, monstro)
    menu/          menu inicial (online/ = painel das mesas online)
    table/         a mesa: opponents/ (rivais), center/ (montes, monstro, alvo), dock/ (sua área,
                   mão, itens, bar/ = barra de ação); actions.ts = o que os cliques fazem
    overlays/      modal, banner, toast, histórico, dicas e regras
  ui/              o que ainda não é React (barra do topo e sala de espera online, até mexermos
                   no online) e as pontes: render.ts (redesenha a mesa), effects.ts (cartas
                   voando, confete), tips.ts (qual dica está aberta)
  main.ts          liga o motor na tela
test/              teste "golden master": partidas de bots têm que terminar igual ao gabarito
                   (gerado da versão original). Mudou regra de propósito? UPDATE_GOLDEN=1 npm test
```

O motor fala com a tela só por `hooks` (`state.ts`): `sync` (estado mudou), `playFx` (efeito visual) e `tip` (dica).
Do lado do React, toda mudança vira um `bump()` na store, e os componentes assinam com `useTick()`.
