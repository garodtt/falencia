import './styles.css';
import { G, hooks } from './game/state.ts';
import { initNet, netSync } from './net/online.ts';
import { playFx } from './app/fx.tsx';
import { render } from './app/render.ts';
import { tipFor } from './app/tips.ts';
import { isSandbox, mountApp } from './app/mount.tsx';

// o motor avisa; a tela (e a rede, no anfitrião) reage
hooks.sync = netSync;
hooks.playFx = playFx;
hooks.tip = tipFor;

addEventListener('resize', () => {
  if (G && G.players) render();
});
mountApp();
// o sandbox não precisa do online (e cada cena da mesa é um iframe: seriam várias conexões)
if (!isSandbox()) void initNet();
