import type { ReactNode } from 'react';
import { CLAN, ITEMS, KINGS, TNAME, heirsTxt } from '../../../game/data.ts';
import { kingActive } from '../../../game/rules.ts';
import { G, ME, nameOf } from '../../../game/state.ts';
import type { Player } from '../../../game/types.ts';
import { CCSS } from '../../../ui/html.ts';
import { Badge } from '../../components/Badge.tsx';
import { ChiefCrown } from '../../components/ChiefCrown.tsx';
import { ColorDot } from '../../components/ColorDot.tsx';
import { Icon, TraitIcons } from '../../components/Icon.tsx';
import { PlayerStats } from '../../components/PlayerStats.tsx';
import { UsedChips } from '../../components/UsedChips.tsx';
import { useUi } from '../../store.ts';
import { toggleKing } from '../actions.ts';

// a sua área: nome, números, itens usados, o rei e o que está valendo para você nesta rodada
export function MeBox({ me }: { me: Player }) {
  const rd = G.rd[ME],
    k = KINGS[me.king],
    won = G.result && G.result.w.includes(ME) && G.phase === 'resultado';
  return (
    <div
      className={`grid gap-2.5 rounded-xl border bg-surface p-3 land:gap-1.5 land:p-2 ${won ? 'border-good' : 'border-line'}`}
      id="meBox"
    >
      <div className="flex min-w-0 items-center gap-[7px] font-display text-base font-semibold">
        <ColorDot color={me.color} />
        {nameOf(ME)}
        {G.chief === ME ? <ChiefCrown /> : null}
        {me.alive ? null : <Badge tone="l">Faliu</Badge>}
      </div>
      <PlayerStats p={me} />
      <UsedChips rd={rd} />
      <KingRow me={me} />
      <div className="flex flex-wrap items-center gap-[5px] text-xs text-muted land:hidden">
        <TraitIcons t={k.tr} />
        {` herdada pelos ${heirsTxt(me.king)}`}
      </div>
      {rd.armed.map((a) => (
        <EffectLine key={a} title={ITEMS[a][0]} text={` preparado · ${ITEMS[a][1]}`} />
      ))}
      {rd.band >= 0 ? (
        <EffectLine
          title={`Bandeira ${CLAN[rd.band]}`}
          text={` · para você o monstro também é ${CLAN[rd.band]}`}
        />
      ) : null}
      {rd.disg ? (
        <EffectLine title="Disfarce" text={` · seus goblins jogados têm ${TNAME[rd.disg]}`} />
      ) : null}
    </div>
  );
}

// o cartão do rei: toque para ler a habilidade (apagado se a Maldição o desligou)
function KingRow({ me }: { me: Player }) {
  const open = useUi((s) => s.kingOpen);
  const k = KINGS[me.king],
    on = kingActive(me);
  return (
    <button
      className="grid w-full grid-cols-[auto_1fr] items-center gap-2.5 rounded-[10px] bg-surface-2 p-[9px] text-left land:grid-cols-[auto_minmax(0,1fr)] land:gap-2 land:p-1.5 text-text shadow-none hover:bg-surface-3 hover:filter-none"
      id="kingToggle"
      onClick={toggleKing}
    >
      <span
        className="grid size-8 place-items-center rounded-lg"
        id="myKing"
        style={{
          color: CCSS[me.king],
          background: `color-mix(in srgb, ${CCSS[me.king]} 22%, transparent)`,
        }}
      >
        <Icon name="crown" style={{ width: 19, height: 19 }} />
      </span>
      <span>
        <b
          className={`block font-display text-sm font-semibold land:truncate ${on ? '' : 'line-through opacity-70'}`}
        >
          {k.name}
        </b>
        <small className="block font-medium text-muted land:hidden">{`${k.short}${on ? '' : ' · desligado nesta rodada'} · ${open ? 'toque para fechar' : 'toque para ver'}`}</small>
      </span>
      {open ? (
        <span className="col-span-full text-[12.5px] font-medium text-muted">{k.text}</span>
      ) : null}
    </button>
  );
}

// um efeito valendo nesta rodada (item preparado, Bandeira, Disfarce)
function EffectLine({ title, text }: { title: ReactNode; text: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-2 py-1.5 text-xs">
      <b className="text-sun">{title}</b>
      {text}
    </div>
  );
}
