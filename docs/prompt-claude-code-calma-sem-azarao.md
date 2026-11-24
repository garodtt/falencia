# Prompt para o Claude Code — tirar Cravada do Azarão e renomear para Calma não Compensa

Cole tudo abaixo no Claude Code, dentro da pasta do repositório `falencia`.

---

Atualize o jogo para bater com as regras v7 atuais (docs/V7 gostosa arrumada com regras boas demais.md, que é o espelho do Notion). São duas mudanças:

## 1. Remover a Cravada do Azarão por completo

A regra deixou de existir. Antes: "Quem cravar tendo a menor mão da mesa (no início da rodada) rouba 4 cartas em vez de 2", efeito impresso dos monstros 13, 18, 21 e 32, e com Monstros Opostos ela vencia a regra do Caos (o azarão roubava 4 em vez de 1).

- Procure em todo o projeto: `grep -rni "azar" src/` (e também em testes, scripts de simulação, docs dentro do app e textos da tela de regras).
- `src/game/data.ts`: tire o efeito do enum/objeto `MFX` e das tabelas `MON_FX`. Os monstros 13, 18, 21 e 32 ficam **sem efeito** (só território). Não mexa nos outros efeitos: Amigo dos Fracos continua em 10, 15, 20, 25, 30, 35 e 40, Vingança do Cemitério em 17, 26, 31 e 38. As passivas continuam em 11 Chapéu, 16 Cicatriz, 22 Monóculo, 27 Fedorento, 33 Maluco e 37 Pereba.
- `src/game/engine.ts` / `src/game/rules.ts`: apague a lógica do roubo de 4 cartas, o registro da "menor mão no início da rodada" (se só servia para o Azarão — a **maior mão** continua sendo anotada para a Caça ao Líder) e a exceção do Azarão com Monstros Opostos. Com Monstros Opostos, acertar em cheio sempre rouba **1 carta** (em vez de 2) e compra 1 item.
- A Armadilha continua disparando em roubo/eliminação de cravada, aproximação e Fúria, roubo do Duelo e Sacrifício — só tire a menção ao Azarão.
- Tire o Azarão da tela de regras (`src/app/overlays/Rules.tsx`), dos textos de log/anúncio do monstro, das dicas, da IA dos bots e de qualquer contador de estatística da simulação.

## 2. Renomear "Pressa não Compensa" para "Calma não Compensa"

- Só o **nome** muda. A regra continua igual: quem perde tendo jogado 3 goblins ou mais compra 1 item no fim da rodada; a carta puxada na Roleta não conta para os 3 goblins; vale mesmo para quem não descartou (Amuleto, última carta).
- Troque todos os textos visíveis ("Pressa não Compensa" → "Calma não Compensa"): tela de regras, logs, toasts, tutorial, manual/README.
- Chaves internas (ex.: `PRESSA`) podem ser renomeadas para `CALMA` se for simples e seguro; se não, deixe a chave e troque só o texto.

## Conferência final

1. `grep -rni "azar\|pressa" src/` não pode achar nada (a não ser chaves internas que você decidiu manter — me diga quais).
2. Rode o typecheck, o lint e os testes; corrija o que quebrar (inclusive testes que esperavam o Azarão).
3. Rode a simulação de bots (2, 3 e 4 jogadores, bots lógicos e humanos) e me mostre: zero erros, duração mediana e % de vitória por clã, comparando com antes da mudança.
4. Faça o build e confirme que a tela de regras abre sem o Azarão e com "Calma não Compensa".
5. Faça commit com a mensagem: `v7: remove Cravada do Azarão; Pressa não Compensa → Calma não Compensa` e me diga o hash.
