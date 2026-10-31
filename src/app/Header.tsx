import { G, MODE, SPEED, nameOf, setSPEED } from '../game/state.ts';
import { Icon } from './components/Icon.tsx';
import { GHOST } from './components/variants.ts';
import { askLocal } from './overlays/modal.ts';
import { Rules } from './overlays/Rules.tsx';
import { goMenu } from './table/actions.ts';
import { bump, useTick, useUi } from './store.ts';

// botão da barra: no celular só o ícone
function BarButton({
  icon,
  label,
  onClick,
  title,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      className={`${GHOST} px-3 py-[7px] text-small narrow:flex-none narrow:px-2.5`}
      aria-label={title ? undefined : label}
      title={title}
      onClick={onClick}
    >
      <Icon name={icon} />
      <span className="narrow:hidden">{label}</span>
    </button>
  );
}

function toggleSpeed() {
  setSPEED(SPEED === 1 ? 0.45 : 1);
  document.documentElement.style.setProperty('--spd', String(SPEED));
  bump();
}

// barra do topo: título (ou rodada e chefe, durante a partida) e os botões de sempre
export function Header() {
  useTick();
  const inGame = useUi((s) => s.screen) === 'game' && !!G?.players && !!G.round;
  return (
    <header
      id="bar"
      className="flex min-h-13 items-center gap-[18px] border-b border-line py-2 px-safe max-sm:gap-2 land:min-h-10 land:py-1"
    >
      {/* no celular, durante a partida, a rodada e o chefe tomam o lugar do título */}
      <div
        id="brand"
        className={`font-display text-xl font-extrabold tracking-[-0.3px] whitespace-nowrap max-sm:text-lg ${inGame ? 'max-sm:hidden' : ''}`}
      >
        Falência: <span className="text-accent">Goblins</span>
      </div>
      {inGame && (
        <div
          id="barInfo"
          className="flex min-w-0 flex-wrap gap-4 text-muted max-sm:gap-x-3 max-sm:gap-y-0 max-sm:text-xs"
        >
          <span>
            Rodada <b>{G.round}</b>
          </span>
          <span>
            Chefe da Toca <b>{nameOf(G.chief)}</b>
          </span>
          {MODE === 'online' && (
            <span>
              Mesa <b>{G.code}</b>
            </span>
          )}
        </div>
      )}
      <div className="flex-1" />
      <BarButton
        icon="book"
        label="Regras"
        onClick={() => void askLocal('Regras', '', [{ label: 'Fechar', value: 1 }], <Rules />)}
      />
      <BarButton
        icon="list"
        label="Histórico"
        onClick={() => useUi.setState((s) => ({ logOpen: !s.logOpen }))}
      />
      <BarButton
        icon="gauge"
        label={SPEED === 1 ? 'Normal' : 'Rápido'}
        title="Velocidade das animações: Normal ou Rápido (cerca de 2× mais rápido). Não muda as regras."
        onClick={toggleSpeed}
      />
      <BarButton icon="home" label="Menu" onClick={() => void goMenu()} />
    </header>
  );
}
