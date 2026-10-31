import { useEffect } from 'react';
import { G, ME, MODE, NET } from '../../game/state.ts';
import { bump, useTick } from '../store.ts';
import { Center } from './center/Center.tsx';
import { Dock } from './dock/Dock.tsx';
import { Opponents } from './opponents/Opponents.tsx';
import { RuleBar } from './RuleBar.tsx';
import { myPending } from './view.ts';

// a mesa de jogo (dentro de <section id="game">): Caos, rivais, centro e a sua área
export function Table() {
  useTick();
  // online, o anfitrião redesenha a cada 10s: o botão "Bot assume a vez" aparece sozinho
  useEffect(() => {
    const t = setInterval(() => {
      if (MODE === 'online' && NET.isHost && Object.keys(NET.waitSince).length) bump();
    }, 10000);
    return () => clearInterval(t);
  }, []);
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
