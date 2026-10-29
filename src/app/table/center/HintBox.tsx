import type { ReactNode } from 'react';
import { playLimit } from '../../../game/rules.ts';
import { G, LOCAL, ME, chaosIs } from '../../../game/state.ts';
import type { Pending, Player } from '../../../game/types.ts';
import { Icon } from '../../components/Icon.tsx';

// a dica do lado direito: o que fazer agora (ou o recado da rodada, como o do Às Cegas)
export function HintBox({ pe, me }: { pe: Pending | null; me: Player }) {
  const text = hintText(pe && pe.kind, me) || G.rd[ME].note;
  return (
    <div
      className="max-w-[300px] justify-self-end max-[960px]:order-3 max-[960px]:justify-self-center max-sm:col-span-full land:order-none land:justify-self-end"
      id="hintBox"
    >
      {text ? (
        <div className="flex items-start gap-2 rounded-[10px] border border-dashed border-line px-3 py-2.5 text-[13px] text-muted land:px-2.5 land:py-1.5 land:text-xs">
          <Icon name="info" />
          <span>{text}</span>
        </div>
      ) : null}
    </div>
  );
}

function hintText(ph: Pending['kind'] | null, me: Player): ReactNode {
  if (LOCAL.spec) return 'Você está assistindo esta mesa.';
  if (!me.alive) return 'Você faliu. Assista ao fim da partida.';
  if (ph === 'select')
    return chaosIs('ABERTO') ? (
      'Palpite aberto: veja o que os outros jogaram antes de escolher.'
    ) : (
      <>
        {`Escolha até ${playLimit(me)[1]} goblins. Itens com `}
        <Icon name="moon" />
        {' estão liberados.'}
      </>
    );
  if (ph === 'window')
    return (
      <>
        {'Itens com '}
        <Icon name="sun" />
        {
          ' liberados para todos, sem ordem. A janela fecha quando todos passarem; se alguém usar um item, todos podem responder.'
        }
      </>
    );
  if (ph === 'steal') return 'Clique num rival para roubar uma carta às cegas.';
  if (ph === 'elim') return 'Clique num rival para eliminar uma carta às cegas.';
  if (ph === 'draw') return 'Clique no monte de itens para comprar.';
  if (ph === 'chaos') return 'Clique no monte de Caos para revelar a regra da próxima rodada.';
  if (G.duel && !G.duel.includes(ME)) return 'Você está fora do duelo nesta rodada.';
  return '';
}
