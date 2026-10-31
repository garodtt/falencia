import { useEffect } from 'react';
import { CLAN, KINGS } from '../../game/data.ts';
import { G, NET } from '../../game/state.ts';
import { leaveTable, resolveNames, sendAct, startOnline } from '../../net/online.ts';
import { ColorDot } from '../components/ColorDot.tsx';
import { GHOST, PRIMARY } from '../components/variants.ts';
import { useTick } from '../store.ts';

const CODE = 'font-display text-lg font-extrabold tracking-[2px] text-accent';
const ROW = 'flex items-center gap-2.5 rounded-box bg-surface-2 px-3.5 py-3';

// sala de espera de uma mesa online: quem já sentou, vagas livres e o botão de começar
export function Lobby() {
  useTick();
  const seats = G?.seats || [],
    uids = seats.map((s) => s.uid).filter(Boolean);
  const key = uids.join();
  useEffect(() => {
    if (key) void resolveNames(key.split(','));
  }, [key]);
  if (!G) return null;
  const mine = seats.find((s) => s.uid === NET.uid),
    free = [0, 1, 2, 3].filter((c) => !seats.some((s) => s.color === c));
  return (
    <div className="grid w-[min(640px,100%)] gap-3.5">
      <h2 className="m-0 font-display text-4xl font-extrabold">
        Mesa <span className={CODE}>{G.code}</span>
      </h2>
      <p className="text-muted">
        Peça para os outros abrirem esta mesma página e entrarem com o código{' '}
        <b className={CODE}>{G.code}</b>.
      </p>
      <div className="grid gap-2">
        {Array.from({ length: G.n }, (_, i) => {
          const s = seats[i];
          if (!s)
            return (
              <div key={i} className={`${ROW} text-muted`}>
                <ColorDot />
                Vaga livre <span className="text-muted">· vira bot se ninguém entrar</span>
              </div>
            );
          return (
            <div key={i} className={ROW}>
              <ColorDot color={s.color} />
              <b>{s.uid === NET.uid ? 'Você' : NET.names[s.uid!] || 'Jogador'}</b>
              <span className="text-muted">
                {CLAN[s.color]} · {KINGS[s.color].name}
              </span>
              {s.uid === G.hostUid && (
                <span className="rounded-full bg-surface-3 px-2 py-0.5 text-note font-bold text-muted">
                  anfitrião
                </span>
              )}
            </div>
          );
        })}
      </div>
      {mine && free.length > 0 && !NET.isHost && (
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-muted">Trocar de território:</span>
          {free.map((c) => (
            <button
              key={c}
              className={GHOST}
              onClick={() => void sendAct({ kind: 'color', color: c })}
            >
              <ColorDot color={c} />
              {CLAN[c]}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        {NET.isHost ? (
          <button className={PRIMARY} onClick={() => void startOnline()}>
            Começar partida
          </button>
        ) : (
          <span className="text-muted">
            {mine ? 'Aguardando o anfitrião começar…' : 'Entrando na mesa…'}
          </span>
        )}
        <button className={GHOST} onClick={leaveTable}>
          Sair da mesa
        </button>
      </div>
    </div>
  );
}
