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
    <div className="grid w-[min(960px,100%)] gap-[18px]">
      <Hero />
      <div className="grid gap-3 rounded-[14px] border border-line bg-surface p-4">
        <PlayerCountPicker />
        <div className="text-muted">Escolha seu território (e seu rei ou rainha)</div>
        <ClanPicker />
        <PlayLocal />
      </div>
      <OnlinePanel />
    </div>
  );
}
