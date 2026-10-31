// A mesa de verdade em cada momento da partida. Cada cena roda num iframe do tamanho da tela
// escolhida, então o layout de celular (pin:/land:) vale como num aparelho.
import { useState } from 'react';
import { chaosTitle } from '../../game/data.ts';
import { GHOST } from '../../app/components/variants.ts';
import { CAOS, CENAS } from '../scenes.ts';
import { Bloco } from '../layout.tsx';

const TELAS = [
  { nome: 'Computador', w: 1366, h: 800 },
  { nome: 'Celular em pé', w: 390, h: 844 },
  { nome: 'Celular deitado', w: 844, h: 390 },
  { nome: 'Tablet em pé', w: 820, h: 1180 },
];
const LARGURA = 1000; // a tela escolhida é encolhida para caber nesta largura

// botão de escolha: marcado ou não
const opcao = (on: boolean) =>
  `${GHOST} px-3 py-1.5 text-small ${on ? '!bg-accent/20 !text-accent' : ''}`;

export function Mesa() {
  const [cena, setCena] = useState(CENAS[0].id),
    [n, setN] = useState(4),
    [caos, setCaos] = useState(''),
    [tela, setTela] = useState(TELAS[0]),
    [seed, setSeed] = useState(1);
  const hash = `#/sandbox/cena/${cena}?n=${n}&seed=${seed}${caos ? `&caos=${caos}` : ''}`,
    escala = Math.min(1, LARGURA / tela.w),
    atual = CENAS.find((c) => c.id === cena)!;
  return (
    <>
      <Bloco
        titulo="Cenários"
        desc="Uma partida de verdade, avançada até o momento escolhido. Dali ela continua jogável, com animações."
      >
        <div className="flex flex-wrap gap-1.5">
          {CENAS.map((c) => (
            <button key={c.id} className={opcao(c.id === cena)} onClick={() => setCena(c.id)}>
              {c.nome}
            </button>
          ))}
        </div>
        <p className="m-0 text-small text-muted">{atual.desc}</p>
        <div className="flex flex-wrap items-center gap-4 text-small">
          <span className="flex items-center gap-1.5">
            Jogadores
            {[2, 3, 4].map((k) => (
              <button key={k} className={opcao(k === n)} onClick={() => setN(k)}>
                {k}
              </button>
            ))}
          </span>
          <label className="flex items-center gap-1.5">
            Caos em toda rodada
            <select
              className="rounded-box border border-line bg-surface-2 px-2 py-1.5 text-text"
              value={caos}
              onChange={(e) => setCaos(e.target.value)}
            >
              <option value="">nenhum (sorteado)</option>
              {CAOS.map((k) => (
                <option key={k} value={k}>
                  {chaosTitle(k)}
                </option>
              ))}
            </select>
          </label>
          <button className={GHOST} onClick={() => setSeed(seed + 1)}>
            Outra partida
          </button>
          <a className="text-accent" href={hash} target="_blank" rel="noreferrer">
            Abrir em tela cheia ↗
          </a>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TELAS.map((t) => (
            <button key={t.nome} className={opcao(t === tela)} onClick={() => setTela(t)}>
              {t.nome} · {t.w}×{t.h}
            </button>
          ))}
        </div>
      </Bloco>
      <div className="overflow-hidden" style={{ width: tela.w * escala, height: tela.h * escala }}>
        {/* a chave nova recarrega o iframe: só trocar o # não recarregaria a página */}
        <iframe
          key={hash + tela.nome}
          title="Mesa"
          src={hash}
          width={tela.w}
          height={tela.h}
          className="origin-top-left rounded-box border border-line"
          style={{ transform: `scale(${escala})` }}
        />
      </div>
    </>
  );
}
