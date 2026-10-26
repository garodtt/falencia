import { G, ME } from '../../game/state.ts';
import { useTick } from '../store.ts';
import { Center } from './center/Center.tsx';
import { Dock } from './dock/Dock.tsx';
import { Opponents } from './opponents/Opponents.tsx';
import { RuleBar } from './RuleBar.tsx';
import { myPending } from './view.ts';

// a mesa de jogo (dentro de <section id="game">): Caos, rivais, centro e a sua área
export function Table() {
  useTick();
  if (!G || !G.players) return null;
  const me = G.players[ME],
    pe = myPending();
  return (
    <>
      <RuleBar />
      <Opponents />
      <Center pe={pe} me={me} />
      <Dock pe={pe} me={me} />
    </>
  );
}
