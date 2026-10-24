import { useTick } from '../store.ts';
import { ClanPicker } from './ClanPicker.tsx';
import { Hero } from './Hero.tsx';
import { OnlinePanel } from './online/OnlinePanel.tsx';
import { PlayerCountPicker } from './PlayerCountPicker.tsx';
import { PlayLocal } from './PlayLocal.tsx';

// tela inicial: partida contra bots e mesas online
export function Menu() {
  useTick(); // MENU e NET mudam por fora (setMenu, rede)
  return (
    <div className="menuBox">
      <Hero />
      <div className="panel">
        <PlayerCountPicker />
        <div className="muted">Escolha seu território (e seu rei ou rainha)</div>
        <ClanPicker />
        <PlayLocal />
      </div>
      <OnlinePanel />
    </div>
  );
}
