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
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 max-[960px]:grid-cols-1 max-[960px]:justify-items-center">
      <Decks pe={pe} />
      <div className="grid justify-items-center gap-2.5">
        <PhaseTag />
        <MonsterSlot />
        <div className="min-h-[40px] text-center" id="targetInfo">
          <TargetInfo />
        </div>
        <div
          className="flex min-h-2.5 items-center gap-1.5 [--cw:clamp(48px,min(4.6vw,7vh),66px)]"
          id="myPlay"
        >
          <MyPlay me={me} />
        </div>
      </div>
      <HintBox pe={pe} me={me} />
    </div>
  );
}
