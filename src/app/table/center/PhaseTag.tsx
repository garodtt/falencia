import { G } from '../../../game/state.ts';
import { Icon } from '../../components/Icon.tsx';

// "Monstro dormindo" (escolha) ou "Monstro acordado" (itens de sol e resultado)
export function PhaseTag() {
  return (
    <div id="phaseTag">
      {G.phase === 'dormindo' ? (
        <span className="inline-flex min-h-[18px] items-center gap-1.5 font-ui text-xs font-bold tracking-[0.07em] land:col-start-2 text-moon uppercase">
          <Icon name="moon" />
          Monstro dormindo
        </span>
      ) : G.phase === 'acordado' || G.phase === 'resultado' ? (
        <span className="inline-flex min-h-[18px] items-center gap-1.5 font-ui text-xs font-bold tracking-[0.07em] land:col-start-2 text-sun uppercase">
          <Icon name="sun" />
          Monstro acordado
        </span>
      ) : (
        <span className="inline-flex min-h-[18px] items-center gap-1.5 font-ui text-xs font-bold tracking-[0.07em] land:col-start-2 uppercase" />
      )}
    </div>
  );
}
