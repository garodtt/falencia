import type { ReactNode } from 'react';
import { CLAN, ITEMS, KINGS, TNAME, lendTxt } from '../../../game/data.ts';
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
    <div className={`me ${won ? 'winner' : ''}`} id="meBox">
      <div className="oname">
        <ColorDot color={me.color} />
        {nameOf(ME)}
        {G.chief === ME ? <ChiefCrown /> : null}
        {me.alive ? null : <Badge tone="l">Faliu</Badge>}
      </div>
      <PlayerStats p={me} />
      <UsedChips rd={rd} />
      <KingRow me={me} />
      <div className="lend">
        Empresta <TraitIcons t={k.tr} />
        {` aos ${lendTxt(me.king)}`}
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
    <button className={`kingrow ${on ? '' : 'off'}`} id="kingToggle" onClick={toggleKing}>
      <span
        className="cr"
        id="myKing"
        style={{
          color: CCSS[me.king],
          background: `color-mix(in srgb, ${CCSS[me.king]} 22%, transparent)`,
        }}
      >
        <Icon name="crown" />
      </span>
      <span>
        <b>{k.name}</b>
        <small>{`${k.short}${on ? '' : ' · desligado nesta rodada'} · ${open ? 'toque para fechar' : 'toque para ver'}`}</small>
      </span>
      {open ? <span className="full">{k.text}</span> : null}
    </button>
  );
}

// um efeito valendo nesta rodada (item preparado, Bandeira, Disfarce)
function EffectLine({ title, text }: { title: ReactNode; text: string }) {
  return (
    <div className="fx">
      <b>{title}</b>
      {text}
    </div>
  );
}
