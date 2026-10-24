import type { Pending, Player } from '../../../game/types.ts';
import { Decks } from './Decks.tsx';
import { HintBox } from './HintBox.tsx';
import { MonsterSlot } from './MonsterSlot.tsx';
import { MyPlay } from './MyPlay.tsx';
import { PhaseTag } from './PhaseTag.tsx';
import { TargetInfo } from './TargetInfo.tsx';

// o centro da mesa: montes, monstro, alvo, a sua jogada e a dica do momento
export function Center({ pe, me }: { pe: Pending | null; me: Player }) {
  return (
    <div className="center">
      <Decks pe={pe} />
      <div className="mid">
        <PhaseTag />
        <MonsterSlot />
        <div className="target" id="targetInfo">
          <TargetInfo />
        </div>
        <div id="myPlay">
          <MyPlay me={me} />
        </div>
      </div>
      <HintBox pe={pe} me={me} />
    </div>
  );
}
