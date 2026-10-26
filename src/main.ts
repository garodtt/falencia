import './styles.css';
import { G, hooks } from './game/state.ts';
import { initNet, netSync } from './net/online.ts';
import { playFx } from './ui/effects.ts';
import { render } from './ui/render.ts';
import { tipFor } from './ui/tips.ts';
import './ui/events.ts';
import { mountApp } from './app/mount.tsx';

// o motor avisa; a tela (e a rede, no anfitrião) reage
hooks.sync = netSync;
hooks.playFx = playFx;
hooks.tip = tipFor;

addEventListener('resize', () => {
  if (G && G.players) render();
});
mountApp();
void initNet();
