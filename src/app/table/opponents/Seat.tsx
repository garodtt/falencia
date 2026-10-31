import { PERSONAS } from '../../../game/bots.ts';
import { KINGS } from '../../../game/data.ts';
import { kingActive } from '../../../game/rules.ts';
import { G, LOCAL, ME, nameOf } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { CLAN_FG } from '../../components/cards/cardBase.ts';
import { Badge } from '../../components/Badge.tsx';
import { GHOST } from '../../components/variants.ts';
import { ChiefCrown } from '../../components/ChiefCrown.tsx';
import { ColorDot } from '../../components/ColorDot.tsx';
import { Icon } from '../../components/Icon.tsx';
import { PlayerStats } from '../../components/PlayerStats.tsx';
import { UsedChips } from '../../components/UsedChips.tsx';
import { KingTip } from '../../components/tips/KingTip.tsx';
import { Tooltip } from '../../components/tooltip/Tooltip.tsx';
import { kick, pickTarget } from '../actions.ts';
import { canKick, outLabel } from '../view.ts';
import { SeatPlay } from './SeatPlay.tsx';

// a cor da borda/sombra do assento: várias coisas podem estar valendo ao mesmo tempo (o rival
// pode ser o chefe E estar vencendo, por ex.); esta é a ordem de prioridade, maior pro menor
function seatSkin(
  acting: boolean,
  chief: boolean,
  isTarget: boolean,
  steal: boolean,
  winner: boolean,
) {
  let border = 'border-line',
    shadow = '';
  if (chief) border = 'border-accent/55';
  if (isTarget) {
    border = steal ? 'border-accent' : 'border-bad';
    shadow = steal ? 'ring-2 ring-accent/40' : 'ring-2 ring-bad/40';
  }
  if (winner) border = 'border-good';
  if (acting) {
    border = 'border-accent';
    shadow = 'ring-2 ring-accent/35 shadow-glow';
  }
  return `${border} ${shadow}`;
}

// um rival: nome, números, rei, o que jogou e o que está fazendo agora
export function Seat({ p }: { p: Player }) {
  const rd = G.rd[p.id];
  const result = G.result && G.phase === 'resultado' ? G.result : null;
  const won = !!(result && result.w.includes(p.id));
  const myPe = G.pend[ME];
  // dá para clicar neste rival: estou roubando/eliminando e ele é um alvo válido
  const isTarget = !!(
    !LOCAL.spec &&
    myPe &&
    (myPe.kind === 'steal' || myPe.kind === 'elim') &&
    myPe.data.T!.includes(p.id) &&
    !LOCAL.answered[myPe.nonce]
  );
  const steal = isTarget && myPe!.kind === 'steal';
  const pe = G.pend[p.id];
  const waiting = !!(
    (pe && !p.bot && pe.kind !== 'next') ||
    (p.bot &&
      p.alive &&
      G.phase === 'dormindo' &&
      !rd.gs.length &&
      !(G.ready || {})[p.id] &&
      !(G.duel && !G.duel.includes(p.id)) &&
      p.hand.length)
  );
  const acting = !!(G.act && G.act.pid === p.id);
  const chief = G.chief === p.id;
  const sitting = !!(G.duel && !G.duel.includes(p.id)); // fora do Duelo
  const shown = !!(G.last && G.last[p.id]) || rd.gs.length > 0; // há cartas na frente dele

  return (
    <div
      data-seat
      className={`relative grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border bg-surface px-3 py-2.5 max-sm:min-h-0 max-sm:gap-x-2 max-sm:gap-y-1 max-sm:px-2.5 max-sm:py-2 land:min-h-0 land:gap-x-2 land:gap-y-0.5 land:px-2.5 land:py-1.5 ${seatSkin(acting, chief, isTarget, steal, won)} ${p.alive ? '' : 'opacity-40'} ${isTarget ? 'cursor-pointer' : ''}`}
      data-id={p.id}
      data-target={isTarget ? (steal ? 'steal' : 'elim') : undefined}
      onClick={isTarget ? () => pickTarget(p.id) : undefined}
    >
      <div style={{ minWidth: 0 }}>
        <div className="flex min-w-0 items-center gap-[7px] font-display text-base font-semibold land:text-sm">
          <ColorDot color={p.color} />
          <span className="truncate">{nameOf(p.id)}</span>
          {p.bot ? <Icon name="bot" /> : null}
          {p.bot && p.persona && PERSONAS[p.persona] ? (
            <span className="font-ui text-xs font-medium text-muted land:hidden">
              {PERSONAS[p.persona].name}
            </span>
          ) : null}
          {chief ? <ChiefCrown /> : null}
          {result && rd.gs.length ? (
            won ? (
              <Badge tone="w">{result.kind === 'exact' ? 'Cravou' : 'Venceu'}</Badge>
            ) : (
              <Badge tone="l">{outLabel(p.id) || 'Perdeu'}</Badge>
            )
          ) : null}
        </div>
        <PlayerStats p={p}>
          <KingStat p={p} />
        </PlayerStats>
      </div>
      <div
        data-oplay
        className="flex items-center gap-1 empty:hidden [--cw:calc(clamp(52px,min(5.2vw,8vh),78px)*0.5)] land:[--cw:22px]"
      >
        {acting ? <span className="animate-blink text-xs text-accent">{G.act!.text}</span> : null}
        <SeatPlay p={p} />
        {!shown && waiting && !acting ? (
          <span className="animate-blink text-xs text-accent">escolhendo…</span>
        ) : null}
        {shown && !G.revealed && !G.openPlays && rd.gs.length && G.phase === 'dormindo' ? (
          <span className="text-xs text-muted land:hidden">pronto</span>
        ) : null}
        {!shown && sitting ? <span className="text-xs text-muted">fora do duelo</span> : null}
      </div>
      <UsedChips rd={rd} />
      {canKick(p, waiting) ? (
        <button
          className={`col-span-full justify-self-start px-2.5 py-[5px] text-xs ${GHOST}`}
          data-kick={p.id}
          onClick={() => kick(p.id)}
        >
          Bot assume a vez
        </button>
      ) : null}
    </div>
  );
}

// o rei do rival (apagado se a Maldição o desligou)
function KingStat({ p }: { p: Player }) {
  const on = kingActive(p);
  return (
    <Tooltip content={() => <KingTip king={p.king} on={on} />}>
      <span className={CLAN_FG[p.king]}>
        <Icon name="crown" />
        <span className="text-muted land:hidden">{KINGS[p.king].short}</span>
      </span>
    </Tooltip>
  );
}
