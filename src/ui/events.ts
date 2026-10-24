// Cliques do que ainda é HTML fixo: a barra do topo e a sala de espera online.
// A mesa e o menu tratam os próprios cliques (React).
import { createElement } from 'react';
import { G, MODE, NET, SPEED, setSPEED } from '../game/state.ts';
import { leaveTable, sendAct, startOnline } from '../net/online.ts';
import { askLocal } from '../app/overlays/modal.ts';
import { Rules } from '../app/overlays/Rules.tsx';
import { goMenu } from '../app/table/actions.ts';
import { $, ic } from './html.ts';
import { render } from './render.ts';

document.querySelector('header.bar')!.addEventListener('click', async (e) => {
  const t = (e.target as Element).closest<HTMLElement>('button');
  if (!t) return;
  if (t.id === 'btnMenu') return goMenu();
  if (t.id === 'btnLog') return void $('logDrawer').classList.toggle('open');
  if (t.id === 'btnRules')
    return void (await askLocal(
      'Regras',
      '',
      [{ label: 'Fechar', value: 1 }],
      createElement(Rules),
    ));
  if (t.id === 'btnSpeed') {
    setSPEED(SPEED === 1 ? 0.45 : 1);
    t.innerHTML = `${ic('gauge')}${SPEED === 1 ? 'Normal' : 'Rápido'}`;
    document.documentElement.style.setProperty('--spd', String(SPEED));
  }
});

$('lobby').addEventListener('click', (e) => {
  const t = (e.target as Element).closest<HTMLElement>('button');
  if (!t) return;
  if (t.id === 'btnStartOnline') return void startOnline();
  if (t.dataset.color !== undefined)
    return void sendAct({ kind: 'color', color: +t.dataset.color });
  if (t.id === 'btnLeave') return leaveTable();
});

// atualiza o botão "Bot assume a vez" para o anfitrião
setInterval(() => {
  if (MODE === 'online' && NET.isHost && G && G.players && Object.keys(NET.waitSince).length)
    render();
}, 10000);
