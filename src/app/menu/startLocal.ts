// Início da partida contra bots.
import { CLAN, KINGS, shuffle } from '../../game/data.ts';
import { gameLoop, newState } from '../../game/engine.ts';
import { MENU, log, setG, setME, setMODE } from '../../game/state.ts';
import { render, show } from '../render.ts';
import { tipFor } from '../tips.ts';

export function startLocal() {
  const colors = [MENU.color, ...shuffle([0, 1, 2, 3].filter((c) => c !== MENU.color))].slice(
    0,
    MENU.n,
  );
  setMODE('local');
  setME(0);
  setG(
    newState(
      MENU.n,
      colors.map((c, i) => ({ color: c, bot: i > 0 })),
    ),
  );
  show('game');
  log(`Você é o território ${CLAN[MENU.color]}, com ${KINGS[MENU.color].name}.`);
  render(true);
  tipFor('start');
  void gameLoop();
}
