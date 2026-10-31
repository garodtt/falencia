// Todas as cartas do jogo. Passe o mouse para ver o balão de cada uma, como na mesa.
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CHAOS, CLAN, ITEMS, makeMonsters, mk } from '../../game/data.ts';
import type { ChaosKey, ItemKey } from '../../game/data.ts';
import { G } from '../../game/state.ts';
import { BackCard } from '../../app/components/cards/BackCard.tsx';
import { ChaosBack } from '../../app/components/cards/ChaosBack.tsx';
import { ChaosCard } from '../../app/components/cards/ChaosCard.tsx';
import { GobCard } from '../../app/components/cards/GobCard.tsx';
import { ItemBack } from '../../app/components/cards/ItemBack.tsx';
import { ItemCard } from '../../app/components/cards/ItemCard.tsx';
import { MonsterBack } from '../../app/components/cards/MonsterBack.tsx';
import { MonsterCard } from '../../app/components/cards/MonsterCard.tsx';
import { Amostra, Bloco, LINHA } from '../layout.tsx';

const MONSTROS = makeMonsters().sort((a, b) => a.v - b.v);
const GOBLINS = Array.from({ length: 20 }, (_, i) => i + 1);

export function Cartas() {
  const [cw, setCw] = useState(70),
    [sm, setSm] = useState(false),
    [eff, setEff] = useState(false);
  return (
    <div className="grid gap-4" style={{ '--cw': `${cw}px` } as CSSProperties}>
      <div className="sticky top-14 z-2 flex flex-wrap items-center gap-4 rounded-panel border border-line bg-surface p-3 text-small">
        <label className="flex items-center gap-2">
          Tamanho (--cw)
          <input
            type="range"
            min={40}
            max={160}
            value={cw}
            onChange={(e) => setCw(+e.target.value)}
          />
          <span className="font-mono">{cw}px</span>
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={sm} onChange={(e) => setSm(e.target.checked)} />
          versão pequena (sm)
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={eff} onChange={(e) => setEff(e.target.checked)} />
          valor efetivo diferente (eff)
        </label>
      </div>
      {CLAN.map((nome, c) => (
        <Bloco
          key={nome}
          titulo={`Goblins ${nome}`}
          desc="A coroa marca os 5 que herdam a característica do rei ou rainha."
        >
          <div className={LINHA}>
            {GOBLINS.map((v) => (
              <GobCard
                key={v}
                g={mk(c, v)}
                sm={sm}
                eff={eff ? 0 : undefined}
                owner={G.players[c]}
              />
            ))}
          </div>
        </Bloco>
      ))}
      <Bloco titulo="Versos">
        <div className={LINHA}>
          <Amostra nome="BackCard">
            <BackCard />
          </Amostra>
          <Amostra nome="ItemBack">
            <ItemBack />
          </Amostra>
          <Amostra nome="ChaosBack">
            <ChaosBack />
          </Amostra>
          <Amostra nome="MonsterBack">
            <MonsterBack />
          </Amostra>
        </div>
      </Bloco>
      <Bloco titulo={`Monstros (${MONSTROS.length})`} desc="Com efeito e passiva impressos.">
        <div className={LINHA}>
          {MONSTROS.map((m) => (
            <MonsterCard key={m.v} m={m} mod={0} />
          ))}
        </div>
      </Bloco>
      <Bloco titulo={`Itens (${Object.keys(ITEMS).length} tipos)`}>
        <div className={LINHA}>
          {(Object.keys(ITEMS) as ItemKey[]).map((k) => (
            <ItemCard key={k} k={k} />
          ))}
        </div>
      </Bloco>
      <Bloco titulo={`Caos (${Object.keys(CHAOS).length} tipos)`}>
        <div className={LINHA}>
          {(Object.keys(CHAOS) as ChaosKey[]).map((k) => (
            <ChaosCard key={k} k={k} />
          ))}
        </div>
      </Bloco>
    </div>
  );
}
