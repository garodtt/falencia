import { G, ME, nameOf } from '../../../../game/state.ts';
import { goMenu } from '../../actions.ts';
import { Say } from './Say.tsx';
import { PRIMARY } from '../../../components/variants.ts';

// fim de jogo: quem venceu e o botão de voltar
export function GameOver() {
  return (
    <>
      <Say>
        {G.winner === null || G.winner === undefined ? (
          'Empate.'
        ) : G.winner === ME ? (
          <b className="text-text">Você é o último goblin em pé!</b>
        ) : (
          <>
            <b className="text-text">{nameOf(G.winner)}</b>
            {' venceu a partida.'}
          </>
        )}
      </Say>
      <button className={PRIMARY} id="btnAgain" onClick={() => void goMenu()}>
        Voltar ao menu
      </button>
    </>
  );
}
