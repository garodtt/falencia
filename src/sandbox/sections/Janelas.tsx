// As janelas do jogo: o modal de pergunta (askLocal) em cada formato, as regras e o aviso de girar.
import { useState } from 'react';
import { ItemCard } from '../../app/components/cards/ItemCard.tsx';
import { GHOST } from '../../app/components/variants.ts';
import { toast } from '../../app/fx.tsx';
import { askLocal } from '../../app/overlays/modal.ts';
import { RotateHint } from '../../app/overlays/RotateHint.tsx';
import { Rules } from '../../app/overlays/Rules.tsx';
import { Bloco } from '../layout.tsx';

// abre e mostra num toast o que foi escolhido
const perguntar = (...a: Parameters<typeof askLocal>) =>
  void askLocal(...a).then((v) => toast(`Escolheu: ${String(v)}`));

const MODAIS: [string, () => void][] = [
  [
    'Sim ou não',
    () =>
      perguntar('Usar o NÃO!?', 'Azul usou Porrete (+2). Cancelar com o seu NÃO!?', [
        { label: 'Usar NÃO!', value: 1 },
        { label: 'Deixar', value: 0, cls: 'ghost' },
      ]),
  ],
  [
    'Perigosa (vermelho)',
    () =>
      perguntar('Sair da partida?', 'A partida atual será encerrada.', [
        { label: 'Sair', value: 1, cls: 'red' },
        { label: 'Ficar', value: 0, cls: 'ghost' },
      ]),
  ],
  [
    'Muitas opções',
    () =>
      perguntar(
        'Ajuste Fino',
        'Quanto somar?',
        [-3, -2, -1, 1, 2, 3].map((d) => ({ label: d > 0 ? `+${d}` : `${d}`, value: d })),
      ),
  ],
  [
    'Com cartas (Mercadora)',
    () =>
      perguntar(
        'Mercadora',
        'Você comprou 2 itens. Fique com um.',
        [
          { label: 'Luneta', value: 'LUNETA' },
          { label: 'Porrete', value: 'PORRETE' },
        ],
        <>
          <ItemCard k="LUNETA" />
          <ItemCard k="PORRETE" />
        </>,
      ),
  ],
  ['Regras', () => perguntar('Regras', '', [{ label: 'Fechar', value: 1 }], <Rules />)],
];

export function Janelas() {
  const [girar, setGirar] = useState(false);
  return (
    <Bloco
      titulo="Modais"
      desc="Todo modal do jogo é askLocal(título, texto, opções, conteúdo?). Na mesa, as perguntas do motor abrem por ele."
    >
      <div className="flex flex-wrap gap-2">
        {MODAIS.map(([nome, abrir]) => (
          <button key={nome} className={GHOST} onClick={abrir}>
            {nome}
          </button>
        ))}
        <button className={GHOST} onClick={() => setGirar(true)}>
          Gire a tela (celular em pé)
        </button>
      </div>
      {girar && <RotateHint onClose={() => setGirar(false)} />}
    </Bloco>
  );
}
