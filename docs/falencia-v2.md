# 🃏 v2 — Errar para menos descarta + fim do baralho

| Campo                     | Valor                                                                                                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                    | Substituída                                                                                                                                                                                                          |
| Data                      | 2026-10-15                                                                                                                                                                                                           |
| Partidas simuladas        | 510.000                                                                                                                                                                                                              |
| Jogadores testados        | 1, 2, 3, 4                                                                                                                                                                                                           |
| Duração mediana (rodadas) | 2p: 9 · 3p: 10 · 4p: 11                                                                                                                                                                                              |
| Empates                   | 19–25%                                                                                                                                                                                                               |
| Mudanças vs anterior      | J/Q/K = 11/12/13 e Ás = 1. Palpites revelados ao mesmo tempo. Errar para menos descarta a menor carta. Se o baralho central acabar, vence quem tem mais cartas (desempate: palpite mais próximo).                    |
| Principais achados        | Acabou o 'jogue o Ás'. Viés de assento sumiu. Mas 19-25% das partidas terminam empatadas, a estratégia quase não importa (vira sorte), o fim do baralho nunca acontece e jogar com 1 jogador é impossível de vencer. |

Página no Notion: https://app.notion.com/p/3fcd6cd7562b81a8a8a5da0d641ff507

---

> 📌 Testada em 510 mil partidas (1 a 4 jogadores, 10 estratégias, 3 leituras da regra).

## Mudanças vs v1

- Valores definidos: J = 11, Q = 12, K = 13, Ás = 1.
- Todos revelam os palpites ao mesmo tempo.
- **Novo:** errar para menos descarta a menor carta.
- **Novo:** se o baralho central acabar, vence quem tem mais cartas; empate → quem chegou mais perto do resultado final.

## Resultados dos testes

- **Melhorou:** somas jogadas espalhadas entre 2 e 12 (antes 64% eram Ás). Vantagem de assento sumiu (≈27% cada com 3 jogadores). Naipes equilibrados.
- **Empates em ~1 de cada 4 partidas** (23% com 2, 19% com 3, 25% com 4) — todos falem na mesma rodada. Desempate pelo palpite mais próximo reduziria para 6-8%.
- **Estratégia quase não importa:** 88% das jogadas erram e descartam; partidas de 9-11 rodadas; quase todas as estratégias vencem 17-19% com 4 jogadores.
- **Fim do baralho nunca acontece** (partida mais longa: 20 rodadas, baralho tem 52 cartas).
- **Jogando sozinho é impossível vencer** (0 em 30 mil partidas).
- Recuperar ainda vale mais que atacar com 3-4 jogadores (38% vs 33% e 33% vs 25%).

## Lacunas no texto

- Menor carta jogada ou menor da mão (testado: dá no mesmo); empate no descarte ao passar; ordem quando dois acertam; destino da carta atacada; todos falindo juntos.

## Regras completas (v2)

Igual à v1, com estas alterações:

- Jogadores: 1 - 4
- Valete, Dama e Rei valem respectivamente 11, 12 e 13, enquanto Ás vale 1.
- Então os jogadores tem de usar as cartas de 1 a 10 em sua mão para adivinhar o número da carta do centro, revelando seus palpites todos ao mesmo tempo
- Caso erre para baixo, se descarta a menor carta, em prol de evitar o ciclo de jogar apenas cartas baixas.
- Caso o baralho central acabe, ganha quem tiver mais cartas, se houver empate, ganhar aquele com a carta mais próxima do resultado final.
