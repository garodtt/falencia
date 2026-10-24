import { G } from '../../../game/state.ts';
import { Icon } from '../../components/Icon.tsx';

// "Monstro dormindo" (escolha) ou "Monstro acordado" (itens de sol e resultado)
export function PhaseTag() {
  return (
    <div id="phaseTag">
      {G.phase === 'dormindo' ? (
        <span className="phase">
          <Icon name="moon" />
          Monstro dormindo
        </span>
      ) : G.phase === 'acordado' || G.phase === 'resultado' ? (
        <span className="phase awake">
          <Icon name="sun" />
          Monstro acordado
        </span>
      ) : (
        <span className="phase" />
      )}
    </div>
  );
}
