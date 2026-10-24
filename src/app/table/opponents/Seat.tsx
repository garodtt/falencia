import { PERSONAS } from '../../../game/bots.ts';
import { KINGS } from '../../../game/data.ts';
import { kingActive } from '../../../game/rules.ts';
import { G, LOCAL, ME, nameOf } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { CCSS } from '../../../ui/html.ts';
import { Badge } from '../../components/Badge.tsx';
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
  const sitting = !!(G.duel && !G.duel.includes(p.id)); // fora do Duelo
  const shown = !!(G.last && G.last[p.id]) || rd.gs.length > 0; // há cartas na frente dele
  const cls = [
    'seat',
    acting ? 'acting' : '',
    p.alive ? '' : 'out',
    G.chief === p.id ? 'chief' : '',
    isTarget ? 'target' + (myPe!.kind === 'steal' ? ' steal' : '') : '',
    won ? 'winner' : '',
  ].join(' ');

  return (
    <div
      className={cls}
      data-id={p.id}
      data-tgt={isTarget ? p.id : undefined}
      onClick={isTarget ? () => pickTarget(p.id) : undefined}
    >
      <div style={{ minWidth: 0 }}>
        <div className="oname">
          <ColorDot color={p.color} />
          <span className="nmtx">{nameOf(p.id)}</span>
          {p.bot ? <Icon name="bot" /> : null}
          {p.bot && p.persona && PERSONAS[p.persona] ? (
            <span className="muted" style={{ font: '500 12px var(--ui)' }}>
              {PERSONAS[p.persona].name}
            </span>
          ) : null}
          {G.chief === p.id ? <ChiefCrown /> : null}
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
      <div className="oplay">
        {acting ? <span className="think on">{G.act!.text}</span> : null}
        <SeatPlay p={p} />
        {!shown && waiting && !acting ? <span className="think on">escolhendo…</span> : null}
        {shown && !G.revealed && !G.openPlays && rd.gs.length && G.phase === 'dormindo' ? (
          <span className="think">pronto</span>
        ) : null}
        {!shown && sitting ? <span className="think">fora do duelo</span> : null}
      </div>
      <UsedChips rd={rd} />
      {canKick(p, waiting) ? (
        <button className="ghost kick" data-kick={p.id} onClick={() => kick(p.id)}>
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
      {(anchor) => (
        <span className={on ? '' : 'off'} style={{ color: CCSS[p.king] }} {...anchor()}>
          <Icon name="crown" />
          <span style={{ color: 'var(--muted)' }}>{KINGS[p.king].short}</span>
        </span>
      )}
    </Tooltip>
  );
}
